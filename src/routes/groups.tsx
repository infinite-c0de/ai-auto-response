import { createFileRoute } from "@tanstack/react-router";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { Plus, Crown, Mic, Users as UsersIcon, Sparkles } from "lucide-react";
import { useState } from "react";
import { AppShell, Card, SectionTitle, Avatar, SkillBar } from "@/components/AppShell";
import { groups, idols, fmt } from "@/data/mock";

export const Route = createFileRoute("/groups")({
  head: () => ({ meta: [
    { title: "Groups — STARLIGHT ENT." },
    { name: "description", content: "Manage active groups, pre-debut units, member roles and debut readiness." },
  ]}),
  component: Groups,
});

function Groups() {
  const [open, setOpen] = useState(false);
  return (
    <AppShell title="Groups" subtitle={`${groups.filter(g=>g.status==="Active").length} active · ${groups.filter(g=>g.status==="Pre-debut").length} pre-debut`}
      action={<button onClick={()=>setOpen(true)} className="flex items-center gap-1 rounded-xl bg-cyan-400 px-3 py-2 text-[11px] font-bold text-slate-900"><Plus className="h-3.5 w-3.5"/>New</button>}>
      {groups.map(g => {
        const members = g.memberIds.map(id => idols.find(i => i.id === id)!).filter(Boolean);
        const radar = [
          { skill: "VOCAL", v: avg(members.map(m=>m.stats.vocal)) },
          { skill: "DANCE", v: avg(members.map(m=>m.stats.dance)) },
          { skill: "RAP", v: avg(members.map(m=>m.stats.rap)) },
          { skill: "VISUAL", v: avg(members.map(m=>m.stats.visual)) },
          { skill: "CHARISMA", v: avg(members.map(m=>m.stats.charisma)) },
        ];
        const ready = members.length >= 3 && avg(members.map(m=>m.stats.vocal)) >= 70 && avg(members.map(m=>m.stats.dance)) >= 70;
        return (
          <Card key={g.id} glow={g.status==="Active" ? "teal" : "violet"}>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${g.gradient}`}><Sparkles className="h-5 w-5 text-white/90"/></div>
                  <div className="min-w-0">
                    <h3 className="text-gradient-teal truncate font-display text-2xl font-black">{g.name}</h3>
                    <p className="text-[11px] text-muted-foreground">Fandom · <span className="text-fuchsia-300 font-semibold">{g.fanName}</span> · {g.concept}</p>
                  </div>
                </div>
              </div>
              <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${g.status==="Active" ? "border-cyan-300/50 text-cyan-300" : "border-fuchsia-300/50 text-fuchsia-300"}`}>{g.status}</span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
              <Mini label="Popularity" v={`${g.popularity}%`} />
              <Mini label="Synergy" v={`${g.synergy}`} />
              <Mini label="Income" v={g.monthlyRevenue ? fmt(g.monthlyRevenue) : "—"} />
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr]">
              <div>
                <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Members & Roles</h4>
                <ul className="space-y-1.5">
                  {members.map((m, idx) => (
                    <li key={m.id} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-1.5">
                      <Avatar name={m.stageName} gradient={m.gradient} size={32} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1 text-xs font-semibold">
                          {idx === 0 && <Crown className="h-3 w-3 text-amber-300"/>}{m.stageName}
                        </div>
                        <div className="text-[10px] text-muted-foreground">{idx === 0 ? "Leader · " : ""}{m.role}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Synergy</h4>
                <div className="h-40">
                  <ResponsiveContainer>
                    <RadarChart data={radar}>
                      <PolarGrid stroke="rgba(255,255,255,0.12)" />
                      <PolarAngleAxis dataKey="skill" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 9, fontWeight: 600 }} />
                      <Radar dataKey="v" stroke="oklch(0.82 0.16 195)" strokeWidth={2} fill="oklch(0.7 0.2 310)" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
              <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Debut Readiness</h4>
              <ul className="grid grid-cols-2 gap-1.5 text-[11px]">
                {[
                  { ok: members.length >= 3, t: "≥ 3 members" },
                  { ok: true, t: "Leader assigned" },
                  { ok: avg(members.map(m=>m.stats.vocal)) >= 70, t: "Vocal avg ≥ 70" },
                  { ok: avg(members.map(m=>m.stats.dance)) >= 70, t: "Dance avg ≥ 70" },
                  { ok: g.status==="Active", t: "Debut song" },
                  { ok: g.status==="Active", t: "Promotion plan" },
                ].map(c => (
                  <li key={c.t} className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${c.ok ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-white/20"}`} />
                    <span className={c.ok ? "" : "text-muted-foreground"}>{c.t}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 text-right text-[11px] font-semibold">{ready ? <span className="text-emerald-300">Ready to debut</span> : <span className="text-amber-300">Almost there</span>}</div>
            </div>
          </Card>
        );
      })}

      {open && <NewGroupModal onClose={()=>setOpen(false)} />}
    </AppShell>
  );
}

function avg(a:number[]){return Math.round(a.reduce((s,n)=>s+n,0)/Math.max(a.length,1));}

function Mini({ label, v }: { label: string; v: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="font-display text-sm font-bold">{v}</div>
    </div>
  );
}

function NewGroupModal({ onClose }: { onClose: () => void }) {
  const roles = ["Leader","Main Vocal","Lead Vocal","Main Dancer","Lead Dancer","Main Rapper","Visual","Center","Maknae"];
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur">
      <div className="glass-strong w-full max-w-md rounded-2xl p-5">
        <h3 className="font-display text-xl font-black text-gradient-teal">Create new group</h3>
        <p className="mt-1 text-[11px] text-muted-foreground">Define identity, fandom and roles.</p>
        <div className="mt-4 space-y-3">
          <Field label="Group name" placeholder="e.g. AURORA" />
          <Field label="Fan name" placeholder="e.g. STELLA" />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Logo</div>
            <button className="mt-1 grid h-20 w-full place-items-center rounded-xl border border-dashed border-white/20 bg-white/5 text-xs text-muted-foreground">Upload logo (placeholder)</button>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Available members</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {idols.filter(i=>!i.group).map(i => (
                <button key={i.id} className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px]">
                  <Avatar name={i.stageName} gradient={i.gradient} size={18} />{i.stageName}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Roles</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {roles.map(r => <span key={r} className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px]">{r}</span>)}
            </div>
          </div>
        </div>
        <div className="mt-5 flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm">Cancel</button>
          <button onClick={onClose} className="flex-1 rounded-xl bg-cyan-400 px-3 py-2 text-sm font-bold text-slate-900">Create group</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <input placeholder={placeholder} className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:neon-teal" />
    </label>
  );
}
