"use client";

import { useParams } from "next/navigation";
import QuestionsTable from "./QuestionsTable";
import Navbar from "@/app/components/Navbar";

export default function QuestionsPage() {
  const { id } = useParams();

  return (
    <div>
        <Navbar/>
      <h1 className="text-xl font-bold text-black mb-6">
        Questions List
      </h1>

      <QuestionsTable testId={id as string} />
    </div>
  );
}