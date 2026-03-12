"use client";
import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { useQuestionStore } from "@/store/questionStore";
import { createClient } from "../../../../lib/supabase/client";

type QuestionRow = {
  question_order: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct: string;
  question_image?: string | null;
};

export default function QuestionUpload({ testId }: { testId: string }) {
  const fileInput = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const { rows, setRows, createQuestions, loading } = useQuestionStore();

  const [questionText, setQuestionText] = useState("");
  const [questionOrder, setQuestionOrder] = useState<number>(1);
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correct, setCorrect] = useState("A");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const parseFile = async (file: File) => {
    const buffer = await file.arrayBuffer();

    const workbook = XLSX.read(buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const json = XLSX.utils.sheet_to_json(sheet);

    setRows(json as QuestionRow[]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      parseFile(file);
    }
  };

  const addQuestionManually = async () => {
    let imagePath: string | null = null;

    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`;

      console.log("Uploading image:", fileName, imageFile);

      const { data, error } = await supabase.storage
        .from("QuestionImage")
        .upload(fileName, imageFile);

      if (error) {
        console.error("Supabase upload error:", error);
        alert("Image upload failed. Check console.");
        return;
      }

      console.log("Upload success:", data);

      const { data: publicUrlData } = supabase.storage
        .from("QuestionImage")
        .getPublicUrl(fileName);

      imagePath = publicUrlData.publicUrl;

      console.log("Public URL:", imagePath);
    }

    const newRow: QuestionRow = {
      question_text: questionText,
      question_order: questionOrder,
      option_a: optionA,
      option_b: optionB,
      option_c: optionC,
      option_d: optionD,
      correct,
      question_image: imagePath ?? null,
    };

    setRows([...rows, newRow]);

    setQuestionText("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setCorrect("A");
    setImageFile(null);
    setQuestionOrder((prev) => prev + 1);
  };

  return (
    <main className="max-w-5xl mx-auto text-black">
      <div className="border border-gray-300 rounded-lg p-6 mb-8 bg-white">
        <h2 className="text-lg font-semibold mb-4">Add Question Manually</h2>

        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter question text"
          className="w-full border p-2 rounded mb-4"
        />

        <div className="grid grid-cols-2 gap-3 mb-4">
          <input value={optionA} onChange={(e)=>setOptionA(e.target.value)} placeholder="Option A" className="border p-2 rounded" />
          <input value={optionB} onChange={(e)=>setOptionB(e.target.value)} placeholder="Option B" className="border p-2 rounded" />
          <input value={optionC} onChange={(e)=>setOptionC(e.target.value)} placeholder="Option C" className="border p-2 rounded" />
          <input value={optionD} onChange={(e)=>setOptionD(e.target.value)} placeholder="Option D" className="border p-2 rounded" />
        </div>

        <div className="flex gap-4 mb-4 items-center">
          <label className="text-sm">Correct Option:</label>
          <select value={correct} onChange={(e)=>setCorrect(e.target.value)} className="border p-2 rounded">
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>

        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e)=>setImageFile(e.target.files?.[0] || null)}
          />

          {imageFile && (
            <div className="mt-3">
              <p className="text-sm mb-1">Image Preview</p>
              <img
                src={URL.createObjectURL(imageFile)}
                className="w-48 rounded-lg border"
                alt="preview"
              />
            </div>
          )}
        </div>

        <button
          onClick={addQuestionManually}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Question
        </button>
      </div>

      {/* Preview Table */}
      {rows.length > 0 && (
        <div className="overflow-x-auto border border-gray-400 rounded">
          <table className="w-full text-sm border-collapse text-black">
            <thead className="bg-gray-200 text-black">
              <tr>
                <th className="border border-gray-400 p-2">Order</th>
                <th className="border border-gray-400 p-2">Question</th>
                <th className="border border-gray-400 p-2">A</th>
                <th className="border border-gray-400 p-2">B</th>
                <th className="border border-gray-400 p-2">C</th>
                <th className="border border-gray-400 p-2">D</th>
                <th className="border border-gray-400 p-2">Correct</th>
                <th className="border border-gray-400 p-2">Image</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-t border-gray-400">
                  <td className="border border-gray-400 p-2">{row.question_order}</td>
                  <td className="border border-gray-400 p-2">{row.question_text}</td>
                  <td className="border border-gray-400 p-2">{row.option_a}</td>
                  <td className="border border-gray-400 p-2">{row.option_b}</td>
                  <td className="border border-gray-400 p-2">{row.option_c}</td>
                  <td className="border border-gray-400 p-2">{row.option_d}</td>
                  <td className="border border-gray-400 p-2 font-bold text-blue-700">
                    {row.correct}
                  </td>
                  <td className="border border-gray-400 p-2">
                    {row.question_image ? (
                      <img
                        src={row.question_image}
                        className="w-16 h-16 object-cover rounded"
                        alt="question"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}