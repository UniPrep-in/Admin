"use client";

import { useEffect, useState } from "react";
import { useQuestionStore } from "@/store/questionStore";

export default function QuestionsTable({ testId }: { testId: string }) {
  const { questions, getQuestionsByTest, loading, updateQuestion, questionUpdation, deleteQuestion, questionDeletion } = useQuestionStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [originalData, setOriginalData] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    getQuestionsByTest(testId);
  }, [testId]);

  const startEdit = (q: any) => {
    setEditingId(q.id);
    setEditData(JSON.parse(JSON.stringify(q)));
    setOriginalData(JSON.parse(JSON.stringify(q)));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData(null);
    setOriginalData(null);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...editData.options];
    updated[index].option_text = value;
    setEditData({ ...editData, options: updated });
  };

  const toggleCorrect = (index: number) => {
    const updated = editData.options.map((o: any, i: number) => ({
      ...o,
      is_correct: i === index,
    }));
    setEditData({ ...editData, options: updated });
  };

  const handleSave = async () => {
    const payload: any = {
      question_id: editData.id
    };

    // check question text change
    if (editData.question_text !== originalData.question_text) {
      payload.question_text = editData.question_text;
    }

    // check question image change
    if (editData.question_image !== originalData.question_image) {
      payload.question_image = editData.question_image;
    }

    // check solution change
    if (editData.solution !== originalData.solution) {
      payload.solution = editData.solution;
    }

    // check options change
    const changedOptions = editData.options.filter(
      (o: any, i: number) =>
        o.option_text !== originalData.options[i].option_text ||
        o.is_correct !== originalData.options[i].is_correct
    );

    if (changedOptions.length > 0) {
      payload.options = changedOptions.map((o: any) => ({
        id: o.id,
        option_text: o.option_text,
        is_correct: o.is_correct,
      }));
    }

    // if nothing changed
    if (Object.keys(payload).length <= 1) { // only question_id
      alert("Nothing changed");
      setEditingId(null);
      return;
    }

    await updateQuestion(editData.id, payload);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteQuestion(id);
    setDeletingId(null);
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-black">
        Loading Questions...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4">
      <h1 className="text-black mb-4">No of Questions {questions.length}</h1>
      
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-400 text-black">
          {questions && questions.length > 0 && (
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2 w-16">Order</th>
                <th className="border p-2">Question</th>
                <th className="border p-2">Options</th>
                <th className="border p-2 w-24">Correct</th>
                <th className="border p-2 w-64">Solution</th>
                <th className="border p-2 w-32">Actions</th>
              </tr>
            </thead>
          )}
          
          <tbody>
            {questions.map((q) => {
              const isEditing = editingId === q.id;
              const row = isEditing ? editData : q;

              return (
                <tr key={q.id} className="border">
                  {/* Order */}
                  <td className="border p-2 text-center">{row.question_order}</td>

                  {/* Question */}
                  <td className="border p-2">
                    {isEditing ? (
                      <textarea
                        className="border p-2 w-full text-black rounded resize-none"
                        rows={3}
                        value={row.question_text}
                        onChange={(e) =>
                          setEditData({
                            ...row,
                            question_text: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <div className="max-w-xs break-words">{row.question_text}</div>
                    )}
                  </td>

                  {/* Options */}
                  <td className="border p-2">
                    <div className="space-y-2">
                      {row.options.map((o: any, i: number) => (
                        <div key={o.id} className="flex gap-2 items-center">
                          <span className="font-semibold w-6">{String.fromCharCode(65 + i)}.</span>
                          {isEditing ? (
                            <input
                              className="border p-1 flex-1 text-black rounded"
                              value={o.option_text}
                              onChange={(e) => handleOptionChange(i, e.target.value)}
                            />
                          ) : (
                            <span className={o.is_correct ? "text-green-700 font-medium" : ""}>
                              {o.option_text}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Correct Answer */}
                  <td className="border p-2 text-center">
                    {isEditing ? (
                      <div className="space-y-2">
                        {row.options.map((o: any, i: number) => (
                          <button
                            key={o.id}
                            onClick={() => toggleCorrect(i)}
                            className={`w-8 h-8 rounded-full text-sm font-bold transition ${
                              o.is_correct 
                                ? "bg-green-500 text-white" 
                                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                            }`}
                          >
                            {String.fromCharCode(65 + i)}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold">
                        {row.options.find((o: any) => o.is_correct)?.option_text?.charAt(0) || 
                         String.fromCharCode(65 + row.options.findIndex((o: any) => o.is_correct))}
                      </span>
                    )}
                  </td>

                  {/* Solution - NEW COLUMN */}
                  <td className="border p-2">
                    {isEditing ? (
                      <textarea
                        className="border p-2 w-full text-black rounded resize-none"
                        rows={4}
                        placeholder="Enter solution..."
                        value={row.solution || ""}
                        onChange={(e) =>
                          setEditData({
                            ...row,
                            solution: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <div className="max-w-xs">
                        {row.solution ? (
                          <div className="text-sm text-gray-700 max-h-32 overflow-y-auto">
                            {row.solution}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-sm">No solution</span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="border p-2">
                    <div className="flex flex-col gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleSave}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => startEdit(q)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          Edit
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDelete(q.id)}
                        disabled={deletingId === q.id}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                      >
                        {deletingId === q.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {questionUpdation && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
          <div className="bg-white px-6 py-4 rounded-lg shadow-lg">
            <div className="flex items-center text-black text-lg font-medium gap-2">
              Saving
              <span className="flex gap-1">
                <span className="w-2 h-2 bg-black rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-black rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-black rounded-full animate-bounce delay-300"></span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}