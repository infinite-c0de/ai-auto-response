import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, ChevronRight } from "lucide-react";
import { AppShell, Card } from "@/components/AppShell";
import { cities } from "@/data/mock";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [
    { title: "Create Agency — STARLIGHT ENT." },
    { name: "description", content: "Start your idol empire — name your agency, pick your CEO and starting city." },
  ]}),
  component: Onboarding,
});

function Onboarding() {
  const [city, setCity] = useState(cities[0].id);
  const picked = cities.find(c=>c.id===city)!;
  return (
    <AppShell title="New Agency" subtitle="Build your idol empire">
      <Card glow="teal">
        <h3 className="font-display text-sm font-bold tracking-wider">IDENTITY</h3>
        <div className="mt-3 space-y-3">
          <Field label="Agency name" placeholder="STARLIGHT ENTERTAINMENT" defaultValue="Starlight Entertainment"/>
          <Field label="CEO name" placeholder="Your name" defaultValue="Park J."/>
        </div>
      </Card>

      <Card>
        <h3 className="font-display text-sm font-bold tracking-wider">STARTING CITY</h3>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {cities.map(c => (
            <button key={c.id} onClick={()=>setCity(c.id)}
              className={`rounded-2xl border p-3 text-left transition-all ${city===c.id ? "neon-teal bg-white/5" : "border-white/10 bg-white/5"}`}>
              <div className="flex items-center justify-between">
                <h4 className="font-display text-lg font-bold">{c.flag} {c.name}</h4>
                <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px]">{c.difficulty}</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">{c.desc}</p>
              <div className="mt-2 grid grid-cols-3 gap-1 text-[10px]">
                <Tag k="Fan" v={`x${c.fan}`}/>
                <Tag k="Cost" v={`x${c.cost}`}/>
                <Tag k="Rev" v={`x${c.revenue}`}/>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card glow="violet">
        <h3 className="font-display text-sm font-bold tracking-wider">PREVIEW · {picked.name.toUpperCase()}</h3>
        <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] sm:grid-cols-4">
          <P k="Budget" v={picked.budget}/>
          <P k="Reputation" v="50"/>
          <P k="Difficulty" v={picked.difficulty}/>
          <P k="Competition" v={`${picked.competition}%`}/>
        </div>
        <Link to="/" className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-4 py-3 font-display text-sm font-bold text-slate-900">
          <Sparkles className="h-4 w-4"/> Create Agency <ChevronRight className="h-4 w-4"/>
        </Link>
      </Card>
    </AppShell>
  );
}

function Field({ label, placeholder, defaultValue }: { label: string; placeholder: string; defaultValue?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <input defaultValue={defaultValue} placeholder={placeholder} className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none focus:neon-teal"/>
    </label>
  );
}
function Tag({ k, v }: { k: string; v: string }) {
  return <div className="rounded-md border border-white/10 bg-white/5 px-1.5 py-1"><span className="text-muted-foreground">{k}</span> <span className="font-bold">{v}</span></div>;
}
function P({ k, v }: { k: string; v: string }) {
  return <div className="rounded-xl border border-white/10 bg-white/5 p-2.5"><div className="text-[10px] text-muted-foreground">{k}</div><div className="font-display text-sm font-bold">{v}</div></div>;
}
