"use client";

import ThemeToggle from "@/components/ui/theme-toggle";
import { IdCardLanyard, Trash2, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Personal", icon: UserIcon, key: "personal" },
  { label: "Security", icon: ShieldIcon, key: "security" },
  { label: "Documents", icon: FileIcon, key: "documents" },
  { label: "Notification Setting", icon: BellIcon, key: "notifications" },
  { label: "Sessions", icon: MonitorIcon, key: "sessions" },
];

function UserIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg
      className="w-5 h-5 text-blue-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function InputField({ label, value, onChange, readOnly }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-[#434655] uppercase tracking-wide">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`px-3 py-3 rounded-lg text-sm text-[#191C1E] outline-none transition-all
          ${
            readOnly
              ? "bg-[#F2F4F6]  cursor-default text-gray-600"
              : "bg-[#F2F4F6] border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          }`}
      />
    </div>
  );
}

function Toggle({ enabled, setEnabled }) {
  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 cursor-pointer
        ${enabled ? "bg-[#4F279B]" : "bg-gray-300"}`}
    >
      <div
        className={`w-6 h-4 bg-white rounded-full shadow-md transform transition-all duration-300
          ${enabled ? "translate-x-4" : "translate-x-0"}`}
      />
    </button>
  );
}

export default function ProfilePage() {
  const [activeNav, setActiveNav] = useState("personal");
  const [editing, setEditing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [changePassword, setChangePassword] = useState(false);
  const [verifyDocuments, setVerifyDocuments] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState(false);

  const [identityFile, setIdentityFile] = useState(null);
  const [certFile, setCertFile] = useState(null);

  const [announcement, setAnnouncement] = useState(true);
  const [salary, setSalary] = useState(true);
  const [mail, setMail] = useState(true);

  console.log("mail changed");

  const [form, setForm] = useState({
    fullName: "Alexander Wright",
    email: "alex.wright@executiveworkspace.com",
    dob: "May 14, 1990",
    phone: "+1 (555) 012-3456",
    gender: "May 14, 1990",
    genderAlt: "May 14, 1990",
    timezone: "May 14, 1990",
    address: "4522 Executive Drive, Suite 100, Silicon Valley, CA 94025",
  });

  const [draft, setDraft] = useState({ ...form });

  const handleEdit = () => {
    setDraft({ ...form });
    setEditing(true);
  };

  const handleCancel = () => setEditing(false);

  const handleSave = () => {
    setForm({ ...draft });
    setEditing(false);
  };

  const handleIdentityUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIdentityFile(file);
    }
  };

  const handleCertUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCertFile(file);
    }
  };

  const field = (key) => ({
    value: editing ? draft[key] : form[key],
    onChange: editing
      ? (e) => setDraft((d) => ({ ...d, [key]: e.target.value }))
      : undefined,
    readOnly: !editing,
  });

  return (
    <div
      className="min-h-screen font-sans"
      style={{ backgroundColor: "var(--surface-page)" }}
    >
    
      <div className="max-w-9xl mx-auto flex flex-col  gap-0 md:gap-6 px-0 md:px-6 py-6 relative">
        {/* ── Header ── */}
        <div className="flex flex-col gap-3 mb-4 sm:mb-5">
          <div>
            <h1
              className="text-3xl font-bold flex items-center gap-1.5"
              style={{ color: "var(--text-primary)" }}
            >
            My Profile
            </h1>
            <p
              className="text-lg mt-1"
              style={{ color: "var(--text-secondary)" }}
            >
             Manage your professional identity and personal details.
            </p>
          </div>
        </div>

        <div className="block md:flex gap-3 items-start">
          
  
          <aside
            className={`
            static md:sticky  md:top-2 left-0 h-full md:h-fit z-20 md:z-auto
             md:bg-transparent
             md:w-[400px] shrink-0 md:self-start
            transform transition-transform duration-200 ease-in-out
             md:shadow-none
             md:pt-0
          `}
          >
            {/* Avatar Card */}
            <div
              className=" rounded-xl p-5 flex flex-col items-center gap-4 mb-4 mx-3 md:mx-0 border-l-4"
              style={{
                backgroundColor: "var(--surface-card)",
                borderLeftColor: "var(--border-strong)",
                boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)",
              }}
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  AW
                </div>
                <span className="absolute bottom-0 right-0 w-5 h-5 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center">
                  <CheckIcon />
                </span>
              </div>
              <div className="text-center">
                <p
                  className="font-bold  text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  Alexander Wright
                </p>
                <p
                  className="text-xs"
                  style={{
                    color: "var(--accent-text)",
                  }}
                >
                  Senior Product Architect
                </p>
              </div>
              <div className="flex gap-2 mt-1">
                <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
                  ● Active
                </span>
                <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                  Engineering
                </span>
              </div>
            </div>

            {/* Nav */}
            <nav
              className=" p-2 rounded-2xl flex md:block overflow-auto  md:overflow-hidden mx-3 md:mx-0 mb-2 md:mb-0"
              style={{
                backgroundColor: "var(--surface-card)",
                boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.15)",
              }}
            >
              {NAV_ITEMS.map(({ label, icon: Icon, key }) => (
                <button
                  key={key}
                  onClick={() => {
                    setActiveNav(key);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-1 md:gap-3 px-4 py-1 md:py-3 text-sm font-semibold transition-all rounded-[12px]
                  ${
                    activeNav === key
                      ? "bg-blue-50 text-[#4A45B6] "
                      : "text-gray-600 hover:bg-gray-50 border-l-4 border-transparent"
                  }`}
                >
                  <Icon size={20} className="text-[#4A45B6]" />
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}

          <main className="flex-1 min-w-0 px-3 md:px-0 space-y-5">
            {/* Personal Information Card */}
            <section
              className=" rounded-2xl shadow-sm p-5 md:p-7"
              style={{
                backgroundColor: "var(--surface-card)",
                boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.15)",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <UserIcon />
                  <h2
                    className="text-lg font-bold "
                    style={{ color: "var(--text-primary)" }}
                  >
                    Personal Information
                  </h2>
                </div>
                <div className="flex gap-2">
                  {editing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="px-4 py-1.5 bg-[#4A45B6] text-white text-sm font-semibold rounded-lg hover:bg-[#4b45b6b9] transition w-[100px] cursor-pointer shadow-[0px_10px_15px_0px_#00000017]"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-1.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition w-[100px] shadow-[0px_10px_15px_0px_#00000017]"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEdit}
                      className="px-4 py-1.5 bg-[#4A45B6] text-white text-sm font-semibold rounded-[4px] cursor-pointer hover:bg-[#4b45b6b9] transition w-[100px] shadow-[0px_10px_15px_0px_#00000017]"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Full Name" {...field("fullName")} />
                <InputField label="Email Address" {...field("email")} />
                <InputField label="Date of Birth" {...field("dob")} />
                <InputField label="Phone Number" {...field("phone")} />
                <InputField label="Gender" {...field("gender")} />
                <InputField label="Gender" {...field("genderAlt")} />
              </div>

              <div className="mt-10 flex flex-col gap-4">
                <InputField label="Time Zone" {...field("timezone")} />
                <InputField label="Residential Address" {...field("address")} />
              </div>
            </section>

            {/* Change Password */}
            <section className="bg-white rounded-[12px] shadow-[0px_1px_2px_#0000000D] border border-gray-100 p-5 md:p-6 cursor-pointer">
              <div onClick={() => setChangePassword((prev) => !prev)}>
                <div className="flex items-center gap-2 mb-1">
                  <CloudIcon />
                  <h2 className="text-lg font-bold text-[#191C1E]">
                    Change Password
                  </h2>
                </div>
                <p className="text-sm text-[#434655] ">Set a strong password</p>
              </div>

              {changePassword && (
                <>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-500 hover:underline flex justify-end "
                  >
                    Forget Password?
                  </Link>
                  <div className="grid grid-cols-1  gap-4 mt-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Current Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="px-3 py-2.5 rounded-lg bg-[#F2F4F6] text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="px-3 py-2.5 rounded-lg bg-[#F2F4F6]  text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="px-3 py-2.5 rounded-lg bg-[#F2F4F6]  text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                      />
                    </div>
                  </div>
                  <button className="mt-4 px-5 py-2 bg-[#4A45B6] text-white text-sm font-semibold rounded-lg hover:bg-[#4b45b6b4] transition cursor-pointer shadow-[0px_10px_15px_0px_#00000017]">
                    Update Password
                  </button>
                </>
              )}
            </section>

            {/* Verification Documents */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 cursor-pointer">
              <div onClick={() => setVerifyDocuments((prev) => !prev)}>
                <div className="flex items-center gap-2 mb-1">
                  <CloudIcon />
                  <h2 className="text-lg font-bold text-[#191C1E]">
                    Verification Documents
                  </h2>
                </div>
                <p className="text-sm text-[#434655] mb-4">
                  Upload your Identity Proof or Professional Certifications
                  (PDF, JPG, PNG up to 10MB).
                </p>
              </div>

              {verifyDocuments && (
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-2 items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition group">
                    <IdCardLanyard
                      size={30}
                      className="group-hover:text-blue-600"
                    />
                    <span className="text-sm text-[#191C1E] group-hover:text-blue-600 transition font-bold uppercase">
                      Identity Proof
                    </span>
                    <span className="text-xs text-[#64748B] mt-1">
                      Drop files or click to browse
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleIdentityUpload}
                    />
                  </label>

                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition group">
                    <svg
                      className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2 transition"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <span className="text-sm text-[#191C1E] group-hover:text-blue-600 transition font-bold uppercase">
                      Certifications
                    </span>
                    <span className="text-xs text-[#64748B] mt-1">
                      Drop files or click to browse
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleCertUpload}
                    />
                  </label>
                </div>
              )}

              {identityFile && (
                <div className="mt-4 flex items-center justify-between gap-2 p-3 bg-[#F2F4F6] rounded-[12px]">
                  <div className="flex items-center gap-2">
                    {identityFile.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(identityFile)}
                      alt="Identity Proof"
                      className="w-12 h-12 object-cover rounded-md "
                    />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-md border">
                      <svg
                        className="w-6 h-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-[#191C1E] font-semibold mt-2">
                      {identityFile.name}
                    </p>

                    <p>
                      {identityFile.size && (
                        <>
                         <span className="text-xs text-[#64748B]">
                          {Math.round(identityFile.size / 1024)} KB
                        </span>
                        <span className="text-xs text-[#64748B] ml-2">
                          {identityFile.lastModified && (
                            <span>
                              {new Date(identityFile.lastModified).toLocaleString()}
                            </span>
                          )}
                        </span>
                        </>
                       
                      )}

                    </p>
                  </div>
                  </div>

                  <Trash2 className="text-red-600" onClick={() => setIdentityFile(null)}/>
               
                </div>
              )}

              {certFile && (
                 <div className="mt-4 flex items-center justify-between gap-2 p-3 bg-[#F2F4F6] rounded-[12px]">
                  <div className="flex items-center gap-2">
                    {certFile.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(certFile)}
                      alt="Certification"
                      className="w-12 h-12 object-cover rounded-md "
                    />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-md border">
                      <svg
                        className="w-6 h-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-[#191C1E] font-semibold mt-2">
                      {certFile.name}
                    </p>

                    <p>
                      {certFile.size && (
                        <>
                        <span className="text-xs text-[#64748B]">
                          {Math.round(certFile.size / 1024)} KB
                        </span>
                        <span className="text-xs text-[#64748B]">
                          {certFile.lastModified && (
                            <span>
                              {new Date(certFile.lastModified).toLocaleString()}
                            </span>
                          )}
                        </span>
                        </>
                        
                      )}
                    </p>
                  </div>
                  </div>

                  <Trash2  className="text-red-600" onClick={() => setCertFile(null)}/>
               
                </div>
              )}
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 cursor-pointer">
               <div onClick={() => setNotificationSettings((prev) => !prev)}>
                  <div className="flex items-center gap-2 mb-1">
                  <CloudIcon />
                  <h2 className="text-lg font-bold text-[#191C1E]">
                    Notification Setting
                  </h2>
                </div>
                <p className="text-sm text-[#434655] mb-4">
                  Upload your Identity Proof or Professional Certifications
                  (PDF, JPG, PNG up to 10MB).
                </p>
              </div>

              {
                notificationSettings && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3 bg-[#F2F4F6] p-4 rounded-[12px]">
                      <label htmlFor="emailNotif" className="text-sm text-[#191C1E] font-semibold">Announcement notification</label>
                      <Toggle enabled={announcement} setEnabled={setAnnouncement} />

                    </div>
                    <div className="flex items-center justify-between gap-3 bg-[#F2F4F6] p-3 rounded-[12px]">
                      <label htmlFor="smsNotif" className="text-sm text-[#191C1E] font-semibold">salary pay slip notification</label>
                      <Toggle enabled={salary} setEnabled={setSalary} />
                    </div>
                    <div className="flex items-center justify-between gap-3 bg-[#F2F4F6] p-3 rounded-[12px]">
                      <label htmlFor="pushNotif" className="text-sm text-[#191C1E] font-semibold">Mail notification</label>
                      <Toggle enabled={mail} setEnabled={setMail} />
                    </div>
                 
                  </div>
                )
              }
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 cursor-pointer">
               <div>
                  <div className="flex items-center gap-2 mb-1">
                  <CloudIcon />
                  <h2 className="text-lg font-bold text-[#191C1E]">
                    Sessions
                  </h2>
                </div>
                <p className="text-sm text-[#434655] mb-4">
                  Upload your Identity Proof or Professional Certifications
                  (PDF, JPG, PNG up to 10MB).
                </p>
              </div>
            </section>
<div className="flex justify-end">
            <button className="mt-4 px-5 py-2 bg-[#4A45B6] text-white text-sm font-semibold rounded-lg hover:bg-[#4b45b6b4] transition cursor-pointer shadow-[0px_10px_15px_0px_#00000017] ">
                Save Profile Changes
            </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
