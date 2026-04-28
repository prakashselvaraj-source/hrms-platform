"use client";

import { useState, useRef, useEffect } from "react";
import {
    Search, Filter, Plus, Eye, Pencil, Trash2, RefreshCw,
    FileText, ChevronLeft, ChevronRight, ChevronDown, X,
    Download, GraduationCap, Upload
} from "lucide-react";

const AVATAR_COLORS = [
    "from-blue-400 to-blue-600",
    "from-purple-400 to-purple-600",
    "from-emerald-400 to-emerald-600",
    "from-orange-400 to-orange-600",
    "from-red-400 to-red-600",
    "from-teal-400 to-teal-600",
    "from-indigo-400 to-indigo-600",
    "from-pink-400 to-pink-600",
];

const REASONS = [
    "Further Studies", "Career Change", "Personal Reasons", "Relocation",
    "Better Opportunity", "Health Issues", "Retirement", "Other",
];

const PER_PAGE_OPTIONS = [5, 10, 15, 20];

const initialEmployees = [
    {
        id: 1, name: "Dr. Justus Boyer Jr.", email: "justus.boyer@executive.com",
        role: "Senior Research Architect", empId: "EMP-9042", colorIdx: 0,
        resignationDate: "May 15,\n2024", lastWorkingDay: "June 30,\n2024", noticePeriod: "45\nDays",
        status: "PENDING", hasDocs: true,
        resignDateFull: "Oct 12, 2023", resignDateSub: "Submitted via Portal",
        lastDayFull: "Jan 12, 2024", lastDaySub: "90 Days Remaining",
        noticeFull: "3 Months", noticeSub: "Standard Corporate Policy",
        reason: "Further Studies",
        description: "I am writing to formally resign from my position. I have decided to pursue a Post-Doctoral Fellowship in Quantum Computing Architectures at the Zurich Institute. This transition is essential for my long-term academic goals. I am committed to ensuring a smooth handover during my notice period.",
        docs: [
            { name: "Resignation_Letter.pdf", size: "1.2 MB", type: "PDF Document" },
            { name: "Handover_Plan.docx", size: "450 KB", type: "Word File" },
        ],
        history: [
            { label: "Submitted", date: "Oct 12, 09:45 AM", done: true },
            { label: "Executive Review", date: "In Progress", active: true },
            { label: "HR Review", date: "pending", done: false },
        ],
    },
    {
        id: 2, name: "Dr. Ashlee Schamberger", email: "ashlee.s@executive.com",
        role: "Product Manager", empId: "EMP-1023", colorIdx: 1,
        resignationDate: "May 18,\n2024", lastWorkingDay: "June 18,\n2024", noticePeriod: "30\nDays",
        status: "PENDING", hasDocs: true,
        resignDateFull: "May 18, 2024", resignDateSub: "Submitted via Portal",
        lastDayFull: "June 18, 2024", lastDaySub: "30 Days Remaining",
        noticeFull: "1 Month", noticeSub: "Standard Corporate Policy",
        reason: "Career Change",
        description: "I am resigning to pursue a new opportunity that aligns more closely with my career aspirations.",
        docs: [{ name: "Resignation_Letter.pdf", size: "980 KB", type: "PDF Document" }],
        history: [
            { label: "Submitted", date: "May 18, 10:00 AM", done: true },
            { label: "Executive Review", date: "In Progress", active: true },
            { label: "HR Review", date: "pending", done: false },
        ],
    },
    {
        id: 3, name: "Kristopher Morar", email: "k.morar@executive.com",
        role: "UI/UX Designer", empId: "EMP-3310", colorIdx: 2,
        resignationDate: "May 20,\n2024", lastWorkingDay: "July 20,\n2024", noticePeriod: "60\nDays",
        status: "REJECTED", hasDocs: false,
        resignDateFull: "May 20, 2024", resignDateSub: "Submitted via Portal",
        lastDayFull: "July 20, 2024", lastDaySub: "60 Days Remaining",
        noticeFull: "2 Months", noticeSub: "Standard Corporate Policy",
        reason: "Personal Reasons",
        description: "Due to personal circumstances I am unable to continue in my current role.",
        docs: [],
        history: [
            { label: "Submitted", date: "May 20, 11:00 AM", done: true },
            { label: "Executive Review", date: "Rejected", done: true },
            { label: "HR Review", date: "N/A", done: false },
        ],
    },
    {
        id: 4, name: "Miss Myrtice Kohler", email: "myrtice.kohler@executive.com",
        role: "Data Analyst", empId: "EMP-4471", colorIdx: 3,
        resignationDate: "May 25,\n2024", lastWorkingDay: "Aug 25,\n2024", noticePeriod: "90\nDays",
        status: "APPROVED", hasDocs: true,
        resignDateFull: "May 25, 2024", resignDateSub: "Submitted via Portal",
        lastDayFull: "Aug 25, 2024", lastDaySub: "90 Days Remaining",
        noticeFull: "3 Months", noticeSub: "Standard Corporate Policy",
        reason: "Relocation",
        description: "I am relocating to another city and regret that I am unable to continue in my current position.",
        docs: [
            { name: "Resignation_Letter.pdf", size: "1.1 MB", type: "PDF Document" },
            { name: "Handover_Plan.docx", size: "320 KB", type: "Word File" },
        ],
        history: [
            { label: "Submitted", date: "May 25, 09:00 AM", done: true },
            { label: "Executive Review", date: "Approved", done: true },
            { label: "HR Review", date: "Approved", done: true },
        ],
    },
    {
        id: 5, name: "James Thornton", email: "j.thornton@executive.com",
        role: "Backend Engineer", empId: "EMP-5512", colorIdx: 4,
        resignationDate: "June 01,\n2024", lastWorkingDay: "July 01,\n2024", noticePeriod: "30\nDays",
        status: "PENDING", hasDocs: false,
        resignDateFull: "June 01, 2024", resignDateSub: "Submitted via Portal",
        lastDayFull: "July 01, 2024", lastDaySub: "30 Days Remaining",
        noticeFull: "1 Month", noticeSub: "Standard Corporate Policy",
        reason: "Health Issues",
        description: "Due to ongoing health concerns, I am unable to continue in my current role.",
        docs: [],
        history: [
            { label: "Submitted", date: "June 01, 08:30 AM", done: true },
            { label: "Executive Review", date: "In Progress", active: true },
            { label: "HR Review", date: "pending", done: false },
        ],
    },
    {
        id: 6, name: "Priya Nair", email: "priya.nair@executive.com",
        role: "HR Specialist", empId: "EMP-6623", colorIdx: 5,
        resignationDate: "June 05,\n2024", lastWorkingDay: "July 05,\n2024", noticePeriod: "30\nDays",
        status: "APPROVED", hasDocs: true,
        resignDateFull: "June 05, 2024", resignDateSub: "Submitted via Portal",
        lastDayFull: "July 05, 2024", lastDaySub: "30 Days Remaining",
        noticeFull: "1 Month", noticeSub: "Standard Corporate Policy",
        reason: "Further Studies",
        description: "Pursuing a master's degree abroad. Grateful for the experience.",
        docs: [{ name: "Resignation_Letter.pdf", size: "870 KB", type: "PDF Document" }],
        history: [
            { label: "Submitted", date: "June 05, 10:00 AM", done: true },
            { label: "Executive Review", date: "Approved", done: true },
            { label: "HR Review", date: "Approved", done: true },
        ],
    },
    {
        id: 7, name: "Priya", email: "priya.nair@executive.com",
        role: "HR Specialist", empId: "EMP-6623", colorIdx: 5,
        resignationDate: "June 05,\n2024", lastWorkingDay: "July 05,\n2024", noticePeriod: "30\nDays",
        status: "APPROVED", hasDocs: true,
        resignDateFull: "June 05, 2024", resignDateSub: "Submitted via Portal",
        lastDayFull: "July 05, 2024", lastDaySub: "30 Days Remaining",
        noticeFull: "1 Month", noticeSub: "Standard Corporate Policy",
        reason: "Further Studies",
        description: "Pursuing a master's degree abroad. Grateful for the experience.",
        docs: [{ name: "Resignation_Letter.pdf", size: "870 KB", type: "PDF Document" }],
        history: [
            { label: "Submitted", date: "June 05, 10:00 AM", done: true },
            { label: "Executive Review", date: "Approved", done: true },
            { label: "HR Review", date: "Approved", done: true },
        ],
    },
];

