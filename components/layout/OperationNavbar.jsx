"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTenant } from "@/hooks/useTenant";



function ChevronDown() {
    return (
        <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
        >
            <polyline points="6 9 12 15 18 9" />
        </svg>
    );
}

function NavItem({ item }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const pathname = usePathname();


    useEffect(() => {
        function onClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
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
            {/* Trigger button */}
            <button
                onClick={() => setOpen((v) => !v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap cursor-pointer border-0`}
            >
                {item.label}
                <span
                    className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                >
                    <ChevronDown />
                </span>
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute top-full left-0  min-w-[210px] bg-white border border-gray-200 rounded-xl shadow-lg shadow-gray-100 py-1.5 z-50">
                    {item.items.map((navItem) => {
                        const active = pathname === navItem.href;
                        return (
                            <Link
                                key={navItem.href}
                                href={navItem.href}
                                onClick={() => setOpen(false)}
                                className={`flex items-center mx-1.5 px-3 py-2 rounded-lg text-[13.5px] transition-colors duration-100 no-underline
                                        ${active
                                        ? "bg-blue-50 text-blue-700 font-medium"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    }`}
                            >
                                {navItem.label}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    )
}


export default function OperationNavbar() {
    const tenant = useTenant();
    const NAV_ITEMS = [
        {
            id: "emp",
            label: "Employee Management",
            items: [
                { label: "All Employees", href: `/${tenant}/admin/operations/employeemanagement/employee-list` },
                { label: "Add Employee", href: `/${tenant}/admin/operations/employeemanagement/add-employee` },
                { label: "Promotion", href: `/${tenant}/admin/operations/promotion` },
                { label: "Performance", href: `/${tenant}/admin/operations/employeemanagement/performance` },
                { label: "Resignation", href: `/${tenant}/admin/operations/resignation` },
                { label: "Termination", href: `/${tenant}/admin/operations/employeemanagement/termination` },
                { label: "Advancement", href: `/${tenant}/admin/operations/employeemanagement/advancement` },

                { label: "Departments", href: `/${tenant}/admin/operations/department` },
                { label: "Add Department", href: `/${tenant}/admin/operations/department/add` },
            ]
        },
        {
            id: "leave",
            label: "Leave Management",
            items: [
                { label: "Leave Management", href: `/${tenant}/admin/operations/leaveManagement` },
                { label: "Create Leave Types", href: `/${tenant}/admin/operations/leaveManagement/Createleavetype` },
                { label: "Leave Requests", href: `/${tenant}/admin/operations/leaveManagement/leave-request` },
                // { label: "Apply Leave", href: "/operations/leave/apply" },
                { label: "Leave Balance", href: `/${tenant}/admin/operations/leaveManagement/leave-balance` },
            ]
        },
        {
            id: "att",
            label: "Attendance",
            items: [
                // { label: "Attendance Policy", href: "/operations/attendance/daily" },
                // { label: "Biometric Attendance", href: "/operations/attendance/monthly" },
                // { label: "Create Policy", href: "/operations/attendance/shifts" },
                { label: "Overview", href: `/${tenant}/admin/operations/attendance/overview` },
                { label: "Manage Attendance Policy", href: `/${tenant}/admin/operations/attendance/attendance-policy` },
                { label: "Create Attendance Policy", href: `/${tenant}/admin/operations/attendance/create-policy` },
                { label: "Biometric Attendance", href: `/${tenant}/admin/operations/attendance/biometric-attendance` },
                // { label: "Shift Management", href: `/${tenant}/admin/operations/attendance/shift-management` },
            ]
        },
        {
            id: "pay",
            label: "Payroll Management",
            items: [
                { label: "Overview", href: `/${tenant}/admin/operations/payrollmanagement` },
                { label: "Payslips", href: `/${tenant}/admin/operations/payrollmanagement/payslip` },
                { label: "Salary Structure", href: `/${tenant}/admin/operations/payrollmanagement/salarystructure` },
                { label: "Employee Salary", href: `/${tenant}/admin/operations/payrollmanagement/employeesalary` },
                { label: "Payroll Processing", href: `/${tenant}/admin/operations/payrollmanagement/payrollprocessing` },
                { label: "Payroll History", href: `/${tenant}/admin/operations/payrollmanagement/payrollhistory` },
                { label: "PayRoll System Config", href: `/${tenant}/admin/operations/payrollmanagement/payrollsystemconfig` },



            ]
        },
        {
            id: "hol",
            label: "Holidays",
            items: [
                { label: "Holiday List", href: `/${tenant}/admin/operations/holidays` },

            ]
        },
        {
            id: "con",
            label: "Config",
            items: [
                {
                    label: "Roles",
                    href: `/${tenant}/admin/operations/rolesmanagement`
                },
                {
                    label: "Promotion",
                    href: `/${tenant}/admin/operations/promotion`
                },
                {
                    label: "Holidays",
                    href: `/${tenant}/admin/operations/holidays`
                },
                {
                    label: "Announcement",
                    href: `/${tenant}/admin/operations/announcement`
                }
            ]
        },
        {
            id: "sup",
            label: "Support",
            items: [
                {
                    label: "Ticket Management",
                    href: `/${tenant}/admin/operations/support`
                }
            ]
        }
    ];
    return (
        <nav className="sticky top-0 z-40 bg-white border-b border-gray-200">
            <div className="flex items-center gap-1 px-6 h-[52px]">
                <span className="text-[15px] font-semibold text-gray-900 mr-3 pr-4 border-r border-gray-200 whitespace-nowrap shrink-0">
                    Operations
                </span>
                {NAV_ITEMS.map((item) => (
                    <NavItem key={item.id} item={item} />
                ))}
            </div>
        </nav>
    );
}