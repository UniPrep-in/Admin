"use client";

import { useTestStore } from "@/store/testStore";

export default function CreateTestPage() {
  const {
    year,
    title,
    duration_minutes,
    total_marks,
    setField,
    createTest,
    loading,
  } = useTestStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTest();
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Create Exam</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setField("year", e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setField("title", e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Duration (minutes)"
          value={duration_minutes}
          onChange={(e) => setField("duration_minutes", e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Total Marks"
          value={total_marks}
          onChange={(e) => setField("total_marks", e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          {loading ? "Creating..." : "Create Exam"}
        </button>
      </form>
    </div>
  );
}