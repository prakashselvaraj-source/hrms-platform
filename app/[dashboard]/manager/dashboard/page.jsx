"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { 
  Users, Calendar, Clock, UserCheck, AlertTriangle, CheckSquare, Search,
  MegaphoneIcon, ChevronDown, TrendingUp, ArrowRight, Bell,
  PieChart, Activity, Zap, ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTenant } from "@/hooks/useTenant";
import { RiOrganizationChart } from "react-icons/ri";
import { FiUsers, FiCalendar, FiClock, FiActivity } from "react-icons/fi";

// Services
import { getEmployees } from "@/services/employeeService";
import { getAllLeaveRequests } from "@/services/leaveService";
import { getAllAnnouncements } from "@/services/announcementService";
import { getStats as getAttendanceStats } from "@/services/attendanceService";
import { toast } from "react-hot-toast";

// ─── Constants & Styles ───────────────────────────────────────────────────────

const COLORS = {
  primary: "#6366f1",
  secondary: "#a855f7",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#0ea5e9",
};

const QUICK_ACTIONS = [
  { id: "leaves", label: "Approve Leaves", icon: <CheckSquare size={20} />, color: "bg-indigo-500", primary: true, href: "operations/leaveManagement" },
  { id: "hierarchy", label: "Org Chart", icon: <RiOrganizationChart size={20} />, color: "bg-violet-500", href: "operations/hrm-orm-hierary" },
  { id: "attendance", label: "Regularize", icon: <Clock size={20} />, color: "bg-emerald-500", href: "operations/attendance/overview" },
  { id: "team", label: "Team Directory", icon: <Users size={20} />, color: "bg-blue-500", href: "operations/employeemanagement/employee-list" },
];

// ─── Shared Components ────────────────────────────────────────────────────────

