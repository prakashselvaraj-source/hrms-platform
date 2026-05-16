"use client";
import { useEffect, useState } from "react";
import {
  Pencil, BadgeCheck, MapPin, Mail, MessageSquare, Sun, Menu, X,
  LayoutGrid, BarChart2, TrendingUp, Clock, ChevronRight, Zap,
  Calendar, Award, Target, ArrowUpRight, Sparkles, User, Bell, Search,
  Settings, LogOut, ChevronDown, Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTenant } from "@/hooks/useTenant";
import ApplyLeaveManagement from "./tabs/ApplyLeaveManagement";
import AttendenceReport from "./tabs/AttendenceReport";
import RequestStatus from "./tabs/RequestStatus";
import UpcomingHolidays from "./tabs/UpcomingHolidays";
import CareerHistory from "./tabs/CareerHistory";
import DesignMember from "./components/DesignMember";
import ReportingManager from "./components/ReportingManager";
import ProfileCard from "./components/ProfileCard";
import ThemeToggle from "@/components/ui/theme-toggle";
import { useSelector } from "react-redux";

const leaveTabs = ["Apply Leaves", "Attendance Report", "Request Status", "Upcoming Holidays", "Career History"];

const GlobalStyles = () => (
  <style>{`
     /* ── Nav tab ── */
    .nav-tab {
      padding: 6px 16px;
      margin: 8px 0;
      font-size: 13px;
      font-weight: 600;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      transition: all 0.18s ease;
      background: transparent;
      color: #64748b;
      letter-spacing: 0.01em;
    }
    .nav-tab:hover { background: #f1f3ff; color: #4f46e5; }
    .nav-tab.active { background: #eff1ff; color: #4338ca; }

    `}</style>
)

/* ── Tab Icons ── */
const TAB_ICONS = {
  "Apply Leaves": <Calendar size={14} />,
  "Attendance Report": <BarChart2 size={14} />,
  "Request Status": <Clock size={14} />,
  "Upcoming Holidays": <Sun size={14} />,
  "Career History": <TrendingUp size={14} />,
};

function SidebarContent() {
  return (
    <div className="flex flex-col gap-6">
      <ProfileCard />
      <DesignMember />
      <ReportingManager />
    </div>
  );
}

export default function HROverview() {
  const [activeLeaveTab, setActiveLeaveTab] = useState("Apply Leaves");
  const [activeTab, setActiveTab] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();
  const tenantId = useTenant();

  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-300">
      <GlobalStyles />
      {/* ── TOP NAVIGATION (ENTERPRISE STYLE) ── */}
      {/* ══ TOP NAV ══ */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(99,102,241,0.08)",
        boxShadow: "0 1px 0 rgba(99,102,241,0.05)",
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Left: Logo + Tabs */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px 14px 0", flexShrink: 0 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 12px rgba(99,102,241,0.35)",
              }}>
                <span style={{ color: "white", fontSize: 11, fontWeight: 900, fontFamily: "'Bricolage Grotesque', system-ui", letterSpacing: 0.5 }}>HR</span>
              </div>
              <span className="display-font" style={{ fontSize: 16, fontWeight: 800, color: "#1a1d27", letterSpacing: "-0.03em" }}>
                WorkSpace
              </span>
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: 22, background: "#e8eaff", margin: "0 4px" }} className="hidden sm:block" />

            {/* Desktop tabs */}
            <div className="hidden sm:flex" style={{ gap: 2 }}>
              {["Overview", "Dashboard"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    router.push(
                      tab === "Overview"
                        ? `/${tenantId}/home/overview`
                        : `/${tenantId}/home/${tab.toLowerCase()}`
                    );
                  }}
                  className={`nav-tab${activeTab === tab ? " active" : ""}`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Right: actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {/* Bell */}


            <ThemeToggle />

          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="mobile-menu sm:hidden" style={{
            borderTop: "1px solid #eef0f8",
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(20px)",
          }}>
            {["Overview", "Dashboard"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setMenuOpen(false);
                  router.push(
                    tab === "Overview"
                      ? `/${tenantId}/home/overview`
                      : `/${tenantId}/home/${tab.toLowerCase()}`
                  );
                }}
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  padding: "12px 24px", fontSize: 13, fontWeight: 600,
                  border: "none", cursor: "pointer", transition: "all 0.15s",
                  color: activeTab === tab ? "#4338ca" : "#64748b",
                  background: activeTab === tab ? "#eff1ff" : "transparent",
                }}>
                {tab}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ── MAIN LAYOUT ── */}
      < div className="max-w-[1600px] mx-auto w-full px-6 py-8" >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

          {/* Main Content Area */}
          <main className="flex flex-col gap-8">

            {/* CLEAN HEADER SECTION */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Overview</h1>
                <p className="text-slate-500 text-[14px]">
                  Welcome back, {user?.firstName || user?.name || "User"}. Here's what's happening today.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                  <Calendar size={16} />
                  Schedule
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-[13px] font-semibold text-white hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-100">
                  <Plus size={16} />
                  Apply Leave
                </button>
              </div>
            </div>

            {/* SUMMARY CARDS (CLEAN & PROFESSIONAL) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: "Available Balance", value: "14 Days", icon: <Calendar className="text-indigo-600" />, trend: "+2 this month", color: "bg-indigo-50" },
                { label: "Active Requests", value: "03", icon: <Clock className="text-amber-600" />, trend: "2 pending", color: "bg-amber-50" },
                { label: "Team Pulse", value: "98%", icon: <Zap className="text-emerald-600" />, trend: "Steady", color: "bg-emerald-50" }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
                    <span className="text-[12px] font-medium text-slate-500">{stat.trend}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* TABBED MODULE SECTION */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Tab Header */}
              <div className="px-6 border-b border-slate-200 bg-white">
                <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
                  {leaveTabs.map((tab) => {
                    const isActive = activeLeaveTab === tab;
                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveLeaveTab(tab)}
                        className={`relative py-4 text-[13px] font-semibold transition-all whitespace-nowrap ${isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        <div className="flex items-center gap-2">
                          {TAB_ICONS[tab]}
                          {tab}
                        </div>
                        {isActive && (
                          <motion.div layoutId="active-tab-border" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab Content Area */}
              <div className="min-h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeLeaveTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    {activeLeaveTab === "Apply Leaves" && <ApplyLeaveManagement />}
                    {activeLeaveTab === "Attendance Report" && <AttendenceReport />}
                    {activeLeaveTab === "Request Status" && <RequestStatus />}
                    {activeLeaveTab === "Upcoming Holidays" && <UpcomingHolidays />}
                    {activeLeaveTab === "Career History" && <CareerHistory />}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Module Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[12px] font-medium text-slate-500">Updated 2 minutes ago</span>
                <button className="text-[12px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">Export Report</button>
              </div>
            </section>
          </main>

          {/* SIDEBAR (PROFESSIONAL & COMPACT) */}
          <aside className="hidden lg:flex flex-col gap-6">
            <SidebarContent />
          </aside>

        </div>
      </div >

      {/* MOBILE DRAWER */}
      < AnimatePresence >
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[130] bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed top-0 right-0 h-full w-[320px] z-[140] bg-white p-6 overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <span className="text-lg font-bold">Menu</span>
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 transition-all text-slate-400"><X size={20} /></button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )
        }
      </AnimatePresence >
    </div >
  );
}