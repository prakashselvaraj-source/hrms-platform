"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTenant } from "@/hooks/useTenant";
import useRole from "@/hooks/useRole";
import { ChevronDown, MoreHorizontal, LayoutGrid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function NavChevron() {
    return (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="6 9 12 15 18 9" />
        </svg>
    );
}

function NavItem({ item, isDropdown = false }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const pathname = usePathname();

    useEffect(() => {
        function onClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    return (
        <div
            ref={ref}
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <button
                onClick={() => setOpen((v) => !v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 whitespace-nowrap cursor-pointer border-0
                    ${open ? "bg-slate-50 text-[#4A45B6]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
            >
                {item.label}
                <span className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
                    <NavChevron />
                </span>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute top-full ${isDropdown ? 'left-full ml-2 -top-2' : 'left-0'} min-w-[220px] max-h-[80vh] overflow-y-auto bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 py-2 z-[100] [scrollbar-width:none]`}
                    >
                        {item.items.map((navItem) => {
                            const active = pathname === navItem.href;
                            return (
                                <Link
                                    key={navItem.href}
                                    href={navItem.href}
                                    onClick={() => setOpen(false)}
                                    className={`flex items-center mx-2 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-150
                                        ${active ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                                >
                                    {navItem.label}
                                </Link>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default function OperationNavbar() {
    const tenant = useTenant();
    const userRole = useRole();
    const role = userRole === "SUPER_ADMIN" ? "manager" : userRole === "ADMIN" ? "admin" : "";
    
    const containerRef = useRef(null);
    const itemRefs = useRef([]);
    const [visibleCount, setVisibleCount] = useState(7); // Default to all

    const NAV_ITEMS = useMemo(() => [
        {
            id: "emp",
            label: "Employee Management",
            items: [
                { label: "All Employees", href: `/${tenant}/${role}/operations/employeemanagement/employee-list` },
                { label: "Add Employee", href: `/${tenant}/${role}/operations/employeemanagement/add-employee` },
                { label: "Promotion", href: `/${tenant}/${role}/operations/promotion` },
                { label: "Performance", href: `/${tenant}/${role}/operations/employeemanagement/performance` },
                { label: "Resignation", href: `/${tenant}/${role}/operations/resignation` },
                { label: "Termination", href: `/${tenant}/${role}/operations/employeemanagement/termination` },
                { label: "Advancement", href: `/${tenant}/${role}/operations/employeemanagement/advancement` },
                { label: "Departments", href: `/${tenant}/${role}/operations/department` },
                { label: "Add Department", href: `/${tenant}/${role}/operations/department/add` },
            ]
        },
        {
            id: "leave",
            label: "Leave Management",
            items: [
                { label: "Leave Management", href: `/${tenant}/${role}/operations/leaveManagement` },
                { label: "Create Leave Types", href: `/${tenant}/${role}/operations/leaveManagement/Createleavetype` },
                { label: "Leave Requests", href: `/${tenant}/${role}/operations/leaveManagement/leave-request` },
                { label: "Leave Balance", href: `/${tenant}/${role}/operations/leaveManagement/leave-balance` },
            ]
        },
        {
            id: "att",
            label: "Attendance",
            items: [
                { label: "Overview", href: `/${tenant}/${role}/operations/attendance/overview` },
                { label: "Manage Attendance Policy", href: `/${tenant}/${role}/operations/attendance/attendance-policy` },
                { label: "Create Attendance Policy", href: `/${tenant}/${role}/operations/attendance/create-policy` },
                { label: "Biometric Attendance", href: `/${tenant}/${role}/operations/attendance/biometric-attendance` },
            ]
        },
        {
            id: "pay",
            label: "Payroll Management",
            items: [
                { label: "Overview", href: `/${tenant}/${role}/operations/payrollmanagement` },
                { label: "Payslips", href: `/${tenant}/${role}/operations/payrollmanagement/payslip` },
                { label: "Salary Structure", href: `/${tenant}/${role}/operations/payrollmanagement/salarystructure` },
                { label: "Employee Salary", href: `/${tenant}/${role}/operations/payrollmanagement/employeesalary` },
                { label: "Payroll Processing", href: `/${tenant}/${role}/operations/payrollmanagement/payrollprocessing` },
                { label: "Payroll History", href: `/${tenant}/${role}/operations/payrollmanagement/payrollhistory` },
                { label: "PayRoll System Config", href: `/${tenant}/${role}/operations/payrollmanagement/payrollsystemconfig` },
            ]
        },
        {
            id: "hol",
            label: "Holidays",
            items: [
                { label: "Holiday List", href: `/${tenant}/${role}/operations/holidays` },
            ]
        },
        {
            id: "con",
            label: "Config",
            items: [
                { label: "Roles", href: `/${tenant}/${role}/operations/rolesmanagement` },
                { label: "Promotion", href: `/${tenant}/${role}/operations/promotion` },
                { label: "Holidays", href: `/${tenant}/${role}/operations/holidays` },
                { label: "Announcement", href: `/${tenant}/${role}/operations/announcement` }
            ]
        },
        {
            id: "sup",
            label: "Support",
            items: [
                { label: "Ticket Management", href: `/${tenant}/${role}/operations/support` }
            ]
        }
    ], [tenant, role]);

    useEffect(() => {
        const updateLayout = () => {
            if (!containerRef.current) return;
            const containerWidth = containerRef.current.offsetWidth;
            let totalWidth = 120; // Start with logo and spacing
            let count = NAV_ITEMS.length;

            for (let i = 0; i < NAV_ITEMS.length; i++) {
                const el = itemRefs.current[i];
                if (!el) continue;
                totalWidth += el.offsetWidth + 8; // width + gap
                if (totalWidth > containerWidth - 60) { // buffer for 'More' button
                    count = i;
                    break;
                }
            }
            setVisibleCount(count);
        };

        const observer = new ResizeObserver(updateLayout);
        if (containerRef.current) observer.observe(containerRef.current);
        updateLayout();
        return () => observer.disconnect();
    }, [NAV_ITEMS]);

    const visibleItems = NAV_ITEMS.slice(0, visibleCount);
    const hiddenItems = NAV_ITEMS.slice(visibleCount);

    return (
        <nav className="sticky top-0 z-[100] bg-white border-b border-slate-100 shadow-sm backdrop-blur-md bg-white/80">
            <div ref={containerRef} className="flex items-center gap-1 px-6 h-[56px] max-w-[1600px] mx-auto relative">
                
                {/* ── Logo Section ── */}
                <div className="flex items-center gap-2 mr-4 pr-4 border-r border-slate-100 shrink-0">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                        <LayoutGrid size={18} />
                    </div>
                    <span className="text-[14px] font-black text-slate-900 tracking-tight uppercase">
                        Ops Hub
                    </span>
                </div>

                {/* ── Invisible Measurement Layer ── */}
                <div className="absolute opacity-0 pointer-events-none flex gap-1 -z-10 overflow-hidden h-0">
                    {NAV_ITEMS.map((item, i) => (
                        <div key={`measure-${item.id}`} ref={el => itemRefs.current[i] = el} className="px-3 py-1.5 text-sm font-bold whitespace-nowrap">
                            {item.label}
                        </div>
                    ))}
                </div>

                {/* ── Visible Items ── */}
                <div className="flex items-center gap-1">
                    {visibleItems.map((item) => (
                        <NavItem key={item.id} item={item} />
                    ))}
                </div>

                {/* ── Overflow Menu ── */}
                {hiddenItems.length > 0 && (
                    <div className="ml-auto flex items-center">
                        <NavItem 
                            item={{ 
                                label: <div className="flex items-center gap-1.5"><MoreHorizontal size={18} /> <span className="hidden sm:inline">More</span></div>, 
                                items: hiddenItems.flatMap(group => group.items.map(subItem => ({
                                    ...subItem,
                                    label: <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">{group.label}</span> {subItem.label}</div>
                                })))
                            }} 
                        />
                    </div>
                )}
            </div>
        </nav>
    );
}