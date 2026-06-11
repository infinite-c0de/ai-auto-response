import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Sparkles, Megaphone } from "lucide-react";
import { AppShell, Card, SectionTitle } from "@/components/AppShell";
import { schedule, promotions, fmt } from "@/data/mock";

export const Route = createFileRoute("/schedule")({
  head: () => ({ meta: [
    { title: "Schedule & Promotion — STARLIGHT ENT." },
    { name: "description", content: "Plan music shows, fan meetings, variety shows and social campaigns." },
  ]}),
  component: SchedulePage,
});

const days = ["MON 12","TUE 13","WED 14","THU 15","FRI 16","SAT 17","SUN 18"];

function SchedulePage() {
  return (
    <AppShell title="Schedule" subtitle="Coordinate performances and promotions"
      action={<Link to="/release" className="flex items-center gap-1 rounded-xl bg-cyan-400 px-3 py-2 text-[11px] font-bold text-slate-900"><Sparkles className="h-3.5 w-3.5"/>New Release</Link>}>
      <Card>
        <SectionTitle>WEEK · OCT 12 – 18</SectionTitle>
        <div className="grid grid-cols-7 gap-1">
          {days.map((d, i) => (
            <div key={d} className="flex flex-col items-center gap-1">
              <span className="text-[9px] font-bold uppercase text-muted-foreground">{d}</span>
              <div className={`h-20 w-full rounded-lg border p-1 text-[9px] ${i===0 ? "neon-teal bg-cyan-400/10" : i===1 ? "neon-violet bg-fuchsia-400/10" : "border-white/10 bg-white/5"}`}>
                {i===0 && <span className="font-bold text-cyan-300">Music Bank</span>}
                {i===1 && <span className="font-bold text-fuchsia-300">Recording</span>}
                {i===3 && <span className="font-bold text-rose-300">CF Shoot</span>}
                {i===4 && <span className="font-bold text-emerald-300">Vocal</span>}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle>UPCOMING ACTIVITIES</SectionTitle>
        <ul className="space-y-2">
          {schedule.map(s => (
            <li key={s.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
              <CalendarDays className="h-5 w-5 text-cyan-300" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="truncate font-display text-sm font-bold">{s.title}</h4>
                  <span className="text-[10px] text-muted-foreground">{s.date}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">{s.category}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card glow="violet">
        <SectionTitle>PROMOTION CATALOG</SectionTitle>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {promotions.map(p => (
            <div key={p.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-sm font-bold">{p.name}</h4>
                <Megaphone className="h-4 w-4 text-fuchsia-300" />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
                <Stat k="Cost" v={fmt(p.cost)} />
                <Stat k="Fans" v={p.fans} c="text-emerald-300"/>
                <Stat k="Reputation" v={p.rep} c="text-cyan-300"/>
                <Stat k="Fatigue" v={p.fatigue} c="text-rose-300"/>
                <Stat k="Duration" v={p.time} />
              </div>
              <button className="mt-3 w-full rounded-lg bg-cyan-400 px-3 py-1.5 text-[11px] font-bold text-slate-900">Schedule</button>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}

function Stat({ k, v, c = "" }: { k: string; v: string; c?: string }) {
  return (
    <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className={`font-semibold ${c}`}>{v}</span></div>
  );
}
