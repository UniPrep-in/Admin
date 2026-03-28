'use client';
import CreateTestPage from "./create-test/page";
import TestsPage from "./tests/page";
import ProfilePage from "../profile/page";
import FlashCards from "./flashCard/page";
import CouponsPage from "./coupons/page";
import Notes from "./notes/page";
import { useEffect, useRef, useState } from "react";
import { createClient } from "../lib/supabase/client";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { Toaster } from "react-hot-toast";
import { CgProfile } from "react-icons/cg";
import { TbPencilCode } from "react-icons/tb";
import { FaListUl } from "react-icons/fa6";
import { TbCardsFilled } from "react-icons/tb";
import { FaNoteSticky } from "react-icons/fa6";
import { RiCoupon3Line } from "react-icons/ri";

type Tab = "profile" | "create" | "list" | "flashcards" | "notes" | "coupons";

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
            className={`px-4 py-2 flex gap-2 justify-center items-center rounded-full text-black ${
              activeTab === "profile"
                ? "text-black bg-amber-400 border"
                : ""
            }`}
          >
            <CgProfile />Profile
          </button>

          <button
            ref={(el) => { tabRefs.current[1] = el; }}
            onClick={() => {
              gsap.fromTo(tabRefs.current[1], { scale: 0.9 }, { scale: 1, duration: 0.25, ease: "power2.out" });
              setActiveTab("create");
            }}
            className={`px-4 py-2 flex items-center justify-center gap-2 rounded-full text-black ${
              activeTab === "create"
                ? "text-black bg-amber-400 border"
                : ""
            }`}
          >
            <TbPencilCode />Create Exam
          </button>

          <button
            ref={(el) => { tabRefs.current[2] = el; }}
            onClick={() => {
              gsap.fromTo(tabRefs.current[2], { scale: 0.9 }, { scale: 1, duration: 0.25, ease: "power2.out" });
              setActiveTab("list");
            }}
            className={`px-4 py-2 flex items-center justify-center gap-2 rounded-full text-black ${
              activeTab === "list"
                ? "text-black bg-amber-400 border"
                : ""
            }`}
          >
            <FaListUl />List Exams
          </button>
          <button
            ref={(el) => { tabRefs.current[3] = el; }}
            onClick={() => {
              gsap.fromTo(tabRefs.current[3], { scale: 0.9 }, { scale: 1, duration: 0.25, ease: "power2.out" });
              setActiveTab("flashcards");
            }}
            className={`px-4 py-2 flex items-center justify-center gap-2 rounded-full text-black ${
              activeTab === "flashcards"
                ? "text-black bg-amber-400 border"
                : ""
            }`}
          >
            <TbCardsFilled />Flash Cards
          </button>
          <button
            ref={(el) => { tabRefs.current[4] = el; }}
            onClick={() => {
              gsap.fromTo(tabRefs.current[4], { scale: 0.9 }, { scale: 1, duration: 0.25, ease: "power2.out" });
              setActiveTab("notes");
            }}
            className={`px-4 py-2 flex items-center justify-center gap-2 rounded-full text-black ${
              activeTab === "notes"
                ? "text-black bg-amber-400 border"
                : ""
            }`}
          >
            <FaNoteSticky />Notes
          </button>
          <button
            ref={(el) => { tabRefs.current[5] = el; }}
            onClick={() => {
              gsap.fromTo(tabRefs.current[5], { scale: 0.9 }, { scale: 1, duration: 0.25, ease: "power2.out" });
              setActiveTab("coupons");
            }}
            className={`px-4 py-2 flex items-center justify-center gap-2 rounded-full text-black ${
              activeTab === "coupons"
                ? "text-black bg-amber-400 border"
                : ""
            }`}
          >
            <RiCoupon3Line />Coupons
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
            {activeTab === "notes" && (
              <motion.div
                key="notes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <Notes />
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
