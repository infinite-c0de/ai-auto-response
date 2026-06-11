export const agency = {
  name: "STARLIGHT ENT.",
  level: 16,
  money: 2_850_500_000,
  gems: 8_750,
  energy: 92,
  energyMax: 100,
  reputation: 88,
  monthlyIncome: 450_000_000,
  ranking: 4,
  city: "Seoul",
};

export const cities = [
  { id: "seoul", name: "Seoul", flag: "🇰🇷", desc: "High competition, strong K-Pop market, high revenue potential.", budget: "₩2.85B", difficulty: "Hard", fan: 1.2, cost: 1.3, revenue: 1.4, competition: 95 },
  { id: "tokyo", name: "Tokyo", flag: "🇯🇵", desc: "Strong idol market, stable fans, high promotion cost.", budget: "₩3.10B", difficulty: "Hard", fan: 1.1, cost: 1.25, revenue: 1.3, competition: 85 },
  { id: "beijing", name: "Beijing", flag: "🇨🇳", desc: "Huge market, high revenue, complex competition.", budget: "₩2.60B", difficulty: "Medium", fan: 1.3, cost: 1.1, revenue: 1.35, competition: 80 },
  { id: "hanoi", name: "Hanoi", flag: "🇻🇳", desc: "Emerging market, lower costs, strong growth potential.", budget: "₩1.80B", difficulty: "Easy", fan: 1.4, cost: 0.7, revenue: 0.9, competition: 40 },
  { id: "bangkok", name: "Bangkok", flag: "🇹🇭", desc: "Regional growth hub, balanced costs and fan expansion.", budget: "₩2.00B", difficulty: "Medium", fan: 1.25, cost: 0.85, revenue: 1.0, competition: 55 },
];

import kaiImg from "@/assets/idols/kai.png";
import yunaImg from "@/assets/idols/yuna.png";
import jihoonImg from "@/assets/idols/jihoon.png";
import haruImg from "@/assets/idols/haru.png";
import seulgiImg from "@/assets/idols/seulgi.png";
import minjiImg from "@/assets/idols/minji.png";
import soraImg from "@/assets/idols/sora.png";
import leoImg from "@/assets/idols/leo.png";
import lunaImg from "@/assets/idols/luna.png";

export const idolImages: Record<string, string> = {
  kai: kaiImg, yuna: yunaImg, jihoon: jihoonImg, haru: haruImg,
  seulgi: seulgiImg, minji: minjiImg, sora: soraImg, leo: leoImg, luna: lunaImg,
};

export type Status = "Active" | "Trainee" | "Resting" | "Injured" | "Promoting";

export type Idol = {
  id: string;
  stageName: string;
  fullName: string;
  age: number;
  dob: string;
  nationality: string;
  flag: string;
  languages: string[];
  personality: string;
  trainingYears: number;
  role: string;
  group?: string;
  status: Status;
  popularity: number;
  rank: number;
  gradient: string;
  stats: { vocal: number; dance: number; rap: number; visual: number; charisma: number; stamina: number; variety: number; acting: number };
  health: number;
  morale: number;
  energy: number;
};

const grads = [
  "from-fuchsia-500/40 via-violet-500/40 to-cyan-400/40",
  "from-cyan-400/40 via-sky-500/40 to-violet-500/40",
  "from-rose-400/40 via-fuchsia-500/40 to-indigo-500/40",
  "from-emerald-400/40 via-teal-500/40 to-cyan-500/40",
  "from-amber-300/40 via-rose-400/40 to-fuchsia-500/40",
  "from-indigo-400/40 via-violet-500/40 to-pink-500/40",
];

