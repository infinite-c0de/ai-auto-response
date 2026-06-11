import { createFileRoute } from "@tanstack/react-router";
import { Swords, ShieldAlert, Megaphone, BarChart3, Search } from "lucide-react";
import { AppShell, Card, SectionTitle } from "@/components/AppShell";
import { rivals } from "@/data/mock";

export const Route = createFileRoute("/rivals")({
  head: () => ({ meta: [
    { title: "Rival Agencies — STARLIGHT ENT." },
    { name: "description", content: "Monitor rival agencies, threat levels and recent market events." },
  ]}),
  component: RivalsPage,
});

const feed = [
  { t: "NOVA MEDIA debuted boy group VANTA", time: "2h ago", tone: "violet" },
  { t: "PRISM LABEL's group 'Mirror' entered Top 10", time: "5h ago", tone: "teal" },
  { t: "ZENITH ENT. signed promising trainee from Osaka", time: "8h ago", tone: "mint" },
  { t: "NOVA MEDIA campaign reduced your Seoul share by 1.4%", time: "1d ago", tone: "hot" },
  { t: "HALO STUDIOS scandal — reputation -4", time: "2d ago", tone: "hot" },
];

function RivalsPage() {
  return (
    <AppShell title="Rival Agencies" subtitle="Event-driven market intel">
      {rivals.map(r => {
        const tone = r.threat === "High" ? "border-rose-300/50 text-rose-300" : r.threat === "Medium" ? "border-amber-300/50 text-amber-300" : "border-emerald-300/50 text-emerald-300";
        return (
          <Card key={r.id}>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <h3 className="truncate font-display text-xl font-black text-gradient-teal">{r.name}</h3>
                <p className="text-[11px] text-muted-foreground">{r.recent}</p>
              </div>
              <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${tone}`}><ShieldAlert className="mr-1 inline h-3 w-3"/>{r.threat}</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
              <Mini label="Reputation" v={`${r.reputation}`} />
              <Mini label="Groups" v={`${r.groups}`} />
              <Mini label="Share" v={`${r.share}%`} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Act Icon={BarChart3} t="Compare"/>
              <Act Icon={Search} t="Details"/>
              <Act Icon={Megaphone} t="Counter"/>
              <Act Icon={Swords} t="Scout"/>
            </div>
          </Card>
        );
      })}

      <Card glow="violet">
        <SectionTitle>EVENT FEED</SectionTitle>
        <ul className="space-y-2">
          {feed.map(e => (
            <li key={e.t} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${e.tone==="hot"?"bg-rose-400":e.tone==="mint"?"bg-emerald-400":e.tone==="teal"?"bg-cyan-400":"bg-fuchsia-400"} shadow-[0_0_8px_currentColor]`}/>
              <div className="min-w-0 flex-1"><p className="text-[12px] font-semibold">{e.t}</p><span className="text-[10px] text-muted-foreground">{e.time}</span></div>
            </li>
          ))}
        </ul>
      </Card>
    </AppShell>
  );
}

function Mini({ label, v }: { label: string; v: string }) {
  return <div className="rounded-xl border border-white/10 bg-white/5 p-2.5"><div className="text-[10px] text-muted-foreground">{label}</div><div className="font-display text-sm font-bold">{v}</div></div>;
}
function Act({ Icon, t }: { Icon: React.ComponentType<{className?:string}>; t: string }) {
  return <button className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold hover:neon-teal"><Icon className="h-3.5 w-3.5"/>{t}</button>;
}
