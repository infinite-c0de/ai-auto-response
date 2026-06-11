import { Link, useLocation } from "@tanstack/react-router";
import {
  Home, Users, Music2, Dumbbell, CalendarDays, Globe2, Swords, Wallet, Settings as SettingsIcon,
  Zap, Gem, Star, ChevronRight,
} from "lucide-react";
import type { ReactNode } from "react";
import { agency, fmt } from "@/data/mock";

const nav = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/idols", label: "Idols", Icon: Users },
  { to: "/groups", label: "Groups", Icon: Music2 },
  { to: "/training", label: "Training", Icon: Dumbbell },
  { to: "/schedule", label: "Schedule", Icon: CalendarDays },
  { to: "/market", label: "Market", Icon: Globe2 },
  { to: "/rivals", label: "Rivals", Icon: Swords },
  { to: "/finance", label: "Finance", Icon: Wallet },
  { to: "/settings", label: "Settings", Icon: SettingsIcon },
] as const;

const primary = nav.slice(0, 5);

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 glass-strong">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl neon-teal bg-gradient-to-br from-cyan-400/25 to-fuchsia-500/25">
          <Star className="h-5 w-5 text-cyan-300" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate font-display text-sm font-bold tracking-wider">{agency.name}</h1>
            <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-300">LV {agency.level}</span>
          </div>
          <div className="mt-1 h-1 w-32 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-2/3 bg-gradient-to-r from-cyan-400 to-fuchsia-500" />
          </div>
        </div>
        <div className="hidden items-center gap-3 text-xs sm:flex">
          <span className="font-display font-semibold">{fmt(agency.money)}</span>
          <span className="flex items-center gap-1 text-fuchsia-300"><Gem className="h-3.5 w-3.5"/>{agency.gems.toLocaleString()}</span>
          <span className="flex items-center gap-1 text-mint-300"><Zap className="h-3.5 w-3.5 text-emerald-300"/>{agency.energy}/{agency.energyMax}</span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 px-4 pb-2 text-[11px] sm:hidden">
        <span className="font-display font-semibold">{fmt(agency.money)}</span>
        <span className="flex items-center gap-1 text-fuchsia-300"><Gem className="h-3 w-3"/>{agency.gems.toLocaleString()}</span>
        <span className="flex items-center gap-1 text-emerald-300"><Zap className="h-3 w-3"/>{agency.energy}/{agency.energyMax}</span>
        <span className="text-muted-foreground">Rank #{agency.ranking}</span>
      </div>
    </header>
  );
}

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-6xl px-3 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2">
      <div className="glass-strong flex items-center justify-between gap-1 rounded-2xl px-2 py-2 shadow-[0_-10px_40px_-20px_rgba(0,0,0,0.8)]">
        {primary.map(({ to, label, Icon }) => {
          const active = pathname === to || (to !== "/" && pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={`no-tap flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] font-medium transition-all ${
                active ? "neon-teal text-cyan-300" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "text-cyan-300" : ""}`} />
              <span className="tracking-wide">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function MoreNavRow() {
  const { pathname } = useLocation();
  const more = nav.slice(5);
  return (
    <div className="scroll-hide -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {more.map(({ to, label, Icon }) => {
        const active = pathname.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all ${
              active ? "neon-teal text-cyan-300" : "border-white/10 bg-white/5 text-muted-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </Link>
        );
      })}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 px-1">
      <div className="min-w-0">
        <h2 className="font-display text-2xl font-black tracking-tight text-gradient-teal">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function AppShell({ children, title, subtitle, action }: { children: ReactNode; title?: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="min-h-dvh pb-28">
      <TopBar />
      <main className="mx-auto flex max-w-6xl flex-col gap-5 px-4 pt-4">
        {title && <PageHeader title={title} subtitle={subtitle} action={action} />}
        <MoreNavRow />
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

export function Card({ children, className = "", glow }: { children: ReactNode; className?: string; glow?: "teal" | "violet" | "none" }) {
  const glowCls = glow === "teal" ? "neon-teal" : glow === "violet" ? "neon-violet" : "border border-white/10";
  return <div className={`glass rounded-2xl p-4 ${glowCls} ${className}`}>{children}</div>;
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <h3 className="font-display text-sm font-bold tracking-[0.18em] text-foreground/90">{children}</h3>
      {action ?? <ChevronRight className="h-4 w-4 text-muted-foreground" />}
    </div>
  );
}

export function SkillBar({ label, value, color = "teal" }: { label: string; value: number; color?: "teal" | "violet" | "mint" }) {
  const grad =
    color === "teal" ? "from-cyan-400 to-fuchsia-500"
    : color === "violet" ? "from-fuchsia-500 to-violet-500"
    : "from-emerald-400 to-cyan-400";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-display font-semibold">{value}<span className="text-muted-foreground">/100</span></span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full bg-gradient-to-r ${grad} shadow-[0_0_12px_rgba(34,211,238,0.5)]`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function Avatar({ name, gradient, size = 48, ring }: { name: string; gradient: string; size?: number; ring?: boolean }) {
  const initials = name.slice(0, 2).toUpperCase();
  return (
    <div
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br ${gradient} ${ring ? "ring-2 ring-cyan-300/60" : ""}`}
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
      <span className="font-display text-xs font-bold tracking-wider text-white/90">{initials}</span>
    </div>
  );
}

export function StatusDot({ status }: { status: string }) {
  const m: Record<string, string> = {
    Active: "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]",
    Trainee: "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]",
    Resting: "bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.8)]",
    Injured: "bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.8)]",
    Promoting: "bg-fuchsia-400 shadow-[0_0_10px_rgba(232,121,249,0.8)]",
  };
  return <span className={`inline-block h-2 w-2 rounded-full ${m[status] ?? "bg-white/40"}`} />;
}
