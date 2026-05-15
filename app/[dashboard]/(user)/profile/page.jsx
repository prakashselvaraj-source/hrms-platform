"use client";

import ThemeToggle from "@/components/ui/theme-toggle";
import { useTenant } from "@/hooks/useTenant";
import { getEmployeeProfile } from "@/services/employeeService";
import { getAdminProfile } from "@/services/adminService";
import { IdCardLanyard, Trash2, Pencil, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
/* ── Nav items ── */
const NAV_ITEMS = [
  { label: "Personal", icon: UserIcon, key: "personal" },
  { label: "Security", icon: ShieldIcon, key: "security" },
  { label: "Documents", icon: FileIcon, key: "documents" },
  { label: "Notification Setting", icon: BellIcon, key: "notifications" },
  { label: "Sessions", icon: MonitorIcon, key: "sessions" },
];

/* ── SVG Icons ── */
function UserIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}
function ShieldIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}
function FileIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
function BellIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}
function MonitorIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd" />
    </svg>
  );
}
function UploadIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  );
}

/* ── Reusable components ── */
function InputField({ label, value, onChange, readOnly, type = "text" }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10.5px] font-bold uppercase tracking-[0.09em]"
        style={{ color: "var(--text-muted)" }}>
        {label}
      </label>
      <input type={type} value={value} onChange={onChange} readOnly={readOnly}
        className="px-3.5 py-3 rounded-xl text-sm outline-none transition-all"
        style={{
          backgroundColor: readOnly ? "var(--surface-muted)" : "var(--surface-active)",
          color: readOnly ? "var(--text-secondary)" : "var(--text-primary)",
          border: `1.5px solid ${readOnly ? "var(--border-subtle)" : "var(--border-default)"}`,
          cursor: readOnly ? "default" : "text",
        }}
        onFocus={e => { if (!readOnly) e.target.style.borderColor = "var(--accent)"; }}
        onBlur={e => { if (!readOnly) e.target.style.borderColor = "var(--border-default)"; }}
      />
    </div>
  );
}

