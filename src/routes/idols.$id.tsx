import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { ChevronLeft, Star, Heart, Zap, Activity, Award, Mic, Music, Drama, Languages, BedDouble, MoreHorizontal } from "lucide-react";
import { AppShell, Card, SectionTitle, SkillBar, Avatar, StatusDot } from "@/components/AppShell";
import { idols } from "@/data/mock";

export const Route = createFileRoute("/idols/$id")({
  loader: ({ params }) => {
    const idol = idols.find(i => i.id === params.id);
    if (!idol) throw notFound();
    return idol;
  },
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData?.stageName ?? "Idol"} — Profile` },
    { name: "description", content: `Profile, skills, training and achievements for ${loaderData?.stageName ?? "this idol"}.` },
  ]}),
  notFoundComponent: () => (
    <AppShell title="Not found"><Card>This idol isn't on the roster.</Card></AppShell>
  ),
  errorComponent: ({ error, reset }) => (
    <AppShell title="Error"><Card><p className="text-sm">{error.message}</p><button onClick={reset} className="mt-3 rounded-lg bg-cyan-400 px-3 py-1.5 text-xs font-bold text-slate-900">Retry</button></Card></AppShell>
  ),
  component: IdolProfile,
});

function IdolProfile() {
  const i = Route.useLoaderData();
  const radar = [
    { skill: "VOCAL", v: i.stats.vocal },
    { skill: "DANCE", v: i.stats.dance },
    { skill: "RAP", v: i.stats.rap },
    { skill: "VISUAL", v: i.stats.visual },
    { skill: "CHARISMA", v: i.stats.charisma },
  ];
  const trainings = [
    { Icon: Mic, label: "Vocal Coaching" },
    { Icon: Music, label: "Dance Practice" },
    { Icon: Mic, label: "Rap Training" },
    { Icon: Star, label: "Visual Training" },
    { Icon: Drama, label: "Acting Class" },
    { Icon: Languages, label: "Language Lab" },
    { Icon: BedDouble, label: "Rest" },
    { Icon: MoreHorizontal, label: "Other" },
  ];
  return (
    <AppShell title={i.stageName} subtitle={`${i.role} · ${i.group ?? "Solo"}`}
      action={<Link to="/idols" className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px]"><ChevronLeft className="h-3.5 w-3.5" />Roster</Link>}>
      {/* Hero portrait */}
      <Card glow="teal" className="overflow-hidden p-0">
        <div className={`relative h-48 bg-gradient-to-br ${i.gradient} sm:h-64`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.4),transparent_60%)]" />
          <div className="absolute right-3 top-3 flex gap-2">
            <button className="grid h-9 w-9 place-items-center rounded-full bg-black/40 backdrop-blur"><Star className="h-4 w-4 text-amber-300" /></button>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h3 className="font-display text-3xl font-black text-gradient-teal">{i.stageName}</h3>
                <p className="text-[11px] uppercase tracking-wider text-white/80">{i.role} · {i.group ?? "Solo"}</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[10px] backdrop-blur">
                <StatusDot status={i.status} />{i.status}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Basic info */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle>BASIC INFO</SectionTitle>
          <dl className="space-y-2 text-[12px]">
            <Row k="Stage Name" v={i.stageName} />
            <Row k="Full Name" v={i.fullName} />
            <Row k="Age" v={`${i.age} (International)`} />
            <Row k="Date of Birth" v={i.dob} />
            <Row k="Nationality" v={<span>{i.nationality} <span className="ml-1">{i.flag}</span></span>} />
            <Row k="Languages" v={i.languages.join(", ")} />
            <Row k="Personality" v={i.personality} />
            <Row k="Training" v={`${i.trainingYears} years`} />
          </dl>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Vital Icon={Heart} label="Health" v={i.health} color="text-rose-300" />
            <Vital Icon={Activity} label="Morale" v={i.morale} color="text-fuchsia-300" />
            <Vital Icon={Zap} label="Energy" v={i.energy} color="text-emerald-300" />
          </div>
        </Card>

        <Card>
          <SectionTitle>PERFORMANCE SKILLS</SectionTitle>
          <div className="grid grid-cols-1 gap-4">
            <div className="h-48">
              <ResponsiveContainer>
                <RadarChart data={radar}>
                  <PolarGrid stroke="rgba(255,255,255,0.12)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 10, fontWeight: 600 }} />
                  <Radar dataKey="v" stroke="oklch(0.82 0.16 195)" strokeWidth={2} fill="oklch(0.82 0.16 195)" fillOpacity={0.35} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              <SkillBar label="Vocal" value={i.stats.vocal} />
              <SkillBar label="Dance" value={i.stats.dance} color="violet" />
              <SkillBar label="Rap" value={i.stats.rap} color="mint" />
              <SkillBar label="Visual" value={i.stats.visual} />
              <SkillBar label="Charisma" value={i.stats.charisma} color="violet" />
              <SkillBar label="Stamina" value={i.stats.stamina} color="mint" />
              <SkillBar label="Variety" value={i.stats.variety} />
              <SkillBar label="Acting" value={i.stats.acting} color="violet" />
            </div>
          </div>
        </Card>
      </div>

      {/* Training & Development */}
      <Card glow="teal">
        <SectionTitle>TRAINING & DEVELOPMENT</SectionTitle>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {trainings.map(({ Icon, label }) => (
            <button key={label} className="group flex flex-col items-start gap-1 rounded-xl border border-white/10 bg-white/5 p-3 text-left transition-all hover:neon-teal">
              <Icon className="h-4 w-4 text-cyan-300" />
              <span className="text-[11px] font-semibold">{label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Achievements */}
      <Card>
        <SectionTitle>RECENT ACHIEVEMENTS</SectionTitle>
        <ul className="space-y-2 text-[12px]">
          {[
            { Icon: Award, t: "Best New Vocalist nomination", d: "Korea Music Awards · 2 days ago" },
            { Icon: Star, t: "Stage performance milestone", d: "Music Bank · 5 days ago" },
            { Icon: Heart, t: "Crossed 1M fan milestone", d: "LUMINA fandom · 1 week ago" },
            { Icon: Activity, t: "Training breakthrough — Vocal +4", d: "Studio · 2 weeks ago" },
          ].map(({ Icon, t, d }) => (
            <li key={t} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-400/20 to-fuchsia-500/20"><Icon className="h-4 w-4 text-cyan-300" /></div>
              <div className="min-w-0">
                <p className="truncate font-semibold">{t}</p>
                <p className="text-[10px] text-muted-foreground">{d}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </AppShell>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-white/5 pb-2 last:border-0">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-right font-semibold">{v}</dd>
    </div>
  );
}

function Vital({ Icon, label, v, color }: { Icon: React.ComponentType<{className?:string}>; label: string; v: number; color: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground"><Icon className={`h-3 w-3 ${color}`} />{label}</div>
      <div className="mt-1 font-display text-lg font-bold">{v}<span className="text-[10px] text-muted-foreground">/100</span></div>
    </div>
  );
}
