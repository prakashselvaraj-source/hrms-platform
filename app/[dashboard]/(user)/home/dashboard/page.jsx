"use client";

import ThemeToggle from "@/components/ui/theme-toggle";
import { useTenant } from "@/hooks/useTenant";
import { getAllAnnouncements } from "@/services/announcementService";
import { getUserDashboard } from "@/services/dashboardService";
import { getAllHolidays } from "@/services/holidayService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/* ── Circular Progress ── */
function CircularProgress({ value = 92 }) {
  const size = 110;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--progress-track)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--progress-fill)" strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold leading-none" style={{ color: "var(--text-primary)" }}>{value}%</span>
        <span className="text-[10px] mt-1 font-semibold uppercase tracking-widest" style={{ color: "var(--progress-label)" }}>Today</span>
      </div>
    </div>
  );
}

/* ── Stat Pill ── */
function StatPill({ value, label, sub }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl px-4 py-3 text-center"
      style={{ backgroundColor: "var(--surface-active)", border: "1px solid var(--border-default)" }}>
      <span className="text-2xl font-black leading-none tracking-tight" style={{ color: "var(--text-primary)" }}>{value}</span>
      {sub && <span className="text-xs mt-0.5 font-medium" style={{ color: "var(--text-subtle)" }}>/{sub}</span>}
      <span className="text-[10px] mt-1.5 font-semibold uppercase tracking-[0.08em] leading-tight" style={{ color: "var(--text-muted)" }}>{label}</span>
    </div>
  );
}

/* ── Section Header ── */
function SectionHeader({ icon, title, badge, action, onAction }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "var(--accent-subtle)" }}>
          {icon}
        </div>
        <span className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>{title}</span>
        {badge && (
          <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: "var(--accent-subtle)", color: "var(--accent-text)" }}>
            {badge}
          </span>
        )}
      </div>
      {action && (
        <a href="#" className="text-[10.5px] font-bold uppercase tracking-[0.08em] hover:underline"
          style={{ color: "var(--text-link)" }}
          onClick={(e) => {
            e.preventDefault();
            if (onAction) onAction();
          }}>
          {action}
        </a>
      )}
    </div>
  );
}

