"use client";

import {
  Users,
  UserPlus,
  DollarSign,
  Megaphone,
  Gift,
  MoreVertical,
  Download,
  Plus,
  Play,
  ChevronRight,
  TrendingUp,
  Activity,
  Ticket,
  ShieldCheck,
  CalendarDays,
  Clock,
  ArrowUpRight,
  Sparkles,
  Zap,
  Building2,
  Mail
} from "lucide-react";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function HRDashboard() {
  const router = useRouter();
  const params = useParams();

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden pb-12">
      {/* Subtle Background Accents */}
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[-50px] w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="relative z-10 p-4 sm:p-8 max-w-[1400px] mx-auto">
        
        {/* ── Sleek Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">
            <ShieldCheck size={14} />
            <span>Staffing Intelligence Hub</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Organization <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Overview</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                Real-time workforce forensic data and administrative orchestration.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Global Status</p>
                <p className="text-[11px] font-bold text-emerald-500 flex items-center justify-end gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Active
                </p>
              </div>
              <div className="w-[1px] h-8 bg-gray-200 mx-1 hidden sm:block"></div>
              <button className="p-2.5 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all text-gray-400 hover:text-indigo-600">
                <Sparkles size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ── LEFT COLUMN (8 Units) ── */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Payroll Summary */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm group relative overflow-hidden">
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Payroll Cycle</p>
                    <p className="text-[11px] text-indigo-600 font-bold mt-0.5">OCTOBER 2023</p>
                  </div>
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                    <DollarSign size={18} />
                  </div>
                </div>
                <div className="flex items-end gap-2 mb-6 relative z-10">
                  <span className="text-3xl font-bold text-gray-900 tracking-tight">Rs.482,950</span>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-bold mb-1 border border-emerald-100">
                    <ArrowUpRight size={10} />
                    2.4%
                  </div>
                </div>
                <div className="space-y-3 relative z-10">
                  <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span>Disbursement Progress</span>
                    <span className="text-indigo-600">85%</span>
                  </div>
                  <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden shadow-inner">
                    <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} className="h-full bg-indigo-600 rounded-full"></motion.div>
                  </div>
                </div>
              </div>

              {/* Attendance Snap */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Attendance Snap</p>
                  <MoreVertical size={16} className="text-gray-300 cursor-pointer" />
                </div>
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="44" fill="none" stroke="#F1F5F9" strokeWidth="10" />
                      <motion.circle cx="50" cy="50" r="44" fill="none" stroke="#10b981" strokeWidth="10"
                        strokeDasharray="276" initial={{ strokeDashoffset: 276 }} animate={{ strokeDashoffset: 276 * 0.08 }} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-gray-900 tracking-tight">92%</span>
                      <span className="text-[8px] font-bold text-gray-400 uppercase">On-Site</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[
                      { label: "Active", count: 412, color: "bg-emerald-500" },
                      { label: "Absent", count: 18, color: "bg-rose-500" },
                      { label: "Leave", count: 24, color: "bg-amber-500" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${item.color}`}></div>
                          <span className="text-[10px] font-bold text-gray-500 uppercase">{item.label}</span>
                        </div>
                        <span className="text-[11px] font-bold text-gray-900">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-indigo-600 rounded-3xl p-8 shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div>
                  <h3 className="text-white font-bold text-lg tracking-tight">Quick Operations</h3>
                  <p className="text-indigo-100 text-xs font-medium">Direct access to staff protocols.</p>
                </div>
                <Zap size={20} className="text-white/40" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
                {[
                  { label: "Enroll Staff", icon: UserPlus, route: `/${params.dashboard}/admin/operations/employeemanagement/add-employee` },
                  { label: "Run Payroll", icon: DollarSign, route: "#" },
                  { label: "Broadcast", icon: Megaphone, route: "#" },
                  { label: "Time Audits", icon: Clock, route: "#" },
                ].map(({ label, icon: Icon, route }) => (
                  <button 
                    key={label} 
                    onClick={() => route !== "#" && router.push(route)}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-2xl py-6 flex flex-col items-center gap-3 cursor-pointer transition-all border border-white/5 group/btn active:scale-95"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-lg group-hover/btn:scale-105 transition-transform">
                      <Icon size={20} />
                    </div>
                    <span className="text-[10px] font-bold tracking-widest text-white uppercase">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Presence Tracker Table */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg tracking-tight">Staff Presence Tracker</h3>
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5">Live On-Site Telemetry</p>
                </div>
                <button className="px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 text-[11px] font-bold uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                  View Logs
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left py-3 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Personnel</th>
                      <th className="text-left py-3 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Division</th>
                      <th className="text-left py-3 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Activity</th>
                      <th className="text-left py-3 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Check-In</th>
                      <th className="text-left py-3 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Modality</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { initials: "MS", name: "Michael Scott", dept: "Sales HQ", status: "ONLINE", statusColor: "bg-emerald-50 text-emerald-600 border-emerald-100", checkin: "08:45 AM", mode: "In-Office", bg: "from-indigo-500 to-indigo-600" },
                      { initials: "PB", name: "Pam Beesly", dept: "Admin Ops", status: "ONLINE", statusColor: "bg-emerald-50 text-emerald-600 border-emerald-100", checkin: "09:02 AM", mode: "Remote", bg: "from-rose-400 to-rose-500" },
                      { initials: "JH", name: "Jim Halpert", dept: "Market Strat", status: "LATE", statusColor: "bg-rose-50 text-rose-500 border-rose-100", checkin: "10:15 AM", mode: "In-Office", bg: "from-blue-500 to-blue-600" },
                    ].map((row) => (
                      <tr key={row.name} className="hover:bg-gray-50 transition-colors duration-200 group">
                        <td className="py-3 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${row.bg} flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}>{row.initials}</div>
                            <span className="text-[13px] font-bold text-gray-900">{row.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-6 text-[12px] font-medium text-gray-500 uppercase tracking-tight">{row.dept}</td>
                        <td className="py-3 px-6">
                          <span className={`text-[9px] font-bold px-2.5 py-1 rounded-lg uppercase border ${row.statusColor}`}>{row.status}</span>
                        </td>
                        <td className="py-3 px-6 text-[12px] text-gray-900 font-bold">{row.checkin}</td>
                        <td className="py-3 px-6">
                          <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-indigo-300"></div>
                            {row.mode}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN (4 Units) ── */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Hiring Pipeline */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 text-base tracking-tight">Talent Pipeline</h3>
                <Activity size={18} className="text-indigo-600" />
              </div>
              <div className="space-y-5">
                {[
                  { title: "Staff Engineer", progress: 80, label: "PHASE 4/5", color: "bg-indigo-600" },
                  { title: "Visual Architect", progress: 40, label: "PHASE 2/5", color: "bg-amber-500" },
                  { title: "HR Business Lead", progress: 100, label: "COMPLETED", color: "bg-emerald-500" },
                ].map((item) => (
                  <div key={item.title}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[12px] font-bold text-gray-900">{item.title}</span>
                      <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider">{item.label}</span>
                    </div>
                    <div className="h-2 bg-gray-50 rounded-full overflow-hidden shadow-inner">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${item.progress}%` }} className={`h-full ${item.color} rounded-full`}></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics Snapshot */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Staff", val: "426", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
                { label: "New Hires", val: "+12", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
                { label: "Tickets", val: "08", icon: Ticket, color: "text-rose-500", bg: "bg-rose-50" },
                { label: "Bulletins", val: "03", icon: Megaphone, color: "text-indigo-600", bg: "bg-indigo-50" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col items-center text-center group hover:scale-[1.02] transition-transform">
                  <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3 shadow-sm`}>
                    <stat.icon size={18} className={stat.color} />
                  </div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900 tracking-tight">{stat.val}</p>
                </div>
              ))}
            </div>

            {/* Celebrations Feed */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Gift size={16} className="text-rose-500" />
                  <span className="font-bold text-gray-900 text-base tracking-tight">Celebrations</span>
                </div>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">OCT '23</span>
              </div>
              <div className="space-y-5">
                {[
                  { name: "Sarah Mitchell", sub: "Design • Today", initials: "SM", bg: "from-pink-400 to-rose-500" },
                  { name: "James Wilson", sub: "Product • Oct 24", initials: "JW", bg: "from-indigo-500 to-indigo-600" },
                ].map((person) => (
                  <div key={person.name} className="flex items-center justify-between group/feed">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${person.bg} flex items-center justify-center text-[10px] font-bold text-white shadow-md`}>{person.initials}</div>
                      <div>
                        <p className="text-[13px] font-bold text-gray-900 leading-tight">{person.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">{person.sub}</p>
                      </div>
                    </div>
                    <button className="w-8 h-8 rounded-lg border border-gray-100 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                      <Play size={10} className="ml-0.5 fill-current" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
