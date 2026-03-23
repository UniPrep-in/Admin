"use client";

import { useParams } from "next/navigation";
import QuestionsTable from "./QuestionsTable";
import Navbar from "@/app/components/Navbar";

export default function QuestionsPage() {
  const { id } = useParams();

  return (
    <div>
      <Navbar/>
      <h1 className="text-xl text-center py-6 font-bold text-black">
        Questions List
      </h1>

      <QuestionsTable testId={id as string} />
    </div>
  );
}