"use client";

import AiAssistantButton from "@/components/AiAssistantButton";
import AiAssistantModal from "@/components/AiAssistantModal";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import React from "react";
import { MessageCircle } from "lucide-react";
import { useAssistantStore } from "@/store/assistant";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const openAssistant = useAssistantStore((state) => state.open);

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAF9]">
      <Header />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-28 pt-4">
        {children}
      </main>
      <div className="fixed bottom-24 ltr:right-4 rtl:left-4 z-40 flex flex-col items-end gap-2 md:right-auto md:left-1/2 md:-translate-x-1/2 md:translate-y-0">
        <button
          onClick={openAssistant}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1B8E5A] text-white shadow-lg transition hover:scale-[0.99] active:scale-95 md:relative md:left-20"
          aria-label="المساعد الذكي"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
        <AiAssistantButton
          floating={false}
          className="h-14 w-14"
        />
      </div>
      <AiAssistantModal />
      <BottomNav />
    </div>
  );
}