const statusStyle = {
    APPROVED: "bg-[#0d9488] text-white",
    PENDING: "bg-[#7c3aed] text-white",
    REJECTED: "bg-[#FFDAD6] text-[#93000A]",
};

// ── Avatar ─────────────────────────────────────────────────
function Avatar({ name, colorIdx = 0, size = "md" }) {
    const initials = name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
    const sz = size === "lg" ? "w-16 h-16 text-lg" : "w-10 h-10 text-xs";
    return (
        <div className={`${sz} rounded-full bg-gradient-to-br ${AVATAR_COLORS[colorIdx % AVATAR_COLORS.length]} flex items-center justify-center text-white font-semibold flex-shrink-0 ring-2 ring-white`}>
            {initials}
        </div>
    );
}

// ── View Modal ─────────────────────────────────────────────
function ViewModal({ emp, onClose, onApprove, onReject, outsideClick }) {

    if (!emp) return null;
    const statusBadge = { APPROVED: "bg-emerald-100 text-emerald-700", PENDING: "bg-amber-100 text-amber-700", REJECTED: "bg-red-100 text-red-700" }[emp.status] || "bg-gray-100 text-gray-600";
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.45)" }} onClick={outsideClick}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"

                onClick={(e) => e.stopPropagation()}>
                <div className="flex">
                    <div className="w-1.5 rounded-l-2xl flex-shrink-0" style={{ background: "linear-gradient(180deg,#7c3aed,#4f46e5)" }} />
                    <div className="flex-1 p-6 space-y-5">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div className="flex items-center gap-4">
                                <Avatar name={emp.name} colorIdx={emp.colorIdx} size="lg" />
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">{emp.name}</h2>
                                    <p className="text-sm text-gray-500">{emp.role}</p>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusBadge}`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current" />{emp.status}
                                        </span>
                                        <span className="text-xs text-gray-400 font-medium">ID: {emp.empId}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                {emp.status === "PENDING" && (
                                    <>
                                        <button onClick={() => { onReject(emp.id); onClose(); }} className="text-sm bg-[#F2F4F6] font-semibold px-4 py-2 rounded-sm border border-gray-200 text-[#191C1E] hover:bg-gray-50 transition-colors">Reject Request</button>
                                        <button onClick={() => { onApprove(emp.id); onClose(); }} className="text-sm font-semibold px-4 py-2 rounded-sm bg-[#4A45B6] hover:bg-indigo-700 text-white transition-colors shadow-md shadow-indigo-200">Approve Resignation</button>
                                    </>
                                )}
                                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"><X className="w-5 h-5" /></button>
                            </div>
                        </div>
                        {/* Info cards */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: "Resignation Date", val: emp.resignDateFull, sub: emp.resignDateSub, color: "text-gray-800" },
                                { label: "Last Working Day", val: emp.lastDayFull, sub: emp.lastDaySub, color: "text-indigo-600" },
                                { label: "Notice Period", val: emp.noticeFull, sub: emp.noticeSub, color: "text-gray-800" },
                            ].map((c) => (
                                <div key={c.label} className="bg-gray-50 border border-gray-100 rounded-sm p-4">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{c.label}</p>
                                    <p className={`text-base font-bold ${c.color}`}>{c.val}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{c.sub}</p>
                                </div>
                            ))}
                        </div>
                        {/* Reason + Docs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-gray-50 border border-gray-100 rounded-sm p-4 space-y-3">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Reason for Departure</p>
                                    <div className="flex items-center gap-2"><GraduationCap className="w-5 h-5 text-indigo-500" /><span className="text-sm font-semibold text-indigo-600">{emp.reason}</span></div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Detailed Description</p>
                                    <p className="text-xs text-gray-600 leading-relaxed">{emp.description}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Supporting Documents</p>
                                {emp.docs.length === 0 ? (
                                    <p className="text-xs text-gray-400 italic">No documents attached.</p>
                                ) : emp.docs.map((doc, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-3">
                                        <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                                            <FileText className="w-[22px] h-[22px]" stroke="#6366f1" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-gray-800 truncate">{doc.name}</p>
                                            <p className="text-[11px] text-gray-400">{doc.size} • {doc.type}</p>
                                        </div>
                                        <button className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 transition-colors"><Download className="w-4 h-4" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Process History */}
                        <div className="border-t border-gray-100 pt-4">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Process History</p>
                                <button className="text-xs text-indigo-500 font-semibold hover:text-indigo-700 transition-colors">View Full Logs</button>
                            </div>
                            <div className="flex items-start">
                                {emp.history.map((step, i) => (
                                    <div key={i} className="flex flex-1 items-start">
                                        <div className="flex flex-col items-center flex-1">
                                            <div className="flex items-center w-full">
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${step.done ? "bg-emerald-500 border-emerald-500" : step.active ? "bg-white border-indigo-500" : "bg-white border-gray-200"}`}>
                                                    {step.done ? (
                                                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                                                    ) : step.active ? (
                                                        <div className="w-2.5 h-2.5 rounded-full border-2 border-indigo-500" />
                                                    ) : (
                                                        <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                                                    )}
                                                </div>
                                                {i < emp.history.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${step.done ? "bg-emerald-300" : "bg-gray-200"}`} />}
                                            </div>
                                            <div className="mt-2 text-center pr-2">
                                                <p className={`text-xs font-semibold ${step.active ? "text-indigo-600" : step.done ? "text-gray-700" : "text-gray-400"}`}>{step.label}</p>
                                                <p className="text-[10px] text-gray-400 mt-0.5">{step.date}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Add / Edit Modal ───────────────────────────────────────
function ResignationFormModal({ mode, emp, onSave, outsideClick }) {

    console.log("mode", mode)
    const isEdit = mode === "edit";
    const fileRef = useRef();
    const reasonRef = useRef(null);
    const [reasonOpen, setReasonOpen] = useState(false);



    const inp = (extra = "") => `w-full text-sm border rounded-xl px-3 py-2.5 bg-[#F8F8F8] focus:outline-none focus:ring-2 focus:ring-[#4A45B6] text-gray-700 border-[#6B7280] placeholder-[#6B7280] ${extra}`;

    const [form, setForm] = useState({
        name: emp?.name || "", email: emp?.email || "",
        role: emp?.role || "", empId: emp?.empId || "",
        resignDateFull: emp?.resignDateFull ? toInputDate(emp.resignDateFull) : "",
        lastDayFull: emp?.lastDayFull ? toInputDate(emp.lastDayFull) : "",
        reason: emp?.reason || "", description: emp?.description || "",
        status: emp?.status || "PENDING",
        docs: emp?.docs || [],
    });
    const [errors, setErrors] = useState({});

    function toInputDate(str) {
        if (!str) return "";
        const d = new Date(str);
        if (isNaN(d)) return "";
        return d.toISOString().split("T")[0];
    }

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Required";
        if (!form.email.trim()) e.email = "Required";
        if (!form.resignDateFull) e.resignDateFull = "Required";
        if (!form.lastDayFull) e.lastDayFull = "Required";
        if (!form.reason) e.reason = "Required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        const fmt = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        const fmtMulti = (d) => {
            const dt = new Date(d);
            return `${dt.toLocaleDateString("en-US", { month: "short", day: "numeric" })},\n${dt.getFullYear()}`;
        };
        const resDt = new Date(form.resignDateFull);
        const lastDt = new Date(form.lastDayFull);
        const diffDays = Math.round((lastDt - resDt) / 86400000);
        const noticeStr = diffDays <= 0 ? "0 Days" : diffDays >= 60 ? `${Math.round(diffDays / 30)} Months` : `${diffDays} Days`;

        onSave({
            ...(emp || {}),
            id: emp?.id || Date.now(),
            colorIdx: emp?.colorIdx ?? Math.floor(Math.random() * AVATAR_COLORS.length),
            name: form.name, email: form.email,
            role: form.role || "Employee",
            empId: form.empId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
            resignationDate: fmtMulti(form.resignDateFull),
            lastWorkingDay: fmtMulti(form.lastDayFull),
            noticePeriod: `${diffDays}\nDays`,
            status: form.status, hasDocs: form.docs.length > 0,
            resignDateFull: fmt(form.resignDateFull), resignDateSub: "Submitted via Portal",
            lastDayFull: fmt(form.lastDayFull), lastDaySub: `${noticeStr} Remaining`,
            noticeFull: noticeStr, noticeSub: "Standard Corporate Policy",
            reason: form.reason, description: form.description, docs: form.docs,
            history: emp?.history || [
                { label: "Submitted", date: fmt(form.resignDateFull), done: true },
                { label: "Executive Review", date: "In Progress", active: true },
                { label: "HR Review", date: "pending", done: false },
            ],
        });
    };

    const handleFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        set("docs", [...form.docs, {
            name: file.name,
            size: `${(file.size / 1024).toFixed(0)} KB`,
            type: file.name.endsWith(".pdf") ? "PDF Document" : "Word File",
        }]);
    };

    const removeDoc = (i) => set("docs", form.docs.filter((_, idx) => idx !== i));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.45)" }} onClick={outsideClick}>
            <div className="bg-white rounded-sm shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between bg-[#F4EDFD] w-full p-6 pb-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{isEdit ? "Edit Resignation" : "Submit Resignation"}</h2>
                        <p className="text-sm text-gray-400 mt-0.5">{isEdit ? "Update resignation details." : "Formalize an employee's exit process."}</p>
                    </div>
                    <button onClick={outsideClick} className="p-1.5 rounded-lg hover:bg-gray-100 text-black transition-colors"><X className="w-5 h-5" /></button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Name + Email */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Full Name *</label>
                            <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Full name"
                                className={inp(errors.name ? "border-red-400" : "border-gray-200")} />
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Email *</label>
                            <input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="Email"
                                className={inp(errors.email ? "border-red-400" : "border-gray-200")} />
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                        </div>
                    </div>
                    {/* Role + EmpId */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Role</label>
                            <input value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="Job title" className={inp("border-gray-200")} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Employee ID</label>
                            <input value={form.empId} onChange={(e) => set("empId", e.target.value)} placeholder="EMP-XXXX" className={inp("border-gray-200")} />
                        </div>
                    </div>
                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Resignation Date *</label>
                            <input type="date" value={form.resignDateFull} onChange={(e) => set("resignDateFull", e.target.value)}
                                className={inp(errors.resignDateFull ? "border-red-400" : "border-gray-200")} />
                            {errors.resignDateFull && <p className="text-xs text-red-500 mt-1">{errors.resignDateFull}</p>}
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Last Working Day *</label>
                            <input type="date" value={form.lastDayFull} onChange={(e) => set("lastDayFull", e.target.value)}
                                className={inp(errors.lastDayFull ? "border-red-400" : "border-gray-200")} />
                            {errors.lastDayFull && <p className="text-xs text-red-500 mt-1">{errors.lastDayFull}</p>}
                        </div>
                    </div>
                    {/* Reason */}
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Reason for Leaving *</label>
                        <div className="relative" ref={reasonRef}>
                            <button
                                type="button"
                                onClick={() => setReasonOpen(!reasonOpen)}
                                className={inp(`flex items-center justify-between text-left ${errors.reason ? "border-red-400" : "border-gray-200"}`)}
                            >
                                <span>{form.reason || "Select a reason"}</span>
                                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${reasonOpen ? "rotate-180" : ""}`} />
                            </button>
                            {reasonOpen && (
                                <ul className="absolute z-20 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
                                    <li key="empty">
                                        <button
                                            type="button"
                                            onClick={() => { set("reason", ""); setReasonOpen(false); }}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${!form.reason ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                                        >
                                            <span className={`w-4 text-indigo-500 ${!form.reason ? "opacity-100" : "opacity-0"}`}>✓</span>
                                            Select a reason
                                        </button>
                                    </li>
                                    {REASONS.map((r) => (
                                        <li key={r}>
                                            <button
                                                type="button"
                                                onClick={() => { set("reason", r); setReasonOpen(false); }}
                                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${form.reason === r ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                                            >
                                                <span className={`w-4 text-indigo-500 ${form.reason === r ? "opacity-100" : "opacity-0"}`}>✓</span>
                                                {r}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {errors.reason && <p className="text-xs text-red-500 mt-1">{errors.reason}</p>}
                    </div>
                    {/* Status */}
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Status</label>
                        <div className="flex gap-2">
                            {["PENDING", "APPROVED", "REJECTED"].map((s) => (
                                <button key={s} onClick={() => set("status", s)}
                                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${form.status === s
                                        ? s === "APPROVED" ? "bg-teal-600 text-white border-teal-600"
                                            : s === "PENDING" ? "bg-[#7c3aed] text-white border-[#7c3aed]"
                                                : "bg-[#FFDAD6] text-[#93000A]"
                                        : "text-[#6B7280] bg-[#F8F8F8] hover:bg-gray-50"}`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Description */}
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Detailed Description</label>
                        <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3}
                            placeholder="Provide additional details..." className={inp("border-gray-200 resize-none")} />
                    </div>
                    {/* Upload */}
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Upload Documents</label>
                        <div onClick={() => fileRef.current?.click()}
                            className="bg-[#F2F4F6] border-2 border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center gap-2 text-[#4A45B6] cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors">
                            <Upload className="w-8 h-8" />
                            <p className="text-sm font-medium text-gray-500">Click to upload resignation letter</p>
                            <p className="text-xs text-gray-400">PDF, DOCX up to 5MB</p>
                            <input ref={fileRef} type="file" className="hidden" accept=".pdf,.docx" onChange={handleFile} />
                        </div>
                        {form.docs.length > 0 && (
                            <div className="mt-2 space-y-2">
                                {form.docs.map((doc, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2">
                                        <FileText className="w-[22px] h-[22px]" stroke="#6366f1" />
                                        <span className="text-xs text-indigo-700 font-medium flex-1 truncate">{doc.name}</span>
                                        <span className="text-xs text-gray-400">{doc.size}</span>
                                        <button onClick={() => removeDoc(i)} className="text-gray-400 hover:text-red-500 ml-1">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
                    <button onClick={outsideClick} className="px-5 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors bg-white">Cancel</button>
                    <button onClick={handleSubmit} className="px-6 py-2.5 text-sm font-semibold text-white bg-[#4A45B6] hover:bg-[#4f46e5] rounded-xl transition-colors shadow-md shadow-indigo-200">
                        {isEdit ? "Save Changes" : "Submit Resignation"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Delete Confirm ─────────────────────────────────────────
function DeleteConfirm({ emp, onClose, onConfirm }) {


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.45)" }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4 text-red-500">
                    <Trash2 className="w-[18px] h-[18px]" />
                </div>
                <h3 className="text-center text-lg font-bold text-gray-800 mb-1">Delete Resignation</h3>
                <p className="text-center text-sm text-gray-500 mb-6">
                    Are you sure you want to delete the record for <span className="font-semibold text-gray-700">{emp?.name}</span>? This cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                    <button onClick={onConfirm} className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors">Delete</button>
                </div>
            </div>
        </div>
    );
}

// ── Main Page ──────────────────────────────────────────────
export default function ResignationsPage() {
    const [employees, setEmployees] = useState(initialEmployees);
    const [search, setSearch] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [showFilters, setShowFilters] = useState(true);
    const [perPage, setPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [applied, setApplied] = useState({ employee: "", status: "", dateFrom: "", dateTo: "" });
    const [viewEmp, setViewEmp] = useState(null);
    const [formModal, setFormModal] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [perPageOpen, setPerPageOpen] = useState(false);
    const [empOpen, setEmpOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    const perPageRef = useRef(null);
    const empRef = useRef(null);
    const statusRef = useRef(null);
    const scrollref = useRef(null);

    useEffect(() => {


        const handler = (e) => {
            if (perPageRef.current && !perPageRef.current.contains(e.target)) setPerPageOpen(false);
            if (empRef.current && !empRef.current.contains(e.target)) setEmpOpen(false);
            if (statusRef.current && !statusRef.current.contains(e.target)) setStatusOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const applyFilters = () => {
        setApplied({ employee: selectedEmployee, status: selectedStatus, dateFrom, dateTo });
        setCurrentPage(1);
    };
    const resetFilters = () => {
        setSearch(""); setSelectedEmployee(""); setSelectedStatus(""); setDateFrom(""); setDateTo("");
        setApplied({ employee: "", status: "", dateFrom: "", dateTo: "" });
        setCurrentPage(1);
    };
    const handleSearch = () => {
        setApplied({ employee: search, status: selectedStatus, dateFrom, dateTo });
        setCurrentPage(1);
    };

    const filtered = employees.filter((e) => {
        const q = search.toLowerCase();
        const matchSearch = !q || e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q);
        const matchEmp = !applied.employee || e.name === applied.employee;
        const matchSt = !applied.status || e.status === applied.status;
        return matchSearch && matchEmp && matchSt;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
    const activeFilterCount = [applied.employee, applied.status, applied.dateFrom, applied.dateTo].filter(Boolean).length;

    const handleSave = (data) => {
        if (formModal.mode === "add") {
            setEmployees((prev) => [...prev, data]);
        } else {
            setEmployees((prev) => prev.map((e) => (e.id === data.id ? data : e)));
            if (viewEmp?.id === data.id) setViewEmp(data);
        }
        setFormModal(null);
    };

    const handleDelete = () => {
        setEmployees((prev) => prev.filter((e) => e.id !== deleteTarget.id));
        if (viewEmp?.id === deleteTarget.id) setViewEmp(null);
        setDeleteTarget(null);
        setCurrentPage((p) => Math.max(1, Math.min(p, Math.ceil((filtered.length - 1) / perPage))));
    };

    const handleApprove = (id) => {
        const update = (e) => e.id !== id ? e : {
            ...e, status: "APPROVED",
            history: [
                { label: "Submitted", date: e.history[0]?.date || "", done: true },
                { label: "Executive Review", date: "Approved", done: true },
                { label: "HR Review", date: "Approved", done: true },
            ],
        };
        setEmployees((prev) => prev.map(update));
    };

    const handleReject = (id) => {
        const update = (e) => e.id !== id ? e : {
            ...e, status: "REJECTED",
            history: [
                { label: "Submitted", date: e.history[0]?.date || "", done: true },
                { label: "Executive Review", date: "Rejected", done: true },
                { label: "HR Review", date: "N/A", done: false },
            ],
        };
        setEmployees((prev) => prev.map(update));
    };

    const handleReset = (id) => {
        setEmployees((prev) => prev.map((e) =>
            e.id !== id ? e : {
                ...e, status: "PENDING",
                history: [
                    { label: "Submitted", date: e.history[0]?.date || "", done: true },
                    { label: "Executive Review", date: "In Progress", active: true },
                    { label: "HR Review", date: "pending", done: false },
                ],
            }
        ));
    };

    const goPage = (p) => setCurrentPage(Math.max(1, Math.min(p, totalPages)));

    const pageNumbers = () => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages = [1];
        if (currentPage > 3) pages.push("...");
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);
        return pages;
    };
    const modalRef = useRef();

    const handleClose = () => {
        setFormModal(null);
        setViewEmp(null);

        scrollref.current.style.overflow = "auto";
    };

    const handleOutsideClick = (e) => {
        handleClose();
    };

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50" ref={scrollref}>
            <div className="w-full space-y-4 max-w-7xl mx-auto">

                {/* Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-800">Resignations</h1>
                    <button onClick={() => {
                        scrollref.current.style.overflow = "hidden";
                        setFormModal({ mode: "add", emp: null })
                    }
                    }

                        className="inline-flex items-center gap-2 bg-[#4A45B6] hover:bg-[#4f46e5] text-white text-sm font-semibold px-5 py-2.5 rounded-sm shadow-lg shadow-indigo-900/30 transition-colors self-start sm:self-auto">
                        <Plus className="w-4 h-4" /> Add Resignation
                    </button>
                </div>

                {/* Search / Filter card */}
                <div className="bg-[#F2F4F6] rounded-2xl border border-gray-100">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2"><Search className="w-4 h-4 text-gray-400" /></span>
                            <input type="text" placeholder="Search employee..." value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 text-gray-700 placeholder-gray-400" />
                        </div>
                        <button onClick={handleSearch}
                            className="inline-flex items-center gap-2 bg-[#4A45B6] hover:bg-[#4f46e5] text-white text-sm font-semibold px-5 py-2.5 rounded-sm shadow-lg shadow-indigo-900/30 transition-colors self-start sm:self-auto">
                            Search
                        </button>
                        <button onClick={() => setShowFilters((f) => !f)}
                            className="inline-flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap bg-[#E6E8EA]">
                            <Filter className="w-4 h-4" /> {showFilters ? "Hide" : "Show"} Filters
                            {activeFilterCount > 0 && (
                                <span className="bg-[#4A45B6] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">{activeFilterCount}</span>
                            )}
                        </button>
                        <div className="inline-flex items-center gap-2 text-sm border border-gray-200 px-4 py-2.5 rounded-xl bg-white whitespace-nowrap">
                            <span className="font-medium text-gray-500 text-xs uppercase tracking-wide">Per Page</span>
                            <div className="relative" ref={perPageRef}>
                                <button
                                    type="button"
                                    onClick={() => setPerPageOpen(!perPageOpen)}
                                    className="flex items-center gap-2 font-semibold text-gray-800 bg-transparent focus:outline-none"
                                >
                                    <span>{perPage}</span>
                                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${perPageOpen ? "rotate-180" : ""}`} />
                                </button>
                                {perPageOpen && (
                                    <ul className="absolute right-0 z-20 mt-2 w-20 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
                                        {PER_PAGE_OPTIONS.map((n) => (
                                            <li key={n}>
                                                <button
                                                    type="button"
                                                    onClick={() => { setPerPage(n); setCurrentPage(1); setPerPageOpen(false); }}
                                                    className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between ${perPage === n ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                                                >
                                                    {n}
                                                    {perPage === n && <span className="w-3 text-indigo-500">✓</span>}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="px-4 pb-4 flex flex-col sm:flex-row flex-wrap items-start sm:items-end gap-3 border-t border-gray-100 pt-4">
                            <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Employee</label>
                                <div className="relative" ref={empRef}>
                                    <button
                                        type="button"
                                        onClick={() => setEmpOpen(!empOpen)}
                                        className="w-full flex items-center justify-between text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-600"
                                    >
                                        <span className="truncate">{selectedEmployee || "Select Employee"}</span>
                                        <ChevronDown className={`flex-shrink-0 w-3.5 h-3.5 text-gray-400 transition-transform ${empOpen ? "rotate-180" : ""}`} />
                                    </button>
                                    {empOpen && (
                                        <ul className="absolute z-20 mt-2 w-full max-h-50 overflow-y-auto bg-white border border-gray-100 rounded-xl shadow-lg">
                                            <li key="empty">
                                                <button
                                                    type="button"
                                                    onClick={() => { setSelectedEmployee(""); setEmpOpen(false); }}
                                                    className={`w-full text-left px-3 py-2.5 text-sm transition-colors flex items-center gap-2 ${!selectedEmployee ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                                                >
                                                    <span className={`w-4 text-indigo-500 ${!selectedEmployee ? "opacity-100" : "opacity-0"}`}>✓</span>
                                                    Select Employee
                                                </button>
                                            </li>
                                            {[...new Set(employees.map((e) => e.name))].map((n) => (
                                                <li key={n}>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setSelectedEmployee(n); setEmpOpen(false); }}
                                                        className={`w-full text-left px-3 py-2.5 text-sm transition-colors flex items-center gap-2 ${selectedEmployee === n ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                                                    >
                                                        <span className={`w-4 text-indigo-500 ${selectedEmployee === n ? "opacity-100" : "opacity-0"}`}>✓</span>
                                                        <span className="truncate">{n}</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</label>
                                <div className="relative" ref={statusRef}>
                                    <button
                                        type="button"
                                        onClick={() => setStatusOpen(!statusOpen)}
                                        className="w-full flex items-center justify-between text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-600"
                                    >
                                        <span className="truncate">
                                            {selectedStatus === "APPROVED" ? "Approved" : selectedStatus === "PENDING" ? "Pending" : selectedStatus === "REJECTED" ? "Rejected" : "Select Status"}
                                        </span>
                                        <ChevronDown className={`flex-shrink-0 w-3.5 h-3.5 text-gray-400 transition-transform ${statusOpen ? "rotate-180" : ""}`} />
                                    </button>
                                    {statusOpen && (
                                        <ul className="absolute z-20 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
                                            <li key="empty">
                                                <button
                                                    type="button"
                                                    onClick={() => { setSelectedStatus(""); setStatusOpen(false); }}
                                                    className={`w-full text-left px-3 py-2.5 text-sm transition-colors flex items-center gap-2 ${!selectedStatus ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                                                >
                                                    <span className={`w-4 text-indigo-500 ${!selectedStatus ? "opacity-100" : "opacity-0"}`}>✓</span>
                                                    Select Status
                                                </button>
                                            </li>
                                            {[
                                                { val: "APPROVED", label: "Approved" },
                                                { val: "PENDING", label: "Pending" },
                                                { val: "REJECTED", label: "Rejected" },
                                            ].map((s) => (
                                                <li key={s.val}>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setSelectedStatus(s.val); setStatusOpen(false); }}
                                                        className={`w-full text-left px-3 py-2.5 text-sm transition-colors flex items-center gap-2 ${selectedStatus === s.val ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                                                    >
                                                        <span className={`w-4 text-indigo-500 ${selectedStatus === s.val ? "opacity-100" : "opacity-0"}`}>✓</span>
                                                        {s.label}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date From</label>
                                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                                    className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-600" />
                            </div>
                            <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date To</label>
                                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                                    className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-600" />
                            </div>
                            <div className="flex gap-2 flex-shrink-0 self-end pt-4 sm:pt-0">
                                <button onClick={applyFilters} className="bg-[#4A45B6] hover:bg-[#4f46e5] text-white text-sm font-semibold px-5 py-2.5 rounded-sm transition-colors whitespace-nowrap">Apply Filters</button>
                                <button onClick={resetFilters} className="border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold px-5 py-2.5 rounded-sm transition-colors bg-[#E6E8EA] whitespace-nowrap">Reset Filters</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm min-w-[700px]">
                            <thead className="bg-[#F2F4F6]">
                                <tr className="border-b border-gray-100">
                                    {["#", "Employee", "Resignation\nDate", "Last\nWorking\nDay", "Notice\nPeriod", "Status", "Documents", "Action"].map((h, i) => (
                                        <th key={i} className={`text-[10px] font-extrabold text-[#737686] uppercase tracking-widest px-4 py-4 whitespace-pre-line ${i === 7 ? "text-center" : "text-left"}`}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.map((emp, idx) => {
                                    const globalIdx = (currentPage - 1) * perPage + idx + 1;
                                    return (
                                        <tr key={emp.id} className="border-t border-[#ECEEF0] hover:bg-indigo-50/30 transition-colors">
                                            <td className="px-4 py-4 text-gray-400 font-medium">{globalIdx}</td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar name={emp.name} colorIdx={emp.colorIdx} />
                                                    <div>
                                                        <p className="text-[#191C1E] font-semibold text-sm whitespace-nowrap">{emp.name}</p>
                                                        <p className="text-xs text-[#737686] mt-0.5">{emp.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-[#191C1E] text-sm whitespace-pre-line leading-snug">{emp.resignationDate}</td>
                                            <td className="px-4 py-4 text-[#191C1E] text-sm whitespace-pre-line leading-snug">{emp.lastWorkingDay}</td>
                                            <td className="px-4 py-4 text-[#191C1E] text-sm whitespace-pre-line leading-snug">{emp.noticePeriod}</td>
                                            <td className="px-4 py-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide ${statusStyle[emp.status]}`}>{emp.status}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                {emp.hasDocs ? (
                                                    <button className="hover:opacity-70 transition-opacity">
                                                        <FileText className="w-[22px] h-[22px]" stroke="#6366f1" />
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">No docs</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        title="View"
                                                        onClick={() => {
                                                            setViewEmp(emp);
                                                            scrollref.current.style.overflow = "hidden";
                                                        }}
                                                        className="text-[#7c3aed] hover:text-blue-600 p-1 rounded-lg hover:bg-blue-50 transition-colors"
                                                    >
                                                        <Eye className="w-[18px] h-[18px]" />
                                                    </button>
                                                    <button
                                                        title="Edit"
                                                        onClick={() => {
                                                            if (scrollref.current) {
                                                                scrollref.current.style.overflow = "hidden";
                                                            }

                                                            setFormModal({
                                                                open: true,
                                                                mode: "edit",
                                                                emp: emp   // 👈 pass employee data
                                                            });
                                                        }}
                                                        className="text-[#7c3aed] hover:text-amber-500 p-1 rounded-lg hover:bg-amber-50 transition-colors"
                                                    >
                                                        <Pencil className="w-[18px] h-[18px]" />
                                                    </button>
                                                    <button title="Reset to Pending" onClick={() => handleReset(emp.id)} className="text-[#7c3aed] hover:text-green-500 p-1 rounded-lg hover:bg-green-50 transition-colors"><RefreshCw className="w-[18px] h-[18px]" /></button>
                                                    <button title="Delete" onClick={() => setDeleteTarget(emp)} className="text-[#BA1A1A] hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors"><Trash2 className="w-[18px] h-[18px]" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {paginated.length === 0 && (
                                    <tr><td colSpan={8} className="px-5 py-16 text-center text-gray-400 text-sm">No resignations found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-5 py-4 flex flex-col sm:flex-row items-center bg-[#F2F4F6] justify-between gap-3 border-t border-[#E0E3E5]">
                        <p className="text-sm text-[#737686]">
                            Showing <span className="text-[#737686]">{filtered.length === 0 ? 0 : (currentPage - 1) * perPage + 1}</span> to{" "}
                            <span className="text-[#737686]">{Math.min(currentPage * perPage, filtered.length)}</span> of{" "}
                            <span className="text-[#737686]">{filtered.length}</span> entries
                        </p>
                        <div className="flex items-center gap-1">
                            <button onClick={() => goPage(currentPage - 1)} disabled={currentPage === 1}
                                className="w-8 h-8 flex items-center justify-center bg-white border-[#C3C6D74D] text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            {pageNumbers().map((page, i) =>
                                page === "..." ? (
                                    <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">…</span>
                                ) : (
                                    <button key={page} onClick={() => goPage(page)}
                                        className={`w-8 h-8 text-sm rounded-sm transition-colors font-semibold cursor-pointer ${currentPage === page ? "bg-[#4A45B6] text-white shadow-md shadow-indigo-200" : "text-[#737686] bg-white hover:bg-gray-100"}`}>
                                        {page}
                                    </button>
                                )
                            )}
                            <button onClick={() => goPage(currentPage + 1)} disabled={currentPage === totalPages}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-white border-[#C3C6D74D]">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {viewEmp && <ViewModal emp={viewEmp} outsideClick={handleOutsideClick} onClose={() => setViewEmp(null)} onApprove={handleApprove} onReject={handleReject} />}
            {formModal && <ResignationFormModal outsideClick={handleOutsideClick} mode={formModal.mode} emp={formModal.emp} onSave={handleSave} />}
            {deleteTarget && <DeleteConfirm emp={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />}
        </div>
    );
}
