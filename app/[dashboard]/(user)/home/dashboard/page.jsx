"use client";

import ThemeToggle from "@/components/ui/theme-toggle";
import { useTenant } from "@/hooks/useTenant";
import { getAllAnnouncements } from "@/services/announcementService";
import { getUserDashboard } from "@/services/dashboardService";
import { getAllHolidays } from "@/services/holidayService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────────
   GLOBAL STYLES  (injected once)
───────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

    *, *::before, *::after { box-sizing: border-box; }

    .hr-root {
      font-family: 'DM Sans', system-ui, sans-serif;
      background: #f5f6fa;
      min-height: 100vh;
      color: #1a1d27;
    }

    .display-font { font-family: 'Bricolage Grotesque', system-ui, sans-serif; }

    /* ── Fade-up entry ── */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .anim-fade { opacity: 0; animation: fadeUp 0.55s cubic-bezier(.22,.68,0,1.2) forwards; }
    .anim-d1 { animation-delay: 0.05s; }
    .anim-d2 { animation-delay: 0.12s; }
    .anim-d3 { animation-delay: 0.20s; }
    .anim-d4 { animation-delay: 0.28s; }
    .anim-d5 { animation-delay: 0.36s; }

    /* ── Shimmer skeleton ── */
    @keyframes shimmer {
      0%   { background-position: -600px 0; }
      100% { background-position: 600px 0; }
    }
    .shimmer {
      background: linear-gradient(90deg, #eef0f8 25%, #e4e7f5 50%, #eef0f8 75%);
      background-size: 600px 100%;
      animation: shimmer 1.6s infinite linear;
      border-radius: 14px;
    }

    /* ── Card base ── */
    .card {
      background: #ffffff;
      border-radius: 20px;
      border: 1px solid rgba(99,102,241,0.08);
      box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(99,102,241,0.05);
      transition: box-shadow 0.25s ease, transform 0.25s ease;
    }
    .card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.06), 0 16px 40px rgba(99,102,241,0.10);
      transform: translateY(-2px);
    }

    /* ── Leave tile ── */
    .leave-tile {
      background: #fafbff;
      border: 1.5px solid #eef0fb;
      border-radius: 16px;
      padding: 16px 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      cursor: pointer;
      transition: all 0.22s cubic-bezier(.22,.68,0,1.2);
    }
    .leave-tile:hover {
      background: #eff1ff;
      border-color: #c7cbf9;
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(99,102,241,0.14);
    }

    /* ── Announcement card ── */
    .announce-card {
      border-radius: 14px;
      border: 1.5px solid #eef0f8;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.22s ease;
      background: #fafbff;
    }
    .announce-card:hover {
      border-color: #c7cbf9;
      box-shadow: 0 6px 20px rgba(99,102,241,0.12);
      transform: translateY(-2px);
    }

    /* ── Permission item ── */
    .perm-item {
      background: #fafbff;
      border: 1.5px solid #eef0f8;
      border-radius: 16px;
      padding: 16px;
      transition: all 0.22s ease;
    }
    .perm-item:hover {
      background: #eff1ff;
      border-color: #c7cbf9;
    }

    /* ── Holiday tile ── */
    .holiday-tile {
      border-radius: 20px;
      overflow: hidden;
      padding: 20px;
      position: relative;
      background: linear-gradient(135deg, #4f46e5 0%, #6366f1 45%, #7c3aed 100%);
      cursor: pointer;
      transition: transform 0.22s ease, box-shadow 0.22s ease;
      box-shadow: 0 8px 24px rgba(79,70,229,0.28);
    }
    .holiday-tile:hover {
      transform: translateY(-3px);
      box-shadow: 0 14px 36px rgba(79,70,229,0.38);
    }

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

    /* ── Progress bar ── */
    .progress-bar-fill {
      height: 100%;
      border-radius: 999px;
      background: linear-gradient(90deg, #6366f1, #818cf8);
      transition: width 0.9s cubic-bezier(.22,.68,0,1.2);
    }

    /* ── Stat pill ── */
    .stat-pill {
      display: flex;
      flex-direction: column;
      padding: 12px 20px;
      border-radius: 14px;
      background: rgba(255,255,255,0.12);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.18);
      min-width: 90px;
    }

    /* ── Icon box ── */
    .icon-box {
      width: 36px; height: 36px;
      border-radius: 10px;
      background: #eff1ff;
      color: #6366f1;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }

    /* ── Attendance row ── */
    .att-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #f1f3fa;
    }
    .att-row:last-child { border-bottom: none; }

    /* ── Mini bar ── */
    .mini-bar-track {
      width: 100%; height: 4px; border-radius: 999px;
      background: #e8eaff; margin-top: 10px; overflow: hidden;
    }
    .mini-bar-fill {
      height: 100%; border-radius: 999px;
      background: linear-gradient(90deg, #6366f1, #a5b4fc);
      transition: width 0.8s cubic-bezier(.22,.68,0,1.2);
    }

    /* ── Pulse dot ── */
    @keyframes pulse-ring {
      0%   { box-shadow: 0 0 0 0 rgba(52,211,153,0.5); }
      70%  { box-shadow: 0 0 0 6px rgba(52,211,153,0); }
      100% { box-shadow: 0 0 0 0 rgba(52,211,153,0); }
    }
    .pulse-dot { animation: pulse-ring 2s ease-out infinite; }

    /* ── Mobile menu slide ── */
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .mobile-menu { animation: slideDown 0.2s ease forwards; }

    /* ── Scrollbar ── */
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #c7cbf9; border-radius: 99px; }
  `}</style>
);

/* ─────────────────────────────────────────────
   ICONS
───────────────────────────────────────────── */
const CalendarIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const TableIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
);
const MegaphoneIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l19-9-9 19-2-8-8-2z" />
  </svg>
);
const ClockIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
  </svg>
);
const LockIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const TicketIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
  </svg>
);
const MenuIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 12h18M3 6h18M3 18h18" />
  </svg>
);
const TrendUpIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 7l-8.5 8.5-5-5L2 17" /><path d="M16 7h6v6" />
  </svg>
);
const BellIcon = () => (
  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const StarIcon = () => (
  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

/* ─────────────────────────────────────────────
   CIRCULAR PROGRESS
───────────────────────────────────────────── */
function CircularProgress({ value = 92 }) {
  const size = 100, stroke = 7;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eff1ff" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="url(#ring-grad)" strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round" />
        <defs>
          <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 20, fontWeight: 900, color: "#4338ca", lineHeight: 1, fontFamily: "'Bricolage Grotesque', system-ui" }}>{value}%</span>
        <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#a5b4fc", marginTop: 3 }}>Score</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────────── */
function SectionHeader({ icon, title, badge, action, onAction }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div className="icon-box">{icon}</div>
        <span className="display-font" style={{ fontSize: 14, fontWeight: 700, color: "#1a1d27", letterSpacing: "-0.02em" }}>
          {title}
        </span>
        {badge && (
          <span style={{
            fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
            padding: "3px 10px", borderRadius: 99,
            background: "#eff1ff", color: "#6366f1",
          }}>{badge}</span>
        )}
      </div>
      {action && (
        <button onClick={onAction} style={{
          display: "flex", alignItems: "center", gap: 4,
          fontSize: 11, fontWeight: 700, color: "#6366f1",
          textTransform: "uppercase", letterSpacing: "0.07em",
          background: "none", border: "none", cursor: "pointer",
          padding: "4px 10px", borderRadius: 8,
          transition: "background 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "#eff1ff"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}>
          {action} <ArrowRightIcon />
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MINI BAR
───────────────────────────────────────────── */
function MiniBar({ used, total }) {
  const pct = total ? Math.min((parseInt(used) / parseInt(total)) * 100, 100) : 0;
  return (
    <div className="mini-bar-track">
      <div className="mini-bar-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────── */
function Skeleton({ style = {} }) {
  return <div className="shimmer" style={{ height: 110, ...style }} />;
}

/* ══════════════════════════════════════════════
   MAIN DASHBOARD
   ✅ All state, hooks, useEffect, data-fetching
      logic kept 100% identical to original file.
   ✅ Only JSX layout and styling changed.
═══════════════════════════════════════════════ */
export default function HRDashboard() {

  /* ── State (original) ── */
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);
  const [dashboard, setDashboard] = useState(null);

  /* ── Hooks (original) ── */
  const router = useRouter();
  const tenantId = useTenant();

  /* ── Data fetching (100% original logic) ── */
  useEffect(() => {

    const fetchDashBoard = async () => {
      try {
        const res = await getUserDashboard(tenantId);
        console.log("dashboardRES", res);

        const data = res.data;
        const payload = {
          announcements: data.announcements || [],
          leaveCards: (data.leaveReport || []).map((item) => ({
            label: item.leaveType,
            used: item.count || 0,
            total: item?.accrual?.maxAnnualQuota || 0,
          })),
        };

        console.log("payload", payload);
        setDashboard(payload);
      } catch (error) {
        console.error("Dashboard fetch failed:", error);
      }
    };
    fetchDashBoard();

    const fetchHolidays = async () => {
      try {
        if (!tenantId) return;
        const res = await getAllHolidays(tenantId);
        console.log("holidayRes", res);

        const allHolidays = Array.isArray(res.data)
          ? res.data
          : (res.data?.holidays || []);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Try upcoming holidays first
        let selected = allHolidays
          .filter((h) => new Date(h.date) >= today)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 2);

        // If no upcoming holidays, show the 2 most recent past ones
        if (selected.length === 0) {
          selected = allHolidays
            .filter((h) => new Date(h.date) < today)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 2);
        }

        const mapped = selected.map((h) => {
          const d = new Date(h.date);
          const diffDays = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
          let dateLabel;
          if (diffDays === 0) dateLabel = "Today";
          else if (diffDays === 1) dateLabel = "Tomorrow";
          else {
            dateLabel = d.toLocaleDateString("en-US", {
              weekday: "short", month: "short", day: "numeric",
            });
          }
          return {
            name: h.holidayName,
            date: dateLabel,
            category: h.category || "Holiday",
            type: h.type || "HOLIDAY",
            initials: (h.holidayName || "H").substring(0, 2).toUpperCase(),
          };
        });

        setUpcomingHolidays(mapped);
      } catch (err) {
        console.error("Fetch holidays failed:", err);
      }
    };
    fetchHolidays();

  }, [tenantId]);

  /* ── Static display data (original) ── */
  const attendanceRows = [
    { label: "Working Days", val: "22 Days", highlight: false },
    { label: "Log-in", val: "09:13 AM", highlight: false },
    { label: "Log-out", val: "07:12 PM", highlight: false },
    { label: "Duration", val: "8h 45m", highlight: true },
  ];

  const permissions = [
    { icon: <ClockIcon />, label: "Short Permission", val: "2 Used", max: "3 Max", pct: 67 },
    { icon: <LockIcon />, label: "Late Login Allowed", val: "1 Used", max: "2 Max", pct: 50 },
  ];

  const perfBars = [
    { label: "Productivity", pct: 94, color: "#6366f1" },
    { label: "Skill Development", pct: 88, color: "#818cf8" },
  ];

  /* ═══════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════ */
  return (
    <div className="hr-root">
      <GlobalStyles />

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

      {/* ══ PAGE BODY ══ */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "28px 32px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── HERO BANNER ── */}
        <div className="anim-fade anim-d1" style={{
          position: "relative", overflow: "hidden", borderRadius: 24,
          background: "linear-gradient(135deg, #3730a3 0%, #4f46e5 35%, #6366f1 65%, #7c3aed 100%)",
          padding: "36px 44px",
          boxShadow: "0 16px 48px rgba(79,70,229,0.32), 0 2px 8px rgba(79,70,229,0.2)",
        }}>
          {/* Mesh circles */}
          <div style={{ position: "absolute", top: -60, right: -40, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 20, right: 80, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -50, left: -30, width: 200, height: 200, borderRadius: "50%", background: "rgba(124,58,237,0.3)", filter: "blur(40px)", pointerEvents: "none" }} />
          {/* Dot grid */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.07, pointerEvents: "none",
            backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }} />

          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
            {/* Left */}
            <div>
              {/* Live indicator */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span className="pulse-dot" style={{
                  display: "inline-block", width: 8, height: 8, borderRadius: "50%",
                  background: "#34d399",
                }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.14em" }}>
                  Tuesday, Oct 24, 2024
                </span>
              </div>

              <h1 className="display-font" style={{ fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.15, margin: 0 }}>
                Welcome back, Alex 👋
              </h1>
              <p style={{ marginTop: 8, fontSize: 14, color: "rgba(255,255,255,0.55)", fontWeight: 400, lineHeight: 1.5 }}>
                Here's your workspace at a glance today.
              </p>

              {/* Quick stats as pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
                {[
                  { val: "22", label: "Days Present", emoji: "📅" },
                  { val: "3", label: "Pending", emoji: "⚡" },
                  { val: "92%", label: "Attendance", emoji: "✅" },
                ].map((s) => (
                  <div key={s.label} className="stat-pill">
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 4, fontWeight: 500 }}>
                      {s.emoji} {s.label}
                    </span>
                    <span className="display-font" style={{ fontSize: 26, fontWeight: 800, color: "white", lineHeight: 1 }}>
                      {s.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
              <button style={{
                padding: "12px 22px", fontSize: 13, fontWeight: 700,
                borderRadius: 14, cursor: "pointer",
                background: "rgba(255,255,255,0.14)", color: "white",
                border: "1.5px solid rgba(255,255,255,0.22)",
                backdropFilter: "blur(10px)",
                transition: "all 0.2s", letterSpacing: "0.01em",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.22)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.14)"}>
                🌴 Apply Leave
              </button>
              <Link
                href={`/${tenantId}/support/raise-ticket`}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "12px 22px", fontSize: 13, fontWeight: 700,
                  borderRadius: 14, cursor: "pointer",
                  background: "rgba(255,255,255,0.95)", color: "#4f46e5",
                  textDecoration: "none", border: "none",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  transition: "all 0.2s", letterSpacing: "0.01em",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "white"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.95)"}>
                <TicketIcon /> Raise Ticket
              </Link>
            </div>
          </div>
        </div>

        {/* ── ROW 1: Leave Report + Attendance ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 20 }} className="anim-fade anim-d2">

          {/* Leave Report — 3 cols */}
          <div className="card" style={{ gridColumn: "span 3", padding: 24 }}>
            <SectionHeader icon={<CalendarIcon />} title="Leave Report" badge="Annual" action="View All" />

            {!dashboard ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} />)}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
                {dashboard.leaveCards.map((c) => (
                  <div key={c.label} className="leave-tile">
                    <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8", marginBottom: 8 }}>
                      {c.label}
                    </p>

                    {c.lop ? (
                      <>
                        <p className="display-font" style={{ fontSize: 32, fontWeight: 900, color: "#4338ca", lineHeight: 1 }}>00</p>
                        <span style={{
                          marginTop: 8, fontSize: 9, fontWeight: 700,
                          padding: "3px 10px", borderRadius: 99,
                          background: "#dcfce7", color: "#15803d",
                        }}>✓ Excellent</span>
                      </>
                    ) : (
                      <>
                        <div style={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
                          <p className="display-font" style={{ fontSize: 32, fontWeight: 900, color: "#4338ca", lineHeight: 1 }}>
                            {String(c.used).padStart(2, "0")}
                          </p>
                          <p style={{ fontSize: 13, fontWeight: 500, color: "#94a3b8", marginBottom: 3 }}>/{c.total}</p>
                        </div>
                        <MiniBar used={c.used} total={c.total} />
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Hint strip */}
            <div style={{
              marginTop: 16, display: "flex", alignItems: "center", gap: 10,
              padding: "12px 16px", borderRadius: 14,
              background: "linear-gradient(90deg, #eff1ff, #f5f3ff)",
              border: "1px solid #e0e3ff",
            }}>
              <span style={{ fontSize: 16 }}>💡</span>
              <span style={{ fontSize: 11.5, fontWeight: 500, color: "#6366f1", lineHeight: 1.5 }}>
                Plan your leaves wisely — balance work and rest throughout the year.
              </span>
            </div>
          </div>

          {/* Attendance — 2 cols */}
          <div className="card" style={{ gridColumn: "span 2", padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
            <SectionHeader icon={<TableIcon />} title="Attendance" />

            <div style={{ display: "flex", gap: 20, flex: 1 }}>
              {/* Ring */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <CircularProgress value={92} />
                <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 99, background: "#dcfce7" }}>
                  <span style={{ color: "#16a34a", display: "flex" }}><TrendUpIcon /></span>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: "#16a34a" }}>+3% this month</span>
                </div>
              </div>

              {/* Stats */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {attendanceRows.map((row) => (
                  <div key={row.label} className="att-row">
                    <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>{row.label}</span>
                    <span style={{
                      fontSize: 13, fontWeight: 700,
                      color: row.highlight ? "#4f46e5" : "#1a1d27",
                      ...(row.highlight ? {
                        background: "#eff1ff", padding: "2px 10px", borderRadius: 8,
                      } : {}),
                    }}>
                      {row.val}
                    </span>
                  </div>
                ))}
                <a href="#" style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  marginTop: 12, fontSize: 11, fontWeight: 700,
                  color: "#6366f1", textDecoration: "none",
                  padding: "6px 0",
                }}
                  onMouseEnter={e => e.currentTarget.style.color = "#4338ca"}
                  onMouseLeave={e => e.currentTarget.style.color = "#6366f1"}>
                  Full report <ArrowRightIcon />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── ROW 2: Bottom 4 cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }} className="anim-fade anim-d3">

          {/* Announcements — from dashboard.announcements (server data) */}
          <div className="card" style={{ padding: 24 }}>
            <SectionHeader
              icon={<MegaphoneIcon />}
              title="Announcements"
              action="All"
              onAction={() => router.push(`/${tenantId}/admin/announcement`)}
            />

            {!dashboard ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[1, 2].map((i) => <Skeleton key={i} />)}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {dashboard.announcements.map((a, i) => {
                  const isPolicy = a.category === "Policy Updates";
                  return (
                    <div key={i} className="announce-card">
                      {/* Top stripe */}
                      <div style={{
                        height: 3,
                        background: isPolicy
                          ? "linear-gradient(90deg, #7c3aed, #6366f1)"
                          : "linear-gradient(90deg, #6366f1, #34d399)",
                      }} />
                      <div style={{ padding: "14px 14px 14px" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                          <span style={{
                            fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em",
                            padding: "3px 10px", borderRadius: 99,
                            background: isPolicy ? "#f5f3ff" : "#f0fdf4",
                            color: isPolicy ? "#7c3aed" : "#15803d",
                          }}>
                            {a.category}
                          </span>
                          <span style={{ fontSize: 15 }}>{isPolicy ? "📋" : "🎉"}</span>
                        </div>
                        <p style={{ fontSize: 12.5, fontWeight: 700, color: "#1a1d27", marginBottom: 5, lineHeight: 1.4 }}>{a.title}</p>
                        <p style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {a.message}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Permission Summary — static (same as original) */}
          <div className="card" style={{ padding: 24 }}>
            <SectionHeader icon={<ClockIcon />} title="Permissions" />

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {permissions.map((p, i) => (
                <div key={i} className="perm-item">
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div className="icon-box">{p.icon}</div>
                    <div>
                      <p style={{ fontSize: 10.5, color: "#94a3b8", fontWeight: 500, lineHeight: 1, marginBottom: 4 }}>{p.label}</p>
                      <p className="display-font" style={{ fontSize: 15, fontWeight: 700, color: "#1a1d27", lineHeight: 1 }}>
                        {p.val}
                        <span style={{ fontSize: 11, fontWeight: 400, color: "#94a3b8" }}> / {p.max}</span>
                      </p>
                    </div>
                  </div>
                  <div style={{ height: 6, borderRadius: 99, background: "#eef0fb", overflow: "hidden" }}>
                    <div className="progress-bar-fill" style={{ width: `${p.pct}%` }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                    <span style={{ fontSize: 9.5, color: "#94a3b8", fontWeight: 500 }}>Used</span>
                    <span style={{ fontSize: 9.5, fontWeight: 700, color: "#6366f1" }}>{p.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Report — static (same as original) */}
          <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
              <div>
                <p className="display-font" style={{ fontSize: 14, fontWeight: 800, color: "#1a1d27", letterSpacing: "-0.02em" }}>Performance</p>
                <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8", marginTop: 3 }}>From HR Team</p>
              </div>
              <span style={{ color: "#f59e0b", fontSize: 20 }}>⭐</span>
            </div>

            {/* Grade badge */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "14px 16px", borderRadius: 16,
              background: "linear-gradient(135deg, #eff1ff, #f5f3ff)",
              border: "1.5px solid #e0e3ff",
              margin: "12px 0 20px",
            }}>
              <span className="display-font" style={{ fontSize: 34, fontWeight: 900, color: "#4338ca", lineHeight: 1 }}>A+</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#4338ca" }}>Outstanding</p>
                <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>Top 5% this quarter</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
              {perfBars.map((b) => (
                <div key={b.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#64748b" }}>{b.label}</span>
                    <span className="display-font" style={{ fontSize: 13, fontWeight: 800, color: "#4338ca" }}>{b.pct}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 99, background: "#eef0fb", overflow: "hidden" }}>
                    <div className="progress-bar-fill" style={{ width: `${b.pct}%`, background: `linear-gradient(90deg, ${b.color}, #a5b4fc)` }} />
                  </div>
                </div>
              ))}
            </div>

            <blockquote style={{
              marginTop: 20, paddingLeft: 14, paddingTop: 10, paddingBottom: 10,
              fontSize: 11, fontStyle: "italic", color: "#64748b", lineHeight: 1.6,
              borderRadius: "0 10px 10px 0",
              borderLeft: "3px solid #818cf8",
              background: "linear-gradient(90deg, #f5f3ff, transparent)",
            }}>
              "Consistently exceeds delivery expectations. Strong potential for leadership tracks."
            </blockquote>
          </div>

          {/* Upcoming Holidays — from upcomingHolidays state (server data) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }} className="anim-fade anim-d4">
            {upcomingHolidays.length === 0 ? (
              <div style={{
                flex: 1, borderRadius: 20, minHeight: 140,
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 8px 24px rgba(79,70,229,0.28)",
              }}>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>No upcoming holidays</p>
              </div>
            ) : (
              upcomingHolidays.map((h, i) => (
                <div key={i} className="holiday-tile" style={{ flex: 1, minHeight: 130 }}>
                  {/* Grid texture */}
                  <div style={{
                    position: "absolute", inset: 0, opacity: 0.08, pointerEvents: "none",
                    backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                    backgroundSize: "18px 18px",
                  }} />
                  {/* Glow circle */}
                  <div style={{
                    position: "absolute", bottom: -24, right: -24,
                    width: 100, height: 100, borderRadius: "50%",
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    pointerEvents: "none",
                  }} />

                  <p style={{
                    fontSize: 9.5, fontWeight: 700, textTransform: "uppercase",
                    letterSpacing: "0.14em", color: "rgba(255,255,255,0.55)",
                    marginBottom: 14, position: "relative",
                  }}>
                    🎉 Upcoming Holiday
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: "50%",
                      background: "rgba(255,255,255,0.18)",
                      border: "1.5px solid rgba(255,255,255,0.25)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 900, color: "white", flexShrink: 0,
                      fontFamily: "'Bricolage Grotesque', system-ui",
                    }}>
                      {h.initials}
                    </div>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 700, color: "white", lineHeight: 1.3 }}>{h.name}</p>
                      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginTop: 3 }}>{h.date}</p>
                    </div>
                  </div>

                  <div style={{
                    marginTop: 14, fontSize: 10, fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.07em",
                    color: "rgba(255,255,255,0.75)",
                    borderRadius: 10, padding: "8px 14px", textAlign: "center",
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    position: "relative",
                  }}>
                    📅 {h.category}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}