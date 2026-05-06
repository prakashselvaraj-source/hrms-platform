"use client";
import { useState } from "react";
import {
  Pencil, BadgeCheck, MapPin, Mail, MessageSquare, Sun, Menu, X,
} from "lucide-react";
import ThemeToggle from "@/components/ui/theme-toggle";
import { useRouter } from "next/navigation";
import { useTenant } from "@/hooks/useTenant";

const leaveTabs = ["Apply Leaves", "Attendance Report", "Request Status", "Upcoming Holidays", "Career History"];

const leaveRows = [
  { type: "Casual Leave",    available: 2, booked: "-",  pct: 20 },
  { type: "Sick Leave",      available: 5, booked: "2",  pct: 50 },
  { type: "Earned Leave",    available: 8, booked: "-",  pct: 80 },
  { type: "Maternity Leave", available: 0, booked: "-",  pct: 0  },
  { type: "Comp Off",        available: 1, booked: "-",  pct: 10 },
];

const teamMembers = [
  { name: "Alex Rivera",      role: "UX Researcher",    online: true,  color: "#6366f1" },
  { name: "Sarah Chen",       role: "Visual Designer",  online: false, color: "#8b5cf6" },
  { name: "Elena Rodriguez",  role: "Design Systems",   online: true,  color: "#06b6d4" },
];

/* ── Icons ── */
function LeafSVG() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="var(--icon-leave-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  );
}

/* ── Avatar ── */
function Avatar({ name, color, size = 36 }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2);
  return (
    <div style={{ width: size, height: size, background: color, flexShrink: 0 }}
      className="rounded-full flex items-center justify-center text-white font-bold text-xs">
      {initials}
    </div>
  );
}

/* ── Stat Chip ── */
function StatChip({ value, label, active }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl px-4 py-2.5 text-center"
      style={{
        backgroundColor: active ? "var(--brand-accent)" : "var(--surface-muted)",
        border: `1px solid ${active ? "var(--brand-accent)" : "var(--border-default)"}`,
      }}>
      <span className="text-lg font-black leading-none" style={{ color: active ? "#fff" : "var(--text-primary)" }}>
        {value}
      </span>
      <span className="text-[9px] font-bold uppercase tracking-widest mt-1"
        style={{ color: active ? "rgba(255,255,255,0.75)" : "var(--text-muted)" }}>
        {label}
      </span>
    </div>
  );
}

/* ── Sidebar Card wrapper ── */
function SideCard({ children }) {
  return (
    <div className="rounded-2xl p-5 flex-shrink-0"
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-default)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
      }}>
      {children}
    </div>
  );
}

