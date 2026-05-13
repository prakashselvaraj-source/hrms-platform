"use client";

import {
  Bell,
  HelpCircle,
  Home,
  Users,
  Shield,
  ChevronDown,
  BookOpen,
  UserPlus,
  TrendingUp,
  Activity,
  FileText,
  LogOut,
  Settings,
  Calendar,
  Clock,
  DollarSign,
  Megaphone,
  Ticket,
  Mail,
  Gift,
  MoreVertical,
  Download,
  Plus,
  Play,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Home", icon: Home, active: false },
];

const PEOPLE_ITEMS = [
  {
    label: "Roles Management",
    icon: Users,
    expandable: true,
    children: ["Permission management"],
  },
  {
    label: "Employee Management",
    icon: Users,
    expandable: true,
    children: [
      "Employee dictionary",
      "Add Employee",
      "promotion",
      "performance",
      "Resignation",
      "Termination",
      "Announcement",
    ],
    activeChild: "Employee dictionary",
  },
];

const TIMES_ITEMS = [
  {
    label: "Leave Management",
    icon: Calendar,
    expandable: true,
    children: ["Leave Types", "Leave Policies", "Leave Requests", "Leave balance"],
  },
  {
    label: "Attendance",
    icon: Clock,
    expandable: true,
    children: ["Attendance Logs", "Attendance policies", "Time-Tracker/ punch logs", "Biometric Attendance"],
  },
  {
    label: "holidays",
    icon: Calendar,
    expandable: true,
    children: ["Geo-calender", "upcoming holidays"],
  },
];

const PAYROLL_ITEMS = [
  "Overview",
  "Salary Structure",
  "Employee Salary",
  "payroll processing",
  "payslip",
  "Previous Payroll",
  "pay cycle configur",
];

