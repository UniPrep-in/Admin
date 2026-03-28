import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/lib/auth/requireAdmin";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { supabase } = auth;

    const body = await req.json();

    const { question_text, question_image, solution, options } = body;

    // 1️⃣ Update question table
    const updateData: any = {};
    
    if (question_text !== undefined) updateData.question_text = question_text;
    if (question_image !== undefined) updateData.question_image = question_image;
    if (solution !== undefined) updateData.solution = solution;

    if (Object.keys(updateData).length > 0) {
      const { error } = await supabase
        .from("questions")
        .update(updateData)
        .eq("id", id);

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }
    }

    // 2️⃣ Update options table (only changed options)
    if (options && options.length > 0) {
      for (const option of options) {
        const { error } = await supabase
          .from("options")
          .update({
            option_text: option.option_text,
            is_correct: option.is_correct,
          })
          .eq("id", option.id);

        if (error) {
          return NextResponse.json(
            { error: error.message },
            { status: 500 }
          );
        }
      }
    }

    // 3️⃣ Return updated question with all fields
    const { data: question, error: fetchError } = await supabase
      .from("questions")
      .select(`
        id,
        question_text,
        question_order,
        question_image,
        solution,
        options(
          id,
          option_text,
          is_correct
        )
      `)
      .eq("id", id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: fetchError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      question,
    });

  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}