export const idols: Idol[] = [
  { id: "kai", stageName: "Kai", fullName: "Park Jong-in", age: 21, dob: "January 14, 2005", nationality: "South Korean", flag: "🇰🇷", languages: ["Korean","English"], personality: "Introverted, Charismatic", trainingYears: 3, role: "Lead Vocalist", group: "ELEVATE", status: "Active", popularity: 95, rank: 2, gradient: grads[0], stats:{vocal:92,dance:88,rap:78,visual:90,charisma:90,stamina:84,variety:70,acting:65}, health:84, morale:76, energy:78 },
  { id: "yuna", stageName: "Yuna", fullName: "Kim Yu-na", age: 20, dob: "March 02, 2006", nationality: "South Korean", flag: "🇰🇷", languages: ["Korean","English","Japanese"], personality: "Cheerful, Focused", trainingYears: 4, role: "Main Vocal", group: "ELEVATE", status: "Active", popularity: 97, rank: 1, gradient: grads[1], stats:{vocal:96,dance:82,rap:60,visual:94,charisma:92,stamina:80,variety:88,acting:74}, health:90, morale:88, energy:85 },
  { id: "jihoon", stageName: "Jihoon", fullName: "Lee Ji-hoon", age: 23, dob: "August 19, 2002", nationality: "South Korean", flag: "🇰🇷", languages: ["Korean"], personality: "Calm, Strategic", trainingYears: 5, role: "Leader / Rapper", group: "ELEVATE", status: "Active", popularity: 90, rank: 3, gradient: grads[2], stats:{vocal:74,dance:80,rap:94,visual:86,charisma:88,stamina:88,variety:72,acting:60}, health:80, morale:74, energy:70 },
  { id: "haru", stageName: "Haru", fullName: "Choi Ha-ru", age: 22, dob: "November 30, 2003", nationality: "South Korean", flag: "🇰🇷", languages: ["Korean","English"], personality: "Warm, Playful", trainingYears: 3, role: "Main Dancer", group: "ELEVATE", status: "Promoting", popularity: 97, rank: 1, gradient: grads[3], stats:{vocal:78,dance:96,rap:70,visual:92,charisma:90,stamina:92,variety:84,acting:70}, health:78, morale:82, energy:68 },
  { id: "seulgi", stageName: "Seulgi", fullName: "Kang Seul-gi", age: 24, dob: "May 12, 2001", nationality: "South Korean", flag: "🇰🇷", languages: ["Korean","Japanese"], personality: "Elegant, Reserved", trainingYears: 6, role: "Visual", group: "ELEVATE", status: "Active", popularity: 92, rank: 4, gradient: grads[4], stats:{vocal:80,dance:88,rap:64,visual:98,charisma:90,stamina:78,variety:70,acting:82}, health:86, morale:80, energy:74 },
  { id: "minji", stageName: "Minji", fullName: "Park Min-ji", age: 19, dob: "April 22, 2007", nationality: "South Korean", flag: "🇰🇷", languages: ["Korean","English"], personality: "Bright, Determined", trainingYears: 2, role: "Solo Artist", status: "Active", popularity: 88, rank: 5, gradient: grads[5], stats:{vocal:84,dance:78,rap:70,visual:88,charisma:84,stamina:76,variety:80,acting:68}, health:82, morale:84, energy:80 },
  { id: "sora", stageName: "Sora", fullName: "Han So-ra", age: 18, dob: "September 09, 2007", nationality: "South Korean", flag: "🇰🇷", languages: ["Korean"], personality: "Quiet, Hardworking", trainingYears: 2, role: "Solo Artist", status: "Trainee", popularity: 90, rank: 6, gradient: grads[0], stats:{vocal:74,dance:82,rap:68,visual:86,charisma:78,stamina:80,variety:70,acting:60}, health:88, morale:78, energy:90 },
  { id: "leo", stageName: "Leo", fullName: "Jang Leo", age: 22, dob: "July 04, 2003", nationality: "South Korean", flag: "🇰🇷", languages: ["Korean","English","Chinese"], personality: "Bold, Outgoing", trainingYears: 4, role: "Main Rapper", group: "ELEVATE", status: "Resting", popularity: 89, rank: 7, gradient: grads[1], stats:{vocal:72,dance:84,rap:96,visual:84,charisma:90,stamina:82,variety:88,acting:70}, health:74, morale:70, energy:60 },
  { id: "luna", stageName: "Luna", fullName: "Bae Lu-na", age: 17, dob: "December 25, 2008", nationality: "South Korean", flag: "🇰🇷", languages: ["Korean","Japanese"], personality: "Curious, Energetic", trainingYears: 1, role: "Trainee", status: "Trainee", popularity: 76, rank: 12, gradient: grads[2], stats:{vocal:66,dance:74,rap:60,visual:84,charisma:72,stamina:74,variety:64,acting:58}, health:90, morale:86, energy:92 },
];

