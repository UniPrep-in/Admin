"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTestStore } from "@/store/testStore";

export default function EditExamPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    year,
    title,
    duration_minutes,
    marks,
    neg_marks,
    loading,
    setField,
    fetchTestById,
    updateTest,
  } = useTestStore();

  useEffect(() => {
    console.log(id);

    if (id) {
      fetchTestById(id);
    }
  }, [id, fetchTestById]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await updateTest(id);

    if (success) {
      router.push("/dashboard/tests");
    }
  };

  return (
    <main className="mx-auto border rounded-xl p-8">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
            Exam Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setField("title", e.target.value)}
            className="text-black w-full border border-neutral-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter exam title"
          />
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
            Year
          </label>
          <input
            type="number"
            value={year}
            onChange={(e) => setField("year", e.target.value)}
            className="text-black w-full border border-neutral-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Exam year"
          />
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={duration_minutes}
              onChange={(e) => setField("duration_minutes", e.target.value)}
              className="text-black w-full border border-neutral-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Duration"
            />
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
              Marks
            </label>
            <input
              type="number"
              value={marks}
              onChange={(e) => setField("marks", e.target.value)}
              className="text-black w-full border border-neutral-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Total marks"
            />
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
              Negative Marks
            </label>
            <input
              type="number"
              value={neg_marks}
              onChange={(e) => setField("neg_marks", e.target.value)}
              className="text-black w-full border border-neutral-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Negative marks"
            />
          </div>
        </div>

        <div className="md:col-span-2 flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Updating..." : "Update Exam"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}