"use client"
import { useState } from "react"
import { createClient } from "@/app/lib/supabase/client"

export default function Notes() {
  const [title, setTitle] = useState("")
  const [bucket, setBucket] = useState("")
  const [subject, setSubject] = useState("")
  const [stream, setStream] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      alert("Please upload a PDF")
      return
    }

    if (!title || !bucket || !subject || !stream) {
      alert("Please fill all fields")
      return
    }

    if (file.size > 15 * 1024 * 1024) {
      alert("File must be less than 15MB")
      return
    }

    try {
      setLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not found")
      }

      const filePath = `pdfs/${Date.now()}-${file.name}`

      const { error: uploadError } = await supabase.storage
        .from("notes")
        .upload(filePath, file)

      if (uploadError) {
        console.error(uploadError)
        alert("Upload failed")
        return
      }

      const { data: signedData } = await supabase.storage
        .from("notes")
        .createSignedUrl(filePath, 60 * 60) // 1 hour

      const pdf_url = signedData?.signedUrl

      const { error: insertError } = await supabase.from("notes").insert({
        title,
        pdf_url,
        bucket,
        subject,
        stream,
        user_id: user.id,
      })

      if (insertError) {
        console.error(insertError)
        alert("DB insert failed")
        return
      }

      alert("Note uploaded successfully!")

      // reset form
      setTitle("")
      setBucket("")
      setSubject("")
      setStream("")
      setFile(null)
    } catch (err) {
      console.error(err)
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-6 text-black min-h-screen">
      <div className="max-w-2xl mx-auto bg-white border border-neutral-200 rounded-xl p-6 shadow-lg">
        <h1 className="text-2xl mb-6 text-center">
          Upload Notes
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Title"
            className="p-3 rounded-md bg-neutral-100 border border-neutral-200 focus:outline-none focus:border-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <select
            className="p-3 rounded-md bg-neutral-100 border border-neutral-200 focus:outline-none focus:border-white"
            value={bucket}
            onChange={(e) => setBucket(e.target.value)}
          >
            <option value="">Select Bucket</option>
            <option value="cuet">CUET</option>
          </select>

          <select
            className="p-3 rounded-md bg-neutral-100 border border-neutral-200 focus:outline-none focus:border-white"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="">Select Subject</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
            <option value="math">Math</option>
            <option value="math">Business Studies</option>
            <option value="math">Accounts</option>
            <option value="math">Economics</option>
          </select>

          <select
            className="p-3 rounded-md bg-neutral-100 border border-neutral-200 focus:outline-none focus:border-white"
            value={stream}
            onChange={(e) => setStream(e.target.value)}
          >
            <option value="">Select Stream</option>
            <option value="science">Science</option>
            <option value="commerce">Commerce</option>
            <option value="commerce">Arts</option>
          </select>

          <label className="flex flex-col gap-2 text-sm text-black">
            Upload PDF
            <input
              type="file"
              accept="application/pdf"
              className="p-3 rounded-md bg-neutral-100 border border-neutral-200 file:bg-black file:text-white file:px-4 file:py-1 file:rounded-md"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>

          <button
            type="submit"
            className="bg-emerald-300 border text-black py-3 rounded-2xl hover:scale-105 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Note"}
          </button>
        </form>
      </div>
    </main>
  )
}