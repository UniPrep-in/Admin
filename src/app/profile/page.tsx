"use client";
import Loader from "../components/ui/loader";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProfileStore } from "../../store/profileStore";
import { createClient } from "../lib/supabase/client";
import Navbar from "../components/Navbar";
import UpdateProfileForm from "./update-profile/UpdateProfileForm";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  const [editing, setEditing] = useState(false);

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
        <Loader />
      </div>
    );
  }

  if (editing) {
    return (
      <div className="min-h-screen bg-neutral-100">
        <Navbar />
        <div className="max-w-3xl mx-auto mt-10 px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl text-black">Your Profile</h1>
              <button
                onClick={() => setEditing(false)}
                className="text-sm text-black bg-red-300 border px-6 py-2 rounded-full shadow-lg"
              >
                Back
              </button>
            </div>
            <UpdateProfileForm />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      <Navbar />

      <div className="max-w-3xl mx-auto mt-10 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6 border-b pb-6">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-semibold text-neutral-900">
                {fullName || "User"}
              </h1>
              <p className="text-sm text-neutral-500">Admin Profile</p>
            </div>
          </div>

          {/* Profile Info */}
          <div className="grid sm:grid-cols-2 gap-6 mt-6 text-sm">
            <div>
              <p className="text-neutral-500">Full Name</p>
              <p className="font-medium text-neutral-900">{fullName || "Not provided"}</p>
            </div>

            <div>
              <p className="text-neutral-500">Phone</p>
              <p className="font-medium text-neutral-900">{phone || "Not provided"}</p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-neutral-500">Address</p>
              <p className="font-medium text-neutral-900">
                {address || "No address added"}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-300 border text-black px-6 py-2 rounded-lg hover:scale-110 duration-300 transition"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}