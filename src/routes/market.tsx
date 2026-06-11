import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TrendingUp, Globe2 } from "lucide-react";
import { AppShell, Card, SectionTitle } from "@/components/AppShell";
import { markets, opportunities, cities } from "@/data/mock";

export const Route = createFileRoute("/market")({
  head: () => ({ meta: [
    { title: "Market — STARLIGHT ENT." },
    { name: "description", content: "City modifiers, regional fan demand and trending opportunities." },
  ]}),
  component: MarketPage,
});

function MarketPage() {
  const [tab, setTab] = useState(markets[0].region);
  const seoul = cities[0];
  return (
    <AppShell title="Market Pulse" subtitle="City modifiers and regional demand">
      <Card glow="teal">
        <SectionTitle>HOME · SEOUL</SectionTitle>
        <p className="text-[11px] text-muted-foreground">{seoul.desc}</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] sm:grid-cols-4">
          <Mod label="Fan Growth" v={`x${seoul.fan}`} c="text-emerald-300" />
          <Mod label="Costs" v={`x${seoul.cost}`} c="text-rose-300" />
          <Mod label="Revenue" v={`x${seoul.revenue}`} c="text-cyan-300" />
          <Mod label="Competition" v={`${seoul.competition}%`} c="text-fuchsia-300" />
        </div>
      </Card>

      <Card>
        <div className="scroll-hide -mx-1 flex gap-2 overflow-x-auto px-1">
          {markets.map(m => (
            <button key={m.region} onClick={()=>setTab(m.region)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold ${tab===m.region ? "neon-teal text-cyan-300" : "border border-white/10 bg-white/5 text-muted-foreground"}`}>{m.region}</button>
          ))}
        </div>
        {markets.filter(m=>m.region===tab).map(m => (
          <div key={m.region} className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Big label="Fans" v={m.fans} />
            <Big label="Revenue" v={m.revenue} />
            <Big label="Chart" v={m.rank} />
            <Big label="Trend" v={m.trend} c="text-emerald-300" />
          </div>
        ))}
      </Card>

      <Card>
        <SectionTitle>OPPORTUNITIES</SectionTitle>
        <ul className="space-y-2">
          {opportunities.map(o => {
            const tone = o.tone === "mint" ? "border-emerald-300/40 text-emerald-300" : o.tone === "hot" ? "border-rose-300/40 text-rose-300" : o.tone === "violet" ? "border-fuchsia-300/40 text-fuchsia-300" : "border-cyan-300/40 text-cyan-300";
            return (
              <li key={o.text} className={`flex items-start gap-3 rounded-xl border ${tone} bg-white/3 p-3`}>
                <TrendingUp className="h-4 w-4" />
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">{o.region}</div>
                  <p className="text-[12px] font-semibold text-foreground">{o.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </AppShell>
  );
}

function Mod({ label, v, c }: { label: string; v: string; c: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className={`font-display text-sm font-bold ${c}`}>{v}</div>
    </div>
  );
}
function Big({ label, v, c="" }: { label: string; v: string; c?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`font-display text-lg font-bold ${c}`}>{v}</div>
    </div>
  );
}
