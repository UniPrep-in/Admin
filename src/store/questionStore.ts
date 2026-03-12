import { create } from "zustand";

type QuestionRow = {
  question_order: number;
  question_text: string;
  question_image?: string | null;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct: string;
};

type Option = {
  id: string;
  option_text: string;
  is_correct: boolean;
};

type Question = {
  id: string;
  question_text: string;
  question_order: number;
  options: Option[];
};

type QuestionState = {
  rows: QuestionRow[];
  loading: boolean;
  questionUpdation:boolean
  questionDeletion:boolean
  questions: Question[];   

  setRows: (rows: QuestionRow[]) => void;
  clearRows: () => void;

  createQuestions: (testId: string) => Promise<void>;

  getQuestionsByTest: (testId: string) => Promise<void>;
   updateQuestion: (questionId: string, payload: any) => Promise<void>;   
   deleteQuestion: (questionId: string) => Promise<void>;
};

export const useQuestionStore = create<QuestionState>((set, get) => ({
  rows: [],
  loading: false,
 questionUpdation:false,
 questionDeletion:false,
  questions: [],  

  setRows: (rows) => set({ rows }),

  clearRows: () => set({ rows: [] }),

  createQuestions: async (testId) => {
    const { rows } = get();

    if (!rows.length) {
      alert("No questions to upload");
      return;
    }

    set({ loading: true });

    try {
      const res = await fetch(`/api/tests/${testId}/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questions: rows,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      alert("Questions uploaded successfully");

      set({ rows: [] });

    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }

    set({ loading: false });
  },

  // 👇 NEW FUNCTION
  getQuestionsByTest: async (testId) => {
    set({ loading: true });

    try {
      const res = await fetch(`/api/tests/${testId}/questions`);
      const data = await res.json();

      if (!res.ok) {
        console.error(data.error);
        return;
      }

      set({ questions: data.questions });

    } catch (error) {
      console.error("Failed to fetch questions", error);
    }

    set({ loading: false });
  },


  updateQuestion: async (questionId: string, payload: any) => {
  set({ questionUpdation: true });

  try {

    console.log("PAYLOAD",payload);
    
    const res = await fetch(`/api/tests/updateQuestion/${questionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }
 set((state:any) => ({
      questions: state.questions.map((q:any) =>
        q.id === questionId ? data.question : q
      )
    }))

    alert("Question updated successfully");
    

  } catch (error) {
    console.error(error);
    alert("Update failed");
  }

  set({ questionUpdation: false });
},


deleteQuestion: async (questionId: string) => {

  const confirmDelete = confirm("Delete this question?");

  if (!confirmDelete) return;

  set({ questionDeletion: true });

  try {

    const res = await fetch(`/api/tests/deleteQuestion/${questionId}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    // remove question locally
    set((state: any) => ({
      questions: state.questions.filter(
        (q: any) => q.id !== questionId
      )
    }));

  } catch (error) {
    console.error(error);
    alert("Delete failed");
  }

  set({ questionDeletion: false });
},
}));