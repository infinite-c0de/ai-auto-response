import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Music2, Sparkles, ChevronRight } from "lucide-react";
import { AppShell, Card, SectionTitle } from "@/components/AppShell";
import { conceptOptions, languageOptions, groups, fmt } from "@/data/mock";

export const Route = createFileRoute("/release")({
  head: () => ({ meta: [
    { title: "Release Single — STARLIGHT ENT." },
    { name: "description", content: "Plan a debut single: concept, production quality, language and promotion budget." },
  ]}),
  component: Release,
});

function Release() {
  const [step, setStep] = useState(1);
  const [group, setGroup] = useState(groups[0].id);
  const [concept, setConcept] = useState(conceptOptions[0]);
  const [quality, setQuality] = useState(2);
  const [lang, setLang] = useState(languageOptions[0]);
  const [budget, setBudget] = useState(120_000_000);
  const [done, setDone] = useState(false);

  return (
    <AppShell title="New Release" subtitle="Plan a debut single">
      <Card glow="teal">
        <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>Step {step} of 5</span><span className="text-cyan-300">{["Group","Concept","Quality","Language","Budget"][step-1]}</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500" style={{ width: `${step*20}%` }}/>
        </div>

        <div className="mt-4 min-h-[160px]">
          {step===1 && (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {groups.map(g => (
                <button key={g.id} onClick={()=>setGroup(g.id)} className={`rounded-xl border p-3 text-left ${group===g.id?"neon-teal":"border-white/10 bg-white/5"}`}>
                  <h4 className="font-display text-lg font-bold">{g.name}</h4>
                  <p className="text-[11px] text-muted-foreground">{g.memberIds.length} members · {g.concept}</p>
                </button>
              ))}
            </div>
          )}
          {step===2 && (
            <div className="flex flex-wrap gap-1.5">
              {conceptOptions.map(c => (
                <button key={c} onClick={()=>setConcept(c)} className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${concept===c?"neon-teal text-cyan-300":"border border-white/10 bg-white/5"}`}>{c}</button>
              ))}
            </div>
          )}
          {step===3 && (
            <div>
              <div className="flex items-center justify-between text-[11px]"><span>Production Quality</span><span className="font-bold text-cyan-300">{["Demo","Standard","Premium","Cinematic"][quality]}</span></div>
              <input type="range" min={0} max={3} value={quality} onChange={e=>setQuality(+e.target.value)} className="mt-3 w-full accent-cyan-400"/>
              <p className="mt-2 text-[11px] text-muted-foreground">Higher quality boosts chart potential but increases production cost.</p>
            </div>
          )}
          {step===4 && (
            <div className="flex flex-wrap gap-1.5">
              {languageOptions.map(l => (
                <button key={l} onClick={()=>setLang(l)} className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${lang===l?"neon-teal text-cyan-300":"border border-white/10 bg-white/5"}`}>{l}</button>
              ))}
            </div>
          )}
          {step===5 && (
            <div>
              <div className="flex items-center justify-between text-[11px]"><span>Promotion budget</span><span className="font-bold text-cyan-300">{fmt(budget)}</span></div>
              <input type="range" min={20_000_000} max={500_000_000} step={10_000_000} value={budget} onChange={e=>setBudget(+e.target.value)} className="mt-3 w-full accent-cyan-400"/>
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] sm:grid-cols-4">
          <Est k="Cost" v={fmt(80_000_000 + quality*40_000_000)}/>
          <Est k="Fan +" v="+185K" c="text-emerald-300"/>
          <Est k="Revenue" v={fmt(420_000_000)} c="text-cyan-300"/>
          <Est k="Risk" v={quality>=3?"High":"Medium"} c="text-fuchsia-300"/>
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={()=>setStep(Math.max(1,step-1))} className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm">Back</button>
          {step<5 ? (
            <button onClick={()=>setStep(step+1)} className="flex-1 rounded-xl bg-cyan-400 px-3 py-2 text-sm font-bold text-slate-900">Next <ChevronRight className="ml-1 inline h-3.5 w-3.5"/></button>
          ) : (
            <button onClick={()=>setDone(true)} className="flex-1 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-3 py-2 text-sm font-bold text-slate-900"><Sparkles className="mr-1 inline h-3.5 w-3.5"/>Release</button>
          )}
        </div>
      </Card>

      {done && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur">
          <div className="glass-strong neon-teal w-full max-w-md rounded-2xl p-5">
            <div className="flex items-center gap-2 text-cyan-300"><Music2 className="h-5 w-5"/><h3 className="font-display text-xl font-black text-gradient-teal">Single Released</h3></div>
            <p className="mt-1 text-[12px] text-muted-foreground">{groups.find(g=>g.id===group)?.name} · {concept} · {lang}</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
              <Result k="1st Week Sales" v="284,500"/>
              <Result k="New Fans" v="+212K" c="text-emerald-300"/>
              <Result k="Revenue" v={fmt(486_000_000)} c="text-cyan-300"/>
              <Result k="Chart Position" v="#3" c="text-fuchsia-300"/>
              <Result k="Reputation" v="+6" c="text-emerald-300"/>
              <Result k="Critic Score" v="8.4 / 10"/>
            </div>
            <button onClick={()=>setDone(false)} className="mt-5 w-full rounded-xl bg-cyan-400 px-3 py-2 text-sm font-bold text-slate-900">Continue</button>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function Est({ k, v, c="" }: { k: string; v: string; c?: string }) {
  return <div className="rounded-xl border border-white/10 bg-white/5 p-2.5"><div className="text-[10px] text-muted-foreground">{k}</div><div className={`font-display text-sm font-bold ${c}`}>{v}</div></div>;
}
function Result({ k, v, c="" }: { k: string; v: string; c?: string }) {
  return <div className="rounded-xl border border-white/10 bg-white/5 p-3"><div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div><div className={`font-display text-base font-bold ${c}`}>{v}</div></div>;
}
