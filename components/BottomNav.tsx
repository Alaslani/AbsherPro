"use client";

import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/store/settings";
import Link from "next/link";
import { Accessibility, BarChart3, Home, ScrollText, ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";

const BottomNav = () => {
  const pathname = usePathname();
  const language = useSettingsStore((state) => state.language);

  const items = [
    { href: "/", label: t("home", language), icon: Home },
    { href: "/grantor", label: t("grantor", language), icon: ShieldCheck },
    { href: "/delegate", label: t("delegate", language), icon: ScrollText },
    { href: "/analytics", label: t("analytics", language), icon: BarChart3 },
    { href: "/accessibility", label: t("accessibility", language), icon: Accessibility },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-between px-2 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex w-full flex-col items-center gap-1 rounded-xl px-2 py-2 text-[12px] font-semibold transition",
                active
                  ? "bg-[#1B8E5A]/10 text-[#1B8E5A]"
                  : "text-slate-500 hover:text-[#1B8E5A]"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
