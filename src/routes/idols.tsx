import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, ChevronRight, UserPlus } from "lucide-react";
import { AppShell, Card, Avatar, StatusDot } from "@/components/AppShell";
import { idols, type Status } from "@/data/mock";

export const Route = createFileRoute("/idols")({
  head: () => ({ meta: [
    { title: "Idol Roster — STARLIGHT ENT." },
    { name: "description", content: "Filter and manage every active idol and trainee in your roster." },
  ]}),
  component: Idols,
});

const statuses: ("All" | Status)[] = ["All", "Active", "Trainee", "Resting", "Promoting", "Injured"];

function Idols() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<typeof statuses[number]>("All");
  const list = useMemo(() =>
    idols.filter(i =>
      (filter === "All" || i.status === filter) &&
      (q === "" || i.stageName.toLowerCase().includes(q.toLowerCase()))
    ), [q, filter]);

  return (
    <AppShell title="Idol Roster" subtitle={`${idols.length} talents under contract`}
      action={<Link to="/recruit" className="flex items-center gap-1 rounded-xl bg-cyan-400 px-3 py-2 text-[11px] font-bold text-slate-900"><UserPlus className="h-3.5 w-3.5" />Recruit</Link>}>
      <Card>
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search idols, roles, groups" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="scroll-hide mt-3 -mx-1 flex gap-2 overflow-x-auto px-1">
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all ${filter === s ? "neon-teal text-cyan-300" : "border border-white/10 bg-white/5 text-muted-foreground"}`}>
              {s}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {list.map(i => (
          <Link key={i.id} to="/idols/$id" params={{ id: i.id }}
            className={`group glass rounded-2xl p-3 transition-all ${i.status === "Active" ? "neon-teal" : "border border-white/10"}`}>
            <div className={`relative h-32 overflow-hidden rounded-xl bg-gradient-to-br ${i.gradient}`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.4),transparent_55%)]" />
              <span className="absolute left-2 top-2 rounded-md bg-black/40 px-1.5 py-0.5 text-[9px] font-bold backdrop-blur">#{i.rank}</span>
              <span className="absolute right-2 top-2 text-base">{i.flag}</span>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <div className="flex items-center gap-1 text-[9px] text-white/80"><StatusDot status={i.status} />{i.status}</div>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-sm font-bold">{i.stageName}</h4>
                <span className="text-[10px] font-semibold text-cyan-300">{i.popularity}%</span>
              </div>
              <p className="truncate text-[10px] text-muted-foreground">{i.role}</p>
              <div className="mt-1 flex items-center justify-between text-[9px] text-muted-foreground">
                <span>{i.group ?? "Solo"}</span>
                <ChevronRight className="h-3 w-3" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
