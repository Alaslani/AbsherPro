"use client";

import { cn } from "@/lib/utils";
import { useAssistantStore } from "@/store/assistant";
import { MessageCircle } from "lucide-react";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  size?: "sm" | "lg";
  className?: string;
  floating?: boolean;
}>;

const AiAssistantButton = ({ size = "lg", className, floating, children }: Props) => {
  const open = useAssistantStore((state) => state.open);

  const base = cn(
    "rounded-full bg-gradient-to-r from-[#1B8E5A] to-[#156B45] text-white shadow-lg transition hover:scale-[0.99] active:scale-95",
    size === "lg" ? "h-14 w-14" : "h-10 w-10",
    className
  );

  if (floating) {
    return (
      <button
        onClick={open}
        className={cn(
          base,
          "fixed bottom-24 ltr:right-4 rtl:left-4 z-40 flex items-center justify-center md:top-1/2 md:bottom-auto md:right-6 md:left-auto md:-translate-y-1/2"
        )}
        aria-label="AI assistant"
      >
        {children ?? <MessageCircle className="h-5 w-5" />}
      </button>
    );
  }

  return (
    <button onClick={open} className={cn(base, "flex items-center justify-center")} aria-label="AI assistant">
      {children ?? <MessageCircle className="h-5 w-5" />}
    </button>
  );
};

export default AiAssistantButton;
