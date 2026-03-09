"use client";
import { createClient } from "@/app/lib/supabase/client";
import { useTestStore } from "@/store/testStore";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import Navbar from "@/app/components/Navbar";
export default  function CreateTestPage() {
  const {
    year,
    title,
    duration_minutes,
    total_marks,
    setField,
    createTest,
    loading,
    marks,
    neg_marks
  } = useTestStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTest();
  };

return (
  <div>
    <Navbar/>
  
  <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded">
    <h2 className="text-xl font-bold mb-4 text-gray-800">Create Exam</h2>

    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="number"
        placeholder="Year"
        value={year}
        onChange={(e) => setField("year", e.target.value)}
        className="w-full border p-2 rounded bg-white text-gray-900 placeholder-gray-500"
      />

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setField("title", e.target.value)}
        className="w-full border p-2 rounded bg-white text-gray-900 placeholder-gray-500"
      />

      <input
        type="number"
        placeholder="Duration (minutes)"
        value={duration_minutes}
        onChange={(e) => setField("duration_minutes", e.target.value)}
        className="w-full border p-2 rounded bg-white text-gray-900 placeholder-gray-500"
      />

      <input
        type="number"
        placeholder="Mark for Right Answer"
        value={marks}
        onChange={(e) => setField("marks", e.target.value)}
        className="w-full border p-2 rounded bg-white text-gray-900 placeholder-gray-500"
      />

      <input
        type="number"
        placeholder="Mark for wrong Answer"
        value={neg_marks}
        onChange={(e) => setField("neg_marks", e.target.value)}
        className="w-full border p-2 rounded bg-white text-gray-900 placeholder-gray-500"
      />

      {/* <input
        type="number"
        placeholder="Total Marks"
        value={total_marks}
        onChange={(e) => setField("total_marks", e.target.value)}
        className="w-full border p-2 rounded bg-white text-gray-900 placeholder-gray-500"
      /> */}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white w-full py-2 rounded"
      >
        {loading ? "Creating..." : "Create Exam"}
      </button>
    </form>
  </div>
  </div>
);
}