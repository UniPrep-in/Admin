"use client";

import { useTestStore } from "@/store/testStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";


export default function TestsPage() {

  const router=useRouter()

  const {tests,fetchAllTests,loading,deleteTest}=useTestStore()

  useEffect(() => {
    fetchAllTests();
  }, [fetchAllTests]);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading exams...
      </div>
    );
  }

  return (
    <div className="p-8">
        <Navbar/>
      <h1 className="text-2xl font-bold mb-6">All Exams</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tests.map((test) => (
          <div
        
            key={test.id}
            className="bg-white border rounded-xl shadow-md p-6 hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold mb-2 text-black">
              {test.title}
            </h2>

            <div 
              onClick={()=>router.push(`/dashboard/tests/${test.id}/questions`)}
            className="text-sm text-gray-600 space-y-1">
              <p>📅 Year: {test.year}</p>
              <p>⏱ Duration: {test.duration_minutes} minutes</p>
              <p>📝 Total Marks: {test.total_marks}</p>
            </div>

            <div className="flex gap-3 mt-4">
              <button onClick={()=>{router.push(`/dashboard/tests/${test.id}/edit`)}} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Edit
              </button>

              {/* <button 
                onClick={() => deleteTest(test.id)}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
                Delete
              </button> */}
              <button 
                onClick={() => router.push(`/dashboard/tests/${test.id}/addquestions`)}
              className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600">
                Add questions
              </button>
            </div>
          </div>
        ))}
      </div>

      {tests.length === 0 && (
        <div className="text-gray-500 mt-10 text-center">
          No exams created yet.
        </div>
      )}
    </div>
  );
}