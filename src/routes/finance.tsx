import { createFileRoute } from "@tanstack/react-router";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import { AppShell, Card, SectionTitle } from "@/components/AppShell";
import { agency, fmt, revenueHistory, transactions } from "@/data/mock";

export const Route = createFileRoute("/finance")({
  head: () => ({ meta: [
    { title: "Finance — STARLIGHT ENT." },
    { name: "description", content: "Balance, monthly profit and recent transactions across your agency." },
  ]}),
  component: FinancePage,
});

const pl = revenueHistory.map(r => ({ m: r.m, profit: r.group + r.solo + r.merch - 220 - r.solo*0.4 }));

function FinancePage() {
  const income = 612_000_000;
  const expense = 442_000_000;
  const net = income - expense;
  return (
    <AppShell title="Finance" subtitle="Numbers that move the agency">
      <Card glow="teal">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Current Balance</div>
            <div className="font-display text-3xl font-black text-gradient-teal">{fmt(agency.money)}</div>
          </div>
          <Wallet className="h-8 w-8 text-cyan-300"/>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
          <KPI label="Income" v={fmt(income)} c="text-emerald-300"/>
          <KPI label="Expenses" v={fmt(expense)} c="text-rose-300"/>
          <KPI label="Net" v={fmt(net)} c="text-cyan-300"/>
        </div>
      </Card>

      <Card>
        <SectionTitle>PROFIT / LOSS</SectionTitle>
        <div className="h-44">
          <ResponsiveContainer>
            <AreaChart data={pl} margin={{ left: -20, right: 8, top: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="ar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.82 0.16 195)" stopOpacity={0.7}/>
                  <stop offset="100%" stopColor="oklch(0.82 0.16 195)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="m" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 9 }} axisLine={false} tickLine={false} width={28}/>
              <Tooltip contentStyle={{ background: "#10131D", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 11 }} />
              <Area type="monotone" dataKey="profit" stroke="oklch(0.82 0.16 195)" strokeWidth={2.5} fill="url(#ar)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <SectionTitle>COST BREAKDOWN</SectionTitle>
        <div className="space-y-2">
          {[
            { l: "Training", v: 28, c: "bg-cyan-400" },
            { l: "Promotion", v: 36, c: "bg-fuchsia-400" },
            { l: "Recruitment", v: 14, c: "bg-emerald-400" },
            { l: "Staff", v: 18, c: "bg-amber-300" },
            { l: "Other", v: 4, c: "bg-rose-400" },
          ].map(r => (
            <div key={r.l}>
              <div className="flex items-center justify-between text-[11px]"><span>{r.l}</span><span className="font-semibold">{r.v}%</span></div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className={`h-full ${r.c}`} style={{ width: `${r.v*2}%` }}/></div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle>TRANSACTIONS</SectionTitle>
        <ul className="divide-y divide-white/5">
          {transactions.map(t => (
            <li key={t.id} className="flex items-center gap-3 py-2.5">
              <div className={`grid h-9 w-9 place-items-center rounded-xl ${t.type==="income" ? "bg-emerald-400/15 text-emerald-300" : "bg-rose-400/15 text-rose-300"}`}>
                {t.type==="income" ? <ArrowUpRight className="h-4 w-4"/> : <ArrowDownRight className="h-4 w-4"/>}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-semibold">{t.label}</p>
                <span className="text-[10px] text-muted-foreground">{t.date}</span>
              </div>
              <span className={`font-display text-sm font-bold ${t.amount>0 ? "text-emerald-300" : "text-rose-300"}`}>{t.amount>0?"+":""}{fmt(t.amount)}</span>
            </li>
          ))}
        </ul>
      </Card>
    </AppShell>
  );
}

function KPI({ label, v, c }: { label: string; v: string; c: string }) {
  return <div className="rounded-xl border border-white/10 bg-white/5 p-2.5"><div className="text-[10px] text-muted-foreground">{label}</div><div className={`font-display text-sm font-bold ${c}`}>{v}</div></div>;
}
