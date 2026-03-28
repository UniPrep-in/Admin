import { createClient } from "@/app/lib/supabase/server";
import { NextResponse } from "next/server";

export async function requireAdmin() {
  const supabase = await createClient();
console.log("here");

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      error: NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      ),
    };
  }

  // check admin role
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (error || !profile?.is_admin) {
    return {
      error: NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      ),
    };
  }

  return { supabase, user };
}
