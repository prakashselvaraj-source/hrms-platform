"use client"

import { useTenant } from "@/hooks/useTenant";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  MessageSquare, ShieldAlert, FileText, 
  Settings, ChevronRight, Home, LayoutGrid,
  Zap, Activity, Target
} from "lucide-react";

export default function OperationPage() {
  const tenant = useTenant();

  const modules = [
    {
      id: "support",
      title: "Ticket Management",
      desc: "Monitor and resolve employee support requests and system issues.",
      icon: MessageSquare,
      href: `/${tenant}/manager/operations/support`,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      tag: "Live"
    },
    {
      id: "policies",
      title: "Policy Center",
      desc: "Manage company policies, handbooks, and compliance documents.",
      icon: ShieldAlert,
      href: "#",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      tag: "Coming Soon"
    },
    {
      id: "assets",
      title: "Asset Registry",
      desc: "Track company hardware, software licenses, and inventory.",
      icon: Target,
      href: "#",
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
      tag: "Planned"
    },
    {
      id: "config",
      title: "System Config",
      desc: "Deep configuration of organization-wide system parameters.",
      icon: Settings,
      href: "#",
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-100",
      tag: "Admin Only"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-6 uppercase tracking-widest font-bold">
          <Home size={12} />
          <span>Dashboard</span>
          <ChevronRight size={12} />
          <span className="text-indigo-600">Operations</span>
        </div>

        {/* ── Header ── */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Activity className="text-indigo-600" size={36} />
            Operations Control
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Manage organization-wide infrastructure and support systems.</p>
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {modules.map((mod, idx) => (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                href={mod.href}
                className={`block h-full p-6 bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden`}
              >
                {/* Background Decoration */}
                <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${mod.bg} opacity-0 group-hover:opacity-40 transition-all blur-2xl`} />
                
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl ${mod.bg} ${mod.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <mod.icon size={28} />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${mod.bg} ${mod.color} border ${mod.border}`}>
                    {mod.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {mod.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  {mod.desc}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                  <span>Enter Module</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ── Quick Actions / Insights ── */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#0A0F24] rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 text-indigo-400">
                <Zap size={20} fill="currentColor" />
                <span className="text-xs font-black uppercase tracking-[0.2em]">Operational Pulse</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">System efficiency is at 98.4%</h2>
              <p className="text-slate-400 max-w-md text-sm leading-relaxed mb-6">
                All operational modules are performing within optimal parameters. There are currently no critical tickets requiring immediate escalation.
              </p>
              <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-900/50">
                View Detailed Analytics
              </button>
            </div>
            {/* Dark Mode Accent */}
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-indigo-600/10 blur-[100px]" />
          </div>

          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex flex-col justify-center">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mb-4">
              <LayoutGrid size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Custom Shortcuts</h3>
            <p className="text-sm text-slate-500 font-medium mb-4">Pin your most used operational modules here for faster access.</p>
            <button className="text-sm font-bold text-indigo-600 hover:underline">Edit shortcuts →</button>
          </div>
        </div>

      </div>
    </div>
  );
}