export type Group = {
  id: string; name: string; fanName: string; concept: string;
  status: "Active" | "Pre-debut" | "Disbanded";
  popularity: number; monthlyRevenue: number; synergy: number;
  memberIds: string[]; gradient: string;
};

export const groups: Group[] = [
  { id: "elevate", name: "ELEVATE", fanName: "LUMINA", concept: "Premium Pop", status: "Active", popularity: 88, monthlyRevenue: 450_000_000, synergy: 92, memberIds: ["yuna","jihoon","leo","haru","seulgi"], gradient: grads[1] },
  { id: "aurora", name: "AURORA", fanName: "STELLA", concept: "Girl Crush", status: "Pre-debut", popularity: 42, monthlyRevenue: 0, synergy: 71, memberIds: ["minji","sora","luna"], gradient: grads[3] },
];

export const schedule = [
  { id: 1, num: 1, title: "MUSIC BANK", category: "Performance", date: "Oct 12, 18:00", progress: 75, accent: "teal" as const, badge: "pinned" },
  { id: 2, num: 2, title: "ALBUM RECORDING", category: "Studio", date: "Oct 13, 10:00", progress: 40, accent: "violet" as const, badge: "ready" },
  { id: 3, num: 3, title: "CF SHOOT", category: "NEXUS Ads", date: "Oct 15, 14:00", progress: 10, accent: "hot" as const, badge: "alert" },
  { id: 4, num: 4, title: "VOCAL LESSON", category: "Studio", date: "Oct 16, 09:00", progress: 0, accent: "mint" as const, badge: "ready" },
];

export const revenueHistory = [
  { m: "JAN", group: 220, solo: 80, merch: 40 },
  { m: "FEB", group: 260, solo: 110, merch: 55 },
  { m: "MAR", group: 310, solo: 130, merch: 70 },
  { m: "APR", group: 290, solo: 160, merch: 85 },
  { m: "MAY", group: 360, solo: 180, merch: 95 },
  { m: "JUN", group: 410, solo: 200, merch: 110 },
  { m: "JUL", group: 470, solo: 230, merch: 130 },
  { m: "AUG", group: 520, solo: 260, merch: 150 },
  { m: "SEP", group: 590, solo: 290, merch: 170 },
];

export const agencyRadar = [
  { skill: "VOCAL", v: 92 },
  { skill: "DANCE", v: 90 },
  { skill: "RAP", v: 78 },
  { skill: "VISUAL", v: 94 },
  { skill: "CHARISMA", v: 90 },
];

export const rivals = [
  { id: "nova", name: "NOVA MEDIA", reputation: 92, groups: 5, share: 28, threat: "High", recent: "Debuted new boy group VANTA" },
  { id: "prism", name: "PRISM LABEL", reputation: 86, groups: 3, share: 19, threat: "Medium", recent: "Top 10 chart entry with 'Mirror'" },
  { id: "zenith", name: "ZENITH ENT.", reputation: 78, groups: 4, share: 14, threat: "Medium", recent: "Signed rising trainee from Osaka" },
  { id: "halo", name: "HALO STUDIOS", reputation: 71, groups: 2, share: 9, threat: "Low", recent: "Scandal — reputation dropped 4 pts" },
];

export const transactions = [
  { id: 1, label: "ELEVATE — Single 'Lumina' royalties", type: "income", amount: 184_000_000, date: "Oct 10" },
  { id: 2, label: "Music Bank performance fee", type: "income", amount: 22_000_000, date: "Oct 09" },
  { id: 3, label: "Dance Practice — weekly", type: "expense", amount: -8_500_000, date: "Oct 08" },
  { id: 4, label: "Trainee recruitment — Luna", type: "expense", amount: -45_000_000, date: "Oct 06" },
  { id: 5, label: "CF shoot prep — NEXUS Ads", type: "expense", amount: -12_000_000, date: "Oct 05" },
  { id: 6, label: "Fan meeting — Seoul", type: "income", amount: 96_000_000, date: "Oct 02" },
  { id: 7, label: "Vocal coaching — Yuna, Kai", type: "expense", amount: -6_200_000, date: "Sep 30" },
];