/* ── Icons ── */
const CalendarIcon = () => (
  <svg className="w-4 h-4" style={{ color: "var(--accent)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const TableIcon = () => (
  <svg className="w-4 h-4" style={{ color: "var(--accent)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
);
const MegaphoneIcon = () => (
  <svg className="w-4 h-4" style={{ color: "var(--accent)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l19-9-9 19-2-8-8-2z" />
  </svg>
);
const ClockIcon = () => (
  <svg className="w-4 h-4" style={{ color: "var(--accent)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
  </svg>
);
const LockIcon = () => (
  <svg className="w-4 h-4" style={{ color: "var(--accent)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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
const TrendUpIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 7l-8.5 8.5-5-5L2 17" /><path d="M16 7h6v6" />
  </svg>
);

/* ══════════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════════ */
export default function HRDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);

  const [dashboard, setDashboard] = useState(null);

  const router = useRouter();

  const tenantId = useTenant();

  useEffect(() => {
    const fetchDashBoard = async () => {
      try {
        const res = await getUserDashboard(tenantId);
        console.log("dashboardRES", res);

        const data = res.data;

        const payload = {
          announcements: data.announcements || [],
          leaveCards: (
            data.leaveReport || []
          ).map((item) => ({
            label: item.leaveType,
            used: item.count || 0,
            total: item?.accrual?.maxAnnualQuota || 0,
          }))
        }

        console.log("payload", payload);
        setDashboard(payload);

      } catch (error) {
        console.error("Dashboard fetch failed:", error);
      }
    }

    fetchDashBoard();

    const fetchHolidays = async () => {
      try {
        if (!tenantId) return;
        const res = await getAllHolidays(tenantId);
        console.log("holidayRes", res);

        const allHolidays = Array.isArray(res.data) ? res.data : (res.data?.holidays || []);
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
          else if (diffDays < 0) {
            dateLabel = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
          } else {
            dateLabel = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
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

  const leaveCards = [
    { label: "Sick Leave", used: "04", total: "10" },
    { label: "Comp Off", used: "02", total: "05" },
    { label: "Casual Leave", used: "07", total: "14" },
    { label: "Optional", used: "01", total: "02" },
    { label: "LOP", used: "00", total: null, lop: true },
  ];

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
    { label: "Productivity", pct: 94, color: "var(--bar-primary)" },
    { label: "Skill Development", pct: 88, color: "var(--bar-secondary)" },
  ];

  // birthdays section now uses upcomingHolidays from backend

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: "var(--surface-page)" }}>

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
            <span className="text-[14px] font-bold" style={{ color: "var(--tab-active-text)" }}>HR Dashboard</span>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 rounded-md"><MenuIcon /></button>
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

      {/* ── Page Body ── */}
      <div className="px-4 sm:px-8 py-6 sm:py-8 max-w-9xl mx-auto space-y-6">

        <div className="sm:hidden flex justify-end"><ThemeToggle /></div>

        {/* ── Hero Header ── */}
        <div className="relative overflow-hidden rounded-2xl px-6 sm:px-8 py-7"
          style={{
            background: "linear-gradient(135deg, var(--gradient-brand-from) 0%, var(--gradient-brand-to) 100%)",
          }}>
          {/* decorative rings */}
          <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-10"
            style={{ border: "2px solid white" }} />
          <div className="absolute -right-4 -top-4 w-32 h-32 rounded-full opacity-10"
            style={{ border: "2px solid white" }} />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] opacity-70 text-white">
                  Tuesday, Oct 24, 2024
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                Welcome back, Alex 👋
              </h1>
              <p className="mt-1.5 text-sm opacity-75 text-white">
                Here's what's happening at the workspace today.
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="flex gap-2.5 flex-shrink-0">
              <button
                className="px-4 py-2.5 text-[12.5px] font-bold rounded-xl transition cursor-pointer border-0 text-white"
                style={{ backgroundColor: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.26)"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.18)"}>
                Apply Leave
              </button>
              <button
                className="px-4 py-2.5 text-[12.5px] font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer border-0 text-white"
                style={{ backgroundColor: "var(--gradient-brand-btn)" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--gradient-brand-btn-hover)"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "var(--gradient-brand-btn)"}>
                <TicketIcon /> Raise Ticket
              </button>
            </div>
          </div>
        </div>

        {/* ── ROW 1: Leave + Attendance ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Leave Report — spans 3 cols */}
          <div className="lg:col-span-3 rounded-2xl p-6"
            style={{
              backgroundColor: "var(--surface-card)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)",
              border: "1px solid var(--border-default)",
            }}>
            <SectionHeader icon={<CalendarIcon />} title="Leave Report" badge="Annual" action="View All" />

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {dashboard?.leaveCards?.map((c) => (
                <div key={c.label} className="rounded-xl p-3.5 flex flex-col gap-1.5 items-center text-center transition-transform hover:-translate-y-0.5"
                  style={{
                    backgroundColor: "var(--surface-active)",
                    border: "1px solid var(--border-default)",
                  }}>
                  <p className="text-[9.5px] font-bold uppercase tracking-[0.1em] leading-tight"
                    style={{ color: "var(--text-muted)" }}>
                    {c.label}
                  </p>
                  {c.lop ? (
                    <>
                      <p className="text-[26px] font-black leading-none" style={{ color: "var(--status-danger-value)" }}>00</p>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "var(--status-success-bg)", color: "var(--status-success-text)" }}>
                        ✓ Excellent
                      </span>
                    </>
                  ) : (
                    <div className="flex items-end gap-0.5">
                      <p className="text-[26px] font-black leading-none" style={{ color: "var(--text-primary)" }}>{c.used}</p>
                      <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-subtle)" }}>/{c.total}</p>
                    </div>
                  )}
                  {/* Mini usage bar */}
                  {!c.lop && (
                    <div className="w-full h-1 rounded-full overflow-hidden mt-1" style={{ backgroundColor: "var(--bar-track)" }}>
                      <div className="h-full rounded-full" style={{
                        width: `${(parseInt(c.used) / parseInt(c.total)) * 100}%`,
                        backgroundColor: "var(--bar-primary)",
                      }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Attendance Report — spans 2 cols */}
          <div className="lg:col-span-2 rounded-2xl p-6 flex flex-col gap-5"
            style={{
              backgroundColor: "var(--surface-card)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)",
              border: "1px solid var(--border-default)",
            }}>
            <SectionHeader icon={<TableIcon />} title="Attendance" />

            <div className="flex flex-col sm:flex-row  gap-5 flex-1">
              {/* Progress ring + score */}
              <div className="flex items-center gap-4">
                <CircularProgress value={92} />
                <div>
                  <p className="text-xl font-black leading-none" style={{ color: "var(--text-primary)" }}>92%</p>
                  <p className="text-xs mt-0.5 font-medium" style={{ color: "var(--text-muted)" }}>Attendance Score</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <span style={{ color: "var(--status-success-text)" }}><TrendUpIcon /></span>
                    <span className="text-[11px] font-bold" style={{ color: "var(--status-success-text)" }}>+3% this month</span>
                  </div>
                </div>
              </div>

              {/* Stats rows */}
              <div className="flex-1 flex flex-col justify-center divide-y" style={{ borderColor: "var(--border-subtle)" }}>
                {attendanceRows.map((row) => (
                  <div key={row.label} className="flex justify-between items-center py-2">
                    <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>{row.label}</span>
                    <span className="text-[13px] font-bold"
                      style={{ color: row.highlight ? "var(--accent)" : "var(--text-primary)" }}>
                      {row.val}
                    </span>
                  </div>
                ))}
                <div className="pt-2">
                  <a href="#" className="text-[11px] font-bold hover:underline" style={{ color: "var(--text-link)" }}>
                    View full report →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── ROW 2: Bottom 4 cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

          {/* Quick Announcements */}
          <div className="rounded-2xl p-6"
            style={{
              backgroundColor: "var(--surface-card)",
              border: "1px solid var(--border-default)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)",
            }}>
            <SectionHeader
              icon={<MegaphoneIcon />}
              title="Announcements"
              action="All Updates"
              onAction={() => router.push(`/${tenantId}/admin/announcement`)}
            />
            <div className="flex flex-col gap-3">
              {dashboard?.announcements.map((a, i) => {
                const isPolicy = a.category === "Policy Updates";
                return (
                  <div key={i} className="group rounded-xl overflow-hidden transition-all hover:shadow-sm cursor-pointer"
                    style={{
                      backgroundColor: "var(--surface-raised)",
                      border: "1px solid var(--border-subtle)",
                    }}>
                    <div className={`h-1 ${isPolicy ? "bg-violet-500" : "bg-green-500"}`} />
                    <div className="p-3.5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: isPolicy ? "var(--accent-subtle)" : "var(--status-success-bg)",
                            color: isPolicy ? "var(--accent-text)" : "var(--status-success-text)"
                          }}>
                          {a.category}
                        </span>
                        <span className="text-base leading-none">{isPolicy ? "📋" : "🎉"}</span>
                      </div>
                      <p className="text-[12.5px] font-bold mb-1 leading-snug" style={{ color: "var(--text-primary)" }}>
                        {a.title}
                      </p>
                      <p className="text-[11px] leading-relaxed line-clamp-2" style={{ color: "var(--text-muted)" }}>
                        {a.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Permission Summary */}
          <div className="rounded-2xl p-6"
            style={{
              backgroundColor: "var(--surface-card)",
              border: "1px solid var(--border-default)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)",
            }}>
            <SectionHeader icon={<ClockIcon />} title="Permissions" />
            <div className="flex flex-col gap-4 mt-1">
              {permissions.map((p, i) => (
                <div key={i} className="rounded-xl p-4"
                  style={{
                    backgroundColor: "var(--surface-raised)",
                    border: "1px solid var(--border-subtle)",
                  }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "var(--accent-subtle)" }}>
                      {p.icon}
                    </div>
                    <div>
                      <p className="text-[11px] font-medium leading-none mb-0.5" style={{ color: "var(--text-muted)" }}>
                        {p.label}
                      </p>
                      <p className="text-[13px] font-bold" style={{ color: "var(--text-primary)" }}>
                        {p.val} <span className="font-normal text-[11px]" style={{ color: "var(--text-subtle)" }}>/ {p.max}</span>
                      </p>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bar-track)" }}>
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${p.pct}%`, backgroundColor: "var(--bar-primary)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Report */}
          <div className="rounded-2xl p-6 flex flex-col"
            style={{
              backgroundColor: "var(--surface-card)",
              border: "1px solid var(--border-default)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)",
            }}>
            <div className="flex items-start justify-between mb-1">
              <div>
                <p className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>Performance</p>
                <p className="text-[10.5px] font-semibold uppercase tracking-widest mt-0.5" style={{ color: "var(--text-muted)" }}>
                  From HR Team
                </p>
              </div>
              <span className="text-2xl" style={{ color: "var(--star-color)" }}>★</span>
            </div>

            <div className="flex flex-col gap-4 mt-5 flex-1">
              {perfBars.map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>{b.label}</span>
                    <span className="text-[13px] font-black" style={{ color: "var(--text-link)" }}>{b.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bar-track)" }}>
                    <div className="h-full rounded-full" style={{ width: `${b.pct}%`, backgroundColor: b.color }} />
                  </div>
                </div>
              ))}
            </div>

            <blockquote className="mt-5 pl-3 py-2 text-[11.5px] italic leading-relaxed rounded-r-lg"
              style={{
                borderLeft: "3px solid var(--callout-border)",
                backgroundColor: "var(--callout-bg)",
                color: "var(--text-muted)",
              }}>
              "Consistently exceeds delivery expectations. Strong potential for leadership tracks."
            </blockquote>
          </div>

          {/* Upcoming Holidays */}
          <div className="rounded-2xl overflow-hidden flex flex-col gap-3">
            {upcomingHolidays.length === 0 ? (
              <div className="flex-1 rounded-2xl p-5 flex flex-col items-center justify-center min-h-[140px] relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, var(--gradient-brand-from) 0%, var(--gradient-brand-to) 100%)`,
                }}>
                <p className="text-[12px] font-semibold text-white/70">No upcoming holidays</p>
              </div>
            ) : (
              upcomingHolidays.map((h, i) => (
                <div key={i} className="flex-1 rounded-2xl p-5 flex flex-col justify-between h-[50px] relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, var(--gradient-brand-from) 0%, var(--gradient-brand-to) 100%)`,
                  }}>
                  {/* BG decoration */}
                  <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full"
                    style={{ border: "2px solid rgba(255,255,255,0.12)" }} />
                  <div className="absolute -right-2 -bottom-2 w-16 h-16 rounded-full"
                    style={{ border: "2px solid rgba(255,255,255,0.1)" }} />

                  <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] mb-2"
                    style={{ color: "var(--gradient-brand-label)" }}>
                    🎉 Upcoming Holiday
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-black text-white flex-shrink-0"
                      style={{ backgroundColor: "var(--gradient-brand-avatar)" }}>
                      {h.initials}
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-white leading-none">{h.name}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: "var(--gradient-brand-sublabel)" }}>{h.date}</p>
                    </div>
                  </div>

                  <div className="mt-3 text-[10px] font-bold uppercase tracking-[0.06em] text-white/80 rounded-lg px-3 py-2 w-full text-center"
                    style={{ backgroundColor: "rgba(255,255,255,0.12)" }}>
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