function Toggle({ enabled, setEnabled }) {
  return (
    <button onClick={() => setEnabled(!enabled)}
      className="w-11 h-6 flex items-center rounded-full p-0.5 transition-all duration-300 cursor-pointer border-0 flex-shrink-0"
      style={{ backgroundColor: enabled ? "var(--brand-accent)" : "var(--border-default)" }}>
      <div className={`w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${enabled ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

/* A collapsible section card */
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

/* ══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */
export default function ProfilePage() {
  const [activeNav, setActiveNav] = useState("personal");
  const [editing, setEditing] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const tenantId = useTenant();
  const [changePassword, setChangePassword] = useState(false);
  const [verifyDocuments, setVerifyDocuments] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState(false);
  const [sessionsOpen, setSessionsOpen] = useState(false);

  const [identityFile, setIdentityFile] = useState(null);
  const [certFile, setCertFile] = useState(null);

  const [announcement, setAnnouncement] = useState(true);
  const [salary, setSalary] = useState(true);
  const [mail, setMail] = useState(true);

  const [user, setUser] = useState(null);

  // Load user data from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);

      // Update form with user data
      setForm((prev) => ({
        ...prev,
        fullName: storedUser.fullName || storedUser.firstName + " " + storedUser.lastName,
        email: storedUser.email,
        phone: storedUser.phone || "",
        dob: storedUser.dob || "",
      }));
    }

    const fetchProfileData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const role = storedUser?.role;
        
        let res;
        if (role === "SUPER_ADMIN" || role === "ADMIN") {
          res = await getAdminProfile(storedUser.email);
        } else {
          res = await getEmployeeProfile(tenantId);
        }

        if (res.data) {
          const profile = res.data;
          setUser(profile);
          
          if (role === "SUPER_ADMIN" || role === "ADMIN") {
            setForm({
              fullName: `${profile.firstName} ${profile.lastName}`,
              email: profile.user?.email || storedUser.email,
              dob: "N/A", // Admin entity might not have all employee fields
              phone: profile.mobileNumber,
              gender: "N/A",
              pronouns: "They / Them",
              timezone: "UTC+05:30",
              address: "N/A",
            });
          } else {
            setForm({
              fullName: `${profile.firstName} ${profile.lastName}`,
              email: profile.workEmail,
              dob: profile.dateOfBirth,
              phone: profile.mobileNumber,
              gender: profile.gender?.charAt(0).toUpperCase() + profile.gender?.slice(1) || "N/A",
              pronouns: profile.gender == "male" ? "He / Him" : "She / Her",
              timezone: "UTC+05:30",
              address: `${profile.currentStreet}, ${profile.currentCity}, ${profile.currentState}, ${profile.currentZip}, ${profile.currentCountry}`,
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    }
    if (tenantId) fetchProfileData();
  }, [tenantId]);


  const [form, setForm] = useState({
    fullName: "",
    email: "",
    dob: "",
    phone: "",
    gender: "",
    pronouns: "",
    timezone: "",
    address: "",
  });
  const [draft, setDraft] = useState({ ...form });

  const handleEdit = () => { setDraft({ ...form }); setEditing(true); };
  const handleCancel = () => setEditing(false);
  const handleSave = () => { setForm({ ...draft }); setEditing(false); };

  const field = (key) => ({
    value: editing ? draft[key] : form[key],
    onChange: editing ? (e) => setDraft((d) => ({ ...d, [key]: e.target.value })) : undefined,
    readOnly: !editing,
  });

  const FilePreview = ({ file, onRemove, label }) => file ? (
    <div className="mt-4 flex items-center justify-between gap-3 p-3.5 rounded-xl"
      style={{ backgroundColor: "var(--surface-muted)", border: "1px solid var(--border-subtle)" }}>
      <div className="flex items-center gap-3 min-w-0">
        {file.type.startsWith("image/") ? (
          <img src={URL.createObjectURL(file)} alt={label}
            className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
        ) : (
          <div className="w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0"
            style={{ backgroundColor: "var(--surface-card)", border: "1px solid var(--border-default)" }}>
            <UploadIcon />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{file.name}</p>
          <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
            {Math.round(file.size / 1024)} KB · {new Date(file.lastModified).toLocaleDateString()}
          </p>
        </div>
      </div>
      <button onClick={onRemove}
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors border-0 cursor-pointer"
        style={{ backgroundColor: "var(--status-danger-bg, #fee2e2)", color: "#ef4444" }}>
        <Trash2 size={14} />
      </button>
    </div>
  ) : null;

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: "var(--surface-page)" }}>
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-7">

        {/* ── Page Header ── */}
        <div className="flex items-start justify-between mb-7">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>
              My Profile
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Manage your professional identity and personal details.
            </p>
          </div>
          <ThemeToggle />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── Sidebar ── */}
          <aside className="lg:sticky lg:top-6 w-full lg:w-64 xl:w-72 flex-shrink-0 flex flex-col gap-4">

            {/* Profile card */}
            <div className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: "var(--surface-card)",
                border: "1px solid var(--border-default)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
              }}>
              {/* Gradient top bar */}
              <div className="h-16 w-full" style={{ background: "var(--brand-gradient)" }} />

              <div className="px-5 pb-5 -mt-8">
                {/* Avatar */}
                <div className="relative w-fit mb-3">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #818cf8, #6366f1)" }}>
                    {user?.photoUrl ? (
                      <img src={user.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      user?.firstName?.charAt(0) || "A"
                    )}
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2"
                    style={{ backgroundColor: "var(--accent)", borderColor: "var(--surface-card)" }}>
                    <CheckIcon />
                  </span>
                </div>

                <p className="text-[15px] font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
                  {form.fullName}
                </p>
                <p className="text-[11.5px] font-semibold mt-0.5" style={{ color: "var(--brand-primary)" }}>
                  {user?.designation || "Executive"}
                </p>

                <div className="flex gap-1.5 mt-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: "var(--status-success-bg)", color: "var(--status-success-text)" }}>
                    ● Active
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: "var(--accent-subtle)", color: "var(--accent-text)" }}>
                    {user?.department || "General"}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <button onClick={handleEdit}
                    className="flex-1 text-[11.5px] font-bold py-2.5 rounded-xl text-white border-0 cursor-pointer transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "var(--brand-accent)" }}>
                    Edit Profile
                  </button>
                  <button className="flex-1 text-[11.5px] font-bold py-2.5 rounded-xl cursor-pointer transition-colors"
                    style={{
                      border: "1.5px solid var(--brand-accent)",
                      color: "var(--brand-accent)",
                      backgroundColor: "transparent",
                    }}>
                    View ID Card
                  </button>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="rounded-2xl p-2"
              style={{
                backgroundColor: "var(--surface-card)",
                border: "1px solid var(--border-default)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
              }}>
              {/* Mobile: horizontal scroll, Desktop: vertical */}
              <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
                {NAV_ITEMS.map(({ label, icon: Icon, key }) => (
                  <button key={key}
                    onClick={() => setActiveNav(key)}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 text-[12.5px] font-semibold transition-all rounded-xl whitespace-nowrap flex-shrink-0 lg:flex-shrink border-0 cursor-pointer w-full text-left"
                    style={{
                      backgroundColor: activeNav === key ? "var(--accent-subtle)" : "transparent",
                      color: activeNav === key ? "var(--accent-text)" : "var(--text-secondary)",
                    }}>
                    <span style={{ color: activeNav === key ? "var(--accent)" : "var(--text-muted)" }}>
                      <Icon size={15} />
                    </span>
                    {label}
                  </button>
                ))}
              </div>
            </nav>
          </aside>

          {/* ── Main Content ── */}
          <main className="flex-1 min-w-0 space-y-4">

            {/* ── Personal Information ── */}
            <section className="rounded-2xl"
              style={{
                backgroundColor: "var(--surface-card)",
                border: "1px solid var(--border-default)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
              }}>
              {/* Section header */}
              <div className="flex items-center justify-between px-6 py-5"
                style={{ borderBottom: "1px solid var(--border-default)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "var(--accent-subtle)", color: "var(--accent)" }}>
                    <UserIcon size={15} />
                  </div>
                  <div>
                    <p className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>Personal Information</p>
                    <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Your identity and contact details</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {editing ? (
                    <>
                      <button onClick={handleSave}
                        className="px-4 py-2 text-white text-[12px] font-bold rounded-xl border-0 cursor-pointer transition-opacity hover:opacity-90"
                        style={{ backgroundColor: "var(--brand-accent)" }}>
                        Save Changes
                      </button>
                      <button onClick={handleCancel}
                        className="px-4 py-2 text-[12px] font-bold rounded-xl border-0 cursor-pointer transition-colors"
                        style={{ backgroundColor: "var(--surface-muted)", color: "var(--text-secondary)" }}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button onClick={handleEdit}
                      className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-bold rounded-xl border-0 cursor-pointer"
                      style={{ backgroundColor: "var(--accent-subtle)", color: "var(--accent-text)" }}>
                      <Pencil size={12} /> Edit
                    </button>
                  )}
                </div>
              </div>

              <div className="px-6 py-5 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Full Name"     {...field("fullName")} />
                  <InputField label="Email Address" {...field("email")} />
                  <InputField label="Date of Birth" {...field("dob")} />
                  <InputField label="Phone Number"  {...field("phone")} />
                  <InputField label="Gender"        {...field("gender")} />
                  <InputField label="Pronouns"      {...field("pronouns")} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Time Zone"           {...field("timezone")} />
                  <InputField label="Residential Address" {...field("address")} />
                </div>
              </div>
            </section>

            {/* ── Change Password ── */}
            <AccordionCard
              icon={<ShieldIcon size={15} />}
              title="Change Password"
              subtitle="Keep your account secure with a strong password"
              open={changePassword}
              onToggle={() => setChangePassword(p => !p)}>
              <div className="pt-4 space-y-4">
                <Link href="/forgot-password"
                  className="text-[11.5px] font-bold hover:underline flex justify-end"
                  style={{ color: "var(--text-link)" }}>
                  Forgot Password?
                </Link>
                {["Current Password", "New Password", "Confirm New Password"].map((lbl) => (
                  <div key={lbl} className="flex flex-col gap-1.5">
                    <label className="text-[10.5px] font-bold uppercase tracking-[0.09em]"
                      style={{ color: "var(--text-muted)" }}>{lbl}</label>
                    <input type="password" placeholder="••••••••"
                      className="px-3.5 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{
                        backgroundColor: "var(--surface-active)",
                        border: "1.5px solid var(--border-default)",
                        color: "var(--text-primary)",
                      }}
                      onFocus={e => e.target.style.borderColor = "var(--accent)"}
                      onBlur={e => e.target.style.borderColor = "var(--border-default)"}
                    />
                  </div>
                ))}
                <button className="px-5 py-2.5 text-white text-[12px] font-bold rounded-xl border-0 cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "var(--brand-accent)" }}>
                  Update Password
                </button>
              </div>
            </AccordionCard>

            {/* ── Verification Documents ── */}
            <AccordionCard
              icon={<FileIcon size={15} />}
              title="Verification Documents"
              subtitle="View your submitted identity and professional verification documents"
              open={verifyDocuments}
              onToggle={() => setVerifyDocuments(p => !p)}>
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Identity Proof", url: user?.identityProofUrl, icon: <IdCardLanyard size={18} /> },
                  { label: "Education Certificate", url: user?.educationCertUrl, icon: <UploadIcon size={18} /> },
                  { label: "Employment Proof", url: user?.employmentProofUrl, icon: <FileIcon size={18} /> },
                ].map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl transition-all"
                    style={{
                      backgroundColor: "var(--surface-muted)",
                      border: "1px solid var(--border-subtle)",
                    }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white shadow-sm" style={{ color: "var(--text-muted)" }}>
                        {doc.icon}
                      </div>
                      <span className="text-[13px] font-bold" style={{ color: "var(--text-primary)" }}>{doc.label}</span>
                    </div>
                    {doc.url ? (
                      <a href={doc.url} target="_blank" rel="noopener noreferrer"
                        className="text-[11px] font-bold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-opacity hover:opacity-80"
                        style={{ backgroundColor: "var(--brand-accent)", color: "white" }}>
                        View
                      </a>
                    ) : (
                      <span className="text-[11px] font-bold text-gray-400">Not Uploaded</span>
                    )}
                  </div>
                ))}
              </div>
            </AccordionCard>

            {/* ── Notification Settings ── */}
            <AccordionCard
              icon={<BellIcon size={15} />}
              title="Notification Settings"
              subtitle="Choose which alerts and updates you receive"
              open={notificationSettings}
              onToggle={() => setNotificationSettings(p => !p)}>
              <div className="pt-4 space-y-3">
                {[
                  { label: "Announcement Notifications", sub: "Company-wide announcements and news", enabled: announcement, setEnabled: setAnnouncement },
                  { label: "Salary Pay Slip Notification", sub: "When your monthly pay slip is available", enabled: salary, setEnabled: setSalary },
                  { label: "Mail Notifications", sub: "Direct messages and HR communications", enabled: mail, setEnabled: setMail },
                ].map(({ label, sub, enabled, setEnabled }) => (
                  <div key={label} className="flex items-center justify-between gap-4 p-4 rounded-xl"
                    style={{ backgroundColor: "var(--surface-muted)", border: "1px solid var(--border-subtle)" }}>
                    <div>
                      <p className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>{label}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>{sub}</p>
                    </div>
                    <Toggle enabled={enabled} setEnabled={setEnabled} />
                  </div>
                ))}
              </div>
            </AccordionCard>

            {/* ── Sessions ── */}
            <AccordionCard
              icon={<MonitorIcon size={15} />}
              title="Active Sessions"
              subtitle="View and manage devices where you're currently signed in"
              open={sessionsOpen}
              onToggle={() => setSessionsOpen(p => !p)}>
              <div className="pt-4 space-y-3">
                {[
                  { device: "MacBook Pro 16″", location: "San Francisco, CA", time: "Active now", current: true },
                  { device: "iPhone 15 Pro", location: "San Francisco, CA", time: "2 hours ago", current: false },
                  { device: "Chrome · Windows", location: "New York, NY", time: "Yesterday", current: false },
                ].map(({ device, location, time, current }) => (
                  <div key={device} className="flex items-center justify-between gap-4 p-4 rounded-xl"
                    style={{ backgroundColor: "var(--surface-muted)", border: "1px solid var(--border-subtle)" }}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "var(--surface-card)", color: "var(--text-muted)", border: "1px solid var(--border-default)" }}>
                        <MonitorIcon size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>{device}</p>
                          {current && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: "var(--status-success-bg)", color: "var(--status-success-text)" }}>
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>{location} · {time}</p>
                      </div>
                    </div>
                    {!current && (
                      <button className="text-[11px] font-bold px-3 py-1.5 rounded-lg border-0 cursor-pointer flex-shrink-0"
                        style={{ backgroundColor: "var(--status-danger-bg, #fee2e2)", color: "#ef4444" }}>
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </AccordionCard>

            {/* ── Save Footer ── */}
            <div className="flex justify-end pt-1 pb-4">
              <button
                className="px-6 py-3 text-white text-[13px] font-bold rounded-xl border-0 cursor-pointer transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--brand-accent)" }}>
                Save All Profile Changes
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}