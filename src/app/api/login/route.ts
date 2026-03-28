import { NextResponse } from "next/server";
import { createClient } from "../../lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    const userId = data.user?.id;

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", userId)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: "No admin access" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      message: "Login successful",
    });

  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
