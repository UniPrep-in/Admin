'use client';
import CreateTestPage from "./create-test/page";
import TestsPage from "./tests/page";
import ProfilePage from "../profile/page";
import { useEffect, useRef, useState } from "react";
import { createClient } from "../lib/supabase/client";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { Toaster } from "react-hot-toast";

type Tab = "profile" | "create" | "list";

export default function Dashboard() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [activeTab, setActiveTab] = useState<Tab>(() => {
    if (typeof window !== "undefined") {
      const savedTab = localStorage.getItem("activeTab");
      if (savedTab === "profile" || savedTab === "create" || savedTab === "list") {
        return savedTab;
      }
    }
    return "profile";
  });

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth");
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <main className="flex flex-col items-center min-h-screen bg-neutral-100">
      <Navbar />
      <Toaster position="top-right" />

      <div className="w-full max-w-6xl py-2 bg-neutral-100">
        {/* Tabs */}
        <div className="flex gap-2 bg-white rounded-full border border-neutral-200 p-2">
          <button
            ref={(el) => { tabRefs.current[0] = el; }}
            onClick={() => {
              gsap.fromTo(tabRefs.current[0], { scale: 0.9 }, { scale: 1, duration: 0.25, ease: "power2.out" });
              setActiveTab("profile");
            }}
            className={`px-4 py-2 rounded-full text-black ${
              activeTab === "profile"
                ? "bg-linear-to-br text-white from-pink-400 to-purple-400"
                : ""
            }`}
          >
            Profile
          </button>

          <button
            ref={(el) => { tabRefs.current[1] = el; }}
            onClick={() => {
              gsap.fromTo(tabRefs.current[1], { scale: 0.9 }, { scale: 1, duration: 0.25, ease: "power2.out" });
              setActiveTab("create");
            }}
            className={`px-4 py-2 rounded-full text-black ${
              activeTab === "create"
                ? "bg-linear-to-br text-white from-pink-400 to-purple-400"
                : ""
            }`}
          >
            Create Exam
          </button>

          <button
            ref={(el) => { tabRefs.current[2] = el; }}
            onClick={() => {
              gsap.fromTo(tabRefs.current[2], { scale: 0.9 }, { scale: 1, duration: 0.25, ease: "power2.out" });
              setActiveTab("list");
            }}
            className={`px-4 py-2 rounded-full text-black ${
              activeTab === "list"
                ? "bg-linear-to-br text-white from-pink-400 to-purple-400"
                : ""
            }`}
          >
            List Exams
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-neutral-100 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <ProfilePage />
              </motion.div>
            )}

            {activeTab === "create" && (
              <motion.div
                key="create"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <CreateTestPage />
              </motion.div>
            )}

            {activeTab === "list" && (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <TestsPage />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
