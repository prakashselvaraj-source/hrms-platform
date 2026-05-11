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
} from "lucide-react";
import { useTenant } from "@/hooks/useTenant";

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const tenant = useTenant();

  const navItems = [
    { label: "Home", href: `/${tenant}/home/overview`, icon: LayoutGrid },
    { label: "Profile", href: `/${tenant}/profile`, icon: User },
    { label: "Leave", href: `/${tenant}/leaveManagement`, icon: CalendarDays },
    { label: "Payroll", href: `/${tenant}/payroll`, icon: Briefcase },
    { label: "Performance", href: `/${tenant}/performance`, icon: BarChart2 },
    { label: "Support", href: `/${tenant}/support`, icon: MessageSquare },
  ];

  const bottomItems = [
    { label: "Settings", href: `/${tenant}/settings`, icon: Settings },
    { label: "Logout", href: "/logout", icon: LogOut },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-20 flex-col items-center bg-[#1a2b6d]
  transform transition-transform duration-300
  ${isOpen ? "translate-x-0" : "-translate-x-full"}
  md:translate-x-0 md:static md:flex`}
      >
        {" "}
        {/* Header */}
        <div className="w-full bg-[#0f1e57] px-2 py-4 text-center">
          <p className="text-[10px] font-medium leading-tight tracking-wide text-white">
            EMPLOYEE
            <br />
            PORTAL
          </p>
        </div>
        {/* Main Nav */}
        <nav className="flex w-full flex-1 flex-col items-center py-2">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex w-full flex-col items-center gap-1 px-2 py-3 text-[10px] transition-colors
                ${isActive
                    ? "bg-white/15 text-white"
                    : "text-[#8fa3d6] hover:bg-white/10 hover:text-white"
                  }`}
                onClick={() => setIsOpen(false)}

              >
                <Icon size={22} strokeWidth={1.8} />
                <span className="text-center leading-tight">{label}</span>
              </Link>
            );
          })}
        </nav>
        {/* Divider */}


        <div className="mx-auto mb-1 h-px w-10 bg-white/15" />
        {/* Bottom Nav */}
        <div className="mb-3 flex w-full flex-col items-center">
          {bottomItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex w-full flex-col items-center gap-1 px-2 py-3 text-[10px] transition-colors
                ${isActive
                    ? "bg-white/15 text-white"
                    : "text-[#8fa3d6] hover:bg-white/10 hover:text-white"
                  }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={22} strokeWidth={1.8} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}
