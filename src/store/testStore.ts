import { create } from "zustand";

type Test = {
  id: string;
  year: number;
  title: string;
  duration_minutes: number;
  total_marks: number;
  marks: number;
  negative_marks: number;
  subject: string;
  stream: string;
};

type TestState = {
  year: string;
  title: string;
  duration_minutes: string;
  total_marks: string;
  loading: boolean;
  marks: string;
  neg_marks: string;
  subject: string;
  stream: string;

  tests: Test[];

  setField: (field: string, value: string) => void;
  resetForm: () => void;
  createTest: () => Promise<void>;
  fetchAllTests: () => Promise<void>;
  updateTest: (id: string) => Promise<boolean>;
  fetchTestById: (id: string) => Promise<void>;
  deleteTest: (id: string) => Promise<void>;
};

export const useTestStore = create<TestState>((set, get) => ({
  year: "",
  title: "",
  duration_minutes: "",
  total_marks: "",
  marks: "",
  neg_marks: "",
  subject: "",
  stream: "",
  loading: false,

  tests: [],

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
      marks: "",
      neg_marks: "",
      subject: "",
      stream: "",
    }),

  createTest: async () => {
    const { year, title, duration_minutes, total_marks, marks, neg_marks, subject, stream } = get();

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
          marks: Number(marks),
          neg_marks: Number(neg_marks),
          subject,
          stream,
        }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        alert(data.error || "Failed to create exam");
      } else {
        alert("Exam created successfully");
        get().resetForm();
        get().fetchAllTests();
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }

    set({ loading: false });
  },

  fetchAllTests: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/tests");
      const data = await res.json();

      if (!res.ok) {
        console.error(data.error);
        return;
      }

      set({ tests: data.exams });
    } catch (error) {
      console.error("Failed to fetch tests", error);
    } finally {
      set({ loading: false });
    }
  },

updateTest: async (id) => {
  const { year, title, duration_minutes, total_marks, marks, neg_marks, subject, stream } = get();

  set({ loading: true });

  try {
    const res = await fetch(`/api/tests/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        year: Number(year),
        title,
        duration_minutes: Number(duration_minutes),
        total_marks: Number(total_marks),
        marks: Number(marks),
        neg_marks: Number(neg_marks),
        subject,
        stream,
      }),
    });

    // Check for empty response first
    const text = await res.text();
    if (!text) {
      console.error("Empty response from server");
      alert("Server returned empty response");
      return false;
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Raw response:", text);
      alert("Invalid response from server");
      return false;
    }

    if (!res.ok) {
      alert(data.error || `Error: ${res.status}`);
      return false;
    }

    alert("Exam updated successfully");
    get().resetForm();
    return true;
  } catch (error) {
    console.error("Update failed", error);
    alert("Network error: " + (error instanceof Error ? error.message : "Unknown error"));
    return false;
  } finally {
    set({ loading: false });
  }
},

  fetchTestById: async (id) => {
  set({ loading: true });

  try {
    const res = await fetch(`/api/tests/${id}`);
    
    // Check for empty response
    const text = await res.text();
    if (!text) {
      console.error("Empty response from server");
      return;
    }

    const data = JSON.parse(text);

    if (!res.ok) {
      console.error(data.error);
      return;
    }

    const exam = data.exam;

    set({
      year: exam.year?.toString() || "",
      title: exam.title || "",
      duration_minutes: exam.duration_minutes?.toString() || "",
      total_marks: exam.total_marks?.toString() || "",
      marks: exam.marks?.toString() || "",
      neg_marks: exam.negative_marks?.toString() || "",
      subject: exam.subject || "",
      stream: exam.stream || "",
    });
  } catch (error) {
    console.error("Failed to fetch test", error);
  } finally {
    set({ loading: false });
  }
},

  deleteTest: async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this test?");

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/tests/${id}`, {
        method: "DELETE",
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        alert(data.error || "Failed to delete test");
        return;
      }

      alert("Test deleted");
      get().fetchAllTests();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Something went wrong");
    }
  },
}));