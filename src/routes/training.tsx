import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Zap, Heart, Activity } from "lucide-react";
import { AppShell, Card, SectionTitle, Avatar } from "@/components/AppShell";
import { idols, trainingTypes } from "@/data/mock";

export const Route = createFileRoute("/training")({
  head: () => ({ meta: [
    { title: "Training Schedule — STARLIGHT ENT." },
    { name: "description", content: "Assign weekly training sessions and simulate idol stat progression." },
  ]}),
  component: TrainingPage,
});

const days = ["MON","TUE","WED","THU","FRI","SAT","SUN"];

function TrainingPage() {
  const [selectedIdol, setSelectedIdol] = useState(idols[0].id);
  const [selectedType, setSelectedType] = useState(trainingTypes[0].id);
  const [grid, setGrid] = useState<Record<string,string>>({});
  const [toast, setToast] = useState<string | null>(null);

  const toggle = (key: string) => setGrid(g => ({ ...g, [key]: g[key] === selectedType ? "" : selectedType }));

  const simulate = () => {
    setToast("Week simulated · +2 Vocal · +3 Dance · −18 Energy · +6 Morale");
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <AppShell title="Weekly Training" subtitle="Tap a slot to schedule a session"
      action={<button onClick={simulate} className="flex items-center gap-1 rounded-xl bg-cyan-400 px-3 py-2 text-[11px] font-bold text-slate-900"><Sparkles className="h-3.5 w-3.5"/>Simulate Week</button>}>
      <Card>
        <SectionTitle>SELECT IDOL</SectionTitle>
        <div className="scroll-hide -mx-1 flex gap-2 overflow-x-auto px-1">
          {idols.map(i => (
            <button key={i.id} onClick={()=>setSelectedIdol(i.id)}
              className={`flex shrink-0 flex-col items-center gap-1 rounded-xl border p-2 transition-all ${selectedIdol===i.id ? "neon-teal bg-white/5" : "border-white/10 bg-white/5"}`}>
              <Avatar name={i.stageName} gradient={i.gradient} size={44} ring={selectedIdol===i.id} />
              <span className="text-[10px] font-semibold">{i.stageName}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle>TRAINING TYPE</SectionTitle>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {trainingTypes.map(t => (
            <button key={t.id} onClick={()=>setSelectedType(t.id)}
              className={`rounded-xl border p-3 text-left transition-all ${selectedType===t.id ? "neon-teal bg-white/5" : "border-white/10 bg-white/5"}`}>
              <div className="text-[12px] font-bold">{t.name}</div>
              <div className="mt-1 flex items-center gap-2 text-[10px]">
                <span className="text-emerald-300">{t.effect}</span>
                <span className="text-rose-300">{t.cost}</span>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card glow="teal">
        <SectionTitle>WEEK PLAN</SectionTitle>
        <div className="grid grid-cols-7 gap-1.5">
          {days.map(d => (
            <div key={d} className="text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{d}</div>
          ))}
          {[0,1,2].flatMap(row => days.map(d => {
            const key = `${row}-${d}`;
            const v = grid[key];
            const label = v ? trainingTypes.find(t=>t.id===v)?.name.split(" ")[0] : "";
            return (
              <button key={key} onClick={()=>toggle(key)}
                className={`aspect-square rounded-lg border p-1 text-[9px] font-bold transition-all ${v ? "neon-teal text-cyan-300 bg-cyan-400/10" : "border-white/10 bg-white/5 text-muted-foreground"}`}>
                {label || "+"}
              </button>
            );
          }))}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
          <Vital Icon={Heart} label="Health" v={84} />
          <Vital Icon={Activity} label="Morale" v={76} />
          <Vital Icon={Zap} label="Energy" v={78} />
        </div>
      </Card>

      {toast && (
        <div className="fixed inset-x-4 bottom-24 z-50 glass-strong neon-teal rounded-2xl px-4 py-3 text-center text-sm font-semibold text-cyan-200">{toast}</div>
      )}
    </AppShell>
  );
}

function Vital({ Icon, label, v }: { Icon: React.ComponentType<{className?:string}>; label: string; v: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground"><Icon className="h-3 w-3" />{label}</div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500" style={{ width: `${v}%` }} />
      </div>
      <div className="mt-1 font-display text-xs font-bold">{v}</div>
    </div>
  );
}
