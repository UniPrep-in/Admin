"use client";

import { useParams } from "next/navigation";
import QuestionUpload from "./QuestionUpload";
import Navbar from "@/app/components/Navbar";

export default function UploadPage() {
  const { id } = useParams();

  return (
    <div>
        <Navbar/>
      <h1 className="text-xl font-bold mb-6">Upload Questions</h1>

      <QuestionUpload testId={id as string} />
    </div>
  );
}