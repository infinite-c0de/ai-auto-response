import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { UserPlus, Sparkles } from "lucide-react";
import { AppShell, Card, SectionTitle } from "@/components/AppShell";
import { trainees, fmt } from "@/data/mock";

export const Route = createFileRoute("/recruit")({
  head: () => ({ meta: [
    { title: "Recruit Trainees — STARLIGHT ENT." },
    { name: "description", content: "Scout and recruit new trainees across regions and skill specialties." },
  ]}),
  component: Recruit,
});

function Recruit() {
  const [confirm, setConfirm] = useState<string | null>(null);
  return (
    <AppShell title="Scout Trainees" subtitle="Build the next generation of stars">
      <Card>
        <SectionTitle>FILTERS</SectionTitle>
        <div className="flex flex-wrap gap-1.5">
          {["All","Vocal","Dance","Rap","Visual","Charisma"].map(f =>
            <button key={f} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold">{f}</button>)}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {trainees.map(t => (
          <Card key={t.id}>
            <div className={`relative h-36 overflow-hidden rounded-xl bg-gradient-to-br ${t.gradient}`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.45),transparent_55%)]" />
              <span className="absolute right-2 top-2 text-lg">{t.flag}</span>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <div className="flex items-end justify-between">
                  <div>
                    <h4 className="font-display text-base font-bold">{t.name}</h4>
                    <p className="text-[10px] text-white/70">{t.nationality} · {t.age}</p>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-bold text-cyan-300 backdrop-blur"><Sparkles className="h-3 w-3"/>{t.potential}</span>
                </div>
              </div>
            </div>
            <div className="mt-2 space-y-1 text-[11px]">
              <div className="flex justify-between"><span className="text-muted-foreground">Skill</span><span className="font-semibold">{t.skill}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Personality</span><span className="font-semibold">{t.personality}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Cost</span><span className="font-bold text-cyan-300">{fmt(t.cost)}</span></div>
            </div>
            <button onClick={()=>setConfirm(t.name)} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-cyan-400 px-3 py-2 text-[12px] font-bold text-slate-900">
              <UserPlus className="h-3.5 w-3.5"/>Recruit
            </button>
          </Card>
        ))}
      </div>

      {confirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur">
          <div className="glass-strong neon-teal w-full max-w-sm rounded-2xl p-5 text-center">
            <Sparkles className="mx-auto h-7 w-7 text-cyan-300"/>
            <h3 className="mt-2 font-display text-xl font-black text-gradient-teal">Welcome, {confirm}</h3>
            <p className="mt-1 text-[12px] text-muted-foreground">Trainee added to your roster. Budget updated.</p>
            <button onClick={()=>setConfirm(null)} className="mt-4 w-full rounded-xl bg-cyan-400 px-3 py-2 text-sm font-bold text-slate-900">Continue</button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
