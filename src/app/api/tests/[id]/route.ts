import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/lib/auth/requireAdmin";

// GET single test
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 });
    }

    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { supabase } = auth;

    const { data, error } = await supabase
      .from("tests")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (!data) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    return NextResponse.json({ exam: data });

  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

// PATCH update test
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 });
    }

    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { supabase } = auth;
    const body = await req.json();

    const { title, year, duration_minutes, total_marks, marks, neg_marks, subject, stream } = body;

    const { data, error } = await supabase
      .from("tests")
      .update({
        title,
        year,
        duration_minutes,
        total_marks,
        marks,
        negative_marks: neg_marks,
        subject,
        stream,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ exam: data }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}

// DELETE test
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 });
    }

    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { supabase } = auth;

    const { error } = await supabase
      .from("tests")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Test deleted successfully" }, { status: 200 });

  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}