"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfileStore } from "../../store/profileStore";
import { createClient } from "../lib/supabase/client";
import Navbar from "../components/ui/Navbar";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  const {
    fullName,
    phone,
    address,
    imageUrl,
    loading,
    fetchProfile,
  } = useProfileStore();

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth");
        return;
      }

      fetchProfile();
    }

    checkUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-lg font-semibold text-gray-700">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-200 to-slate-400">
     <Navbar/>
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">
          My Profile
        </h2>

        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt="Profile"
            className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-blue-500"
          />
        ) : (
          <div className="w-28 h-28 rounded-full mx-auto bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600">No Image</span>
          </div>
        )}

        <div className="text-left space-y-2 text-gray-700">
          <p><strong>Name:</strong> {fullName}</p>
          <p><strong>Phone:</strong> {phone}</p>
          <p><strong>Address:</strong> {address}</p>
        </div>

        <button
          onClick={() => router.push("/profile/update-profile")}
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}