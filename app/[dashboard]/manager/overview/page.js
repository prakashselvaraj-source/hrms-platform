"use client";
import { useState } from "react";
import {
  Pencil, BadgeCheck, MapPin, Mail, MessageSquare, Sun, Menu, X,
  MenuIcon,
} from "lucide-react";
import ThemeToggle from "@/components/ui/theme-toggle";
import { useRouter, useParams } from "next/navigation";

const leaveTabs = ["Apply Leaves", "Attendance Report", "Request Status", "Upcoming Holidays", "Career History"];

const leaveRows = [
  { type: "Casual Leave", available: 2, booked: "-" },
  { type: "Sick Leave", available: 5, booked: "2" },
  { type: "Earned Leave", available: 8, booked: "-" },
  { type: "Maternity Leave", available: 0, booked: "-" },
  { type: "Comp Off", available: 1, booked: "-" },
];

const teamMembers = [
  { name: "Alex Rivera", role: "UX Researcher", online: true, color: "#6366f1" },
  { name: "Sarah Chen", role: "Visual Designer", online: false, color: "#8b5cf6" },
  { name: "Elena Rodriguez", role: "Design Systems", online: true, color: "#06b6d4" },
];

function LeafSVG() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="var(--icon-leave-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

function Avatar({ name, color, size = 36 }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2);
  return (
    <div
      style={{ width: size, height: size, background: color, flexShrink: 0 }}
      className="rounded-full flex items-center justify-center text-white font-semibold text-xs"
    >
      {initials}
    </div>
  );
}

