"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Clipboard,
  LayoutDashboard,
  NotebookPen,
  Users,
  Activity,
  Dumbbell,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/patients", label: "Pacientes", icon: Users },
  { href: "/app/exercises", label: "Ejercicios", icon: Dumbbell },
  { href: "/app/agenda", label: "Agenda", icon: Calendar },
  { href: "/app/sessions", label: "Sesiones", icon: NotebookPen },
  { href: "/app/alerts", label: "Alertas", icon: Activity },
  { href: "/app/consents", label: "Consentimientos", icon: Clipboard },
];

export function Sidebar({
  userName,
  roleLabel,
}: {
  userName: string;
  roleLabel: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-6 flex h-[calc(100vh-48px)] flex-col gap-6 rounded-[var(--radius-lg)] border border-[var(--line)] bg-white/90 p-6 shadow-[var(--shadow-md)]">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-[#9c8f7e]">
          Centro
        </p>
        <p className="text-lg font-semibold">FISIOAPP</p>
        <p className="mt-2 text-sm text-[var(--muted)]">{userName}</p>
        <span className="mt-2 inline-flex rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent-2)]">
          {roleLabel}
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-[var(--accent)] text-white"
                  : "text-[var(--muted)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent-2)]"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
