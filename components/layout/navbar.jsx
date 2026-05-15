"use client";

import { Bell, HelpCircle, Menu, User, Building2, LogOut, Settings, ChevronDown, Shield } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTenant } from "@/hooks/useTenant";
import { getAdminProfile } from "@/services/adminService";

export default function Navbar({ setIsOpen }) {
  const router = useRouter();
  const tenant = useTenant();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const dropdownRef = useRef(null);

  // ── Load logged-in user data ──
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    const fetchUser = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        if (!email) return;
        const res = await getAdminProfile(email);
        setProfile(res.data);
      } catch (err) {
        // Fallback: use localStorage name/email
        const name = localStorage.getItem("userName") || localStorage.getItem("userEmail") || "Admin";
        setProfile({ firstName: name, lastName: "", user: { email: localStorage.getItem("userEmail") }, tenant: null });
      }
    };
    fetchUser();
  }, []);

  // ── Close dropdown on outside click ──
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  // ── Derived display values ──
  const managerPath = role === "ADMIN" ? "manager" : "admin";
  const fullName = profile ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() : "Loading…";
  const email = profile?.user?.email || "";
  const initials = fullName !== "Loading…"
    ? fullName.split(" ").map(n => n[0]).filter(Boolean).join("").slice(0, 2).toUpperCase()
    : "?";

  // Use a stable fallback for designation during hydration
  const designation = profile?.designation || (role === "SUPER_ADMIN" ? "Super Admin" : (role ? "Admin" : "..."));
  const companyName = profile?.tenant?.companyName || tenant;

  return (
    <header className="flex h-[56px] w-full items-center justify-between border-b border-slate-100 bg-white px-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] z-30">

      {/* ── Mobile menu toggle ── */}
      <div className="flex items-center md:hidden">
        <button onClick={() => setIsOpen(true)} className="text-slate-400 hover:text-slate-600 transition-colors">
          <Menu size={20} />
        </button>
      </div>

      {/* ── Right Section ── */}
      <div className="flex items-center gap-4 ml-auto">

        {/* Notification Bell */}
        <button
          className="relative text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-50"
          aria-label="Notifications"
        >
          <Bell size={19} strokeWidth={1.8} />
          {/* Unread indicator */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
        </button>

        {/* Help */}
        <button
          className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-50"
          aria-label="Help"
        >
          <HelpCircle size={19} strokeWidth={1.8} />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-150 bg-slate-200" />

        {/* ── User Profile Dropdown ── */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-slate-50 transition-all duration-150 cursor-pointer border-0 bg-transparent"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden flex-shrink-0 shadow-sm">
              {profile?.photoUrl ? (
                <img src={profile.photoUrl} alt={fullName} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>

            {/* Name & Role */}
            <div className="text-left hidden sm:block">
              <p className="text-[13px] font-semibold text-slate-800 leading-tight">{fullName}</p>
              <p className="text-[10.5px] text-slate-400 leading-tight">{designation}</p>
            </div>

            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* ── Dropdown Panel ── */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-[260px] bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/60 py-2 z-[200]">

              {/* Profile header */}
              <div className="px-4 pt-3 pb-4 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm overflow-hidden">
                    {profile?.photoUrl
                      ? <img src={profile.photoUrl} alt={fullName} className="w-full h-full object-cover" />
                      : initials
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold text-slate-900 truncate">{fullName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{email}</p>
                    <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      <Shield size={9} /> {role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                    </span>
                  </div>
                </div>
                {companyName && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg px-2.5 py-1.5">
                    <Building2 size={12} className="text-slate-400 shrink-0" />
                    <span className="truncate font-medium">{companyName}</span>
                  </div>
                )}
              </div>

              {/* Menu items */}
              <div className="py-1.5 px-2">
                <DropdownItem
                  icon={<User size={15} />}
                  label="My Profile"
                  sub="Manage your personal details"
                  href={`/${tenant}/${managerPath}/profile`}
                  onClick={() => setDropdownOpen(false)}
                />
                <DropdownItem
                  icon={<Building2 size={15} />}
                  label="Organization"
                  sub={companyName || "View tenant settings"}
                  href={`/${tenant}/${managerPath}/organization`}
                  onClick={() => setDropdownOpen(false)}
                />
                <DropdownItem
                  icon={<Settings size={15} />}
                  label="Settings"
                  sub="Preferences and configuration"
                  href={`/${tenant}/${managerPath}/dashboard`}
                  onClick={() => setDropdownOpen(false)}
                />
              </div>

              {/* Logout */}
              <div className="border-t border-slate-50 px-2 pt-1.5 pb-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all text-sm font-semibold cursor-pointer border-0 bg-transparent"
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// ── Reusable dropdown item ──
function DropdownItem({ icon, label, sub, href, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-all group"
    >
      <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-slate-700 group-hover:text-slate-900 leading-tight">{label}</p>
        <p className="text-[10.5px] text-slate-400 leading-none mt-0.5 truncate">{sub}</p>
      </div>
    </Link>
  );
}