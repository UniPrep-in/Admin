"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTestStore } from "@/store/testStore";
import Navbar from "@/app/components/Navbar";

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
    <div><Navbar/>    <div className="max-w-lg mx-auto mt-12 bg-white shadow-md border rounded-xl p-8">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Edit Exam
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Exam Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setField("title", e.target.value)}
            className="text-black w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter exam title"
          />
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <input
            type="number"
            value={year}
            onChange={(e) => setField("year", e.target.value)}
            className="text-black w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Exam year"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (minutes)
          </label>
          <input
            type="number"
            value={duration_minutes}
            onChange={(e) =>
              setField("duration_minutes", e.target.value)
            }
            className="text-black w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Duration"
          />
        </div>

        {/* Total Marks */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mark
          </label>
          <input
            type="number"
            value={marks}
            onChange={(e) =>
              setField("marks", e.target.value)
            }
            className="text-black w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Total marks"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Negative Mark
          </label>
          <input
            type="number"
            value={neg_marks}
            onChange={(e) =>
              setField("neg_marks", e.target.value)
            }
            className="text-black w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Total marks"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-3">
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
    </div>
    </div>

  );
}