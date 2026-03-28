'use client';
import CreateTestPage from "./create-test/page";
import TestsPage from "./tests/page";
import ProfilePage from "../profile/page";
import FlashCards from "./flashCard/page";
import CouponsPage from "./coupons/page";
import { useEffect, useRef, useState } from "react";
import { createClient } from "../lib/supabase/client";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { Toaster } from "react-hot-toast";

type Tab = "profile" | "create" | "list" | "flashcards" | "coupons";

export default function Dashboard() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("profile");

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
          <button
            ref={(el) => { tabRefs.current[3] = el; }}
            onClick={() => {
              gsap.fromTo(tabRefs.current[3], { scale: 0.9 }, { scale: 1, duration: 0.25, ease: "power2.out" });
              setActiveTab("flashcards");
            }}
            className={`px-4 py-2 rounded-full text-black ${
              activeTab === "flashcards"
                ? "bg-linear-to-br text-white from-pink-400 to-purple-400"
                : ""
            }`}
          >
            Flash Cards
          </button>
          <button
            ref={(el) => { tabRefs.current[4] = el; }}
            onClick={() => {
              gsap.fromTo(tabRefs.current[4], { scale: 0.9 }, { scale: 1, duration: 0.25, ease: "power2.out" });
              setActiveTab("coupons");
            }}
            className={`px-4 py-2 rounded-full text-black ${
              activeTab === "coupons"
                ? "bg-linear-to-br text-white from-pink-400 to-purple-400"
                : ""
            }`}
          >
            Coupons
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
            {activeTab === "flashcards" && (
              <motion.div
                key="flashcards"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <FlashCards />
              </motion.div>
            )}
            {activeTab === "coupons" && (
              <motion.div
                key="coupons"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <CouponsPage />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
