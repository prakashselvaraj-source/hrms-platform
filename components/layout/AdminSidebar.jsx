"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  Home,
  Shield,
  UserCheck,
  Users,
  Calendar,
  Clock,
  Award,
  BarChart2,
  TrendingUp,
  DollarSign,
  RefreshCw,
  FileText,
  Briefcase,
  AlertCircle,
  ChevronDown,
  UserRoundPen,
  CalendarCheck,
} from "lucide-react";
import { useState } from "react";

// ─── Sidebar Data with hrefs ──────────────────────────────────────────────────



// ─── Sidebar Component ────────────────────────────────────────────────────────

export default function AdminSidebar() {
  const pathname = usePathname();
  const { dashboard } = useParams();

  const sidebarSections = [
    {
      title: "MAIN",
      items: [
        { label: "Home", icon: Home, href: `/${dashboard}/dashboard` },
      ],
    },
    {
      title: "PEOPLE",
      items: [
        { label: "Roles Management", icon: Shield, href: `/${dashboard}/admin/rolesmanagement` },
        { label: "Permission management", icon: UserCheck, href: `/${dashboard}/people/permissions` },
      ],
    },
    {
      title: null,
      items: [
        {
          label: "Employee Management",
          icon: Users,
          expandable: true,
          children: [
            { label: "Employee directory", href: `/${dashboard}/admin/employeemanagement/employee-list` },
            { label: "Add Employees", href: `/${dashboard}/admin/employeemanagement/add-employee` },
            { label: "Promotion", href: `/${dashboard}/admin/promotion` },
            { label: "Performance", href: `/${dashboard}/admin/employeemanagement/performance` },
            { label: "Resignation", href: `/${dashboard}/admin/employeemanagement/resignation` },
            { label: "Termination", href: `/${dashboard}/admin/employeemanagement/termination` },
            { label: "Advancement", href: `/${dashboard}/admin/employeemanagement/advancement` },
          ],
        },
      ],
    },
    {
      title: "TIME & LEAVE & HOLIDAYS",
      items: [
        {
          label: "Leave Management",
          icon: Calendar,
          expandable: true,
          children: [
            { label: "Leave Types", href: `/${dashboard}/admin/leaves` },
            { label: "Leave Policies", href: `/${dashboard}/admin/leaves/leave-policy-config` },
            { label: "Leave Requests", href: `/${dashboard}/admin/leaves/leave-request` },
            { label: "Leave Balance", href: `/${dashboard}/admin/leaves/leave-balance` },
          ],
        },
      ],
    },
    {
      title: null,
      items: [
        {
          label: "Attendance",
          icon: Clock,
          expandable: true,
          children: [
            { label: "Overview", href: `/${dashboard}/admin/attendance/overview` },
            { label: "Create Policy", href: `/${dashboard}/admin/attendance/create-policy` },
            { label: "Attendance Policy", href: `/${dashboard}/admin/attendance/attendance-policy` },
            { label: "Biometric Attendance", href: `/${dashboard}/admin/attendance/biometric-attendance` },
          ],
        },
      ],
    },
    {
      title: null,
      items: [
        {
          label: "PayRoll Manangement",
          icon: Clock,
          expandable: true,
          children: [
            { label: "Overview", href: `/${dashboard}/admin/payrollmanagement` },
            { label: "Salary Structure", href: `/${dashboard}/admin/payrollmanagement/salarystructure` },
            { label: "Employee Salary", href: `/${dashboard}/admin/payrollmanagement/employeesalary` },
            { label: "Payroll Processing", href: `/${dashboard}/admin/payrollmanagement/payrollprocessing` },
            { label: "PaySlip", href: `/${dashboard}/admin/payrollmanagement/payslip` },
            { label: "PayRoll History", href: `/${dashboard}/admin/payrollmanagement/payrollhistory` },
            { label: "PayRoll System Config", href: `/${dashboard}/admin/payrollmanagement/payrollsystemconfig` },


          ],
        },
      ],
    },
    {
      title: null,
      items: [
        {
          label: "Holidays",
          icon: Award,
          expandable: true,
          children: [
            { label: "Geo-calendar", href: `/${dashboard}/holidays/geo-calendar` },
            { label: "Upcoming holidays", href: `/${dashboard}/admin/holidays` },
          ],
        },
      ],
    },
    {
      title: " MANAGEMENT",
      items: [
        { label: "Tasks", icon: CalendarCheck, href: `/${dashboard}/admin/tasks` },
        { label: "Departments", icon: UserRoundPen, href: `/${dashboard}/admin/department` },
        { label: "Announcements", icon: BarChart2, href: `/${dashboard}/admin/announcement` },
        { label: "Overview", icon: BarChart2, href: `/${dashboard}/payroll` },
        { label: "Salary Structure", icon: TrendingUp, href: `/${dashboard}/payroll/salary-structure` },
        { label: "Employee Salary", icon: DollarSign, href: `/${dashboard}/payroll/employee-salary` },
        { label: "Payroll processing", icon: RefreshCw, href: `/${dashboard}/payroll/processing` },
        { label: "Details", icon: FileText, href: `/${dashboard}/payroll/details` },
        { label: "Previous Payroll", icon: Briefcase, href: `/${dashboard}/payroll/previous` },
        { label: "Pay cycle configure", icon: AlertCircle, href: `/${dashboard}/payroll/pay-cycle` },
      ],
    },
  ];

  const [expanded, setExpanded] = useState({
    "Employee Management": true,
    "Leave Management": true,
    Attendance: false,
    Holidays: false,
  });

  const isActive = (href) => pathname === href;
  const isChildActive = (children) =>
    Array.isArray(children) && children.some((c) => pathname === c.href);

  return (
    <aside className="w-64 min-h-screen bg-[#1a1a2e] text-white flex flex-col static left-0 top-0 bottom-0 overflow-y-auto z-10">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/10">
        <p className="text-xs font-bold tracking-widest text-indigo-300 uppercase">
          HR Portal
        </p>
      </div>

      <nav className="flex-1 py-2">
        {sidebarSections.map((section, si) => (
          <div key={si} className="mt-2">
            {/* Section heading */}
            {section.title && (
              <p className="px-4 py-1 text-[9px] tracking-widest text-gray-500 uppercase font-semibold">
                {section.title}
              </p>
            )}

            {section.items.map((item) =>
              item.expandable ? (
                // ── Expandable group ──────────────────────────────────────
                <div key={item.label}>
                  <button
                    onClick={() =>
                      setExpanded((p) => ({ ...p, [item.label]: !p[item.label] }))
                    }
                    className={`w-full flex items-center justify-between px-4 py-2 text-xs
                                hover:bg-white/10 transition-colors
                                ${isChildActive(item.children) ? "text-indigo-300" : "text-gray-300"}`}
                  >
                    <span className="flex items-center gap-2">
                      <item.icon size={13} />
                      {item.label}
                    </span>
                    <ChevronDown
                      size={11}
                      className={`transition-transform ${expanded[item.label] ? "rotate-180" : ""}`}
                    />
                  </button>

                  {expanded[item.label] && (
                    <div className="ml-7 border-l border-white/10">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-3 py-1.5 text-[11px] hover:text-white transition-colors
                                      ${isActive(child.href)
                              ? "text-white font-semibold bg-indigo-600/20 border-l-2 border-indigo-400 -ml-px pl-[11px]"
                              : "text-gray-400"}`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // ── Flat link ─────────────────────────────────────────────
                <Link
                  key={item.href}
                  href={item.href}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-xs
                              hover:bg-white/10 transition-colors
                              ${isActive(item.href)
                      ? "bg-indigo-600/40 text-white font-medium"
                      : "text-gray-300"}`}
                >
                  <item.icon size={13} />
                  {item.label}
                </Link>
              )
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}