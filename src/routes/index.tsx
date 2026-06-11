import { createFileRoute, Link } from "@tanstack/react-router";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Heart, Wallet, CalendarCheck, MoreHorizontal, Pin, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";
import { AppShell, Card, SectionTitle, Avatar } from "@/components/AppShell";
import { agencyRadar, idols, revenueHistory, schedule, fmt, groups } from "@/data/mock";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Dashboard — STARLIGHT ENT." },
    { name: "description", content: "Agency control center: roster, schedule, performance and revenue at a glance." },
  ]}),
  component: Home,
});

function Home() {
  const elevate = groups[0];
  const members = elevate.memberIds.map(id => idols.find(i => i.id === id)!).filter(Boolean);
  const stats = [
    { label: "Vocal", v: 92 }, { label: "Dance", v: 95 }, { label: "Rap", v: 78 }, { label: "Visual", v: 89 }, { label: "Charisma", v: 90 },
  ];
  return (
    <AppShell title="Control Center" subtitle="Real-time pulse of your agency">
      {/* Group hero */}
      <Card glow="teal" className="overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-gradient-teal font-display text-3xl font-black tracking-tight">{elevate.name}</h3>
            <p className="text-[11px] text-muted-foreground">{members.length} members · Active</p>
          </div>
          <span className="rounded-full border border-cyan-300/50 px-2.5 py-1 text-[10px] font-semibold text-cyan-300">Active</span>
        </div>
        <div className="mt-3 grid h-28 grid-cols-5 gap-1.5 overflow-hidden rounded-xl">
          {members.map(m => (
            <div key={m.id} className={`relative bg-gradient-to-br ${m.gradient}`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.4),transparent_60%)]" />
              <span className="absolute bottom-1 left-1 right-1 truncate text-center text-[9px] font-bold uppercase tracking-wider text-white/90">{m.stageName}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
          <KPI icon={<Heart className="h-3 w-3 text-rose-300" />} label="Popularity" value="88%" sub="+5%" />
          <KPI icon={<Wallet className="h-3 w-3 text-emerald-300" />} label="Income" value="₩450M" sub="/mo" />
          <KPI icon={<CalendarCheck className="h-3 w-3 text-cyan-300" />} label="Schedule" value="3" sub="active" />
        </div>
      </Card>

      {/* Performance */}
      <Card>
        <SectionTitle action={<MoreHorizontal className="h-4 w-4 text-muted-foreground" />}>PERFORMANCE · ELEVATE</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="h-56">
            <ResponsiveContainer>
              <RadarChart data={agencyRadar}>
                <PolarGrid stroke="rgba(255,255,255,0.12)" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 10, fontWeight: 600 }} />
                <Radar dataKey="v" stroke="oklch(0.82 0.16 195)" strokeWidth={2} fill="url(#radarFill)" fillOpacity={0.7} />
                <defs>
                  <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="oklch(0.82 0.16 195)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.7 0.2 310)" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {stats.map(s => (
              <div key={s.label} className="flex flex-col items-center gap-1.5">
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{s.label}</span>
                <div className="relative h-24 w-3 overflow-hidden rounded-full bg-white/10">
                  <div className="absolute inset-x-0 bottom-0 rounded-full bg-gradient-to-t from-fuchsia-500 to-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.7)]" style={{ height: `${s.v}%` }} />
                </div>
                <span className="font-display text-xs font-bold">{s.v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-5 gap-1.5">
          {members.map(m => (
            <Link key={m.id} to="/idols/$id" params={{ id: m.id }} className="flex flex-col items-center gap-1">
              <Avatar name={m.stageName} gradient={m.gradient} size={42} image={m.image} />
              <span className="text-[9px] font-semibold uppercase tracking-wider">{m.stageName}</span>
            </Link>
          ))}
        </div>
      </Card>

      {/* Schedule */}
      <Card>
        <SectionTitle>CURRENT SCHEDULE</SectionTitle>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {schedule.map(s => <ScheduleCard key={s.id} s={s} />)}
        </div>
      </Card>

      {/* Revenue */}
      <Card>
        <div className="mb-2 flex items-end justify-between">
          <SectionTitle>REVENUE HISTORY</SectionTitle>
          <div className="text-right">
            <div className="text-gradient-teal font-display text-xl font-black">₩1.45B</div>
            <div className="text-[10px] text-muted-foreground">Jan – Sep total</div>
          </div>
        </div>
        <div className="h-48">
          <ResponsiveContainer>
            <LineChart data={revenueHistory} margin={{ left: -20, right: 8, top: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="lg" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="oklch(0.82 0.16 195)" />
                  <stop offset="100%" stopColor="oklch(0.7 0.2 310)" />
                </linearGradient>
              </defs>
              <XAxis dataKey="m" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 9 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={{ background: "#10131D", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="group" stroke="url(#lg)" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="solo" stroke="oklch(0.7 0.2 250)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="merch" stroke="oklch(0.7 0.2 310)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Mini label="Monthly Profit" value={fmt(170_000_000)} accent="mint" />
          <Mini label="Fan Growth" value="+128K" accent="teal" />
          <Mini label="Promotion" value={fmt(82_000_000)} accent="violet" />
          <Mini label="Reputation" value="+4" accent="mint" />
        </div>
      </Card>
    </AppShell>
  );
}

function KPI({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
      <div className="flex items-center gap-1 text-muted-foreground">{icon}<span className="text-[10px]">{label}</span></div>
      <div className="mt-1 font-display text-base font-bold">{value} <span className="text-[10px] font-normal text-emerald-300">{sub}</span></div>
    </div>
  );
}

function Mini({ label, value, accent }: { label: string; value: string; accent: "mint"|"teal"|"violet" }) {
  const dot = accent === "mint" ? "bg-emerald-400" : accent === "teal" ? "bg-cyan-400" : "bg-fuchsia-400";
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />{label}
      </div>
      <div className="font-display text-sm font-bold">{value}</div>
    </div>
  );
}

function ScheduleCard({ s }: { s: typeof schedule[number] }) {
  const accent = s.accent === "teal" ? "neon-teal" : s.accent === "violet" ? "neon-violet" : "border border-rose-400/50";
  const badge = s.badge === "pinned" ? <Pin className="h-3.5 w-3.5 rotate-45 text-fuchsia-300" /> : s.badge === "alert" ? <AlertCircle className="h-3.5 w-3.5 text-rose-400" /> : <CheckCircle2 className="h-3.5 w-3.5 text-cyan-300" />;
  return (
    <div className={`relative rounded-2xl bg-white/[0.04] p-3 ${accent}`}>
      <div className="absolute right-2 top-2">{badge}</div>
      <div className="flex items-start gap-2">
        <span className="font-display text-2xl font-black text-gradient-teal">{s.num}.</span>
        <div className="min-w-0 flex-1">
          <h4 className="truncate font-display text-sm font-bold">{s.title}</h4>
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>{s.category}</span><span>{s.date}</span>
          </div>
          {s.progress > 0 && (
            <div className="mt-2">
              <div className="h-1 overflow-hidden rounded-full bg-white/10">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500" style={{ width: `${s.progress}%` }} />
              </div>
              <div className="mt-1 flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground">in progress</span>
                <span className="font-semibold text-cyan-300">{s.progress}%</span>
              </div>
            </div>
          )}
          <button className="mt-2 flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px]">
            Details <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
