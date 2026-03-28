"use client";
import Loader from "@/app/components/ui/loader";
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
    return <div className="flex justify-center items-center">
      <Loader />
    </div>;
  }

return (
  <div className="flex justify-center items-center bg-none">
    <form
   onSubmit={async (e) => {
    e.preventDefault();

    const success = await saveProfile();

    if (success) {
      router.push("/profile");
    }
  }}
      className="bg-none w-96 space-y-5"
    >
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
        className="w-full text-black text-sm file:text-black file:rounded-full file:px-4 file:py-2 file:bg-linear-to-br file:from-blue-300 file:to-blue-300"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        required
      />

      {imageError && (
        <p className="text-red-600 text-sm">{imageError}</p>
      )}

      <button
  type="submit"
  disabled={loading || imageError != null}
  className="w-full bg-emerald-300 border text-black p-2 rounded-lg"
>
  {loading ? "Saving..." : "Save Profile"}
</button>
    </form>
  </div>
);
}