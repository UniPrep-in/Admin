import { NextResponse } from "next/server";

import { requireAdmin } from "@/app/lib/auth/requireAdmin";

const ALLOWED_PLAN_IDS = ["basic", "pro", "advance"] as const;
const ALLOWED_DISCOUNT_TYPES = ["percent", "fixed"] as const;

type AllowedPlanId = (typeof ALLOWED_PLAN_IDS)[number];
type DiscountType = (typeof ALLOWED_DISCOUNT_TYPES)[number];

type CouponRow = {
  id: string;
  code: string;
  influencer_name: string;
  discount_type: DiscountType;
  discount_value: number;
  allowed_plan_ids: string[];
  is_active: boolean;
  valid_from: string;
  valid_until: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

type CouponStatus = "inactive" | "scheduled" | "active" | "expired";

type UpdateCouponPayload = {
  code?: string;
  influencerName?: string;
  discountType?: string;
  discountValue?: number | string;
  allowedPlanIds?: string[];
  isActive?: boolean;
  validFrom?: string;
  validUntil?: string;
};

function isAllowedPlanId(value: string): value is AllowedPlanId {
  return ALLOWED_PLAN_IDS.includes(value as AllowedPlanId);
}

function isDiscountType(value: string): value is DiscountType {
  return ALLOWED_DISCOUNT_TYPES.includes(value as DiscountType);
}

function isDateInput(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function getCouponStatus(coupon: Pick<CouponRow, "is_active" | "valid_from" | "valid_until">): CouponStatus {
  if (!coupon.is_active) {
    return "inactive";
  }

  const today = new Date().toISOString().slice(0, 10);

  if (today < coupon.valid_from) {
    return "scheduled";
  }

  if (today > coupon.valid_until) {
    return "expired";
  }

  return "active";
}

function mapCoupon(coupon: CouponRow) {
  return {
    ...coupon,
    status: getCouponStatus(coupon),
  };
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const auth = await requireAdmin();

    if (auth.error) {
      return auth.error;
    }

    const { supabase } = auth;
    const body = (await req.json().catch(() => null)) as UpdateCouponPayload | null;

    const code = body?.code?.trim().toUpperCase() ?? "";
    const influencerName = body?.influencerName?.trim() ?? "";
    const discountType = body?.discountType?.trim() ?? "";
    const discountValue = Number(body?.discountValue);
    const allowedPlanIds = [...new Set((body?.allowedPlanIds ?? []).map((planId) => planId.trim()))];
    const isActive = body?.isActive ?? true;
    const validFrom = body?.validFrom?.trim() ?? "";
    const validUntil = body?.validUntil?.trim() ?? "";

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    if (!influencerName) {
      return NextResponse.json({ error: "Influencer name is required" }, { status: 400 });
    }

    if (!isDiscountType(discountType)) {
      return NextResponse.json(
        { error: "Discount type must be percent or fixed" },
        { status: 400 },
      );
    }

    if (!Number.isFinite(discountValue) || discountValue <= 0) {
      return NextResponse.json(
        { error: "Discount value must be greater than 0" },
        { status: 400 },
      );
    }

    if (discountType === "percent" && discountValue > 100) {
      return NextResponse.json(
        { error: "Percent discount cannot be greater than 100" },
        { status: 400 },
      );
    }

    if (allowedPlanIds.length === 0) {
      return NextResponse.json(
        { error: "Select at least one allowed plan" },
        { status: 400 },
      );
    }

    if (!allowedPlanIds.every(isAllowedPlanId)) {
      return NextResponse.json(
        { error: "Allowed plans must be basic, pro, or advance" },
        { status: 400 },
      );
    }

    if (!validFrom || !isDateInput(validFrom)) {
      return NextResponse.json({ error: "Start date is required" }, { status: 400 });
    }

    if (!validUntil || !isDateInput(validUntil)) {
      return NextResponse.json({ error: "End date is required" }, { status: 400 });
    }

    if (validUntil < validFrom) {
      return NextResponse.json(
        { error: "End date cannot be before start date" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("coupons")
      .update({
        code,
        influencer_name: influencerName,
        discount_type: discountType,
        discount_value: discountValue,
        allowed_plan_ids: allowedPlanIds,
        is_active: isActive,
        valid_from: validFrom,
        valid_until: validUntil,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(
        "id, code, influencer_name, discount_type, discount_value, allowed_plan_ids, is_active, valid_from, valid_until, created_by, created_at, updated_at",
      )
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "A coupon with this code already exists" },
          { status: 409 },
        );
      }

      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ coupon: mapCoupon(data as CouponRow) }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const auth = await requireAdmin();

    if (auth.error) {
      return auth.error;
    }

    const { supabase } = auth;
    const { error } = await supabase.from("coupons").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Coupon deleted successfully" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
