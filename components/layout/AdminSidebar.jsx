"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  User,
  CalendarDays,
  Briefcase,
  BarChart2,
  MessageSquare,
  Settings,
  LogOut,
  BarChart,
  FileText,
  CheckSquare,
  ChevronRight,
  ChevronLeft,
  Command,
  Sparkles,
  Lock,
  Building2
} from "lucide-react";
import { useTenant } from "@/hooks/useTenant";
import { useEffect, useState } from "react";
import { getTenantDetails } from "@/services/organizationService";
import { toast } from "react-hot-toast";

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const tenant = useTenant();
  const [role, setRole] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [setupComplete, setSetupComplete] = useState(true);
  const [companyLogo, setCompanyLogo] = useState(null);

  useEffect(() => {
    setMounted(true);
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);

    if (tenant) {
      checkSetupStatus();
    }
  }, [tenant]);

  const checkSetupStatus = async () => {
    try {
      const res = await getTenantDetails();
      setSetupComplete(res.data.setupComplete);
      setCompanyLogo(res.data.logoUrl);
    } catch (error) {
      console.error("Failed to check setup status", error);
    }
  };

  // Determine the correct path prefix for the home/dashboard route
  const manager = role === 'SUPER_ADMIN' ? 'manager' : role === 'ADMIN' ? 'admin' : '';

  // Dynamically generate navigation items based on the user's role
  const getNavItems = () => {
    // Shared items across all roles
    const sharedItems = [
      { label: "Payroll", href: `/${tenant}/payroll`, icon: Briefcase },
      { label: "Resignation", href: `/${tenant}/resignation`, icon: FileText },
      { label: "Attendance", href: `/${tenant}/attendance`, icon: BarChart2 },
      { label: "Tasks", href: `/${tenant}/tasks/MyTasks`, icon: CheckSquare },

    ];

    switch (role) {
      case 'SUPER_ADMIN':
        return [
          { label: "Home", href: `/${tenant}/${manager}/dashboard`, icon: LayoutGrid },
          { label: "Leave", href: `/${tenant}/manager/Leave-management`, icon: CalendarDays },
          ...sharedItems,
          {
            label: "Operations",
            href: setupComplete ? `/${tenant}/manager/operations` : "#",
            icon: Command,
            locked: !setupComplete
          }
        ];
      case 'ADMIN':
        return [
          { label: "Home", href: `/${tenant}/${manager}/home/overview`, icon: LayoutGrid },
          { label: "Leave", href: `/${tenant}/leaveManagement`, icon: CalendarDays },
          ...sharedItems,
          {
            label: "Operations",
            href: setupComplete ? `/${tenant}/admin/operations/employeemanagement/employee-list` : "#",
            icon: Command,
            locked: !setupComplete
          }
        ];
      default: // Regular Employee
        return [
          { label: "Home", href: `/${tenant}/home/overview`, icon: LayoutGrid }, // Employees usually don't have a 'manager' prefix
          // Add specific EMPLOYEE links here
          { label: "Leave", href: `/${tenant}/leaveManagement`, icon: CalendarDays },

          ...sharedItems
        ];
    }
  };

  const navItems = getNavItems();

  const bottomItems = [
    { label: "Settings", href: `/${tenant}/settings`, icon: Settings },
    { label: "Support", href: `/${tenant}/support`, icon: MessageSquare },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen?.(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen flex flex-col justify-between 
          bg-[#0A0F24] border-r border-white/5 shadow-2xl
          transform transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static
          ${isExpanded ? "w-[260px]" : "w-[88px]"}`}
      >
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header / Logo */}
          <div className="h-24 w-full flex items-center relative shrink-0 border-b border-white/5 bg-gradient-to-b from-white/[0.04] to-transparent px-4">
            <div className="w-[56px] flex items-center justify-center shrink-0">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.3)] overflow-hidden p-1.5 border border-white/10">
                {companyLogo ? (
                  <img src={companyLogo} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <Building2 className="text-indigo-600 w-5 h-5" />
                )}
              </div>
            </div>
            {isExpanded && (
              <div className="flex flex-col ml-1 overflow-hidden whitespace-nowrap">
                <span className="text-white font-bold tracking-wide text-[15px] leading-tight truncate max-w-[150px]">
                  {tenant?.toUpperCase() || "HR SAAS"}
                </span>
                <span className="text-blue-400 text-[10px] uppercase font-bold tracking-[0.2em] mt-0.5">Portal</span>
              </div>
            )}

            {/* Desktop Toggle Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#0A0F24] border border-white/10 rounded-full items-center justify-center text-slate-400 hover:text-white hover:scale-110 hover:bg-blue-600 transition-all z-50 shadow-lg"
            >
              {isExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>
          </div>

          {/* Main Nav */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 flex flex-col gap-2 relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {navItems.map(({ label, href, icon: Icon, locked }) => {
              const isActive = pathname === href;
              return (
                <div
                  key={label}
                  className="relative group"
                  onClick={() => {
                    if (locked) {
                      toast.error("Please complete Organization Setup first", {
                        icon: '🔒',
                        style: {
                          borderRadius: '16px',
                          background: '#0A0F24',
                          color: '#fff',
                        },
                      });
                    }
                  }}
                >
                  <Link
                    href={locked ? "#" : href}
                    className={`group relative flex items-center min-h-[50px] mx-4 rounded-xl transition-all duration-200
                      ${isActive
                        ? "bg-blue-600/15 text-blue-400"
                        : locked
                          ? "text-slate-600 cursor-not-allowed opacity-50"
                          : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                      }
                    `}
                    onClick={() => !locked && setIsOpen?.(false)}
                  >
                    {/* Active Indicator Line */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
                    )}

                    <div className="w-[56px] flex items-center justify-center shrink-0 relative">
                      <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} className={`transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                      {locked && (
                        <div className="absolute top-0 right-3 bg-red-500 rounded-full p-0.5 border border-[#0A0F24]">
                          <Lock size={8} className="text-white" />
                        </div>
                      )}
                    </div>

                    {isExpanded && (
                      <span className={`text-[14px] font-medium whitespace-nowrap transition-colors ${isActive ? "text-blue-400 font-semibold" : ""}`}>
                        {label}
                      </span>
                    )}

                    {/* Tooltip for Collapsed State */}
                    {!isExpanded && (
                      <div className="absolute left-[72px] px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-xl border border-white/10 z-50">
                        {label}
                      </div>
                    )}
                  </Link>
                </div>
              );
            })}

          </div>
        </div>

        {/* Bottom Nav */}
        <div className="py-4 border-t border-white/5 bg-gradient-to-t from-white/[0.02] to-transparent flex flex-col gap-2">
          {bottomItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`group relative flex items-center min-h-[50px] mx-4 rounded-xl transition-all duration-200
                  ${isActive
                    ? "bg-blue-600/15 text-blue-400"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }
                `}
                onClick={() => setIsOpen?.(false)}
              >
                {/* Active Indicator Line */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
                )}

                <div className="w-[56px] flex items-center justify-center shrink-0">
                  <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} className={`transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                </div>

                {isExpanded && (
                  <span className={`text-[14px] font-medium whitespace-nowrap ${isActive ? "text-blue-400 font-semibold" : ""}`}>
                    {label}
                  </span>
                )}

                {!isExpanded && (
                  <div className="absolute left-[72px] px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-xl border border-white/10 z-50">
                    {label}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}
