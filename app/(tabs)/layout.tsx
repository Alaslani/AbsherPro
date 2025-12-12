"use client";

import AiAssistantModal from "@/components/AiAssistantModal";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import React from "react";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAF9]">
      <Header />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-28 pt-4">
        {children}
      </main>
      <AiAssistantModal />
      <BottomNav />
    </div>
  );
}
