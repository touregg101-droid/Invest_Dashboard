"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpenText, FileText, HeartPulse, Home, Landmark } from "lucide-react";

const items = [
  { href: "/", label: "홈", icon: Home },
  { href: "/stocks/005930", label: "종목", icon: Landmark },
  { href: "/#flows", label: "수급", icon: BarChart3 },
  { href: "/#sentiment", label: "심리", icon: HeartPulse },
  { href: "/#research", label: "리서치", icon: FileText },
  { href: "/journal", label: "일지", icon: BookOpenText }
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white/95 backdrop-blur">
      <div className="mx-auto grid max-w-md grid-cols-6 px-1 pb-2 pt-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/" ? pathname === "/" : item.href.startsWith("/#") ? false : pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-md text-[10px] ${active ? "text-ink" : "text-muted"}`}
            >
              <Icon size={19} strokeWidth={active ? 2.4 : 1.8} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
