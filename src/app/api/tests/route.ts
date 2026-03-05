import { NextResponse } from "next/server";
import { createClient } from "../../lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    // 1️⃣ Check logged-in user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // 2️⃣ Check admin role
    // const { data: profile, error: roleError } = await supabase
    //   .from("profiles")
    //   .select("role")
    //   .eq("id", user.id)
    //   .single();

    // if (roleError || !profile || profile.role !== "admin") {
    //   return NextResponse.json(
    //     { error: "Not authorized (Admin only)" },
    //     { status: 403 }
    //   );
    // }

    // 3️⃣ Get request data
    const body = await req.json();
    const { year, title, duration_minutes, total_marks } = body;

    if (!year || !title || !duration_minutes || !total_marks) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    // 4️⃣ Insert exam
    const { data, error } = await supabase
      .from("tests")
      .insert([
        {
          year,
          title,
          duration_minutes,
          total_marks,
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