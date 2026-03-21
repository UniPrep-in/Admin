"use client";

import * as XLSX from "xlsx";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function FlashCards() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 📥 Upload Excel → Insert into DB
  const handleFileUpload = async (e: any) => {
    const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_USER_ID!;

    const file = e.target.files[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

    // Step 1: format incoming data
    const formatted = jsonData.map((item) => ({
      word: item.word.trim(),
      meaning: item.meaning,
      synonyms: item.synonyms ? item.synonyms.split(",").map((s: string) => s.trim()) : [],
      antonyms: item.antonyms ? item.antonyms.split(",").map((s: string) => s.trim()) : [],
      hook: item.hook || null,
      type: item.type || null,
      example: item.example || null,
      user_id: ADMIN_ID, // 🔥 ADMIN AS GLOBAL
    }));

    // Step 2: fetch existing GLOBAL flashcards
    const { data: existingData, error: fetchError } = await supabase
      .from("flash_cards")
      .select("*")
      .eq("user_id", ADMIN_ID);

    console.log("Existing Data:", existingData);

    if (fetchError) {
      console.error(fetchError);
      alert("Failed to fetch existing data ❌");
      return;
    }

    const existingMap: any = {};
    existingData?.forEach((card) => {
      existingMap[card.word.toLowerCase()] = card;
    });

    const toInsert: any[] = [];
    const toUpdate: any[] = [];

    // Step 3: merge logic
    formatted.forEach((item) => {
      const key = item.word.toLowerCase();

      if (existingMap[key]) {
        const existing = existingMap[key];

        const mergedSynonyms = Array.from(
          new Set([...(existing.synonyms || []), ...(item.synonyms || [])])
        );

        const mergedAntonyms = Array.from(
          new Set([...(existing.antonyms || []), ...(item.antonyms || [])])
        );

        toUpdate.push({
          id: existing.id,
          synonyms: mergedSynonyms,
          antonyms: mergedAntonyms,
          meaning: item.meaning || existing.meaning,
          hook: item.hook || existing.hook,
          type: item.type || existing.type,
          example: item.example || existing.example,
        });
      } else {
        toInsert.push(item);
      }
    });

    // Step 4: insert new
    if (toInsert.length > 0) {
      const { error: insertError } = await supabase
        .from("flash_cards")
        .insert(toInsert);

      if (insertError) {
        console.error("Insert Error:", insertError);
        alert(`Insert failed ❌: ${insertError.message}`);
        return;
      }
    }

    // Step 5: update existing
    for (const item of toUpdate) {
      const { error: updateError } = await supabase
        .from("flash_cards")
        .update(item)
        .eq("id", item.id);

      if (updateError) {
        console.error("Update Error:", updateError);
      }
    }
  };

  // 📤 Download Excel Template
  const downloadTemplate = () => {
    const templateData = [
      {
        word: "Aberration",
        meaning: "Departure from what is normal",
        synonyms: "anomaly,deviation",
        antonyms: "normality",
        hook: "Ab = away, erration = error",
        type: "noun",
        example: "His anger was an aberration",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Flashcards");

    XLSX.writeFile(workbook, "flashcards_template.xlsx");
  };

  return (
    <main className="p-6 flex flex-col gap-2">
      <span className="text-black text-lg">Download this template below to add the flashcards in the required format</span>

      {/* Download Template */}
      <button
        onClick={downloadTemplate}
        className="px-4 py-2 bg-white-500 text-blue-500 border border-blue-500 rounded w-fit"
      >
        Download Excel Template
      </button>

      <span className="text-black text-lg">Upload here click on this button and choose the file to upload make sure the file is in .xlsx or .xls format</span>
      {/* Upload File */}
      <div className="w-full max-w-md">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <p className="mb-2 text-sm text-blue-700">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-blue-500">.xlsx or .xls files only</p>
          </div>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>
    </main>
  );
}