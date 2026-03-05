"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProfileStore } from "../../../store/profileStore";
import { createClient } from "../../lib/supabase/client";

export default function UpdateProfileForm() {
  const router = useRouter();
  const supabase = createClient();
  const [checkingAuth, setCheckingAuth] = useState(true);

  const {
    fullName,
    phone,
    address,
    loading,
    setFullName,
    setPhone,
    setAddress,
    setFile,
    saveProfile,
    imageError
  } = useProfileStore();

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth");
      } else {
        setCheckingAuth(false);
      }
    }

    checkUser();
  }, []);

  if (checkingAuth) {
    return <p className="text-center mt-10">Checking authentication...</p>;
  }

return (
  <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-200 to-slate-400">
    <form
   onSubmit={async (e) => {
    e.preventDefault();

    const success = await saveProfile();

    if (success) {
      router.push("/profile");
    }
  }}
      className="bg-white p-8 rounded-2xl shadow-2xl w-96 space-y-5"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Complete Profile
      </h2>

      <input
        type="text"
        placeholder="Full Name"
        className="w-full border border-gray-400 p-2 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />

      <input
        type="tel"
        placeholder="Phone Number"
        className="w-full border border-gray-400 p-2 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />

      <textarea
        placeholder="Address"
        className="w-full border border-gray-400 p-2 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />

      <input
        type="file"
        accept="image/*"
        className="w-full text-black"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        required
      />

      {imageError && (
        <p className="text-red-600 text-sm">{imageError}</p>
      )}

      <button
  type="submit"
  disabled={loading || imageError != null}
  className="w-full bg-black text-white font-semibold p-2 rounded-lg 
             hover:bg-blue-700 transition duration-200 
             disabled:bg-gray-400 disabled:text-gray-200"
>
  {loading ? "Saving..." : "Save Profile"}
</button>
    </form>
  </div>
);
}