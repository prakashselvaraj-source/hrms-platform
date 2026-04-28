"use client";

import ThemeToggle from "@/components/ui/theme-toggle";
import { useRouter } from "next/navigation";
import { useState } from "react";

/* ── Circular Progress ── */
function CircularProgress({ value = 92 }) {
  const size = 96;
  const stroke = 9;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--progress-track)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--progress-fill)" strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold leading-none" style={{ color: "var(--text-primary)" }}>
          {value}%
        </span>
        <span className="text-[10px] mt-0.5" style={{ color: "var(--progress-label)" }}>Tue</span>
      </div>
    </div>
  );
}

/* ── Icons ── */
const CalendarIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-muted)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const TableIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-muted)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
);
const MegaphoneIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-muted)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l19-9-9 19-2-8-8-2z" />
  </svg>
);
const ClockIcon = () => (
  <svg className="w-[18px] h-[18px]" style={{ color: "var(--accent)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
  </svg>
);
const LockIcon = () => (
  <svg className="w-[18px] h-[18px]" style={{ color: "var(--accent)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const TicketIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
  </svg>
);
const MenuIcon = () => (
  <svg className="w-5 h-5" style={{ color: "var(--text-muted)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 12h18M3 6h18M3 18h18" />
  </svg>
);

/* ══════════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════════ */
export default function HRDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
 const router = useRouter();

  const leaveCards = [
    { label: "Sick Leave",   used: "04", total: "10" },
    { label: "Comp Off",     used: "02", total: "05" },
    { label: "Casual Leave", used: "07", total: "14" },
    { label: "Optional",     used: "01", total: "02" },
    { label: "LOP",          used: "00", total: null, lop: true },
  ];

  const attendanceRows = [
    { label: "Total Working Days", val: "22 Days",  highlight: false },
    { label: "Log-in",             val: "09:13 AM", highlight: false },
    { label: "Log-out",            val: "07:12 AM", highlight: false },
    { label: "Duration",           val: "8h 45m",   highlight: true  },
  ];

  /*
   * Announcements use TIER 3 component-level overrides — these tag colors
   * are semantically meaningful (cultural = green, policy = brand purple)
   * and are genuinely unique, so local scoping is correct here.
   */
  const announcements = [
    {
      tag: "Cultural Event",
      tagBg: "var(--status-success-bg)",
      tagColor: "var(--status-success-text)",
      borderColor: "var(--status-success-text)",
      title: "Diwali Celebration Desk Contest",
      desc: "Decorate your workspace by Friday for a chance to win vouchers.",
    },
    {
      tag: "Policy Update",
      tagBg: "var(--accent-subtle)",
      tagColor: "var(--accent-text)",
      borderColor: "var(--border-strong)",
      title: "Updated Remote Work Guidelines",
      desc: "Check the employee handbook for the revised hybrid work model.",
    },
  ];

  const permissions = [
    { icon: <ClockIcon />, label: "Short Permission",   val: "2 Used / 3 Max" },
    { icon: <LockIcon />,  label: "Late Login Allowed", val: "1 Used / 2 Max" },
  ];

  const perfBars = [
    { label: "Productivity",      pct: 94, color: "var(--bar-primary)" },
    { label: "Skill Development", pct: 88, color: "var(--bar-secondary)" },
  ];

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: "var(--surface-page)" }}>

      {/* ── Top Nav / Tab Bar ── */}
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
                onClick={() => {setActiveTab(tab);console.log(tab);router.push(tab==="Overview" ? "/home/overview" : `/home/${tab.toLowerCase()}`)}}
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

      <div className="px-4 sm:px-6 py-4 sm:py-5 max-w-9xl mx-auto">

        <ThemeToggle />

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4 sm:mb-5">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-1.5" style={{ color: "var(--text-primary)" }}>
              Welcome, Alex <span className="text-xl">👋</span>
            </h1>
            <p className="text-lg mt-1" style={{ color: "var(--text-secondary)" }}>
              Here's what's happening at the workspace today.
            </p>
          </div>
          <div className="flex gap-2 sm:mt-1">
            <button
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-[12px] sm:text-[12.5px] font-medium border rounded-lg transition cursor-pointer"
              style={{
                color: "var(--btn-outline-text)",
                backgroundColor: "var(--btn-outline-bg)",
                borderColor: "var(--btn-outline-border)",
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--btn-outline-hover)"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "var(--btn-outline-bg)"}
            >
              Apply Leave
            </button>
            <button
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-[12px] sm:text-[12.5px] font-medium rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer border-0"
              style={{
                color: "var(--btn-primary-text)",
                backgroundColor: "var(--btn-primary-bg)",
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--btn-primary-hover)"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "var(--btn-primary-bg)"}
            >
              <TicketIcon /> Raise Ticket
            </button>
          </div>
        </div>

        {/* ── ROW 1: Leave Report + Attendance Report ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-3.5">

          {/* Leave Report */}
          <div
            className="col-span-2 flex flex-col gap-2 justify-between rounded-xl border-l-4 p-4"
            style={{
              backgroundColor: "var(--surface-card)",
              borderLeftColor: "var(--border-strong)",
              boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)",
            }}
          >
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2 text-[18px] font-bold">
                <CalendarIcon />
                <span style={{ color: "var(--text-primary)"}}>Leave Report</span>
              </div>
              <span
                className="text-[10.5px] font-semibold px-3 py-0.5 rounded-full tracking-wide"
                style={{
                  color: "var(--accent-text)",
                  backgroundColor: "var(--accent-subtle)",
                }}
              >
                ANNUALLY
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {leaveCards.map((c) => (
                <div
                  key={c.label}
                  className="border flex flex-col gap-2 rounded-xl p-3 text-center"
                  style={{
                    backgroundColor: "var(--surface-active)",
                    borderColor: "var(--border-default)",
                  }}
                >
                  <p
                    className="text-[10px] font-medium uppercase tracking-[1px] mb-1.5 leading-tight"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {c.label}
                  </p>
                  {c.lop ? (
                    <>
                      <p className="text-2xl font-bold leading-none" style={{ color: "var(--status-danger-value)" }}>
                        00
                      </p>
                      <p className="text-[8.5px] font-medium mt-1.5" style={{ color: "var(--status-danger-label)" }}>
                        Excellent Standing
                      </p>
                    </>
                  ) : (
                    <p className="text-2xl font-bold leading-none" style={{ color: "var(--text-primary)" }}>
                      {c.used}
                      <span className="text-sm font-medium" style={{ color: "var(--text-subtle)" }}>
                        /{c.total}
                      </span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Attendance Report */}
          <div
            className="rounded-xl p-5 flex flex-col gap-3"
            style={{
              backgroundColor: "var(--surface-card)",
              boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.15)",
            }}
          >
            <div className="flex items-center gap-2 text-[18px] font-bold">
              <TableIcon />
              <span style={{ color: "var(--text-primary)" }}>Attendance Report</span>
            </div>
            <div className="flex gap-5 items-center">
              <CircularProgress value={92} />
              <div className="flex-1 p-4">
                {attendanceRows.map((row) => (
                  <div key={row.label} className="flex justify-between items-baseline mb-[7px]">
                    <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                      {row.label}
                    </span>
                    <span
                      className="text-[12px] font-bold"
                      style={{ color: row.highlight ? "var(--accent)" : "var(--text-primary)" }}
                    >
                      {row.val}
                    </span>
                  </div>
                ))}
                <a
                  href="#"
                  className="text-[12px] font-medium flex justify-end hover:underline"
                  style={{ color: "var(--text-link)" }}
                >
                  view more
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── ROW 2: 4 cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_268px] gap-3.5">

          {/* Quick Announcements */}
          <div
            className="rounded-xl border p-5"
            style={{
              backgroundColor: "var(--surface-card)",
              borderColor: "var(--border-default)",
              boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.06)",
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-1.5 text-[14px] font-semibold">
                <MegaphoneIcon />
                <span className="font-bold" style={{ color: "var(--text-primary)" }}>
                  Quick Announcements
                </span>
              </div>
              <a
                href="#"
                className="text-[10px] font-bold tracking-[1px] hover:underline whitespace-nowrap ml-2"
                style={{ color: "var(--text-link)" }}
              >
                ALL UPDATES
              </a>
            </div>
            <div className="flex flex-col gap-2.5">
              {announcements.map((a, i) => (
                <div
                  key={i}
                  className="pl-2.5 py-3 rounded-lg border-l-[4px]"
                  style={{
                    backgroundColor: "var(--surface-raised)",
                    borderLeftColor: a.borderColor,
                  }}
                >
                  <span
                    className="inline-block text-[10px] font-bold uppercase tracking-[0.07em] py-0.5 rounded-full mb-1.5"
                    style={{ backgroundColor: a.tagBg, color: a.tagColor }}
                  >
                    {a.tag}
                  </span>
                  <p className="text-[12px] font-bold mb-1 leading-snug" style={{ color: "var(--text-primary)" }}>
                    {a.title}
                  </p>
                  <p className="text-[11px] leading-[1.55]" style={{ color: "var(--text-muted)" }}>
                    {a.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Permission Summary */}
          <div
            className="rounded-xl border p-5"
            style={{
              backgroundColor: "var(--surface-card)",
              borderColor: "var(--border-default)",
              boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.06)",
            }}
          >
            <p className="text-[18px] font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              Permission Summary
            </p>
            <div className="flex flex-col gap-2.5">
              {permissions.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 border rounded-xl p-3"
                  style={{
                    backgroundColor: "var(--surface-raised)",
                    borderColor: "var(--border-subtle)",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "var(--surface-card)" }}
                  >
                    {p.icon}
                  </div>
                  <div>
                    <p className="text-[12px] mb-0.5" style={{ color: "var(--text-muted)" }}>
                      {p.label}
                    </p>
                    <p className="text-[14px] font-bold" style={{ color: "var(--text-primary)" }}>
                      {p.val}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Report */}
          <div
            className="flex flex-col gap-3 rounded-xl border p-5"
            style={{
              backgroundColor: "var(--surface-card)",
              borderColor: "var(--border-default)",
              boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.06)",
            }}
          >
            <div>
              <div className="flex items-start justify-between mb-0.5">
                <p className="text-[18px] font-bold" style={{ color: "var(--text-primary)" }}>
                  Performance Report
                </p>
                <span className="text-2xl leading-none" style={{ color: "var(--star-color)" }}>★</span>
              </div>
              <p
                className="text-[11px] mb-3.5 font-semibold tracking-[1px] uppercase"
                style={{ color: "var(--text-muted)" }}
              >
                From HR Team
              </p>
            </div>
            {perfBars.map((b) => (
              <div key={b.label} className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                    {b.label}
                  </span>
                  <span className="text-[12px] font-bold" style={{ color: "var(--text-link)" }}>
                    {b.pct}%
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bar-track)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${b.pct}%`, backgroundColor: b.color }}
                  />
                </div>
              </div>
            ))}
            <p
              className="p-5 text-[12px] italic leading-relaxed border-l-2 pl-2.5 mt-2"
              style={{
                backgroundColor: "var(--callout-bg)",
                borderLeftColor: "var(--callout-border)",
                color: "var(--text-muted)",
              }}
            >
              "Consistently exceeds delivery expectations. Strong potential for leadership tracks."
            </p>
          </div>

          {/* Upcoming Birthdays */}
          <div className="sm:col-span-2 xl:col-span-1 flex flex-col gap-3 sm:flex-row xl:flex-col">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="flex-1 rounded-[14px] p-5"
                style={{
                  background: `linear-gradient(135deg, var(--gradient-brand-from) 0%, var(--gradient-brand-to) 100%)`,
                }}
              >
                <p
                  className="text-[14px] font-bold uppercase tracking-[0.09em] mb-3"
                  style={{ color: "var(--gradient-brand-label)" }}
                >
                  Upcoming Birthdays
                </p>
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: "var(--gradient-brand-avatar)" }}
                  >
                    SJ
                  </div>
                  <div className="space-y-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-white leading-none truncate">
                        Sarah Jenkins
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: "var(--gradient-brand-sublabel)" }}>
                        Tomorrow, Oct 24th
                      </p>
                    </div>
                    <button
                      className="text-[8px] font-bold uppercase tracking-[0.04em] text-white rounded-md px-2 py-1.5 flex-shrink-0 cursor-pointer border-0 whitespace-nowrap transition"
                      style={{ backgroundColor: "var(--gradient-brand-btn)" }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--gradient-brand-btn-hover)"}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = "var(--gradient-brand-btn)"}
                    >
                      Wish Happy Birthday
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}