"use client";

import { useState } from "react";
import {
    ChevronRight, User, ArrowLeft, ArrowRight,
    Settings, Clock, CalendarDays, ShieldCheck, Zap, DollarSign, Users,
} from "lucide-react";

import GeneralTab from "./components/GeneralTab";
import WorkingHoursTab from "./components/WorkingHoursTab";
import ShiftsTab from "./components/ShiftsTab";
import AttendanceRulesTab from "./components/AttendanceRulesTab";
import OvertimeTab from "./components/OvertimeTab";
import PayrollMappingTab from "./components/PayrollMappingTab";
import AssignmentTab from "./components/AssignmentTab";

// ─── Tabs definition (was previously in PolicyTabs.jsx) ──────────────────────
const TABS = [
    { id: "general", label: "General", Icon: Settings },
    { id: "working-hours", label: "Working Hours", Icon: Clock },
    { id: "shifts", label: "Shifts", Icon: CalendarDays },
    { id: "attendance-rules", label: "Attendance Rules", Icon: ShieldCheck },
    { id: "overtime", label: "Overtime", Icon: Zap },
    { id: "payroll-mapping", label: "Payroll Mapping", Icon: DollarSign },
    { id: "assignment", label: "Assignment", Icon: Users },
];

const TAB_IDS = TABS.map((t) => t.id);

// ─── Default form state ───────────────────────────────────────────────────────
const DEFAULT_DATA = {
    policyName: "Monthly",
    policyCode: "",
    effectiveFrom: "",
    description: "Monthly",
    policyActive: true,
    workingDays: [true, true, true, true, true, false, false],
    sat1and3: true,
    sat2and4: true,
    sat5: false,
    dailyHours: 9,
    weeklyOff: "Sunday",
    breakMins: 60,
    monthlyDays: 26,
    shiftType: "Flexible",
    shiftName: "Morning Shift",
    shiftStart: "09:00",
    shiftEnd: "18:00",
    lateEntryMins: 15,
    earlyExitMins: 30,
    lateMarkAfter: "",
    earlyExitThreshold: "",
    lateMarksBeforeLop: "",
    maxLateMarks: "",
    halfDayHours: 4.5,
    fullAbsentHours: "",
    noLoginAbsent: true,
    continuousAbsenceAlert: true,
    enableTimeRounding: false,
    enableOvertimeTracking: true,
    calcBasis: "Daily threshold (Over 8 hrs)",
    minHoursToTrigger: 0.5,
    maxOtHours: 40,
    managerApprovalRequired: true,
    autoCapEnforcement: false,
    includeWorkingDays: true,
    includePaidHolidays: true,
    includeApprovedLeaves: true,
    includeOvertimePay: false,
    lopBasis: "Attendance shortage (recommended)",
    halfDayLopFactor: 0.5,
    workingDaysMonth: 26,
    lateMarkLopFactor: 0.1,
    departments: ["Engineering", "Product", "HR"],
    roles: ["Developer", "Senior Engineer", "Manager"],
    assignedEmployees: [1, 2],
};

export default function CreatePolicyPage() {
    const [activeTab, setActiveTab] = useState("general");
    const [formData, setFormData] = useState(DEFAULT_DATA);
    const [saved, setSaved] = useState(false);

    function handleChange(key, value) {
        setFormData((prev) => ({ ...prev, [key]: value }));
    }

    function handleSave() {
        console.log("Saving policy:", formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    }

    function handleCancel() {
        if (window.confirm("Discard changes?")) {
            setFormData(DEFAULT_DATA);
            setActiveTab("general");
        }
    }

    const currentTabIdx = TAB_IDS.indexOf(activeTab);
    const hasPrev = currentTabIdx > 0;
    const hasNext = currentTabIdx < TAB_IDS.length - 1;

    function renderTab() {
        switch (activeTab) {
            case "general": return <GeneralTab data={formData} onChange={handleChange} />;
            case "working-hours": return <WorkingHoursTab data={formData} onChange={handleChange} />;
            case "shifts": return <ShiftsTab data={formData} onChange={handleChange} />;
            case "attendance-rules": return <AttendanceRulesTab data={formData} onChange={handleChange} />;
            case "overtime": return <OvertimeTab data={formData} onChange={handleChange} />;
            case "payroll-mapping": return <PayrollMappingTab data={formData} onChange={handleChange} />;
            case "assignment": return <AssignmentTab data={formData} onChange={handleChange} />;
            default: return null;
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="px-4 sm:px-6 py-6">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
                    <span className="hover:text-violet-600 cursor-pointer">Attendance</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-gray-600 font-medium">Create / Edit Policy</span>
                </nav>

                <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Policy</h1>

                <div className="bg-white rounded-sm border-t-2 border-[#DCDCDC61] overflow-hidden">

                    {/* Card Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-black" />
                            <span className="text-lg font-semibold">Create New Policy</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="text-sm font-semibold text-[#4A45B6] hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                className={`text-sm font-semibold px-5 py-2 rounded-sm transition-all ${saved
                                    ? "bg-emerald-500 text-white"
                                    : "bg-[#4A45B6] hover:bg-violet-700 text-white"
                                    }`}
                            >
                                {saved ? "✓ Saved!" : "Save Policy"}
                            </button>
                        </div>
                    </div>

                    {/* Tabs Navigation — inlined from PolicyTabs */}
                    <div className="border-b border-gray-100 bg-white sticky top-0 z-10">
                        <div className="flex overflow-x-auto scrollbar-hide gap-0">
                            {TABS.map(({ id, label, Icon }) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => setActiveTab(id)}
                                    className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-3.5 text-xs 
                                        font-semibold  transition-colors ${activeTab === id
                                            ? "bg-[#4A45B6] text-white"
                                            : "border-transparent hover:text-gray-600 hover:border-gray-200"
                                        }`}

                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="px-5 sm:px-8 py-7">{renderTab()}</div>

                    {/* Footer Navigation */}
                    <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-t border-gray-100 bg-gray-50/50">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="text-sm font-semibold text-gray-500 hover:text-gray-700"
                        >
                            Cancel
                        </button>
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => hasPrev && setActiveTab(TAB_IDS[currentTabIdx - 1])}
                                disabled={!hasPrev}
                                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${hasPrev ? "text-gray-600 hover:text-violet-600" : "text-gray-300 cursor-not-allowed"
                                    }`}
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Previous Tab
                            </button>
                            <button
                                type="button"
                                onClick={() => hasNext && setActiveTab(TAB_IDS[currentTabIdx + 1])}
                                disabled={!hasNext}
                                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${hasNext ? "text-violet-600 hover:text-violet-800" : "text-gray-300 cursor-not-allowed"
                                    }`}
                            >
                                Next Tab
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}