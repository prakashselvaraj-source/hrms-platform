"use client";

import { useState, useMemo, useRef } from "react";
import {
    FileText,
    Folder,
    Upload,
    Search,
    ChevronRight,
    CheckCircle2,
    Clock,
    File,
    Image as ImageIcon,
    FileCode,
    History,
    Users,
    Download,
    Eye,
    X,
    ShieldCheck,
    HardDrive,
    Calendar,
    Filter,
    XCircle,
    RotateCcw
} from "lucide-react";

/* ─── Components ─── */

const FileIcon = ({ type }) => {
    switch (type) {
        case "pdf": return <FileText className="text-rose-500" size={20} />;
        case "image": return <ImageIcon className="text-blue-500" size={20} />;
        case "excel": return <FileCode className="text-emerald-500" size={20} />;
        default: return <File className="text-slate-400" size={20} />;
    }
};


const StatusPill = ({ status }) => {
    const styles = {
        Completed: "bg-[#007B71] text-white",
        Verified: "bg-blue-50 text-blue-600",
        Rejected: "bg-[#FFDAD6] text-[#BA1A1A] ",

        "Under Review": "bg-[#FFFBEB] text-[#6D4C41]",
        Pending: "bg-rose-50 text-rose-600",
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${styles[status] || "bg-slate-50 text-slate-500"}`}>
            {status.toUpperCase()}
        </span>
    );
};


function ViewModal({ file, onClose }) {
    if (!file) return null;


    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();

        }
    }
    return (
        <div onClick={handleOutsideClick} className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center border border-slate-100">
                            <FileIcon type={file.type} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">{file.name}</h3>
                            <p className="text-[10px] font-bold text-[#4A45B6] uppercase tracking-widest">{file.type} Document</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-600 transition-all">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">File Size</p>
                            <p className="text-sm font-semibold text-[#191C1E] flex items-center gap-2">
                                <HardDrive size={14} className="text-slate-300" />
                                {file.size}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Uploaded On</p>
                            <p className="text-sm font-semibold text-[#191C1E] flex items-center gap-2">
                                <Calendar size={14} className="text-slate-300" />
                                {file.date}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Employee</p>
                            <p className="text-sm font-semibold text-[#191C1E] flex items-center gap-2">
                                <Users size={14} className="text-slate-300" />
                                {file.uploadedFor}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Current Status</p>
                            <StatusPill status={file.status} />
                        </div>
                    </div>

                    <div className="p-4 bg-violet-50/50 rounded-xl border border-violet-100">
                        <p className="text-[11px] font-bold text-[#4A45B6] uppercase tracking-wider mb-2">Manager Access Note</p>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                            This document is visible to you as the direct manager of {file.uploadedFor.split(" ")[0]}.
                            Changes or verification will be logged in the audit trail.
                        </p>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 flex items-center gap-3">
                    <button className="flex-1 bg-[#4A45B6] hover:bg-violet-700 text-white py-2.5 rounded-sm text-sm font-bold shadow-lg shadow-violet-100 transition-all flex items-center justify-center gap-2">
                        <Download size={16} />
                        Download File
                    </button>
                    <button onClick={onClose} className="px-6 py-2.5 border border-slate-200 text-slate-600 hover:bg-white rounded-sm text-sm font-bold transition-all">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}


/* ─── Mock Data ─── */
const initialTeamFiles = [
    { id: 1, name: "Performance_Review_Q1_Sonia.pdf", type: "pdf", size: "1.2 MB", uploadedFor: "Sonia Kaur", date: "Apr 18, 2026", status: "Completed" },
    { id: 2, name: "Project_Submission_Vikram.zip", type: "zip", size: "15.4 MB", uploadedFor: "Vikram Kota", date: "Apr 17, 2026", status: "Under Review" },
    { id: 3, name: "Training_Certificate_Meena.jpg", type: "image", size: "2.1 MB", uploadedFor: "Meena Raj", date: "Apr 15, 2026", status: "Verified" },
    { id: 4, name: "Asset_Declaration_Arjun.pdf", type: "pdf", size: "850 KB", uploadedFor: "Arjun Das", date: "Apr 12, 2026", status: "Pending" },
    { id: 5, name: "Travel_Reimbursement_Rahul.pdf", type: "pdf", size: "1.1 MB", uploadedFor: "Rahul Verma", date: "Apr 10, 2026", status: "Completed" },
];

export default function ManagerFiles() {
    const [files, setFiles] = useState(initialTeamFiles);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewingFile, setViewingFile] = useState(null);
    const [toast, setToast] = useState(null);
    const fileInputRef = useRef(null);
    const scrollref = useRef(null);
    const handleClose = () => {
        setViewingFile(null); // ✅ close modal

        if (scrollref.current) {
            scrollref.current.style.overflow = "auto";
        }
    };
    const openModal = (file) => {
        setViewingFile(file);

        if (scrollref.current) {
            scrollref.current.style.overflow = "hidden";
        }
    };

    const filteredFiles = useMemo(() => {
        return files.filter(f =>
            f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.uploadedFor.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [files, searchTerm]);

    const handleApprove = (id) => {
        setFiles(files.map(f => f.id === id ? { ...f, status: "Verified" } : f));
        showToast("Document approved and verified!");
    };

    const handleReject = (id) => {
        setFiles(files.map(f => f.id === id ? { ...f, status: "Rejected" } : f));
        showToast("Document rejected.");
    };

    const handleReset = (id) => {
        setFiles(files.map(f => f.id === id ? { ...f, status: "Pending" } : f));
        showToast("Status reset to Pending.");
    };

    const handleDownload = (name) => {
        showToast(`Preparing download for ${name}...`);
        setTimeout(() => showToast(`Successfully downloaded: ${name}`), 1000);
    };

    const handleTeamUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const mockNew = {
            id: Date.now(),
            name: file.name,
            type: file.name.split('.').pop().toLowerCase(),
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            uploadedFor: "Team Shared",
            date: "Today",
            status: "Under Review"
        };
        setFiles([mockNew, ...files]);
        showToast("Team document uploaded successfully!");
        e.target.value = null; // Reset input
    };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <div className="min-h-screen p-6 md:p-10 text-[#191C1E] relative" ref={scrollref}>

            <ViewModal file={viewingFile} onClose={handleClose} />

            {/* Toast */}
            {toast && (
                <div className="fixed top-10 right-10 z-[120] bg-slate-900 text-white px-6 py-3 rounded-sm shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-right-10 font-bold text-sm">
                    <CheckCircle2 size={18} className="text-emerald-400" />
                    {toast}
                    <button onClick={() => setToast(null)}><X size={14} /></button>
                </div>
            )}

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-6 uppercase tracking-widest font-bold">
                <span>Dashboard</span>
                <ChevronRight size={12} />
                <span className="text-[#4A45B6]">Team Documents</span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Team Files</h1>
                    <p className="text-sm text-slate-400 mt-1">Review and manage documents for your direct reports.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={handleTeamUpload} className="flex items-center gap-2 bg-[#4A45B6] hover:bg-violet-700 text-white px-4 py-2 rounded-sm text-sm font-bold transition-all shadow-lg shadow-violet-100 active:scale-95">
                        <Upload size={16} /> Upload for Team
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>
            </div>

            {/* Manager Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[

                    {
                        label: "Team Members", value: "08", icon: Users,
                        color: "text-[#4A45B6]", border: "border-[#4A45B6]",
                        bg: "bg-[#4A45B61A]"
                    },
                    {
                        label: "Pending Review", value: files.filter(f => f.status === "Pending" || f.status === "Under Review").length, icon: Clock,
                        color: "text-[#BA1A1A]", border: "border-[#BA1A1A]", bg: "bg-[#FFDAD633]"
                    },
                    {
                        label: "Verified Docs", value: files.filter(f => f.status === "Verified" || f.status === "Completed").length,
                        icon: ShieldCheck, color: "text-[#006058] ", border: "border-[#006058]",
                        bg: "bg-[#007B711A]"
                    },

                ].map((stat) => (
                    <div key={stat.label} className={`p-6 rounded-sm bg-[#F8FAFC]  border-l-4 flex items-center gap-4 
                    transition-all hover:shadow-md cursor-default ${stat.border} `}>
                        <div className={`w-12 h-12 rounded-sm flex items-center justify-center ${stat.bg}`}>
                            <stat.icon size={24} className={stat.color} />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-2xl font-bold mt-0.5">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Files List */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[300px]">
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text" placeholder="Search team documents..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-[#4A45B6]"
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-sm border border-slate-200">
                        <History size={16} /> Team Activity
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-[#F2F4F6] border-b border-slate-100">
                                <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Document Name</th>
                                <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Employee</th>
                                <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="text-right px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredFiles.length === 0 ? (
                                <tr><td colSpan={5} className="py-16 text-center text-slate-400">No team documents found.</td></tr>
                            ) : (
                                filteredFiles.map((file) => (
                                    <tr key={file.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded bg-slate-50 flex items-center justify-center"><FileIcon type={file.type} /></div>
                                                <span className="font-bold text-slate-800">{file.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">{file.uploadedFor[0]}</div>
                                                <span className="font-semibold text-[#191C1E]">{file.uploadedFor}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">{file.date}</td>
                                        <td className="px-6 py-4"><StatusPill status={file.status} /></td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => openModal(file)}
                                                    className="p-2 text-slate-400 hover:text-[#4A45B6] hover:bg-violet-50 rounded-sm transition-all" title="View"><Eye size={16} /></button>
                                                <button onClick={() => handleDownload(file.name)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-sm transition-all" title="Download"><Download size={16} /></button>

                                                {/* Status Actions */}
                                                {(file.status === "Pending" || file.status === "Under Review") ? (
                                                    <>
                                                        <button onClick={() => handleApprove(file.id)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-sm transition-all" title="Approve"><ShieldCheck size={16} /></button>
                                                        <button onClick={() => handleReject(file.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-sm transition-all" title="Reject"><XCircle size={16} /></button>
                                                    </>
                                                ) : (
                                                    <button onClick={() => handleReset(file.id)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-sm transition-all" title="Reset to Pending">
                                                        <RotateCcw size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Manager Notice */}
            <div className="mt-8 p-4 bg-[#FFFBEB] border-l-4  border-[#FFB300]  rounded-sm flex gap-3">
                <Clock className="text-amber-600 shrink-0" size={18} />
                <div>
                    <p className="text-sm font-bold text-[#6D4C41]">Access Restricted</p>
                    <p className="text-xs text-[#795548] mt-0.5">You only have access to documents for employees within your department. Verification actions are logged.</p>
                </div>
            </div>
        </div>
    );
}
