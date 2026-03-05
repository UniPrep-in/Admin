import { createClient } from "../lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/ui/Navbar";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  return (
    <main>
      <div>
        <Navbar />
      </div>

      <h1 className="text-black">Dashboard</h1>
      <p className="text-black">Logged in as: {user.email}</p>

      <Link
        href="/profile"
        className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Update Profile
      </Link>
      <Link
        href="/dashboard/create-test"
        className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
          create exam
      </Link>
    </main>
  );
}