function GlassCard({ children, className = "", noPadding = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-2xl ${noPadding ? "" : "p-5"} ${className}`}
    >
      {children}
    </motion.div>
  );
}

function StatCard({ title, value, subtext, icon: Icon, color, trend, loading }) {
  return (
    <GlassCard className="group relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-[0.03] transition-transform duration-500 group-hover:scale-150`} style={{ backgroundColor: color }} />
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl flex items-center justify-center`} style={{ backgroundColor: `${color}15`, color }}>
          <Icon size={22} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${trend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
            <TrendingUp size={12} className={trend < 0 ? "rotate-180" : ""} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
      {loading ? (
        <div className="h-9 w-24 bg-gray-100 animate-pulse rounded-lg mt-1" />
      ) : (
        <h3 className="text-3xl font-black text-gray-800 mt-1">{value}</h3>
      )}
      <p className="text-[11px] text-gray-500 font-bold mt-2 flex items-center gap-1.5 italic">
        <Activity size={12} className="text-indigo-400" />
        {subtext}
      </p>
    </GlassCard>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function ManagerDashboard() {
  const user = useSelector((state) => state.auth.user);
  const tenantId = useTenant();
  
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    attendanceRate: 0,
    activeAnnouncements: 0
  });
  const [team, setTeam] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tenantId) {
      fetchDashboardData();
    }
  }, [tenantId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [empRes, leaveRes, annRes, attRes] = await Promise.all([
        getEmployees(tenantId, 0, 100),
        getAllLeaveRequests(tenantId, 0, 10),
        getAllAnnouncements(tenantId, 0, 5),
        getAttendanceStats()
      ]);

      const employees = empRes.data.content || [];
      const leaves = leaveRes.data.content || [];
      const anns = annRes.data.content || [];
      const attStats = attRes.data || {};

      setTeam(employees.slice(0, 5));
      setLeaveRequests(leaves);
      setAnnouncements(anns);
      
      setStats({
        totalEmployees: empRes.data.totalElements || employees.length,
        pendingLeaves: leaves.filter(l => l.status === "PENDING").length,
        attendanceRate: attStats.attendancePercentage || 0,
        activeAnnouncements: anns.length
      });

    } catch (error) {
      console.error("Dashboard fetch error:", error);
      toast.error("Failed to sync dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-6 font-sans">
      
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">Manager Console</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          </div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">
            {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{user?.firstName || "Manager"}</span>
          </h1>
          <p className="text-sm font-bold text-gray-400 mt-1">Here's what's happening with your team today.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search team analytics..." 
              className="pl-12 pr-6 py-2.5 bg-white border border-gray-100 rounded-xl w-64 lg:w-80 text-sm font-bold shadow-sm outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
            />
          </div>
          <button onClick={fetchDashboardData} className={`w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-all shadow-sm ${loading ? 'animate-spin' : ''}`}>
            <Zap size={20} />
          </button>
        </motion.div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard title="Direct Reports" value={stats.totalEmployees} subtext="Syncing from directory" icon={FiUsers} color={COLORS.primary} loading={loading} />
        <StatCard title="Active Leaves" value={stats.pendingLeaves} subtext="Pending approval" icon={FiCalendar} color={COLORS.warning} loading={loading} />
        <StatCard title="Attendance" value={`${stats.attendanceRate}%`} subtext="Daily avg rate" icon={FiClock} color={COLORS.success} loading={loading} />
        <StatCard title="Announcements" value={stats.activeAnnouncements} subtext="Active internal posts" icon={MegaphoneIcon} color={COLORS.info} loading={loading} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Alerts & Quick Actions */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Recent Leave Requests Panel */}
          <GlassCard className="border-l-8 border-indigo-400">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-500">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-[15px] font-black text-gray-800">Pending Approvals</h3>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Awaiting Action</p>
                </div>
              </div>
              <button className="text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-tighter">View All</button>
            </div>
            <div className="space-y-4">
              {leaveRequests.length > 0 ? (
                leaveRequests.slice(0, 3).map((leave) => (
                  <div key={leave.id} className="flex items-center justify-between p-3.5 bg-gray-50/50 rounded-xl border border-white group hover:bg-white transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs">
                        {leave.employeeName?.split(' ').map(n => n[0]).join('') || 'E'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-600">{leave.employeeName}</p>
                        <p className="text-[11px] text-gray-400 italic">{leave.leaveType} • {leave.startDate}</p>
                      </div>
                    </div>
                    <button className="p-2 bg-indigo-50 text-indigo-600 rounded-lg transition-all hover:bg-indigo-600 hover:text-white">
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic text-center py-4">No pending leave requests.</p>
              )}
            </div>
          </GlassCard>

          {/* Workforce Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard>
              <h3 className="text-[15px] font-black text-gray-800 mb-1">Workforce Pulse</h3>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">Status Distribution</p>
              
              <div className="flex items-end justify-between h-40 gap-4 mb-6">
                {[
                  { label: "Direct", height: "100%", count: stats.totalEmployees, color: "bg-indigo-500" },
                  { label: "Leaves", height: `${(stats.pendingLeaves / (stats.totalEmployees || 1)) * 100}%`, count: stats.pendingLeaves, color: "bg-amber-400" },
                  { label: "Active", height: `${stats.attendanceRate}%`, count: "Synced", color: "bg-violet-500" },
                  { label: "News", height: `${(stats.activeAnnouncements / 10) * 100}%`, count: stats.activeAnnouncements, color: "bg-emerald-500" },
                ].map((bar) => (
                  <div key={bar.label} className="flex-1 flex flex-col items-center gap-3">
                    <div className="relative w-full flex flex-col justify-end h-full">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: bar.height }}
                        className={`w-full rounded-lg ${bar.color} shadow-lg`}
                      />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase">{bar.label}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-[15px] font-black text-gray-800 mb-1">Quick Tasks</h3>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">Manager Toolkit</p>
              <div className="grid grid-cols-2 gap-4">
                {QUICK_ACTIONS.map((action) => (
                  <motion.button
                    key={action.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.href = `/${tenantId}/manager/${action.href}`}
                    className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white border border-gray-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer text-center"
                  >
                    <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                      {action.id === "hierarchy" ? <RiOrganizationChart size={24} /> : action.icon}
                    </div>
                    <span className="text-[11px] font-black text-gray-600 uppercase tracking-tighter leading-tight">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Right Column: Team List & News */}
        <div className="space-y-6">
          
          {/* Team Snapshot */}
          <GlassCard noPadding className="overflow-hidden">
            <div className="p-6 border-b border-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-black text-gray-800">Team Members</h3>
                <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Zap size={16} />
                </span>
              </div>
            </div>
            <div className="p-2">
              {team.length > 0 ? (
                team.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs">
                        {member.firstName?.[0]}{member.lastName?.[0]}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${member.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[13px] font-black text-gray-800">{member.firstName} {member.lastName}</h4>
                      <p className="text-[11px] font-bold text-gray-400">{member.department || 'Employee'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-gray-400 italic text-center py-4">No team members found.</p>
              )}
            </div>
            <div className="p-4 bg-indigo-50/50 flex items-center justify-center">
              <button onClick={() => window.location.href = `/${tenantId}/manager/operations/employeemanagement/employee-list`} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View All</button>
            </div>
          </GlassCard>

          {/* Announcements */}
          <GlassCard className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-none shadow-indigo-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                <MegaphoneIcon size={20} />
              </div>
              <h3 className="text-[15px] font-black">Company News</h3>
            </div>
            <div className="space-y-6">
              {announcements.length > 0 ? (
                announcements.map((ann) => (
                  <div key={ann.id} className="pb-6 border-b border-white/10 last:border-0 last:pb-0">
                    <span className="text-[9px] font-black bg-amber-400 text-amber-950 px-2 py-0.5 rounded-md uppercase tracking-widest mb-2 inline-block">{ann.type || 'NOTICE'}</span>
                    <h4 className="text-sm font-black mb-1">{ann.title}</h4>
                    <p className="text-xs text-indigo-100 font-bold leading-relaxed truncate">{ann.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-indigo-200 italic">No recent announcements.</p>
              )}
            </div>
            <button className="w-full mt-6 py-3 bg-white text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-all">
              All Announcements
            </button>
          </GlassCard>
        </div>
      </div>

    </div>
  );
}


