import { NextResponse } from "next/server";
import { createClient } from "../../lib/supabase/server";
import { requireAdmin } from "@/app/lib/auth/requireAdmin";

export async function POST(req: Request) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;
    const { supabase } = auth;

    const body = await req.json();
    const { year, title, duration_minutes, marks, neg_marks, subject, stream } = body;

    if (!year || !title || !duration_minutes || !marks || !neg_marks) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("tests")
      .insert([
        {
          year,
          title,
          duration_minutes,
          total_marks: 0,
          marks,
          negative_marks: neg_marks,
          subject,
          stream,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Exam created successfully",
        exam: data[0],
      },
      { status: 201 }
    );

  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('tests')
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      exams: data
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}