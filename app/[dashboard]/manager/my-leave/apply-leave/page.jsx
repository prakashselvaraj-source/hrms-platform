"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    ChevronRight,
    Home,
    Calendar,
    MessageSquare,
    UploadCloud,
    X,
    ChevronDown,
    Info,
    ArrowLeft
} from "lucide-react";

const LEAVE_TYPES = [
    { id: "sl", name: "Sick Leave", balance: "06/10", color: "text-amber-600 bg-amber-50" },
    { id: "cl", name: "Casual Leave", balance: "07/14", color: "text-violet-600 bg-violet-50" },
    { id: "co", name: "Comp Off", balance: "02/05", color: "text-emerald-600 bg-emerald-50" },
    { id: "ol", name: "Optional Leave", balance: "01/02", color: "text-blue-600 bg-blue-50" },
    { id: "lop", name: "LOP", balance: "--", color: "text-rose-600 bg-rose-50" },
];

function CustomDropdown({ options, value, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handleClick(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const selected = options.find(opt => opt.id === value) || options[0];

    return (
        <div ref={ref} className="relative">
            <label className="block text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Leave Type</label>
            <div
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 h-[50px] cursor-pointer hover:border-[#4A45B6] transition-all"
            >
                <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${selected.color}`}>
                        {selected.name.toUpperCase()}
                    </span>
                    <span className="text-[14px] text-gray-400">Balance: <span className="font-bold text-gray-700">{selected.balance}</span></span>
                </div>
                <ChevronDown size={18} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
            </div>

            {open && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] bg-white border border-gray-100 rounded-xl shadow-2xl z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    {options.map((opt) => (
                        <div
                            key={opt.id}
                            onClick={() => { onChange(opt.id); setOpen(false); }}
                            className={`px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${value === opt.id ? "bg-violet-50/50" : ""}`}
                        >
                            <span className={`text-[14px] font-semibold ${value === opt.id ? "text-[#4A45B6]" : "text-gray-700"}`}>{opt.name}</span>
                            <span className="text-[12px] text-gray-400">Balance: {opt.balance}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ApplyLeave() {
    const router = useRouter();
    const [leaveType, setLeaveType] = useState("cl");
    const [isHalfDay, setIsHalfDay] = useState(false);
    const [formData, setFormData] = useState({
        fromDate: "",
        toDate: "",
        reason: "",
    });

    const calculateDays = () => {
        if (!formData.fromDate || !formData.toDate) return 0;
        const start = new Date(formData.fromDate);
        const end = new Date(formData.toDate);
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        if (diff < 0) return 0;
        return isHalfDay ? 0.5 : diff;
    };

    const days = calculateDays();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (leaveType === "cl" && days > 2) {
            alert("Casual Leave (CL) cannot exceed 2 days.");
            return;
        }

        // Mock submission
        alert("Leave application submitted successfully!");
        router.push("/manager/My-leave");
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] p-6 md:p-10 font-sans">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[12px] text-gray-400 mb-6 uppercase tracking-widest font-bold">
                <Home size={12} />
                <ChevronRight size={12} />
                <span className="cursor-pointer hover:text-[#4A45B6]" onClick={() => router.push("/manager/My-leave")}>My Leaves</span>
                <ChevronRight size={12} />
                <span className="text-[#4A45B6]">Apply Leave</span>
            </div>

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 rounded-full bg-white border border-gray-200 
                    flex items-center justify-center text-gray-400 hover:text-[#4A45B6] 
                    hover:border-[#4A45B6] transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Apply Leave</h1>
                    <p className="text-gray-400 text-sm mt-1">Submit your leave request for approval</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <CustomDropdown
                                    options={LEAVE_TYPES}
                                    value={leaveType}
                                    onChange={setLeaveType}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">From Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="date"
                                                required
                                                className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 h-[50px] text-[14px] focus:outline-none focus:border-[#4A45B6] transition-all"
                                                value={formData.fromDate}
                                                onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">To Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="date"
                                                required
                                                className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 h-[50px] text-[14px] focus:outline-none focus:border-[#4A45B6] transition-all"
                                                value={formData.toDate}
                                                onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 bg-violet-50/50 p-4 rounded-xl border border-violet-100/50">
                                    <input
                                        type="checkbox"
                                        id="halfday"
                                        className="w-4 h-4 rounded text-[#4A45B6] focus:ring-[#4A45B6]"
                                        checked={isHalfDay}
                                        onChange={(e) => setIsHalfDay(e.target.checked)}
                                    />
                                    <label htmlFor="halfday" className="text-[14px] font-semibold text-gray-700 cursor-pointer">Apply for half day</label>
                                    <div className="ml-auto group relative cursor-help">
                                        <Info size={16} className="text-violet-400" />
                                        <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-900 text-white text-[10px] rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                            Half day will be counted as 0.5 days in your balance.
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Reason for Leave</label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-4 top-4 text-gray-400" size={18} />
                                        <textarea
                                            required
                                            rows="4"
                                            placeholder="Please explain the reason for your leave request..."
                                            className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-[14px] focus:outline-none focus:border-[#4A45B6] transition-all resize-none"
                                            value={formData.reason}
                                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                        ></textarea>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Attachment (Optional)</label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#4A45B6] hover:bg-violet-50/30 transition-all cursor-pointer group">
                                        <UploadCloud size={32} className="mx-auto text-gray-300 group-hover:text-[#4A45B6] mb-2 transition-colors" />
                                        <p className="text-[13px] font-semibold text-gray-500 group-hover:text-gray-700 transition-colors">Click to upload or drag and drop</p>
                                        <p className="text-[11px] text-gray-400 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 h-[50px] bg-[#4A45B6] text-white rounded-xl font-bold text-[14px] hover:bg-[#3d38a0] shadow-lg shadow-violet-200 transition-all active:scale-[0.98]"
                                    >
                                        Submit Application
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.back()}
                                        className="px-8 h-[50px] bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-[14px] hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="space-y-6">
                    <div className="bg-[#4A45B6] rounded-2xl p-6 text-white shadow-xl shadow-violet-200 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-[18px] font-bold mb-4">Leave Policy Highlights</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <Info size={12} />
                                    </div>
                                    <p className="text-[13px] text-white/90 leading-relaxed font-bold">Casual leaves (CL) cannot exceed 2 days per request.</p>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <Info size={12} />
                                    </div>
                                    <p className="text-[13px] text-white/90 leading-relaxed">Medical certificate is required for sick leaves exceeding 2 days.</p>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <Info size={12} />
                                    </div>
                                    <p className="text-[13px] text-white/90 leading-relaxed">Comp-off should be utilized within 60 days of earning.</p>
                                </li>
                            </ul>
                        </div>
                        {/* Decorative background circle */}
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="text-[16px] font-bold text-gray-900 mb-4">Summary</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                                <span className="text-[13px] text-gray-400">Total Days</span>
                                <span className={`text-[14px] font-bold ${leaveType === "cl" && days > 2 ? "text-rose-500" : "text-gray-700"}`}>
                                    {days > 0 ? `${days} day${days > 1 ? "s" : ""}` : "--"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                                <span className="text-[13px] text-gray-400">Effective From</span>
                                <span className="text-[14px] font-bold text-gray-700">{formData.fromDate || "--"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[13px] text-gray-400">Approver</span>
                                <span className="text-[14px] font-bold text-gray-700">Manager (Admin)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
