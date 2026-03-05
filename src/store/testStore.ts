import { create } from "zustand";

type TestState = {
  year: string;
  title: string;
  duration_minutes: string;
  total_marks: string;
  loading: boolean;

  setField: (field: string, value: string) => void;
  resetForm: () => void;
  createTest: () => Promise<void>;
};

export const useTestStore = create<TestState>((set, get) => ({
  year: "",
  title: "",
  duration_minutes: "",
  total_marks: "",
  loading: false,

  setField: (field, value) =>
    set((state) => ({
      ...state,
      [field]: value,
    })),

  resetForm: () =>
    set({
      year: "",
      title: "",
      duration_minutes: "",
      total_marks: "",
    }),

  createTest: async () => {
    const { year, title, duration_minutes, total_marks } = get();

    set({ loading: true });

    try {
      const res = await fetch("/api/tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          year: Number(year),
          title,
          duration_minutes: Number(duration_minutes),
          total_marks: Number(total_marks),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
      } else {
        alert("Exam created successfully");
        get().resetForm();
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }

    set({ loading: false });
  },
}));