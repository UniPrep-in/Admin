import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/lib/auth/requireAdmin";

// creating questions and options 
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: test_id } = await params;

    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { supabase } = auth;

    const body = await req.json();
    const { questions } = body;

    if (!questions?.length) {
      return NextResponse.json(
        { error: "No questions provided" },
        { status: 400 }
      );
    }

    for (const q of questions) {
      // 1️⃣ Insert question with solution
      const { data: question, error: qError } = await supabase
        .from("questions")
        .insert({
          test_id,
          question_text: q.question_text,
          question_order: q.question_order,
          question_image: q.question_image ?? null,
          solution: q.solution ?? null, // Add solution field
        })
        .select()
        .single();

      if (qError) {
        return NextResponse.json(
          { error: qError.message },
          { status: 500 }
        );
      }

      // 2️⃣ Prepare options
      const options = [
        { text: q.option_a, letter: "A" },
        { text: q.option_b, letter: "B" },
        { text: q.option_c, letter: "C" },
        { text: q.option_d, letter: "D" },
      ];

      const optionRows = options.map((o) => ({
        question_id: question.id,
        option_text: o.text,
        is_correct: o.letter === q.correct,
      }));

      // 3️⃣ Insert options
      const { error: optionError } = await supabase
        .from("options")
        .insert(optionRows);

      if (optionError) {
        return NextResponse.json(
          { error: optionError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      message: "Questions uploaded successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// Get questions and options by test id 
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { supabase } = auth;

    const { id } = await params;

    const { data, error } = await supabase
      .from("questions")
      .select(`
        id,
        question_text,
        question_order,
        question_image,
        solution,
        options (
          id,
          option_text,
          is_correct
        )
      `)
      .eq("test_id", id)
      .order("question_order", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      questions: data,
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}