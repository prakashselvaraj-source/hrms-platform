"use client";

import { useState, useRef, useEffect } from "react";
import { useTenant } from "@/hooks/useTenant";
import { useRouter } from "next/navigation";
import { createTicket, uploadTicketAttachment } from "@/services/ticketService";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Plus, 
    ArrowLeft, 
    Upload, 
    X, 
    Check, 
    ChevronDown, 
    AlertCircle, 
    Info, 
    FileText, 
    Send,
    Trash2,
    Loader2,
    CheckCircle2
} from "lucide-react";

const categories = [
    "IT Support",
    "HR Request",
    "Finance",
    "Facilities",
    "Legal",
    "Other",
];

const priorities = ["Low", "Medium", "High", "Urgent"];

const priorityStyles = {
    Low: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Medium: "bg-indigo-50 text-indigo-700 border-indigo-100",
    High: "bg-amber-50 text-amber-700 border-amber-100",
    Urgent: "bg-rose-50 text-rose-700 border-rose-100",
};

export default function CreateTicket() {
    const [category, setCategory] = useState("IT Support");
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [priority, setPriority] = useState("Low");
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState([]);
    const [dragging, setDragging] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const fileRef = useRef(null);
    const dropdownRef = useRef(null);
    const tenant = useTenant();
    const router = useRouter();

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setCategoryOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const dropped = Array.from(e.dataTransfer.files);
        setFiles((prev) => [...prev, ...dropped]);
    };

    const handleFileInput = (e) => {
        const picked = Array.from(e.target.files);
        setFiles((prev) => [...prev, ...picked]);
    };

    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!subject.trim()) return;
        setSubmitting(true);
        setError("");
        try {
            let attachmentUrls = [];
            if (files.length > 0) {
                const uploads = await Promise.all(
                    files.map((f) => uploadTicketAttachment(f))
                );
                attachmentUrls = uploads.map((u) => u.data?.url || u.data?.fileUrl || "");
            }

            const payload = {
                subject: subject.trim(),
                description,
                category,
                priority: priority.toUpperCase(),
                attachments: attachmentUrls,
            };

            await createTicket(tenant, payload);
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit ticket. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl shadow-xl shadow-indigo-100 border border-slate-200 p-10 max-w-md w-full text-center"
                >
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-3">Ticket Sent!</h2>
                    <p className="text-slate-500 mb-8 leading-relaxed">
                        We've received your request. Our support team typically responds within 2–4 business hours.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => router.push(`/${tenant}/support`)}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95"
                        >
                            View My Tickets
                        </button>
                        <button
                            onClick={() => { setSubmitted(false); setSubject(""); setDescription(""); setFiles([]); }}
                            className="w-full bg-white hover:bg-slate-50 text-slate-600 font-bold py-4 rounded-2xl border border-slate-200 transition-all active:scale-95"
                        >
                            Raise Another Ticket
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-8 lg:p-12 font-sans text-slate-900">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto space-y-8"
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <button 
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest mb-2"
                        >
                            <ArrowLeft className="w-3 h-3" />
                            Back
                        </button>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900">
                            Raise Support Ticket
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Fill in the details below to reach out to our team.
                        </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                        <Info className="w-5 h-5 text-indigo-600 shrink-0" />
                        <div className="text-[10px] leading-tight text-indigo-800 font-bold uppercase tracking-wider">
                            Typical response<br/>under 4 hours
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 sm:p-10 space-y-8">
                        {/* Row 1: Category & Priority */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Category Dropdown */}
                            <div className="space-y-3" ref={dropdownRef}>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                                    Inquiry Category
                                </label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setCategoryOpen(!categoryOpen)}
                                        className="w-full flex items-center justify-between border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 bg-slate-50/50 hover:bg-white hover:border-indigo-300 focus:outline-none transition-all group shadow-sm"
                                    >
                                        <span className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                            {category}
                                        </span>
                                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${categoryOpen ? "rotate-180 text-indigo-600" : ""}`} />
                                    </button>

                                    <AnimatePresence>
                                        {categoryOpen && (
                                            <motion.ul 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute z-20 mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-indigo-100/50 overflow-hidden"
                                            >
                                                {categories.map((c) => (
                                                    <li key={c}>
                                                        <button
                                                            type="button"
                                                            onClick={() => { setCategory(c); setCategoryOpen(false); }}
                                                            className={`w-full text-left px-5 py-3.5 text-sm font-bold transition-all flex items-center justify-between
                                                                ${category === c
                                                                    ? "bg-indigo-50 text-indigo-700"
                                                                    : "text-slate-600 hover:bg-slate-50"
                                                                }`}
                                                        >
                                                            {c}
                                                            {category === c && <Check className="w-4 h-4" />}
                                                        </button>
                                                    </li>
                                                ))}
                                            </motion.ul>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Priority Selection */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                                    Priority Level
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {priorities.map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setPriority(p)}
                                            className={`text-[11px] font-black uppercase tracking-tighter px-4 py-3 rounded-2xl border transition-all duration-200 flex-1 min-w-[80px]
                                                ${priority === p
                                                    ? `${priorityStyles[p]} border-current shadow-md`
                                                    : "bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600"
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Subject */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                                Subject
                            </label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="A brief summary of your request"
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                                Detailed Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your issue or request in detail..."
                                rows={6}
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-3xl px-6 py-5 text-sm font-medium leading-relaxed text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all resize-none shadow-sm"
                            />
                        </div>

                        {/* File Upload */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                                Attachments (Optional)
                            </label>
                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileRef.current.click()}
                                className={`border-2 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300
                                    ${dragging
                                        ? "border-indigo-500 bg-indigo-50 scale-[0.99]"
                                        : "border-slate-200 bg-slate-50/30 hover:border-indigo-300 hover:bg-slate-50"
                                    }`}
                            >
                                <div className="w-16 h-16 rounded-[1.25rem] bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-200">
                                    <Upload className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-center space-y-1">
                                    <p className="text-sm font-black text-slate-900">
                                        Drag & drop files here
                                    </p>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                                        Or click to browse from device
                                    </p>
                                </div>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={handleFileInput}
                                    accept=".pdf,.png,.jpg,.jpeg,.docx"
                                />
                            </div>

                            {/* File List */}
                            <AnimatePresence>
                                {files.length > 0 && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="mt-4 space-y-2"
                                    >
                                        {files.map((file, i) => (
                                            <motion.div
                                                key={`${file.name}-${i}`}
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                className="flex items-center justify-between bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-sm"
                                            >
                                                <div className="flex items-center gap-4 min-w-0">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                                                        <FileText className="w-5 h-5 text-indigo-500" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-bold text-slate-900 truncate">{file.name}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold">{(file.size / 1024).toFixed(1)} KB</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                                                    className="p-2 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-rose-50 border border-rose-100 rounded-2xl p-5 flex items-center gap-4 text-rose-800"
                            >
                                <AlertCircle className="w-6 h-6 shrink-0" />
                                <p className="text-sm font-bold">{error}</p>
                            </motion.div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-8 py-4 text-sm font-black text-slate-400 hover:text-slate-600 transition-all uppercase tracking-widest"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!subject.trim() || submitting}
                                className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white text-sm font-black px-10 py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        <span>Submit Ticket</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