/* ── Sidebar ── */
function SidebarContent({ teamMembers }) {
  return (
    <>
      {/* ── Profile Card ── */}
      <SideCard>
        {/* Top strip accent */}
        <div className="h-1 -mx-5 -mt-5 mb-5 rounded-t-2xl"
          style={{ background: "var(--brand-gradient)" }} />

        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #a78bfa, #ec4899)" }}>
              SS
            </div>
            <div>
              <h3 className="text-sm font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
                Shivani Singh
              </h3>
              <p className="text-[11px] font-semibold mt-0.5" style={{ color: "var(--brand-primary)" }}>
                Product Designer
              </p>
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                Design Dept
              </p>
            </div>
          </div>
          <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
            style={{ background: "var(--surface-muted)", color: "var(--brand-primary)" }}>
            <Pencil size={12} />
          </button>
        </div>

        {/* Info pills */}
        <div className="space-y-2 mb-5">
          {[
            { icon: <BadgeCheck size={13} />, text: "EMP-1024" },
            { icon: <MapPin size={13} />,     text: "New York HQ" },
            { icon: <Mail size={13} />,        text: "shivani.s@company.com" },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2.5 text-xs rounded-xl px-3 py-2"
              style={{ background: "var(--surface-muted)", color: "var(--text-secondary)" }}>
              <span style={{ color: "var(--text-muted)" }}>{icon}</span>
              <span className="truncate">{text}</span>
            </div>
          ))}
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <StatChip value="4.2" label="Rating" />
          <StatChip value="32" label="Projects" active />
          <StatChip value="6yr" label="Tenure" />
        </div>

        <div className="flex gap-2">
          <button className="flex-1 text-white text-xs font-bold py-2.5 rounded-xl transition-all"
            style={{ background: "var(--brand-accent)" }}>
            Edit Profile
          </button>
          <button className="flex-1 text-xs font-bold py-2.5 rounded-xl border transition-all"
            style={{ borderColor: "var(--brand-accent)", color: "var(--brand-accent)", background: "transparent" }}>
            View ID Card
          </button>
        </div>
      </SideCard>

      {/* ── Team Members ── */}
      <SideCard>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Design Members</h4>
            <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: "var(--text-muted)" }}>
              Your Core Team
            </p>
          </div>
          <button className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg"
            style={{ background: "var(--surface-muted)", color: "var(--brand-primary)" }}>
            See All
          </button>
        </div>

        <div className="space-y-3">
          {teamMembers.map((m) => (
            <div key={m.name} className="flex items-center gap-3 p-2.5 rounded-xl transition-colors hover:bg-opacity-60"
              style={{ background: "var(--surface-muted)" }}>
              <div className="relative flex-shrink-0">
                <Avatar name={m.name} color={m.color} size={34} />
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 ${m.online ? "bg-green-400" : "bg-gray-300"}`}
                  style={{ borderColor: "var(--surface-muted)" }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>{m.name}</p>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{m.role}</p>
              </div>
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: m.online ? "#4ade80" : "var(--border-default)" }} />
            </div>
          ))}
        </div>

        <button className="mt-4 w-full text-xs font-semibold py-2.5 rounded-xl border transition-all"
          style={{ background: "transparent", borderColor: "var(--border-default)", color: "var(--text-secondary)" }}>
          Request Collaboration
        </button>
      </SideCard>

      {/* ── Reporting Manager ── */}
      <SideCard>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Reporting Manager</h4>
            <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: "var(--text-muted)" }}>
              Direct Supervisor
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl p-4"
          style={{ background: "var(--surface-muted)", border: "1px solid var(--border-subtle)" }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #fbbf24, #f97316)" }}>
            MT
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Marcus Thorne</p>
            <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "var(--brand-primary)" }}>
              Director of Design
            </p>
          </div>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
            style={{ background: "var(--surface-card)", color: "var(--brand-primary)", border: "1px solid var(--border-default)" }}>
            <MessageSquare size={14} />
          </button>
        </div>
      </SideCard>
    </>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */
export default function HROverview() {
  const [activeLeaveTab, setActiveLeaveTab] = useState("Apply Leaves");
  const [menuOpen, setMenuOpen]   = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const tenantId = useTenant();

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--surface-page)", color: "var(--text-primary)" }}>

      {/* ── Top Nav ── */}
      <div className="sticky top-0 z-30 border-b px-4 sm:px-8"
        style={{ backgroundColor: "var(--nav-bg)", borderColor: "var(--nav-border)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center justify-between max-w-9xl mx-auto">
          <div className="hidden sm:flex">
            {["Overview", "Dashboard"].map((tab) => (
              <button key={tab}
                onClick={() => { setActiveTab(tab); router.push(tab === "Overview" ? `/${tenantId}/home/overview` : `/${tenantId}/home/${tab.toLowerCase()}`); }}
                className="px-5 py-3.5 text-[13px] font-semibold border-b-2 transition-all cursor-pointer bg-transparent outline-none"
                style={{
                  borderBottomColor: activeTab === tab ? "var(--tab-active-border)" : "transparent",
                  color: activeTab === tab ? "var(--tab-active-text)" : "var(--tab-inactive-text)",
                  letterSpacing: "0.01em",
                }}>
                {tab}
              </button>
            ))}
          </div>
          <div className="flex sm:hidden items-center justify-between w-full py-3.5">
            <span className="text-[14px] font-bold" style={{ color: "var(--tab-active-text)" }}>HR Overview</span>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 rounded-md">
              <Menu size={20} style={{ color: "var(--text-muted)" }} />
            </button>
          </div>
          <div className="hidden sm:block py-2"><ThemeToggle /></div>
        </div>
        {menuOpen && (
          <div className="sm:hidden border-t pb-2"
            style={{ borderColor: "var(--divider)", backgroundColor: "var(--surface-overlay)" }}>
            {["Overview", "Dashboard"].map((tab) => (
              <button key={tab}
                onClick={() => { setActiveTab(tab); setMenuOpen(false); }}
                className="block w-full text-left px-4 py-2.5 text-[13px] font-semibold cursor-pointer border-0 transition"
                style={{
                  color: activeTab === tab ? "var(--tab-active-text)" : "var(--tab-inactive-text)",
                  backgroundColor: activeTab === tab ? "var(--mobile-menu-active-bg)" : "transparent",
                }}>
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 gap-6 p-4 sm:p-6 lg:p-8 min-w-0 relative max-w-9xl mx-auto w-full">

        {/* Mobile FAB */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl"
          style={{ background: "var(--brand-accent)" }}>
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)} />
        )}

        {/* Mobile sidebar drawer */}
        <aside className={`lg:hidden fixed top-0 right-0 h-full z-50 w-80 max-w-[90vw] overflow-y-auto p-4 flex flex-col gap-4 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}
          style={{ background: "var(--surface-page)" }}>
          <div className="pt-16 space-y-4">
            <SidebarContent teamMembers={teamMembers} />
          </div>
        </aside>

        {/* ── Main Content ── */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">

          {/* Mobile ThemeToggle */}
          <div className="sm:hidden flex justify-end"><ThemeToggle /></div>

          {/* ── Hero Banner ── */}
          <div className="relative rounded-2xl overflow-hidden"
            style={{ background: "var(--brand-gradient)", minHeight: "140px" }}>
            {/* Decorative rings */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2 w-40 h-40 rounded-full pointer-events-none"
              style={{ border: "1.5px solid rgba(255,255,255,0.12)" }} />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full pointer-events-none"
              style={{ border: "1.5px solid rgba(255,255,255,0.1)" }} />
            <div className="absolute right-28 bottom-4 w-10 h-10 rounded-full pointer-events-none"
              style={{ background: "rgba(255,255,255,0.06)" }} />

            <div className="relative z-10 px-6 sm:px-8 py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}>
                    <Sun size={12} className="text-white" />
                    <span className="text-white/80 text-[10px] font-bold tracking-[0.12em] uppercase">
                      New Day, New Goals
                    </span>
                  </div>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                  Good morning, Shivani! 🌟
                </h1>
                <p className="text-white/65 text-sm mt-1 font-medium">
                  Tuesday — here's your workspace at a glance.
                </p>
              </div>

              {/* Quick stats in banner */}
              <div className="flex gap-2.5 flex-shrink-0">
                {[
                  { v: "16", l: "Days Off Left" },
                  { v: "3",  l: "Pending Tasks" },
                  { v: "92%",l: "Attendance" },
                ].map(({ v, l }) => (
                  <div key={l} className="flex flex-col items-center rounded-xl px-3.5 py-2.5"
                    style={{ background: "rgba(255,255,255,0.16)", backdropFilter: "blur(10px)" }}>
                    <span className="text-white font-black text-lg leading-none">{v}</span>
                    <span className="text-white/65 text-[9.5px] font-bold uppercase tracking-wider mt-0.5 whitespace-nowrap">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Leave Section ── */}
          <div className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-default)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
            }}>

            {/* Section header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4"
              style={{ borderBottom: "1px solid var(--border-default)" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "var(--icon-leave-bg)" }}>
                  <LeafSVG />
                </div>
                <span className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>Leave Management</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ background: "var(--accent-subtle)", color: "var(--accent-text)" }}>
                FY 2024–25
              </span>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto gap-1 px-4 py-2.5"
              style={{ borderBottom: "1px solid var(--border-default)", background: "var(--surface-muted)" }}>
              {leaveTabs.map((tab) => (
                <button key={tab}
                  onClick={() => setActiveLeaveTab(tab)}
                  className="px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all flex-shrink-0 rounded-xl"
                  style={{
                    background: activeLeaveTab === tab ? "var(--surface-card)" : "transparent",
                    color: activeLeaveTab === tab ? "var(--brand-primary)" : "var(--text-muted)",
                    boxShadow: activeLeaveTab === tab ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  }}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Table header */}
            <div className="hidden sm:grid grid-cols-[1fr_120px_120px_140px] gap-4 px-6 py-3"
              style={{ borderBottom: "1px solid var(--border-default)", background: "var(--surface-muted)" }}>
              {["Leave Type", "Available", "Booked", ""].map((h, i) => (
                <p key={i} className={`text-[10px] font-bold uppercase tracking-widest ${i > 0 ? "text-center" : ""}`}
                  style={{ color: "var(--text-muted)" }}>
                  {h}
                </p>
              ))}
            </div>

            {/* Rows */}
            <div>
              {leaveRows.map((row, i) => (
                <div key={i}
                  className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_120px_120px_140px] gap-4 items-center px-6 py-4 group transition-colors"
                  style={{
                    borderBottom: i < leaveRows.length - 1 ? "1px solid var(--border-default)" : "none",
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--surface-muted)"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>

                  {/* Leave type */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--icon-leave-bg)" }}>
                      <LeafSVG />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>
                        {row.type}
                      </p>
                      {/* mobile available label */}
                      <p className="text-[10px] sm:hidden mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {row.available} days available
                      </p>
                      {/* usage bar */}
                      <div className="hidden sm:block mt-1.5 w-24 h-1 rounded-full overflow-hidden"
                        style={{ background: "var(--bar-track)" }}>
                        <div className="h-full rounded-full"
                          style={{ width: `${row.pct}%`, background: "var(--bar-primary)" }} />
                      </div>
                    </div>
                  </div>

                  {/* Available */}
                  <div className="hidden sm:flex flex-col items-center justify-center">
                    <p className="text-lg font-black leading-none" style={{ color: "var(--text-primary)" }}>
                      {row.available}
                    </p>
                    <p className="text-[10px] font-medium mt-0.5" style={{ color: "var(--text-muted)" }}>days</p>
                  </div>

                  {/* Booked */}
                  <div className="hidden sm:flex flex-col items-center justify-center">
                    <p className="text-lg font-black leading-none"
                      style={{ color: row.booked !== "-" ? "var(--brand-primary)" : "var(--text-muted)" }}>
                      {row.booked}
                    </p>
                    {row.booked !== "-" && (
                      <p className="text-[10px] font-medium mt-0.5" style={{ color: "var(--text-muted)" }}>booked</p>
                    )}
                  </div>

                  {/* Apply button */}
                  <div className="flex items-center justify-end sm:justify-center">
                    <button
                      className="text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl border transition-all whitespace-nowrap"
                      style={{ borderColor: "var(--brand-accent)", color: "var(--brand-accent)", background: "transparent" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "var(--brand-accent)"; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--brand-accent)"; }}>
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 flex items-center justify-between"
              style={{ borderTop: "1px solid var(--border-default)", background: "var(--surface-muted)" }}>
              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                Showing all leave types · FY 2024–25
              </p>
              <a href="#" className="text-[11px] font-bold hover:underline" style={{ color: "var(--text-link)" }}>
                View leave history →
              </a>
            </div>
          </div>
        </div>

        {/* ── Desktop Sidebar ── */}
        <aside className="hidden lg:flex flex-col gap-4 w-72 xl:w-80 flex-shrink-0">
          <SidebarContent teamMembers={teamMembers} />
        </aside>
      </div>
    </div>
  );
}