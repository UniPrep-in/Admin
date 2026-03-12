"use client";
import Loader from "@/app/components/ui/loader";
import { useTestStore } from "@/store/testStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BsPencilSquare } from "react-icons/bs";
import { TfiViewListAlt } from "react-icons/tfi";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import toast from "react-hot-toast";


export default function TestsPage() {

  const router=useRouter()

  const {tests,fetchAllTests,loading,deleteTest}=useTestStore()
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editingTestId, setEditingTestId] = useState<string | null>(null);
  const [addQuestionsOpen, setAddQuestionsOpen] = useState(false);
  const [addingTestId, setAddingTestId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllTests();
  }, [fetchAllTests]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <main className="py-8">
      <h1 className="text-2xl text-black mb-6">All Mocks</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tests.map((test) => (
          <div
        
            key={test.id}
            className="bg-white border rounded-xl shadow-md p-6"
          >
            <div className="flex justify-between items-center border-b border-neutral-600 py-2">
              <h2 className="text-xl text-black">
              {test.title}
            </h2>
            <div className="flex gap-2 justify-center items-center">
              <button
                onClick={() => {
                  setEditingTestId(test.id);
                  setEditOpen(true);
                }}
                className="flex items-center justify-center gap-2 bg-neutral-100 border border-neutral-200 shadow-sm text-sm rounded-lg text-black p-2"
              >
                <BsPencilSquare /> Edit
              </button>
              <button
                onClick={() => {
                  setSelectedTestId(test.id);
                  setConfirmOpen(true);
                }}
                className="flex items-center justify-center gap-2 bg-neutral-100 border border-neutral-200 shadow-sm text-sm rounded-lg text-black p-2"
              >
                <RiDeleteBin2Fill className="text-lg text-red-500"/>Delete
              </button>
            </div>
            </div>

            <div className="space-y-1 py-4">
              <span className="text-black text-lg py-2">Current Details:</span>
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg flex justify-center items-center py-2">
                <span className="text-black text-sm">Year: {test.year}</span>
              </div>
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg flex justify-center items-center py-2">
                <span className="text-black text-sm">Duration: {test.duration_minutes} minutes</span>
              </div>
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg flex justify-center items-center py-2">
                <span className="text-black text-sm">Total Marks: {test.total_marks}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-neutral-600 pt-4">
              <h1 className="text-lg text-black">Actions:</h1>
              <button 
                onClick={() => router.push(`/dashboard/tests/${test.id}/questions`)}
                className="px-4 py-2 bg-black flex items-center justify-center gap-2 text-white rounded-lg hover:opacity-80 duration-300"
              >
                <TfiViewListAlt />View Questions
              </button>
              <button 
                onClick={() => {
                  setAddingTestId(test.id);
                  setAddQuestionsOpen(true);
                }}
              className="px-4 py-2 bg-emerald-300 text-black flex justify-center items-center gap-2 border rounded-lg hover:bg-emerald-500 duration-300">
                <FaPlus />Add questions
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
      {editOpen && editingTestId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-[90vw] h-[85vh] rounded-xl shadow-xl flex flex-col">
            <div className="flex items-center justify-between border-b px-6 py-3">
              <h2 className="text-lg text-black">Edit Exam</h2>
              <button
                onClick={() => {
                  setEditOpen(false);
                  setEditingTestId(null);
                }}
                className="text-sm px-3 py-1 flex justify-center items-center duration-300 border text-black bg-red-300 rounded-lg hover:bg-red-400"
              >
                <IoClose className="text-lg" />Close
              </button>
            </div>
            <iframe
              src={`/dashboard/tests/${editingTestId}/edit`}
              className="flex-1 w-full"
            />
          </div>
        </div>
      )}
      {addQuestionsOpen && addingTestId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-[90vw] h-[85vh] rounded-xl shadow-xl flex flex-col">
            <div className="flex items-center justify-between border-b px-6 py-3">
              <h2 className="text-lg text-black">Add Questions</h2>
              <button
                onClick={() => {
                  setAddQuestionsOpen(false);
                  setAddingTestId(null);
                }}
                className="text-sm px-3 py-1 flex justify-center items-center duration-300 border text-black bg-red-300 rounded-lg hover:bg-red-400"
              >
                <IoClose className="text-lg" />Exit
              </button>
            </div>

            <iframe
              src={`/dashboard/tests/${addingTestId}/addquestions`}
              className="flex-1 w-full"
            />
          </div>
        </div>
      )}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-xl text-black font-semibold">Delete Test</h2>
            <p className="text-sm text-neutral-600">
              Are you sure you want to delete this test and all its questions?
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => {
                  setConfirmOpen(false);
                  setSelectedTestId(null);
                }}
                className="px-4 py-2 rounded-lg border border-neutral-300 text-black hover:bg-neutral-100"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  if (!selectedTestId) return;

                  try {
                    await deleteTest(selectedTestId);
                    toast.success("Test deleted successfully");
                  } catch (error) {
                    toast.error("Cannot delete the test because it is referenced by other records.");
                  }

                  setConfirmOpen(false);
                  setSelectedTestId(null);
                }}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}