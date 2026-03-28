"use client";
import { useParams } from "next/navigation";
import QuestionUpload from "./QuestionUpload";

export default function UploadPage() {
  const { id } = useParams();

  return (
    <div className="py-6">
      <QuestionUpload testId={id as string} />
    </div>
  );
}