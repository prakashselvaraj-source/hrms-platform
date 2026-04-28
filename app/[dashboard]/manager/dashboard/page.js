"use client";

import { useState, useRef, useEffect } from "react";
import {
  Users, Calendar, Clock, UserCheck, AlertTriangle, CheckSquare, Search,
  MegaphoneIcon, ChevronDown
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────


const POLICY_ALERTS = [
  "Priya Sharma has exceeded 2 leaves this month – subsequent leaves will be marked as Loss of Pay (LOP).",
  "Arjun Das applied for 3 consecutive CL days – max allowed is 2. System has auto-split.",
  "Sandwich leave detected: Meena Raj's leave on Mon + Wed spans a Tuesday. This may violate the sandwich policy.",
];

const ON_LEAVE = [
  { name: "Priya Sharma", role: "UI Designer", type: "CL", initials: "PS", color: "bg-orange-400" },
  { name: "Meena Raj", role: "Frontend Dev", type: "SL", initials: "MR", color: "bg-green-500" },
  { name: "Sonia Kaur", role: "Backend Dev", type: "CL", initials: "SK", color: "bg-[#E2DFFF]" },

];

const QUICK_ACTIONS = [
  {
    label: "Approve Leave", primary: true,
    icon: <CheckSquare size={20} />,
  },
  {
    label: "View Calendar", primary: false,
    icon: <Calendar size={20} />,
  },
  {
    label: "Attendance Request", primary: false,
    icon: <Clock size={20} />,
  },
  {
    label: "My Team", primary: false,
    icon: <Users size={20} />,
  },
];

const ANNOUNCEMENTS = [
  { type: "CULTURAL EVENT", typeCls: "bg-amber-50 text-amber-700", title: "Diwali Celebration Desk Contest", desc: "Decorate your workspace by Friday for a chance to win vouchers." },
  { type: "POLICY UPDATE", typeCls: "bg-indigo-50 text-indigo-700", title: "Updated Remote Work Guidelines", desc: "Check the employee handbook for the revised hybrid work model." },
];

const PENDING = [
  { count: 4, title: "Leave requests awaiting", sub: "Approval Needed" },
  { count: 2, title: "Attendance regularizations", sub: "Review Pending" },
];

const TEAM_MEMBERS = [
  { name: "Arjun Das", role: "Senior Backend Dev", initials: "AD", color: "bg-indigo-500", status: "Online", statusCls: "bg-green-50 text-green-600" },
  { name: "Priya Sharma", role: "UI/UX Lead", initials: "PS", color: "bg-orange-400", status: "On Leave", statusCls: "bg-orange-50 text-orange-600" },
  { name: "David Chen", role: "Project Manager", initials: "DC", color: "bg-cyan-500", status: "Remote", statusCls: "bg-indigo-50 text-[#4A45B6]" },
  { name: "Sarah Jenkins", role: "Frontend Developer", initials: "SJ", color: "bg-green-500", status: "Online", statusCls: "bg-green-50 text-green-600" },
];

const LEAVE_REQUESTS = [
  {
    name: "Arjun Das", role: "Senior Engineer", initials: "AD", color: "bg-indigo-500", type: "CL", typeCls: "bg-indigo-50 text-[#4A45B6]", dateRange: "Oct 24 – Oct 26", days: "3 Days",
    status: "Pending", statusCls: "bg-orange-50 text-orange-500", action: "APPROVE", actionCls: "bg-[#4A45B6] text-white hover:bg-indigo-700"
  },
  { name: "Priya Sharma", role: "UI Designer", initials: "PS", color: "bg-orange-400", type: "SL", typeCls: "bg-amber-50 text-amber-700", dateRange: "Oct 27 – Oct 27", days: "1 Day", status: "Done", statusCls: "bg-green-50 text-green-600", action: "DONE", actionCls: "bg-green-50 text-green-600 cursor-default" },
  { name: "Meena Raj", role: "Frontend Dev", initials: "MR", color: "bg-green-500", type: "CL", typeCls: "bg-indigo-50 text-[#4A45B6]", dateRange: "Oct 28 – Oct 29", days: "2 Days", status: "Pending", statusCls: "bg-orange-50 text-orange-500", action: "APPROVE", actionCls: "bg-[#4A45B6] text-white hover:bg-indigo-700" },
  { name: "David Chen", role: "Project Manager", initials: "DC", color: "bg-cyan-500", type: "SL", typeCls: "bg-amber-50 text-amber-700", dateRange: "Oct 30 – Oct 30", days: "1 Day", status: "Pending", statusCls: "bg-orange-50 text-orange-500", action: "APPROVE", actionCls: "bg-[#4A45B6] text-white hover:bg-indigo-700" },
];


// ─── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ initials, color, size = "w-8 h-8", text = "text-xs" }) {
  return (
    <div className={`${size} ${color} rounded-full flex items-center justify-center text-white font-bold ${text} shrink-0`}>
      {initials}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function HRDashboard() {
  const [teamSearch, setTeamSearch] = useState("");
  const [leaveSearch, setLeaveSearch] = useState("");
  const [leaveType, setLeaveType] = useState("All");
  const [isLeaveTypeOpen, setIsLeaveTypeOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLeaveTypeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTeam = TEAM_MEMBERS.filter(m =>
    m.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
    m.role.toLowerCase().includes(teamSearch.toLowerCase())
  );

  const filteredLeaves = LEAVE_REQUESTS.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(leaveSearch.toLowerCase()) ||
      r.role.toLowerCase().includes(leaveSearch.toLowerCase());
    const matchesType = leaveType === "All" || r.type === leaveType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

      {/* Page heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">Good morning, Ravi 👋</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        <div className="bg-white rounded-sm  border-l-4 border-[#4A45B6] p-5 hover:shadow-sm transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-sm flex items-center
             justify-center bg-[#4A45B61A]">

              <span className="text-[#4A45B6]">
                <Users size={18} />
              </span>

            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1
             rounded-full bg-[#007B7133] text-[#006058]">
              +1 new


            </span>
          </div>

          <p className="text-[10.5px] font-semibold text-[#434655] uppercase tracking-wide">
            Total Team Members
          </p>

          <p className="text-3xl font-bold text-[#434655]  mt-1">12</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-sm   border-l-4 border-[#BA1A1A] p-5 hover:shadow-sm transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-sm flex items-center justify-center bg-[#FFDAD633]">
              <span className="text-[#BA1A1A]">
                <Calendar size={18} />
              </span>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#FFDAD633] text-[#BA1A1A]">
              Urgent
            </span>
          </div>
          <p className="text-[10.5px] font-semibold text-[#434655]  uppercase tracking-wide">
            Pending Leave Requests

          </p>
          <p className="text-3xl font-bold text-[#434655]  mt-1">4</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-sm  border-l-4 border-[#712AE2] p-5 hover:shadow-sm transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-sm flex items-center justify-center bg-[#8A4CFC1A] text-[#712AE2]">
              <span className="text-[#712AE2]">
                <Clock size={18} />
              </span>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#8A4CFC1A] 
            text-[#712AE2]">

              Today
            </span>
          </div>
          <p className="text-[10.5px] font-semibold text-[#434655]  uppercase tracking-wide">
            Attendance Requests
          </p>
          <p className="text-3xl font-bold text-[#434655]  mt-1">2</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-sm border-l-4 border-[#006058] p-5 hover:shadow-sm transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-sm flex items-center justify-center bg-[#007B711A]">
              <span className="text-[#006058]">

                <UserCheck size={18} />
              </span>
            </div>

            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#007B711A] text-[#006058]">
              Active
            </span>
          </div>
          <p className="text-[10.5px] font-semibold text-[#434655]  uppercase tracking-wide">
            Employees on Leave Today
          </p>
          <p className="text-3xl font-bold text-[#434655]  mt-1">3</p>
        </div>
      </div>

      {/* ── Policy Alerts ── */}
      <div className="bg-[#FFF8E1] border-l-4 border-[#FFB300] rounded-sm p-4 mb-5">
        <div className="flex items-center gap-2 mb-2.5">

          <AlertTriangle size={15} className="text-[#FFB300]" />
          <h3 className="text-[13px] font-bold text-[#6D4C41]">Policy Alerts & Compliance</h3>
        </div>
        <ul className="space-y-1.5">


          {POLICY_ALERTS.map((a, i) => (
            <li key={i} className="flex items-start gap-2 text-[12px] text-[#795548]">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-[#FFB300] shrink-0" />
              {a}

            </li>
          ))}
        </ul>
      </div>

      {/* ── Mid Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-5">

        {/* Team Snapshot */}
        <div className="bg-white rounded-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[13.5px] font-bold text-slate-800">Team Snapshot</h3>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              LIVE STATUS
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mb-4">Today's attendance overview</p>

          <div className="grid grid-cols-3 gap-2 mb-5">
            {[

              { n: 8, l: "Present", bg: "bg-[#F2F4F6]", tc: "text-green-600" },
              { n: 1, l: "Absent", bg: "bg-[#F2F4F6]", tc: "text-[#BA1A1A]" },
              { n: 3, l: "On Leave", bg: "bg-[#F2F4F6]", tc: "text-[#712AE2]" },
            ].map(({ n, l, bg, tc }) => (
              <div key={l} className={`text-center py-3 rounded-xl ${bg}`}>
                <p className={`text-xl font-bold ${tc}`}>{n}</p>
                <p className="text-[9.5px] font-bold text-[#434655] uppercase tracking-wide mt-0.5">{l}</p>
              </div>

            ))}
          </div>

          <p className="text-[12px] font-bold text-slate-700 mb-3">On Leave Today</p>
          <div className="space-y-3">
            {ON_LEAVE.map((p) => (
              <div key={p.name} className="flex items-center gap-2.5">
                <Avatar initials={p.initials} color={p.color} size="w-8 h-8" text="text-[11px]" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-slate-800 truncate">{p.name}</p>
                  <p className="text-[11px] text-slate-400">{p.role}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${p.type === "CL" ? "bg-indigo-50 text-[#4A45B6]" : "bg-amber-50 text-amber-700"}`}>
                  {p.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-sm border border-slate-100 p-5">
          <h3 className="text-[13.5px] font-bold text-slate-800 mb-1">Quick Actions</h3>
          <p className="text-[11.5px] text-slate-400 mb-4">Common tasks at a glance</p>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map(({ label, primary, icon }) => (
              <button
                key={label}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl text-[12px] font-semibold border transition-all cursor-pointer
                  ${primary
                    ? "bg-[#4A45B6] text-white border-indigo-600 hover:bg-indigo-700"
                    : "bg-white text-[#4A45B6] border-slate-200 hover:bg-indigo-50 hover:border-indigo-300"
                  }`}
              >

                {icon}
                <span className="text-center leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-sm border border-slate-100 p-5 md:col-span-2 xl:col-span-1">
          <div className="flex items-center gap-5 mb-4">
            <MegaphoneIcon className="w-5 h-5 text-[#712AE2]" />
            <h3 className="text-[13.5px] font-bold text-slate-800"> Quick Announcements</h3>
            <button className="text-[11px] font-bold text-[#4A45B6] hover:underline tracking-wide">ALL UPDATES</button>
          </div>
          <div className="space-y-3">
            {ANNOUNCEMENTS.map((a) => (
              <div key={a.title} className="border border-slate-100 rounded-xl p-3 hover:border-indigo-100 transition-colors">
                <span className={`inline-block text-[9.5px] font-bold px-2 py-0.5 rounded-md mb-2 tracking-wide ${a.typeCls}`}>{a.type}</span>
                <p className="text-[13px] font-semibold text-slate-800">{a.title}</p>
                <p className="text-[11.5px] text-slate-400 mt-1 leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Pending + My Team ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-5">

        {/* Pending Actions */}
        <div className="bg-white rounded-sm border border-slate-100 p-5">
          <h3 className="text-[13.5px] font-bold text-slate-800 mb-1">Pending Actions</h3>
          <p className="text-[11.5px] text-slate-400 mb-1">Items requiring your attention</p>
          <div className="divide-y divide-slate-50">
            {PENDING.map((item) => (
              <div key={item.title} className="flex items-center gap-4 py-4">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#4A45B6] font-bold text-base flex items-center justify-center shrink-0">
                  {item.count}
                </div>
                <div className="flex-1">
                  <p className="text-[13.5px] font-semibold text-slate-800">{item.title}</p>
                  <p className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wide mt-0.5">{item.sub}</p>
                </div>
                <button className="text-[11.5px] font-semibold text-[#4A45B6] hover:underline shrink-0">Review</button>
              </div>
            ))}
          </div>
        </div>

        {/* My Team */}
        <div className="bg-white rounded-sm border border-slate-100 p-5">
          <h3 className="text-[13.5px] font-bold text-slate-800 mb-1">My Team</h3>
          <p className="text-[11.5px] text-slate-400 mb-3">Manage and monitor your direct reports</p>
          <div className="relative mb-3">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={teamSearch}
              onChange={(e) => setTeamSearch(e.target.value)}
              className="w-full text-[12.5px] border border-slate-200 rounded-xl pl-8 pr-3 py-2 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 placeholder-slate-300"
            />
          </div>
          <div className="divide-y divide-slate-50">
            {filteredTeam.map((m) => (
              <div key={m.name} className="flex items-center gap-3 py-2.5">
                <Avatar initials={m.initials} color={m.color} size="w-8 h-8" text="text-[11px]" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-slate-800 truncate">{m.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{m.role}</p>
                </div>
                <span className={`text-[10.5px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${m.statusCls}`}>{m.status}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-3">
            Showing {filteredTeam.length} of {TEAM_MEMBERS.length} records</p>
        </div>
      </div>

      {/* ── Recent Leave Requests ── */}
      <div className="bg-white rounded-sm border border-slate-100 p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <h3 className="text-[13.5px] font-bold text-slate-800">Recent Leave Requests</h3>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
                <Search size={12} />
              </span>
              <input
                type="text"
                placeholder="Search leaves..."
                value={leaveSearch}
                onChange={(e) => setLeaveSearch(e.target.value)}
                className="text-[12px] border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 outline-none focus:border-indigo-400 placeholder-slate-300 w-full sm:w-48"
              />
            </div>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsLeaveTypeOpen(!isLeaveTypeOpen)}
                className="flex items-center justify-between text-[12px] border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-400 text-slate-600 bg-white min-w-[140px] hover:border-indigo-300 transition-all shadow-sm"
              >
                <span>{leaveType === "All" ? "All Types" : leaveType === "CL" ? "Casual Leave (CL)" : "Sick Leave (SL)"}</span>
                <ChevronDown size={14} className={`ml-2 text-slate-400 transition-transform duration-200 ${isLeaveTypeOpen ? "rotate-180 text-indigo-500" : ""}`} />
              </button>
              {isLeaveTypeOpen && (
                <div className="absolute right-0 mt-1.5 w-full bg-white border border-slate-100 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in duration-100">
                  <ul >
                    {[
                      { val: "All", label: "All Types" },
                      { val: "CL", label: "Casual Leave (CL)" },
                      { val: "SL", label: "Sick Leave (SL)" }
                    ].map((opt) => (
                      <li key={opt.val}>
                        <button
                          type="button"
                          onClick={() => {
                            setLeaveType(opt.val);
                            setIsLeaveTypeOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-[12px] transition-all
                            ${leaveType === opt.val
                              ? "text-white font-bold bg-[#4A45B6]"
                              : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                            }`}
                        >
                          {opt.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button className="text-[11.5px] font-semibold text-[#4A45B6] hover:underline">View All</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[580px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                {["Employee", "Leave Type", "Date Range", "Days", "Status", "Action"].map((h) => (
                  <th key={h} className="pb-3 text-[10.5px] font-bold text-slate-400 uppercase tracking-wide pr-4 last:pr-0">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLeaves.map((r) => (
                <tr key={r.name + r.dateRange} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={r.initials} color={r.color} size="w-8 h-8" text="text-[11px]" />
                      <div>
                        <p className="text-[13px] font-semibold text-slate-800">{r.name}</p>
                        <p className="text-[11px] text-slate-400">{r.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md ${r.typeCls}`}>{r.type}</span>
                  </td>
                  <td className="py-3.5 pr-4 text-[12.5px] text-slate-600 font-medium whitespace-nowrap">{r.dateRange}</td>
                  <td className="py-3.5 pr-4 text-[12.5px] text-slate-600 font-medium">{r.days}</td>
                  <td className="py-3.5 pr-4">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${r.statusCls}`}>{r.status}</span>
                  </td>
                  <td className="py-3.5">
                    <button className={`text-[11px] font-bold px-3.5 py-1.5 rounded-lg transition-colors ${r.actionCls}`}>
                      {r.action}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