export const promotions = [
  { id: "ms", name: "Music Show Performance", cost: 18_000_000, fans: "+12k", rep: "+3", fatigue: "+15", time: "1 day" },
  { id: "sm", name: "Social Media Campaign", cost: 6_500_000, fans: "+9k", rep: "+1", fatigue: "+3", time: "3 days" },
  { id: "fm", name: "Fan Meeting", cost: 22_000_000, fans: "+18k", rep: "+5", fatigue: "+12", time: "1 day" },
  { id: "vs", name: "Variety Show", cost: 14_000_000, fans: "+15k", rep: "+4", fatigue: "+10", time: "1 day" },
  { id: "dc", name: "Dance Challenge", cost: 3_500_000, fans: "+22k", rep: "+2", fatigue: "+5", time: "5 days" },
  { id: "ri", name: "Radio Interview", cost: 2_000_000, fans: "+4k", rep: "+1", fatigue: "+2", time: "2 hours" },
];

export const opportunities = [
  { region: "Vietnam", text: "Viral dance trend rising — boost dance challenges", tone: "mint" as const },
  { region: "Seoul", text: "High competition this month — expect tougher charts", tone: "hot" as const },
  { region: "Japan", text: "Market prefers elegant concept right now", tone: "violet" as const },
  { region: "Bangkok", text: "Sponsorship interest increasing", tone: "teal" as const },
];

export const markets = [
  { region: "Korea", fans: "2.4M", revenue: "₩620M", trend: "+8%", rank: "#4" },
  { region: "Japan", fans: "1.1M", revenue: "₩340M", trend: "+5%", rank: "#9" },
  { region: "China", fans: "0.9M", revenue: "₩210M", trend: "+12%", rank: "#11" },
  { region: "Vietnam", fans: "0.6M", revenue: "₩90M", trend: "+22%", rank: "#6" },
  { region: "Thailand", fans: "0.5M", revenue: "₩80M", trend: "+14%", rank: "#7" },
  { region: "Global", fans: "5.5M", revenue: "₩1.34B", trend: "+10%", rank: "#13" },
];

export const trainees = [
  { id: "t1", name: "Aria", age: 17, nationality: "Japanese", flag: "🇯🇵", potential: 92, skill: "Vocal", personality: "Quiet, Driven", cost: 80_000_000, gradient: grads[0] },
  { id: "t2", name: "Renjun", age: 18, nationality: "Chinese", flag: "🇨🇳", potential: 88, skill: "Dance", personality: "Sharp, Bold", cost: 65_000_000, gradient: grads[1] },
  { id: "t3", name: "Mai", age: 16, nationality: "Vietnamese", flag: "🇻🇳", potential: 84, skill: "Visual", personality: "Bright, Curious", cost: 42_000_000, gradient: grads[2] },
  { id: "t4", name: "Theo", age: 19, nationality: "Thai", flag: "🇹🇭", potential: 80, skill: "Rap", personality: "Calm, Witty", cost: 36_000_000, gradient: grads[3] },
  { id: "t5", name: "Sky", age: 17, nationality: "Korean", flag: "🇰🇷", potential: 94, skill: "Charisma", personality: "Magnetic, Warm", cost: 95_000_000, gradient: grads[4] },
];

export const trainingTypes = [
  { id: "vocal", name: "Vocal Coaching", effect: "+Vocal", cost: "−Energy" },
  { id: "dance", name: "Dance Practice", effect: "+Dance", cost: "−Energy" },
  { id: "rap", name: "Rap Training", effect: "+Rap", cost: "−Energy" },
  { id: "acting", name: "Acting Class", effect: "+Acting", cost: "−Energy" },
  { id: "lang", name: "Language Lab", effect: "+Language", cost: "−Energy" },
  { id: "media", name: "Media Training", effect: "+Variety", cost: "−Energy" },
  { id: "rest", name: "Rest Day", effect: "+Morale", cost: "+Energy" },
];

export const conceptOptions = ["Girl Crush", "Fresh", "Elegant", "Hip-Hop", "Ballad", "Experimental", "Global Pop"];
export const languageOptions = ["Korean","Japanese","Chinese","Vietnamese","English"];

export function fmt(n: number) {
  if (Math.abs(n) >= 1_000_000_000) return `₩${(n/1_000_000_000).toFixed(2)}B`;
  if (Math.abs(n) >= 1_000_000) return `₩${(n/1_000_000).toFixed(0)}M`;
  if (Math.abs(n) >= 1_000) return `₩${(n/1_000).toFixed(0)}K`;
  return `₩${n}`;
}
