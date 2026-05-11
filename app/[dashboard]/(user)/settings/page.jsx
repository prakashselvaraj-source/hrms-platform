"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useTenant } from "@/hooks/useTenant";
import { ChevronDown, ChevronUp } from "lucide-react";

/* ── SVG Icons ── */
function SunIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function MoonIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

function BellIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

function GlobeIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ShieldIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function UserCogIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 8v6m-3-3h6" />
    </svg>
  );
}

function MonitorIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function MailIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

/* ── Reusable Components ── */

function Toggle({ enabled, setEnabled }) {
  return (
    <button onClick={() => setEnabled(!enabled)}
      className="w-11 h-6 flex items-center rounded-full p-0.5 transition-all duration-300 cursor-pointer border-0 flex-shrink-0"
      style={{ backgroundColor: enabled ? "var(--brand-accent)" : "var(--border-default)" }}>
      <div className={`w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${enabled ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

function AccordionCard({ icon, title, subtitle, open, onToggle, children }) {
  return (
    <section className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: "var(--surface-card)",
        border: "1px solid var(--border-default)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
      }}>
      <button className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer border-0 bg-transparent"
        onClick={onToggle}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "var(--accent-subtle)", color: "var(--accent)" }}>
            {icon}
          </div>
          <div>
            <p className="text-[14px] font-bold leading-tight" style={{ color: "var(--text-primary)" }}>{title}</p>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>{subtitle}</p>
          </div>
        </div>
        <div style={{ color: "var(--text-muted)" }}>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>
      {open && (
        <div className="px-6 pb-6 pt-1" style={{ borderTop: "1px solid var(--border-default)" }}>
          {children}
        </div>
      )}
    </section>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10.5px] font-bold uppercase tracking-[0.09em]" style={{ color: "var(--text-muted)" }}>
        {label}
      </label>
      <select value={value} onChange={onChange}
        className="px-3.5 py-3 rounded-xl text-sm outline-none transition-all appearance-none cursor-pointer"
        style={{
          backgroundColor: "var(--surface-active)",
          border: "1.5px solid var(--border-default)",
          color: "var(--text-primary)",
        }}
        onFocus={e => e.target.style.borderColor = "var(--accent)"}
        onBlur={e => e.target.style.borderColor = "var(--border-default)"}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */
export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const tenant = useTenant();

  /* Accordion states */
  const [appearanceOpen, setAppearanceOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [regionalOpen, setRegionalOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  /* Appearance */
  const [selectedTheme, setSelectedTheme] = useState("system");

  useEffect(() => {
    if (theme) setSelectedTheme(theme);
  }, [theme]);

  /* Notifications */
  const [emailNotif, setEmailNotif] = useState({
    announcements: true,
    payroll: true,
    leaveUpdates: true,
    taskAssignments: true,
    general: false,
  });
  const [pushNotif, setPushNotif] = useState({
    announcements: false,
    payroll: true,
    leaveUpdates: true,
    taskAssignments: true,
    general: true,
  });
  const [inAppNotif, setInAppNotif] = useState({
    announcements: true,
    payroll: true,
    leaveUpdates: true,
    taskAssignments: true,
    general: true,
  });

  /* Regional */
  const [timezone, setTimezone] = useState("UTC");
  const [dateFormat, setDateFormat] = useState("MMM DD, YYYY");
  const [weekStart, setWeekStart] = useState("monday");

  /* Security */
  const [twoFactor, setTwoFactor] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  const handleSaveAll = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const themeOptions = [
    { value: "light", label: "Light", icon: SunIcon },
    { value: "dark", label: "Dark", icon: MoonIcon },
    { value: "system", label: "System", icon: MonitorIcon },
  ];

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: "var(--surface-page)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-7">

        {/* ── Page Header ── */}
        <div className="flex items-start justify-between mb-7">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>
              Settings
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Customize your application experience and preferences.
            </p>
          </div>
        </div>

        <div className="space-y-4">

          {/* ── Appearance ── */}
          <AccordionCard
            icon={<SunIcon size={15} />}
            title="Appearance"
            subtitle="Customize the look and feel of the application"
            open={appearanceOpen}
            onToggle={() => setAppearanceOpen(p => !p)}>
            <div className="pt-4 space-y-5">
              <p className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>Theme Mode</p>
              <div className="grid grid-cols-3 gap-3">
                {themeOptions.map(({ value, label, icon: Icon }) => (
                  <button key={value}
                    onClick={() => setTheme(value)}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all cursor-pointer border-0"
                    style={{
                      backgroundColor: selectedTheme === value ? "var(--accent-subtle)" : "var(--surface-muted)",
                      border: selectedTheme === value ? "2px solid var(--accent)" : "2px solid transparent",
                      color: selectedTheme === value ? "var(--accent-text)" : "var(--text-secondary)",
                    }}>
                    <Icon size={22} />
                    <span className="text-[12px] font-bold">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </AccordionCard>

          {/* ── Notification Preferences ── */}
          <AccordionCard
            icon={<BellIcon size={15} />}
            title="Notification Preferences"
            subtitle="Choose how and when you receive notifications"
            open={notificationsOpen}
            onToggle={() => setNotificationsOpen(p => !p)}>
            <div className="pt-4 space-y-6">
              {[
                { label: "Email Notifications", desc: "Receive notifications via email", state: emailNotif, setState: setEmailNotif, icon: MailIcon },
                { label: "Push Notifications", desc: "Receive notifications on your device", state: pushNotif, setState: setPushNotif, icon: BellIcon },
                { label: "In-App Notifications", desc: "Show notifications within the application", state: inAppNotif, setState: setInAppNotif, icon: MonitorIcon },
              ].map(({ label, desc, state, setState, icon: Icon }) => (
                <div key={label} className="rounded-xl p-4"
                  style={{ backgroundColor: "var(--surface-muted)", border: "1px solid var(--border-subtle)" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "var(--surface-card)", color: "var(--text-muted)" }}>
                      <Icon size={15} />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>{label}</p>
                      <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{desc}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { key: "announcements", label: "Announcements" },
                      { key: "payroll", label: "Payroll & Salary" },
                      { key: "leaveUpdates", label: "Leave Updates" },
                      { key: "taskAssignments", label: "Task Assignments" },
                      { key: "general", label: "General Communications" },
                    ].map(({ key, label: itemLabel }) => (
                      <div key={key} className="flex items-center justify-between py-1.5">
                        <span className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>{itemLabel}</span>
                        <Toggle
                          enabled={state[key]}
                          setEnabled={(val) => setState((prev) => ({ ...prev, [key]: val }))}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </AccordionCard>

          {/* ── Regional & Locale ── */}
          <AccordionCard
            icon={<GlobeIcon size={15} />}
            title="Regional & Locale"
            subtitle="Configure timezone, date format, and regional preferences"
            open={regionalOpen}
            onToggle={() => setRegionalOpen(p => !p)}>
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField
                label="Timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                options={[
                  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
                  { value: "US/Eastern", label: "Eastern Time (ET)" },
                  { value: "US/Central", label: "Central Time (CT)" },
                  { value: "US/Mountain", label: "Mountain Time (MT)" },
                  { value: "US/Pacific", label: "Pacific Time (PT)" },
                  { value: "Europe/London", label: "London (GMT)" },
                  { value: "Asia/Kolkata", label: "India (IST)" },
                  { value: "Asia/Dubai", label: "Dubai (GST)" },
                  { value: "Asia/Singapore", label: "Singapore (SGT)" },
                  { value: "Australia/Sydney", label: "Sydney (AEST)" },
                ]}
              />
              <SelectField
                label="Date Format"
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                options={[
                  { value: "MMM DD, YYYY", label: "Jan 15, 2024" },
                  { value: "DD/MM/YYYY", label: "15/01/2024" },
                  { value: "YYYY-MM-DD", label: "2024-01-15" },
                  { value: "MM/DD/YYYY", label: "01/15/2024" },
                ]}
              />
              <SelectField
                label="First Day of Week"
                value={weekStart}
                onChange={(e) => setWeekStart(e.target.value)}
                options={[
                  { value: "monday", label: "Monday" },
                  { value: "sunday", label: "Sunday" },
                  { value: "saturday", label: "Saturday" },
                ]}
              />
            </div>
          </AccordionCard>

          {/* ── Privacy & Security ── */}
          <AccordionCard
            icon={<ShieldIcon size={15} />}
            title="Privacy & Security"
            subtitle="Manage your account security and privacy preferences"
            open={securityOpen}
            onToggle={() => setSecurityOpen(p => !p)}>
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between gap-4 p-4 rounded-xl"
                style={{ backgroundColor: "var(--surface-muted)", border: "1px solid var(--border-subtle)" }}>
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>Two-Factor Authentication</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>Add an extra layer of security to your account</p>
                </div>
                <Toggle enabled={twoFactor} setEnabled={setTwoFactor} />
              </div>
              <div className="flex items-center justify-between gap-4 p-4 rounded-xl"
                style={{ backgroundColor: "var(--surface-muted)", border: "1px solid var(--border-subtle)" }}>
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>Login Alerts</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>Get notified when a new device logs into your account</p>
                </div>
                <Toggle enabled={loginAlerts} setEnabled={setLoginAlerts} />
              </div>
              <div className="rounded-xl p-4"
                style={{ backgroundColor: "var(--surface-muted)", border: "1px solid var(--border-subtle)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>Active Sessions</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>Manage devices where you are currently logged in</p>
                  </div>
                  <button className="text-[11px] font-bold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-opacity hover:opacity-80 text-white"
                    style={{ backgroundColor: "var(--brand-accent)" }}
                    onClick={() => window.location.href = `/${tenant}/profile`}>
                    Manage
                  </button>
                </div>
              </div>
            </div>
          </AccordionCard>

          {/* ── Account ── */}
          <AccordionCard
            icon={<UserCogIcon size={15} />}
            title="Account"
            subtitle="View your account information and manage account settings"
            open={accountOpen}
            onToggle={() => setAccountOpen(p => !p)}>
            <div className="pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl p-4" style={{ backgroundColor: "var(--surface-muted)", border: "1px solid var(--border-subtle)" }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Account Type</p>
                  <p className="text-[13px] font-semibold mt-1" style={{ color: "var(--text-primary)" }}>Employee</p>
                </div>
                <div className="rounded-xl p-4" style={{ backgroundColor: "var(--surface-muted)", border: "1px solid var(--border-subtle)" }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Member Since</p>
                  <p className="text-[13px] font-semibold mt-1" style={{ color: "var(--text-primary)" }}>January 2024</p>
                </div>
              </div>

              <div className="rounded-xl p-4"
                style={{ backgroundColor: "var(--status-danger-bg, #FEF2F2)", border: "1px solid #FECACA" }}>
                <p className="text-[12px] font-bold" style={{ color: "#DC2626" }}>Danger Zone</p>
                <p className="text-[11px] mt-1" style={{ color: "#9CA3AF" }}>
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button className="mt-3 text-[11px] font-bold px-4 py-2 rounded-lg border-0 cursor-pointer"
                  style={{ backgroundColor: "#DC2626", color: "white" }}>
                  Deactivate Account
                </button>
              </div>
            </div>
          </AccordionCard>

          {/* ── Save Footer ── */}
          <div className="flex items-center justify-end gap-3 pt-1 pb-4">
            {saved && (
              <span className="text-[12px] font-semibold" style={{ color: "var(--status-success-text)" }}>
                Settings saved successfully
              </span>
            )}
            <button
              onClick={handleSaveAll}
              className="px-6 py-3 text-white text-[13px] font-bold rounded-xl border-0 cursor-pointer transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--brand-accent)" }}>
              Save All Settings
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
