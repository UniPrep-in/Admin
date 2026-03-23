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
    marks,
    neg_marks,
    subject,
    stream
  } = useTestStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTest();
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">Create Exam</h1>
          <p className="text-sm text-neutral-500">Configure a new mock test for students</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-neutral-600">Year</label>
              <input
                type="number"
                placeholder="2024"
                value={year}
                onChange={(e) => setField("year", e.target.value)}
                className="border text-neutral-500 border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-neutral-600">Duration (minutes)</label>
              <input
                type="number"
                placeholder="180"
                value={duration_minutes}
                onChange={(e) => setField("duration_minutes", e.target.value)}
                className="border text-neutral-500 border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-neutral-600">Exam Title</label>
            <input
              type="text"
              placeholder="UPSC Prelims Mock Test"
              value={title}
              onChange={(e) => setField("title", e.target.value)}
              className="border text-neutral-500 border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* New Subject and Stream fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-neutral-600">Subject</label>
              <input
                type="text"
                placeholder="General Studies"
                value={subject}
                onChange={(e) => setField("subject", e.target.value)}
                className="border text-neutral-500 border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-neutral-600">Stream</label>
              <input
                type="text"
                placeholder="UPSC"
                value={stream}
                onChange={(e) => setField("stream", e.target.value)}
                className="border text-neutral-500 border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-neutral-600">Marks for Correct Answer</label>
              <input
                type="number"
                placeholder="4"
                value={marks}
                onChange={(e) => setField("marks", e.target.value)}
                className="border text-neutral-500 border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-neutral-600">Negative Marks</label>
              <input
                type="number"
                placeholder="1"
                value={neg_marks}
                onChange={(e) => setField("neg_marks", e.target.value)}
                className="border text-neutral-500 border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-neutral-800 transition disabled:opacity-50"
          >
            {loading ? "Creating Exam..." : "Create Exam"}
          </button>
        </form>
      </div>
    </div>
  );
}