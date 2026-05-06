"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
    X, Upload, FileText, ChevronDown, 
    ArrowLeft, Send, AlertCircle, CheckCircle2 
} from "lucide-react";
import { useTenant } from "@/hooks/useTenant";
import { createResignation } from "@/services/resignationService";
import { uploadImage } from "@/services/uploadService";

const REASONS = [
    "Further Studies", "Career Change", "Personal Reasons", "Relocation",
    "Better Opportunity", "Health Issues", "Retirement", "Other",
];

export default function ApplyResignationPage() {
    const router = useRouter();
    const tenant = useTenant();
    const fileRef = useRef();
    const reasonRef = useRef(null);
    
    const [reasonOpen, setReasonOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [form, setForm] = useState({
        resignDateFull: "",
        lastDayFull: "",
        reason: "",
        description: "",
        docs: [],
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setMounted(true);

        const handler = (e) => {
            if (reasonRef.current && !reasonRef.current.contains(e.target)) {
                setReasonOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [tenant]);

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const validate = () => {
        const e = {};
        if (!form.resignDateFull) e.resignDateFull = "Resignation date is required";
        if (!form.lastDayFull) e.lastDayFull = "Last working day is required";
        if (!form.reason) e.reason = "Please select a reason for leaving";
        if (form.description.length < 20) e.description = "Please provide a more detailed description (min 20 chars)";
        
        // Date validation
        if (form.resignDateFull && form.lastDayFull) {
            const res = new Date(form.resignDateFull);
            const last = new Date(form.lastDayFull);
            if (last < res) {
                e.lastDayFull = "Last working day cannot be before resignation date";
            }
        }
        
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const resignationData = {
                resignationDate: form.resignDateFull,
                lastWorkingDay: form.lastDayFull,
                reason: form.reason,
                description: form.description,
                status: "PENDING",
                documentUrl: form.docs.length > 0 ? form.docs[0].url : null
            };
            
            await createResignation(resignationData, tenant);
            
            setIsSubmitting(false);
            setIsSuccess(true);
            
            // Redirect after success
            setTimeout(() => {
                router.push(`/${tenant}/resignation`);
            }, 2000);
        } catch (error) {
            console.error("Error submitting resignation:", error);
            setIsSubmitting(false);
            alert("Failed to submit resignation. Please try again.");
        }
    };

    const handleFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            alert("File size exceeds 5MB limit");
            return;
        }

        setIsUploading(true);
        try {
            const res = await uploadImage(file);
            const url = res.data.url || res.data; // Handle different response formats

            set("docs", [{
                name: file.name,
                size: `${(file.size / 1024).toFixed(0)} KB`,
                type: file.name.endsWith(".pdf") ? "PDF Document" : "Word File",
                url: url
            }]);
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload document. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const removeDoc = (i) => set("docs", form.docs.filter((_, idx) => idx !== i));

    if (!mounted) return null;

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center space-y-6 animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-gray-900">Application Submitted!</h1>
                        <p className="text-gray-500">Your resignation request has been successfully submitted and is now awaiting administrative review.</p>
                    </div>
                    <p className="text-sm text-gray-400">Redirecting you to the status page...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.back()}
                        className="p-2 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Apply for Resignation</h1>
                        <p className="text-sm text-gray-500">Please provide the details for your resignation process.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 sm:p-8 space-y-8">
                        {/* Dates Section */}
                        <div className="space-y-4">
                            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <AlertCircle className="w-3.5 h-3.5 text-indigo-500" />
                                Important Dates
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Resignation Date *</label>
                                    <input 
                                        type="date" 
                                        value={form.resignDateFull} 
                                        onChange={(e) => set("resignDateFull", e.target.value)}
                                        className={`w-full px-4 py-3 rounded-xl border bg-gray-50/50 focus:outline-none focus:ring-2 transition-all ${
                                            errors.resignDateFull ? "border-red-300 ring-red-100 focus:ring-red-400" : "border-gray-200 focus:ring-indigo-400"
                                        }`}
                                    />
                                    {errors.resignDateFull && <p className="text-xs text-red-500 font-medium">{errors.resignDateFull}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Proposed Last Working Day *</label>
                                    <input 
                                        type="date" 
                                        value={form.lastDayFull} 
                                        onChange={(e) => set("lastDayFull", e.target.value)}
                                        className={`w-full px-4 py-3 rounded-xl border bg-gray-50/50 focus:outline-none focus:ring-2 transition-all ${
                                            errors.lastDayFull ? "border-red-300 ring-red-100 focus:ring-red-400" : "border-gray-200 focus:ring-indigo-400"
                                        }`}
                                    />
                                    {errors.lastDayFull && <p className="text-xs text-red-500 font-medium">{errors.lastDayFull}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Reason Section */}
                        <div className="space-y-4 pt-4 border-t border-gray-50">
                            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-indigo-500" />
                                Reason & Context
                            </h2>
                            <div className="space-y-4">
                                <div className="space-y-1.5 relative" ref={reasonRef}>
                                    <label className="text-sm font-semibold text-gray-700">Primary Reason for Leaving *</label>
                                    <button
                                        type="button"
                                        onClick={() => setReasonOpen(!reasonOpen)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border bg-gray-50/50 text-left transition-all ${
                                            errors.reason ? "border-red-300 focus:ring-red-400" : "border-gray-200 focus:ring-indigo-400"
                                        }`}
                                    >
                                        <span className={form.reason ? "text-gray-900" : "text-gray-400"}>
                                            {form.reason || "Select a reason"}
                                        </span>
                                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${reasonOpen ? "rotate-180" : ""}`} />
                                    </button>
                                    {reasonOpen && (
                                        <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="max-h-60 overflow-y-auto py-2">
                                                {REASONS.map((r) => (
                                                    <button
                                                        key={r}
                                                        type="button"
                                                        onClick={() => { set("reason", r); setReasonOpen(false); }}
                                                        className={`w-full text-left px-5 py-2.5 text-sm hover:bg-indigo-50 transition-colors ${
                                                            form.reason === r ? "bg-indigo-50 text-indigo-700 font-bold" : "text-gray-700"
                                                        }`}
                                                    >
                                                        {r}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {errors.reason && <p className="text-xs text-red-500 font-medium">{errors.reason}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Detailed Explanation *</label>
                                    <textarea 
                                        value={form.description} 
                                        onChange={(e) => set("description", e.target.value)}
                                        rows={4}
                                        placeholder="Please provide more details about your decision..."
                                        className={`w-full px-4 py-3 rounded-xl border bg-gray-50/50 focus:outline-none focus:ring-2 transition-all resize-none ${
                                            errors.description ? "border-red-300 ring-red-100 focus:ring-red-400" : "border-gray-200 focus:ring-indigo-400"
                                        }`}
                                    />
                                    <div className="flex justify-between items-center">
                                        {errors.description ? (
                                            <p className="text-xs text-red-500 font-medium">{errors.description}</p>
                                        ) : (
                                            <p className="text-xs text-gray-400">Minimum 20 characters required.</p>
                                        )}
                                        <p className="text-xs text-gray-400">{form.description.length} characters</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Documents Section */}
                        <div className="space-y-4 pt-4 border-t border-gray-50">
                            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Upload className="w-3.5 h-3.5 text-indigo-500" />
                                Attachments (Optional)
                            </h2>
                            <div className="space-y-3">
                                <div 
                                    onClick={() => fileRef.current?.click()}
                                    className="group bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center gap-3 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all"
                                >
                                    <div className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-indigo-500 shadow-sm group-hover:scale-110 transition-transform">
                                        {isUploading ? (
                                            <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                                        ) : (
                                            <Upload className="w-6 h-6" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-700">
                                            {isUploading ? "Uploading..." : "Click to upload resignation letter"}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">Supports PDF or DOCX up to 5MB</p>
                                    </div>
                                    <input ref={fileRef} type="file" className="hidden" accept=".pdf,.docx" onChange={handleFile} disabled={isUploading} />
                                </div>

                                {form.docs.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {form.docs.map((doc, i) => (
                                            <div key={i} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 shadow-sm animate-in fade-in slide-in-from-left-2 duration-200">
                                                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-gray-800 truncate">{doc.name}</p>
                                                    <p className="text-[10px] text-gray-400">{doc.size} • {doc.type}</p>
                                                </div>
                                                <button 
                                                    type="button"
                                                    onClick={() => removeDoc(i)} 
                                                    className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="bg-gray-50/80 px-8 py-6 border-t border-gray-100 flex items-center justify-between gap-4">
                        <button 
                            type="button"
                            onClick={() => router.back()}
                            className="text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 bg-[#4A45B6] hover:bg-[#3f3aa0] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-8 py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Submit Application
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
