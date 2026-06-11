import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, Palette, Info, Rocket, FileText } from "lucide-react";
import { AppShell, Card, SectionTitle } from "@/components/AppShell";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [
    { title: "Settings — STARLIGHT ENT." },
    { name: "description", content: "Game settings, design notes and MVP scope for the agency simulator prototype." },
  ]}),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AppShell title="Settings" subtitle="Prototype controls & style guide">
      <Card>
        <SectionTitle>GAME</SectionTitle>
        <Row label="Notifications" v={<Toggle on/>}/>
        <Row label="Haptics" v={<Toggle/>}/>
        <Row label="Auto-advance week" v={<Toggle/>}/>
        <Link to="/onboarding" className="mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm"><span>Restart onboarding</span><Rocket className="h-4 w-4 text-cyan-300"/></Link>
        <button className="mt-2 flex w-full items-center justify-between rounded-xl border border-rose-400/40 bg-rose-400/10 px-3 py-2.5 text-sm text-rose-300"><span>Reset prototype data</span><Trash2 className="h-4 w-4"/></button>
      </Card>

      <Card>
        <SectionTitle>STYLE GUIDE</SectionTitle>
        <div className="grid grid-cols-5 gap-2">
          {[
            { n: "bg", c: "bg-[#080B12]" },
            { n: "surf", c: "bg-[#10131D]" },
            { n: "teal", c: "bg-cyan-400" },
            { n: "violet", c: "bg-fuchsia-500" },
            { n: "mint", c: "bg-emerald-400" },
          ].map(s => (
            <div key={s.n} className="space-y-1 text-center">
              <div className={`h-12 w-full rounded-xl ${s.c} shadow-inner`}/>
              <span className="text-[10px] text-muted-foreground">{s.n}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 text-[12px] text-muted-foreground"><Palette className="h-4 w-4"/> Dark futuristic · neon teal / violet · glass cards · soft glow</div>
      </Card>

      <Card>
        <SectionTitle>MVP SCOPE</SectionTitle>
        <ul className="space-y-1.5 text-[12px]">
          {["Agency creation","Trainee recruitment","Idol profiles","Training schedule","Group management","Debut single workflow","Promotion scheduling","Market modifiers","Rival event feed","Finance dashboard"].map(s=>(
            <li key={s} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400"/>{s}</li>
          ))}
        </ul>
      </Card>

      <Card>
        <div className="mb-2 flex items-center gap-2 text-[12px] text-muted-foreground"><Info className="h-4 w-4"/>Future expansion</div>
        <div className="flex flex-wrap gap-1.5">
          {["Personalities","Scandals","Sponsorships","AI agencies","Contracts","Idol poaching","Acquisitions","Sub-labels","World tours","Advanced economy"].map(t=>(
            <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px]">{t}</span>
          ))}
        </div>
      </Card>

      <div className="text-center text-[10px] text-muted-foreground"><FileText className="mx-auto mb-1 h-3 w-3"/>Prototype v0.1 · UI-only vertical slice</div>
    </AppShell>
  );
}

function Row({ label, v }: { label: string; v: React.ReactNode }) {
  return <div className="flex items-center justify-between border-b border-white/5 py-2.5 text-sm last:border-0"><span>{label}</span>{v}</div>;
}
function Toggle({ on }: { on?: boolean }) {
  return (
    <span className={`relative inline-block h-5 w-9 rounded-full transition-all ${on ? "bg-cyan-400" : "bg-white/15"}`}>
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${on ? "left-4" : "left-0.5"}`}/>
    </span>
  );
}
