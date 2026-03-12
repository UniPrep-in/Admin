"use client";
import { useParams } from "next/navigation";
import QuestionUpload from "./QuestionUpload";

export default function UploadPage() {
  const { id } = useParams();

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Upload Questions</h1>

      <QuestionUpload testId={id as string} />
    </div>
  );
}