function SidebarContent({ teamMembers }) {
  return (
    <>
      {/* Profile Card */}
      <div
        className="rounded-2xl p-5 flex-shrink-0 border-l-4"
        style={{
          background: "var(--surface-card)",
          borderLeftColor: "var(--border-accent)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-col gap-3">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ background: "linear-gradient(135deg, #a78bfa, #ec4899)" }}
            >
              SS
            </div>
            <div>
              <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                Shivani Singh
              </h3>
              <p className="text-xs font-medium" style={{ color: "var(--brand-primary)" }}>
                Product Designer · Design Dept
              </p>
            </div>
          </div>
          <button className="transition-colors mt-1" style={{ color: "var(--brand-primary)" }}>
            <Pencil size={14} />
          </button>
        </div>

        <div className="space-y-2 mb-4">
          {[
            { icon: <BadgeCheck size={14} />, text: "EMP-1024" },
            { icon: <MapPin size={14} />, text: "New York HQ" },
            { icon: <Mail size={14} />, text: "shivani.s@company.com" },
          ].map(({ icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 text-xs rounded-lg px-2 py-1.5 w-fit"
              style={{ background: "var(--surface-muted)", color: "var(--text-secondary)" }}
            >
              <span style={{ color: "var(--text-muted)" }}>{icon}</span>
              <span className="truncate max-w-[180px]">{text}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            className="flex-1 text-white text-xs font-bold py-2.5 rounded-lg transition-colors"
            style={{ background: "var(--brand-accent)" }}
          >
            Edit Profile
          </button>
          <button
            className="flex-1 text-xs font-bold py-2.5 rounded-lg border transition-colors"
            style={{ borderColor: "var(--brand-accent)", color: "var(--brand-accent)" }}
          >
            View ID Card
          </button>
        </div>
      </div>

      {/* Team Members */}
      <div
        className="rounded-2xl p-5 flex-shrink-0 border-l-4"
        style={{
          background: "var(--surface-card)",
          borderLeftColor: "var(--border-accent)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              Design Members
            </h4>
            <p
              className="text-[10px] uppercase tracking-wide font-semibold mt-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              Your Core Team
            </p>
          </div>
          <button
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: "var(--brand-primary)" }}
          >
            See All
          </button>
        </div>

        <div className="space-y-3">
          {teamMembers.map((m) => (
            <div key={m.name} className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <Avatar name={m.name} color={m.color} size={36} />
                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 ${m.online ? "bg-green-400" : "bg-gray-300"
                    }`}
                  style={{ borderColor: "var(--surface-card)" }}
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                  {m.name}
                </p>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                  {m.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          className="mt-4 w-full text-xs font-semibold py-2.5 rounded-lg border transition-all"
          style={{
            background: "var(--surface-muted)",
            borderColor: "var(--border-default)",
            color: "var(--text-secondary)",
          }}
        >
          Request Collaboration
        </button>
      </div>

      {/* Reporting Manager */}
      <div
        className="rounded-2xl p-5 flex-shrink-0 border-l-4"
        style={{
          background: "var(--surface-card)",
          borderLeftColor: "var(--border-accent)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <h4 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
          Reporting Manager
        </h4>
        <p
          className="text-[10px] uppercase tracking-widest font-semibold mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Direct Supervisor
        </p>

        <div
          className="flex items-center gap-3 rounded-xl px-3 py-3"
          style={{ background: "var(--surface-muted)" }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #fbbf24, #f97316)" }}
          >
            MT
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              Marcus Thorne
            </p>
            <p
              className="text-[10px] uppercase tracking-widest font-semibold"
              style={{ color: "var(--brand-primary)" }}
            >
              Director of Design
            </p>
          </div>
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all flex-shrink-0"
            style={{ background: "var(--surface-card)", color: "var(--brand-primary)" }}
          >
            <MessageSquare size={14} />
          </button>
        </div>
      </div>
    </>
  );
}

export default function HRDashboard() {
  const params = useParams();
  const tenantId = params?.dashboard;

  const [activeLeaveTab, setActiveLeaveTab] = useState("Apply Leaves");
  const [menuOpen, setMenuOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleApplyHover = (e, entering) => {
    e.currentTarget.style.background = entering ? "var(--brand-accent)" : "transparent";
    e.currentTarget.style.color = entering ? "#fff" : "var(--brand-accent)";
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "var(--surface-page)", color: "var(--text-primary)" }}
    >
      {/* Top page tabs */}
      <div
        className="border-b px-4 sm:px-6"
        style={{ backgroundColor: "var(--nav-bg)", borderColor: "var(--nav-border)" }}
      >
        <div className="flex items-center justify-between">
          {/* Tabs – hidden on mobile */}
          <div className="hidden sm:flex">
            {["Overview", "Dashboard"].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); console.log(tab); router.push(tab === "Overview" ? `/${tenantId}/manager/overview` : `/${tenantId}/manager/${tab.toLowerCase()}`) }}
                className="px-4 py-3 text-[13px] font-medium border-b-2 transition-colors cursor-pointer bg-transparent outline-none"
                style={{
                  borderBottomColor: activeTab === tab ? "var(--tab-active-border)" : "transparent",
                  color: activeTab === tab ? "var(--tab-active-text)" : "var(--tab-inactive-text)",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Mobile: app name + hamburger */}
          <div className="flex sm:hidden items-center justify-between w-full py-3">
            <span className="text-[14px] font-semibold" style={{ color: "var(--tab-active-text)" }}>
              HR Dashboard
            </span>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 rounded-md">
              <MenuIcon />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div
            className="sm:hidden border-t pb-2"
            style={{ borderColor: "var(--divider)", backgroundColor: "var(--surface-overlay)" }}
          >
            {["Overview", "Dashboard"].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setMenuOpen(false); }}
                className="block w-full text-left px-4 py-2.5 text-[13px] font-medium cursor-pointer border-0 transition"
                style={{
                  color: activeTab === tab ? "var(--tab-active-text)" : "var(--tab-inactive-text)",
                  backgroundColor: activeTab === tab ? "var(--mobile-menu-active-bg)" : "transparent",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 gap-4 p-3 md:p-6 min-w-0 relative">

        {/* Mobile FAB toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg"
          style={{ background: "var(--brand-accent)" }}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile sidebar drawer */}
        <aside
          className={`lg:hidden fixed top-0 right-0 h-full z-40 w-80 max-w-[90vw] overflow-y-auto p-4 flex flex-col gap-4 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "translate-x-full"
            }`}
          style={{ background: "var(--surface-page)" }}
        >
          <div className="pt-14">
            <SidebarContent teamMembers={teamMembers} />
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">

          {/* Greeting Banner */}
          <div
            className="relative rounded-2xl p-5 md:p-8 flex items-center min-h-[110px] md:min-h-[130px] flex-shrink-0 overflow-hidden"
            style={{ background: "var(--brand-gradient)" }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none select-none">
              <div className="absolute right-32 top-4 w-28 h-28 rounded-full border border-white/10" />
              <div className="absolute right-16 bottom-2 w-16 h-16 rounded-full border border-white/10" />
              <div className="absolute right-10 top-10 w-8 h-8 rounded-full bg-white/5" />
              <div className="absolute right-48 bottom-6 w-10 h-10 rounded-full bg-white/5" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 backdrop-blur-md bg-white/20 rounded-lg px-3 py-1.5 w-fit">
                <Sun size={14} className="text-white" />
                <span className="text-white/80 text-xs font-semibold tracking-widest uppercase">
                  New Day, New Goals
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                Good morning, Shivani!{" "}
                <span className="hidden sm:inline">
                  <br />
                  Have a great day 🌟
                </span>
              </h1>
            </div>
          </div>

          {/* Leave section */}
          <div className="rounded-xl overflow-hidden" style={{ background: "var(--surface-muted)" }}>

            {/* Scrollable tabs */}
            <div
              className="flex overflow-x-auto gap-1 px-2 py-2 border-b scrollbar-hide"
              style={{ borderColor: "var(--border-default)" }}
            >
              {leaveTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveLeaveTab(tab)}
                  className="px-3 md:px-4 py-2 text-[10px] md:text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex-shrink-0 rounded-xl"
                  style={{
                    background: activeLeaveTab === tab ? "var(--surface-card)" : "transparent",
                    color: activeLeaveTab === tab ? "var(--brand-primary)" : "var(--text-muted)",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Leave table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ minWidth: "400px" }}>
                <tbody>
                  {leaveRows.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b last:border-0 transition-colors"
                      style={{
                        background: "var(--surface-card)",
                        borderColor: "var(--border-default)",
                      }}
                    >
                      {/* Leave type */}
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: "var(--icon-leave-bg)" }}
                          >
                            <LeafSVG />
                          </div>
                          <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                            {row.type}
                          </span>
                        </div>
                      </td>

                      {/* Available */}
                      <td className="text-center px-4 md:px-6 py-3 md:py-4">
                        <p className="font-bold" style={{ color: "var(--text-primary)" }}>
                          {row.available}
                        </p>
                        <p className="text-[10px]" style={{ color: "var(--text-hint)" }}>
                          Days
                        </p>
                      </td>

                      {/* Booked — hidden on xs */}
                      <td
                        className="text-center px-4 md:px-6 py-3 md:py-4 font-bold hidden sm:table-cell"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {row.booked}
                      </td>

                      {/* Apply button */}
                      <td className="text-center px-4 md:px-6 py-3 md:py-4">
                        <button
                          className="text-xs font-bold uppercase tracking-wider px-3 md:px-4 py-2 rounded-lg border transition-all whitespace-nowrap"
                          style={{
                            borderColor: "var(--brand-accent)",
                            color: "var(--brand-accent)",
                            background: "transparent",
                          }}
                          onMouseEnter={(e) => handleApplyHover(e, true)}
                          onMouseLeave={(e) => handleApplyHover(e, false)}
                        >
                          Apply Now
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Desktop sidebar */}
        <aside className="hidden lg:flex flex-col gap-4 w-72 xl:w-80 flex-shrink-0">
          <SidebarContent teamMembers={teamMembers} />
        </aside>
      </div>
    </div>
  );
}