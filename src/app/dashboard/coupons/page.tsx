"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsPencilSquare } from "react-icons/bs";
import { RiDeleteBin2Fill } from "react-icons/ri";

const PLAN_OPTIONS = [
  { id: "basic", label: "Basic" },
  { id: "pro", label: "Pro" },
  { id: "advance", label: "Advance" },
] as const;

type DiscountType = "percent" | "fixed";
type CouponStatus = "inactive" | "scheduled" | "active" | "expired";

type CouponRecord = {
  id: string;
  code: string;
  influencer_name: string;
  discount_type: DiscountType;
  discount_value: number;
  allowed_plan_ids: string[];
  is_active: boolean;
  valid_from: string;
  valid_until: string;
  status: CouponStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

type CouponsResponse = {
  coupons?: CouponRecord[];
  error?: string;
};

type CreateCouponResponse = {
  coupon?: CouponRecord;
  error?: string;
};

type DeleteCouponResponse = {
  message?: string;
  error?: string;
};

const initialFormState = {
  code: "",
  influencerName: "",
  discountType: "percent" as DiscountType,
  discountValue: "",
  allowedPlanIds: ["basic"] as string[],
  isActive: true,
  validFrom: "",
  validUntil: "",
};

function formatDiscount(coupon: CouponRecord) {
  const value = Number(coupon.discount_value);

  if (coupon.discount_type === "percent") {
    return `${value}%`;
  }

  return `Rs ${value}`;
}

function formatPlanLabel(planIds: string[]) {
  return planIds
    .map((planId) => PLAN_OPTIONS.find((plan) => plan.id === planId)?.label ?? planId)
    .join(", ");
}

function formatDateValue(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function formatTimeValue(date: Date) {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  return `${String(hours).padStart(2, "0")}:${minutes} ${period}`;
}

function formatCreatedDate(createdAt: string) {
  const date = new Date(createdAt);

  return `${formatDateValue(date)}, ${formatTimeValue(date)}`;
}

function formatValidityDate(dateValue: string) {
  return formatDateValue(new Date(`${dateValue}T00:00:00`));
}

function getStatusTone(status: CouponStatus) {
  switch (status) {
    case "active":
      return "bg-emerald-100 text-emerald-700";
    case "scheduled":
      return "bg-blue-100 text-blue-700";
    case "expired":
      return "bg-amber-100 text-amber-700";
    case "inactive":
    default:
      return "bg-rose-100 text-rose-700";
  }
}

function formatStatusLabel(status: CouponStatus) {
  switch (status) {
    case "active":
      return "Active";
    case "scheduled":
      return "Scheduled";
    case "expired":
      return "Expired";
    case "inactive":
    default:
      return "Inactive";
  }
}

function ActionIconButton({
  label,
  tone,
  onClick,
  children,
}: {
  label: string;
  tone: "neutral" | "danger";
  onClick: () => void;
  children: React.ReactNode;
}) {
  const toneClasses =
    tone === "danger"
      ? "border-red-200 bg-red-50 text-red-600 hover:border-red-300 hover:bg-red-100"
      : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-100";

  const tooltipToneClasses =
    tone === "danger"
      ? "border-red-200/80 bg-white text-red-600 shadow-red-100/80"
      : "border-neutral-200 bg-white text-neutral-700 shadow-neutral-200/80";

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm transition-all duration-200 hover:-translate-y-0.5 ${toneClasses}`}
      >
        {children}
      </button>
      <div
        className={`pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-lg border px-3 py-1.5 text-xs font-medium opacity-0 shadow-lg transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 ${tooltipToneClasses}`}
      >
        <span className="whitespace-nowrap">{label}</span>
        <span
          className={`absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r ${
            tone === "danger" ? "border-red-200/80 bg-white" : "border-neutral-200 bg-white"
          }`}
        />
      </div>
    </div>
  );
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<CouponRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [deleteCouponId, setDeleteCouponId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [code, setCode] = useState(initialFormState.code);
  const [influencerName, setInfluencerName] = useState(initialFormState.influencerName);
  const [discountType, setDiscountType] = useState<DiscountType>(initialFormState.discountType);
  const [discountValue, setDiscountValue] = useState(initialFormState.discountValue);
  const [allowedPlanIds, setAllowedPlanIds] = useState<string[]>(initialFormState.allowedPlanIds);
  const [isActive, setIsActive] = useState(initialFormState.isActive);
  const [validFrom, setValidFrom] = useState(initialFormState.validFrom);
  const [validUntil, setValidUntil] = useState(initialFormState.validUntil);

  const resetForm = () => {
    setCode(initialFormState.code);
    setInfluencerName(initialFormState.influencerName);
    setDiscountType(initialFormState.discountType);
    setDiscountValue(initialFormState.discountValue);
    setAllowedPlanIds(initialFormState.allowedPlanIds);
    setIsActive(initialFormState.isActive);
    setValidFrom(initialFormState.validFrom);
    setValidUntil(initialFormState.validUntil);
  };

  const openCreateModal = () => {
    resetForm();
    setEditingCouponId(null);
    setIsCreateOpen(true);
  };

  const openEditModal = (coupon: CouponRecord) => {
    setEditingCouponId(coupon.id);
    setCode(coupon.code);
    setInfluencerName(coupon.influencer_name);
    setDiscountType(coupon.discount_type);
    setDiscountValue(String(coupon.discount_value));
    setAllowedPlanIds(coupon.allowed_plan_ids);
    setIsActive(coupon.is_active);
    setValidFrom(coupon.valid_from);
    setValidUntil(coupon.valid_until);
    setIsCreateOpen(true);
  };

  const closeFormModal = () => {
    if (submitting) {
      return;
    }

    setIsCreateOpen(false);
    setEditingCouponId(null);
  };

  const loadCoupons = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/coupons", { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as CouponsResponse | null;

      if (!response.ok || !payload) {
        throw new Error(payload?.error || "Unable to load coupons right now.");
      }

      setCoupons(payload.coupons ?? []);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load coupons right now.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCoupons();
  }, []);

  const togglePlan = (planId: string) => {
    setAllowedPlanIds((current) =>
      current.includes(planId)
        ? current.filter((value) => value !== planId)
        : [...current, planId],
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const isEditing = Boolean(editingCouponId);
      const response = await fetch(
        isEditing ? `/api/coupons/${editingCouponId}` : "/api/coupons",
        {
          method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          influencerName,
          discountType,
          discountValue,
          allowedPlanIds,
          isActive,
          validFrom,
          validUntil,
        }),
        },
      );

      const payload = (await response.json().catch(() => null)) as CreateCouponResponse | null;

      if (!response.ok || !payload?.coupon) {
        throw new Error(payload?.error || "Unable to create coupon right now.");
      }

      const createdCoupon = payload.coupon;

      if (isEditing) {
        setCoupons((current) =>
          current.map((coupon) => (coupon.id === createdCoupon.id ? createdCoupon : coupon)),
        );
      } else {
        setCoupons((current) => [createdCoupon, ...current]);
      }

      resetForm();
      setIsCreateOpen(false);
      setEditingCouponId(null);
      toast.success(
        isEditing
          ? `Coupon ${createdCoupon.code} updated successfully`
          : `Coupon ${createdCoupon.code} created successfully`,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : editingCouponId
            ? "Unable to update coupon right now."
            : "Unable to create coupon right now.";

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCoupon = async () => {
    if (!deleteCouponId) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/coupons/${deleteCouponId}`, {
        method: "DELETE",
      });

      const payload = (await response.json().catch(() => null)) as DeleteCouponResponse | null;

      if (!response.ok) {
        throw new Error(payload?.error || "Unable to delete coupon right now.");
      }

      setCoupons((current) => current.filter((coupon) => coupon.id !== deleteCouponId));
      setDeleteCouponId(null);
      toast.success(payload?.message || "Coupon deleted successfully");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to delete coupon right now.";

      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900">Recent Coupons</h2>
            <p className="text-sm text-neutral-500">Newest coupons appear first after creation.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openCreateModal}
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Add Coupon
            </button>
            <button
              type="button"
              onClick={() => void loadCoupons()}
              disabled={loading}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-10 text-center text-sm text-neutral-500">
            Loading coupons...
          </div>
        ) : coupons.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-10 text-center text-sm text-neutral-500">
            No coupons created yet.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 xl:hidden">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-neutral-900">{coupon.code}</p>
                      <p className="text-sm text-neutral-500">{coupon.influencer_name}</p>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusTone(coupon.status)}`}
                    >
                      {formatStatusLabel(coupon.status)}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3">
                      <p className="text-xs uppercase tracking-wide text-neutral-500">Discount</p>
                      <p className="mt-1 text-sm font-medium text-neutral-800">
                        {formatDiscount(coupon)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3">
                      <p className="text-xs uppercase tracking-wide text-neutral-500">Plans</p>
                      <p className="mt-1 text-sm font-medium text-neutral-800">
                        {formatPlanLabel(coupon.allowed_plan_ids)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3">
                      <p className="text-xs uppercase tracking-wide text-neutral-500">Start date</p>
                      <p className="mt-1 text-sm font-medium text-neutral-800">
                        {formatValidityDate(coupon.valid_from)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3">
                      <p className="text-xs uppercase tracking-wide text-neutral-500">End date</p>
                      <p className="mt-1 text-sm font-medium text-neutral-800">
                        {formatValidityDate(coupon.valid_until)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4 border-t border-neutral-200 pt-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-neutral-500">Created</p>
                      <p className="mt-1 text-sm font-medium text-neutral-800">
                        {formatCreatedDate(coupon.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <ActionIconButton
                        label="Edit coupon"
                        tone="neutral"
                        onClick={() => openEditModal(coupon)}
                      >
                        <BsPencilSquare className="text-base" />
                      </ActionIconButton>
                      <ActionIconButton
                        label="Delete coupon"
                        tone="danger"
                        onClick={() => setDeleteCouponId(coupon.id)}
                      >
                        <RiDeleteBin2Fill className="text-base" />
                      </ActionIconButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden xl:block">
              <table className="min-w-full table-fixed border border-neutral-200 text-left text-sm text-neutral-700">
                <thead className="bg-neutral-100 text-neutral-900">
                  <tr>
                    <th className="border border-neutral-200 px-4 py-3">Code</th>
                    <th className="border border-neutral-200 px-4 py-3">Influencer</th>
                    <th className="border border-neutral-200 px-4 py-3">Discount</th>
                    <th className="border border-neutral-200 px-4 py-3">Plans</th>
                    <th className="border border-neutral-200 px-4 py-3">Start</th>
                    <th className="border border-neutral-200 px-4 py-3">End</th>
                    <th className="border border-neutral-200 px-4 py-3">Status</th>
                    <th className="border border-neutral-200 px-4 py-3">Created</th>
                    <th className="border border-neutral-200 px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon.id} className="bg-white">
                      <td className="border border-neutral-200 px-4 py-3 font-semibold text-neutral-900">
                        {coupon.code}
                      </td>
                      <td className="border border-neutral-200 px-4 py-3 break-words">
                        {coupon.influencer_name}
                      </td>
                      <td className="border border-neutral-200 px-4 py-3">
                        {formatDiscount(coupon)}
                      </td>
                      <td className="border border-neutral-200 px-4 py-3 break-words">
                        {formatPlanLabel(coupon.allowed_plan_ids)}
                      </td>
                      <td className="border border-neutral-200 px-4 py-3">
                        {formatValidityDate(coupon.valid_from)}
                      </td>
                      <td className="border border-neutral-200 px-4 py-3">
                        {formatValidityDate(coupon.valid_until)}
                      </td>
                      <td className="border border-neutral-200 px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusTone(coupon.status)}`}
                        >
                          {formatStatusLabel(coupon.status)}
                        </span>
                      </td>
                      <td className="border border-neutral-200 px-4 py-3">
                        {formatCreatedDate(coupon.created_at)}
                      </td>
                      <td className="border border-neutral-200 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <ActionIconButton
                            label="Edit coupon"
                            tone="neutral"
                            onClick={() => openEditModal(coupon)}
                          >
                            <BsPencilSquare className="text-base" />
                          </ActionIconButton>
                          <ActionIconButton
                            label="Delete coupon"
                            tone="danger"
                            onClick={() => setDeleteCouponId(coupon.id)}
                          >
                            <RiDeleteBin2Fill className="text-base" />
                          </ActionIconButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {isCreateOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
          <div
            className="absolute inset-0"
            onClick={() => {
              if (!submitting) {
                setIsCreateOpen(false);
              }
            }}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-3xl rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-neutral-900">
                  {editingCouponId ? "Edit Coupon" : "Create Coupon"}
                </h1>
                <p className="text-sm text-neutral-500">
                  {editingCouponId
                    ? "Update this coupon and save the new active dates or discount details."
                    : "Create a coupon with its active date range and plan availability."}
                </p>
              </div>
              <button
                type="button"
                onClick={closeFormModal}
                disabled={submitting}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-50"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-neutral-600">Coupon code</label>
                  <input
                    type="text"
                    placeholder="AMAN50"
                    value={code}
                    onChange={(event) => setCode(event.target.value.toUpperCase())}
                    className="rounded-lg border border-neutral-200 px-3 py-2 text-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-neutral-600">Influencer name</label>
                  <input
                    type="text"
                    placeholder="Aman"
                    value={influencerName}
                    onChange={(event) => setInfluencerName(event.target.value)}
                    className="rounded-lg border border-neutral-200 px-3 py-2 text-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-neutral-600">Discount type</label>
                  <select
                    value={discountType}
                    onChange={(event) => setDiscountType(event.target.value as DiscountType)}
                    className="rounded-lg border border-neutral-200 px-3 py-2 text-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="percent">Percent</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-neutral-600">
                    Discount value {discountType === "percent" ? "(%)" : "(Rs)"}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder={discountType === "percent" ? "20" : "200"}
                    value={discountValue}
                    onChange={(event) => setDiscountValue(event.target.value)}
                    className="rounded-lg border border-neutral-200 px-3 py-2 text-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-neutral-600">Start date</label>
                  <input
                    type="date"
                    value={validFrom}
                    onChange={(event) => setValidFrom(event.target.value)}
                    className="rounded-lg border border-neutral-200 px-3 py-2 text-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-neutral-600">End date</label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(event) => setValidUntil(event.target.value)}
                    className="rounded-lg border border-neutral-200 px-3 py-2 text-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-sm text-neutral-600">Allowed plans</span>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {PLAN_OPTIONS.map((plan) => {
                    const checked = allowedPlanIds.includes(plan.id);

                    return (
                      <label
                        key={plan.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                          checked
                            ? "border-emerald-300 bg-emerald-50"
                            : "border-neutral-200 bg-neutral-50 hover:border-neutral-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => togglePlan(plan.id)}
                        />
                        <span className="text-sm font-medium text-neutral-800">{plan.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <label className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(event) => setIsActive(event.target.checked)}
                />
                <span className="text-sm font-medium text-neutral-800">Coupon is active</span>
              </label>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeFormModal}
                  disabled={submitting}
                  className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-black px-6 py-3 font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50"
                >
                  {submitting
                    ? editingCouponId
                      ? "Saving Changes..."
                      : "Creating Coupon..."
                    : editingCouponId
                      ? "Save Changes"
                      : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deleteCouponId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
          <div
            className="absolute inset-0"
            onClick={() => {
              if (!isDeleting) {
                setDeleteCouponId(null);
              }
            }}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-neutral-900">Delete Coupon</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Are you sure you want to delete this coupon? This action cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteCouponId(null)}
                disabled={isDeleting}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleDeleteCoupon()}
                disabled={isDeleting}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
