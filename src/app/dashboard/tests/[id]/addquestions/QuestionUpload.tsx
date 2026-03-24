"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import * as XLSX from "xlsx";
import { useQuestionStore } from "@/store/questionStore";
import { createClient } from "../../../../lib/supabase/client";
import { BsFillCloudUploadFill } from "react-icons/bs";
import { AiOutlineClear } from "react-icons/ai";

type QuestionRow = {
  question_order: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct: string;
  question_image?: string | null;
  solution?: string | null;
};

type DraftData = {
  questionText: string;
  questionOrder: number;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correct: string;
  solution: string;
  rows: QuestionRow[];
};

const DRAFT_KEY = "question_upload_draft";

function readDraft(): DraftData | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as DraftData) : null;
  } catch {
    return null;
  }
}

export default function QuestionUpload({ testId }: { testId: string }) {
  const fileInput = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { rows, setRows, createQuestions, loading } = useQuestionStore();

  // Always start with empty defaults so SSR and first client render match
  const [questionText, setQuestionText] = useState("");
  const [questionOrder, setQuestionOrder] = useState<number>(1);
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correct, setCorrect] = useState("A");
  const [solution, setSolution] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [draftStatus, setDraftStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [hasDraft, setHasDraft] = useState(false);

  // Restore draft after mount — runs only on the client, no SSR mismatch.
  // React 18 auto-batches all setState calls inside useEffect so this is
  // a single re-render, not a cascade.
  useEffect(() => {
    const draft = readDraft();
    if (!draft) return;
    setQuestionText(draft.questionText || "");
    setQuestionOrder(draft.questionOrder || 1);
    setOptionA(draft.optionA || "");
    setOptionB(draft.optionB || "");
    setOptionC(draft.optionC || "");
    setOptionD(draft.optionD || "");
    setCorrect(draft.correct || "A");
    setSolution(draft.solution || "");
    if (draft.rows?.length) setRows(draft.rows);
    setHasDraft(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save draft (debounced 500ms)
  const saveDraft = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setDraftStatus("saving");
    saveTimerRef.current = setTimeout(() => {
      try {
        const draft: DraftData = {
          questionText,
          questionOrder,
          optionA,
          optionB,
          optionC,
          optionD,
          correct,
          solution,
          rows,
        };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        setDraftStatus("saved");
        setHasDraft(true);
        setTimeout(() => setDraftStatus("idle"), 2000);
      } catch {
        setDraftStatus("idle");
      }
    }, 500);
  }, [questionText, questionOrder, optionA, optionB, optionC, optionD, correct, solution, rows]);

  // Auto-save on any field change
  useEffect(() => {
    saveDraft();
  }, [saveDraft]);

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
    setDraftStatus("idle");
  };

  const parseFile = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);
    setRows(json as QuestionRow[]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
  };

  const addQuestionManually = async () => {
    let imagePath: string | null = null;

    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`;
      const { data, error } = await supabase.storage
        .from("QuestionImage")
        .upload(fileName, imageFile);

      if (error) {
        console.error("Supabase upload error:", error);
        alert("Image upload failed. Check console.");
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("QuestionImage")
        .getPublicUrl(fileName);

      imagePath = publicUrlData.publicUrl;
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
      solution: solution || null,
    };

    setRows([...rows, newRow]);
    setQuestionText("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setCorrect("A");
    setSolution("");
    setImageFile(null);
    setQuestionOrder((prev) => prev + 1);
  };

  const handleUpload = async () => {
    await createQuestions(testId);
    clearDraft();
    setRows([]);
  };

  return (
    <main className="max-w-5xl mx-auto text-black">
      {/* Draft status bar */}
      <div className="flex items-center justify-between mb-4 min-h-7">
        <div className="flex items-center gap-2">
          {draftStatus === "saving" && (
            <span className="text-black bg-amber-300 hover:scale-105 duration-300 border rounded-xl px-6 py-4 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-black animate-pulse" />
              Saving draft
            </span>
          )}
          {draftStatus === "saved" && (
            <span className="text-black bg-emerald-300 border px-6 py-4 rounded-xl flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-black" />
              Draft saved
            </span>
          )}
          {draftStatus === "idle" && hasDraft && (
            <span className="border rounded-xl bg-emerald-300 text-black px-6 py-4">Draft restored</span>
          )}
        </div>

        {hasDraft && (
          <button
            onClick={() => {
              if (confirm("Clear draft and reset all fields?")) {
                clearDraft();
                setQuestionText("");
                setOptionA("");
                setOptionB("");
                setOptionC("");
                setOptionD("");
                setCorrect("A");
                setSolution("");
                setQuestionOrder(1);
                setRows([]);
              }
            }}
            className="bg-red-300 hover:scale-105 duration-300 border rounded-2xl text-black px-6 py-4 flex items-center justify-center gap-2"
          >
            <AiOutlineClear className="text-lg" />Clear draft
          </button>
        )}
      </div>

      <div className="border border-gray-300 rounded-lg p-6 mb-8 bg-white">
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter question text"
          className="w-full border p-2 rounded mb-4"
        />

        <textarea
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          placeholder="Enter solution (optional)"
          className="w-full border p-2 rounded mb-4"
        />

        <div className="grid grid-cols-2 gap-3 mb-4">
          <input value={optionA} onChange={(e) => setOptionA(e.target.value)} placeholder="Option A" className="border p-2 rounded" />
          <input value={optionB} onChange={(e) => setOptionB(e.target.value)} placeholder="Option B" className="border p-2 rounded" />
          <input value={optionC} onChange={(e) => setOptionC(e.target.value)} placeholder="Option C" className="border p-2 rounded" />
          <input value={optionD} onChange={(e) => setOptionD(e.target.value)} placeholder="Option D" className="border p-2 rounded" />
        </div>

        <div className="flex gap-4 mb-4 items-center">
          <label className="text-sm">Correct Option:</label>
          <select value={correct} onChange={(e) => setCorrect(e.target.value)} className="border p-2 rounded">
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>

        <div className="mb-4 flex flex-col gap-2">
          <span>If question has any images (e.g. match the following, pattern based)</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="file:bg-emerald-300 file:text-black file:border file:rounded-full file:px-4 file:py-2"
          />
          {imageFile && (
            <div className="mt-3">
              <p className="text-sm mb-1">Image Preview</p>
              <img src={URL.createObjectURL(imageFile)} className="w-48 rounded-lg border" alt="preview" />
            </div>
          )}
        </div>

        <button
          onClick={addQuestionManually}
          className="bg-linear-to-br from-black via-neutral-700 to-black text-white px-6 py-4 rounded-2xl hover:scale-110"
        >
          Add Question
        </button>
      </div>

      <div className="mb-6 flex gap-3">
        <input ref={fileInput} type="file" hidden accept=".xlsx" onChange={handleFileSelect} />
        {rows.length > 0 && (
          <button onClick={handleUpload} className="bg-green-300 hover:scale-105 duration-300 flex items-center justify-center gap-2 text-black border px-6 py-4 rounded-xl">
            <BsFillCloudUploadFill className="text-lg" />{loading ? "Uploading..." : "Upload Questions"}
          </button>
        )}
      </div>

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
                <th className="border border-gray-400 p-2">Solution</th>
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
                  <td className="border border-gray-400 p-2 font-bold text-blue-700">{row.correct}</td>
                  <td className="border border-gray-400 p-2">{row.solution ? row.solution : "-"}</td>
                  <td className="border border-gray-400 p-2">
                    {row.question_image ? (
                      <img src={row.question_image} className="w-16 h-16 object-cover rounded" alt="question" />
                    ) : ("-")}
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