export default function HRDashboard() {
  const [expandedSections, setExpandedSections] = useState({
    "Roles Management": true,
    "Employee Management": true,
    "Leave Management": true,
    Attendance: true,
    holidays: true,
  });

  const toggleSection = (label) => {
    setExpandedSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
    
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Nav */}
        <header className="h-12 bg-white border-b border-gray-200 flex items-center justify-end px-6 gap-4 flex-shrink-0">
          <Bell size={18} className="text-gray-500 cursor-pointer" />
          <HelpCircle size={18} className="text-gray-500 cursor-pointer" />
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-xs font-semibold text-gray-800">SarahJenkins</div>
              <div className="text-[10px] text-gray-400">HR-1024</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-orange-300 flex items-center justify-center text-xs font-bold text-orange-700">SJ</div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {/* Header */}
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Good morning, Sarah. Here's what's happening across the organization today.</p>
          </div>

          <div className="flex gap-5">
            {/* Left Column */}
            <div className="flex-1 flex flex-col gap-5 min-w-0">
              {/* Top Row: Payroll + Attendance + Stats */}
              <div className="flex gap-4">
                {/* Payroll Summary */}
                <div className="bg-white rounded-xl p-5 flex-1 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Payroll Summary</p>
                      <p className="text-[10px] text-gray-400">NEXT PAY DATE: OCT 31, 2023</p>
                    </div>
                    <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                      <DollarSign size={16} className="text-purple-500" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl font-bold text-gray-900">Rs.482,950</span>
                    <span className="text-xs text-green-500 font-semibold">↑2.4%</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Gross Salaries</span>
                        <span className="font-medium text-gray-700">Rs.412,000</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full">
                        <div className="h-1.5 bg-purple-500 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Taxes & Benefits</span>
                        <span className="font-medium text-gray-700">Rs.70,950</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full">
                        <div className="h-1.5 bg-purple-300 rounded-full" style={{ width: "30%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attendance */}
                <div className="bg-white rounded-xl p-5 flex-1 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Attendance</p>
                      <p className="text-[10px] text-gray-400">TODAY'S SNAPSHOT</p>
                    </div>
                    <MoreVertical size={16} className="text-gray-400 cursor-pointer" />
                  </div>
                  <div className="flex items-center gap-5">
                    {/* Circle */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="32" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                        <circle cx="40" cy="40" r="32" fill="none" stroke="#10b981" strokeWidth="8"
                          strokeDasharray={`${2 * Math.PI * 32 * 0.92} ${2 * Math.PI * 32 * 0.08}`} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-800">92%</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-gray-600">Present (412)</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span className="text-gray-600">Absent (18)</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                        <span className="text-gray-600">On Leave (24)</span>
                      </div>
                    </div>
                  </div>
                  <button className="mt-3 w-full border border-purple-200 text-purple-600 text-xs py-1.5 rounded-lg flex items-center justify-center gap-1.5 hover:bg-purple-50">
                    <Download size={12} />
                    Export to Excel
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-[#3730A3] rounded-xl p-5">
                <h3 className="text-white font-semibold text-sm mb-4">Quick Actions</h3>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "PAY RUN", icon: DollarSign },
                    { label: "ONBOARD", icon: UserPlus },
                    { label: "REPORT", icon: FileText },
                    { label: "CALENDAR", icon: Calendar },
                  ].map(({ label, icon: Icon }) => (
                    <button key={label} className="bg-[#4338CA] hover:bg-[#4F46E5] rounded-xl py-4 flex flex-col items-center gap-2 cursor-pointer transition-colors">
                      <Icon size={22} className="text-white" />
                      <span className="text-[10px] font-bold tracking-wider text-white">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recruitment & Talent Metrics */}
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Recruitment & Talent Metrics</h3>
                    <p className="text-xs text-gray-400">Quarterly performance and hiring velocity</p>
                  </div>
                  <button className="bg-[#3730A3] text-white text-xs px-3 py-1.5 rounded-lg">All Departments</button>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#3730A3]">Recruitment Progress</p>
                    <p className="text-[10px] font-semibold text-[#3730A3]">85% Capacity</p>
                  </div>
                  <div className="space-y-4">
                    {[
                      { title: "Senior Engineering Lead", progress: 80, stages: "4/5 Stages", color: "bg-[#3730A3]" },
                      { title: "Product Designer", progress: 40, stages: "2/5 Stages", color: "bg-yellow-400" },
                      { title: "HR Specialist", progress: 100, stages: "Complete", color: "bg-green-500", complete: true },
                    ].map(({ title, progress, stages, color, complete }) => (
                      <div key={title}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-sm font-medium text-gray-700">{title}</span>
                          <span className={`text-xs font-medium ${complete ? "text-green-600" : "text-gray-500"}`}>{stages}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div className={`h-2 ${color} rounded-full`} style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Attendance Tracking */}
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Attendance Tracking</h3>
                    <p className="text-xs text-gray-400">Real-time occupancy and check-in logs</p>
                  </div>
                  <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700">
                    <Download size={12} />
                    Export to Excel
                  </button>
                </div>
                <table className="w-full mt-4">
                  <thead>
                    <tr className="text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                      <th className="text-left pb-2">Employee</th>
                      <th className="text-left pb-2">Department</th>
                      <th className="text-left pb-2">Status</th>
                      <th className="text-left pb-2">Check-In</th>
                      <th className="text-left pb-2">Work Mode</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { initials: "MS", name: "Michael Scott", dept: "Regional Management", status: "PRESENT", statusColor: "bg-green-100 text-green-700", checkin: "08:45 AM", mode: "On-site", avatarBg: "bg-blue-500" },
                      { initials: "PB", name: "Pam Beesly", dept: "Admin & Ops", status: "PRESENT", statusColor: "bg-green-100 text-green-700", checkin: "09:02 AM", mode: "Remote", avatarBg: "bg-pink-400" },
                      { initials: "JH", name: "Jim Halpert", dept: "Sales Strategy", status: "LATE", statusColor: "bg-red-100 text-red-600", checkin: "10:15 AM", mode: "On-site", avatarBg: "bg-yellow-500" },
                    ].map((row) => (
                      <tr key={row.name} className="border-b border-gray-50 last:border-0">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full ${row.avatarBg} flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0`}>{row.initials}</div>
                            <span className="text-sm text-gray-800">{row.name}</span>
                          </div>
                        </td>
                        <td className="py-3 text-sm text-gray-500">{row.dept}</td>
                        <td className="py-3">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded ${row.statusColor}`}>{row.status}</span>
                        </td>
                        <td className="py-3 text-sm text-gray-600">{row.checkin}</td>
                        <td className="py-3 text-sm text-gray-600">{row.mode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Integrated Priority Inbox */}
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Mail size={15} className="text-gray-500" />
                    <span className="font-semibold text-sm text-gray-900">Integrated Priority Inbox</span>
                  </div>
                  <button className="text-xs text-purple-600 hover:underline">Go to Mailbox</button>
                </div>
                <div className="space-y-3">
                  {[
                    { initials: "AM", name: "Alex Mercer", time: "10:45 AM", preview: "Urgent: Benefit package update for the upcoming open enrollment season...", unread: true, avatarBg: "bg-[#3730A3]" },
                    { initials: "DC", name: "David Chen", time: "Yesterday", preview: "The leave request for Q4 has been submitted for approval by the board...", unread: false, avatarBg: "bg-gray-400" },
                  ].map((msg) => (
                    <div key={msg.name} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full ${msg.avatarBg} flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0`}>{msg.initials}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-800">{msg.name}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] text-gray-400">{msg.time}</span>
                            {msg.unread && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 truncate">{msg.preview}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-64 flex-shrink-0 flex flex-col gap-4">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center gap-1">
                    <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center">
                      <Users size={14} className="text-purple-400" />
                    </div>
                    <p className="text-[10px] text-gray-400">Total Employees</p>
                    <p className="text-lg font-bold text-gray-800">10</p>
                  </div>
                ))}
              </div>

              {/* Announcements */}
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Megaphone size={14} className="text-gray-600" />
                    <span className="font-semibold text-sm text-gray-900">Announcements</span>
                  </div>
                  <button className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                    <Plus size={12} className="text-white" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="border-l-4 border-purple-500 pl-3 py-1">
                    <p className="text-[9px] font-bold uppercase text-purple-500 tracking-wider mb-0.5">NEW POLICY</p>
                    <p className="text-xs font-semibold text-gray-800">Hybrid Work Policy v2.1</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Starting Nov 1st, all departments transition to the new flexible framework.</p>
                  </div>
                  <div className="border-l-4 border-orange-400 pl-3 py-1">
                    <p className="text-[9px] font-bold uppercase text-orange-400 tracking-wider mb-0.5">EVENT</p>
                    <p className="text-xs font-semibold text-gray-800">Annual Founder's Day</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Join us for the town hall meeting and awards ceremony this Friday.</p>
                  </div>
                </div>
              </div>

              {/* Payroll Deadlines */}
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-sm text-gray-900 mb-3">Payroll Deadlines</h3>
                <div className="space-y-3">
                  {[
                    { month: "OCT", day: "28", title: "Monthly Salary Approval", sub: "4 days remaining", color: "bg-orange-500" },
                    { month: "NOV", day: "05", title: "Tax Compliance Filing", sub: "11 days remaining", color: "bg-gray-400" },
                  ].map(({ month, day, title, sub, color }) => (
                    <div key={title} className="flex items-start gap-3">
                      <div className={`${color} rounded-lg w-10 h-10 flex flex-col items-center justify-center flex-shrink-0`}>
                        <span className="text-[8px] font-bold text-white uppercase leading-none">{month}</span>
                        <span className="text-sm font-bold text-white leading-none">{day}</span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{title}</p>
                        <p className="text-[10px] text-gray-400">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Tickets */}
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm text-gray-900">Active Tickets</h3>
                  <span className="bg-[#3730A3] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">12 New</span>
                </div>
                <div className="space-y-2">
                  {[
                    { title: "IT Equipment Request", sub: "Dwight Schrute • High" },
                    { title: "Salary Grievance", sub: "Toby Flenderson • Medium" },
                  ].map(({ title, sub }) => (
                    <div key={title} className="flex items-center justify-between p-2 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{title}</p>
                        <p className="text-[10px] text-gray-400">{sub}</p>
                      </div>
                      <ChevronRight size={14} className="text-gray-400" />
                    </div>
                  ))}
                </div>
                <button className="w-full mt-3 text-[11px] font-semibold text-[#3730A3] text-center hover:underline">VIEW ALL TICKETS</button>
              </div>

              {/* Birthdays */}
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Gift size={14} className="text-gray-600" />
                    <span className="font-semibold text-sm text-gray-900">Birthdays</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">OCTOBER</span>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "Sarah Mitchell", sub: "Design Team • Today", initials: "SM", bg: "bg-pink-400" },
                    { name: "James Wilson", sub: "Product Dev • Oct 24", initials: "JW", bg: "bg-blue-400" },
                  ].map(({ name, sub, initials, bg }) => (
                    <div key={name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center text-[10px] font-bold text-white`}>{initials}</div>
                        <div>
                          <p className="text-xs font-semibold text-gray-800">{name}</p>
                          <p className="text-[10px] text-gray-400">{sub}</p>
                        </div>
                      </div>
                      <button className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                        <Play size={9} className="text-gray-400 ml-0.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
