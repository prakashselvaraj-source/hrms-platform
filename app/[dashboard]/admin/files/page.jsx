"use client";

import { useState, useRef } from "react";
import {
    FileText,
    Folder,
    Upload,
    Search,
    Filter,
    Download,
    Trash2,
    Eye,
    ChevronRight,
    CheckCircle2,
    Clock,
    AlertCircle,
    File,
    Image as ImageIcon,
    FileCode,
    History,
    Signature,
    X,
    HardDrive,
    Calendar,
    User as UserIcon,
    ShieldCheck,
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
        Signed: "bg-[#007B71] text-white",
        Verified: "bg-blue-50 text-blue-600",
        Rejected: "bg-[#FFDAD6] text-[#BA1A1A] ",
        Pending: "bg-rose-50 text-rose-600",
        Published: "bg-blue-50 text-blue-600 border-blue-100",
        Draft: "bg-slate-50 text-slate-500 border-slate-100",
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
    };

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
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ownership</p>
                            <p className="text-sm font-semibold text-[#191C1E] flex items-center gap-2">
                                <UserIcon size={14} className="text-slate-300" />
                                {file.uploadedFor}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Current Status</p>
                            <StatusPill status={file.status} />
                        </div>
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
const mockFiles = [
    { id: 1, name: "Employment_Agreement_Priya.pdf", type: "pdf", size: "2.4 MB", uploadedFor: "Priya Sharma", date: "Apr 18, 2026", status: "Signed" },
    { id: 2, name: "ID_Proof_Vikram.jpg", type: "image", size: "1.1 MB", uploadedFor: "Vikram Kota", date: "Apr 17, 2026", status: "Pending" },
    { id: 3, name: "Policy_Handbook_2026.pdf", type: "pdf", size: "5.8 MB", uploadedFor: "All Employees", date: "Apr 15, 2026", status: "Published" },
    { id: 4, name: "Relieving_Letter_Arjun.pdf", type: "pdf", size: "1.8 MB", uploadedFor: "Arjun Das", date: "Apr 12, 2026", status: "Draft" },
    { id: 5, name: "Income_Tax_Declaration.xlsx", type: "excel", size: "450 KB", uploadedFor: "Sonia Kaur", date: "Apr 10, 2026", status: "Pending" },
];

export default function AdminFiles() {
    const [files, setFiles] = useState(mockFiles);
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

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleDownload = (name) => {
        showToast(`Preparing download for ${name}...`);
        setTimeout(() => showToast(`Successfully downloaded: ${name}`), 1000);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const mockNew = {
            id: Date.now(),
            name: file.name,
            type: file.name.split('.').pop().toLowerCase(),
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            uploadedFor: "Admin Upload",
            date: "Today",
            status: "Pending"
        };
        setFiles([mockNew, ...files]);
        showToast("Document uploaded successfully!");
        e.target.value = null; // Reset input
    };

    const handleVerify = (id) => {
        setFiles(files.map(f => f.id === id ? { ...f, status: "Verified" } : f));
        showToast("Document verified successfully.");
    };

    const handleReject = (id) => {
        setFiles(files.map(f => f.id === id ? { ...f, status: "Rejected" } : f));
        showToast("Document rejected.");
    };

    const handleReset = (id) => {
        setFiles(files.map(f => f.id === id ? { ...f, status: "Pending" } : f));
        showToast("Status reset to Pending.");
    };

    const handleDelete = (id, name) => {
        setFiles(files.filter(f => f.id !== id));
        showToast(`Document "${name}" deleted.`);
    };

    return (
        <div className="min-h-screen  p-6 md:p-10 text-[#191C1E]" ref={scrollref}>

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
                <span className="text-[#4A45B6]">Files & Documents</span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Documents Vault</h1>
                    <p className="text-sm text-slate-400 mt-1">Manage, request, and organize company-wide files.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 bg-[#4A45B6] hover:bg-violet-700 text-white px-4 py-2 rounded-sm text-sm font-bold transition-all shadow-lg shadow-violet-100 active:scale-95"
                    >
                        <Upload size={16} />
                        Upload Document
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

                    <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-sm text-sm font-bold hover:bg-slate-50 transition-all">
                        <Signature size={16} />
                        Request Sign
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {[


                    { label: "Total Documents", value: "1,284", icon: Folder, color: "text-[#4A45B6]", border: "border-[#4A45B6]", bg: "bg-[#4A45B61A]" },
                    {
                        label: "Pending Signatures", value: "42", icon: Clock, color: "text-[#BA1A1A]", border: "border-[#BA1A1A]",

                        bg: "bg-[#FFDAD633]"
                    },


                    {
                        label: "Signed Documents", value: "856", icon: CheckCircle2, color: "text-[#712AE2]", border: "border-[#712AE2]",
                        bg: "bg-[#8A4CFC1A]"
                    },

                    {
                        label: "Compliance Alerts", value: "03", icon: AlertCircle, color: "text-[#006058] ", border: "border-[#006058]",
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

            {/* Main Content Area */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

                {/* Table Toolbar */}
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by file name or employee..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-[#4A45B6] transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-sm border border-slate-200">
                            <Filter size={16} />
                            Filter
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-sm border border-slate-200">
                            <History size={16} />
                            Audit Log
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-[#F2F4F6] border-b border-slate-100">
                                <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">File Name</th>
                                <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Size</th>
                                <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Uploaded For</th>
                                <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="text-right px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {files.map((file) => (
                                <tr key={file.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-slate-50 flex items-center justify-center group-hover:bg-white transition-all shadow-sm">
                                                <FileIcon type={file.type} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{file.name}</p>
                                                <p className="text-[11px] text-slate-400 uppercase tracking-tight">{file.type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-slate-500 font-medium">{file.size}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-[#E2DFFF] text-[#4A45B6] flex items-center justify-center text-[10px] font-bold">
                                                {file.uploadedFor.split(" ")[0][0]}
                                            </div>
                                            <span className="font-semibold text-[#191C1E]">{file.uploadedFor}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{file.date}</td>
                                    <td className="px-6 py-4">
                                        <StatusPill status={file.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => openModal(file)} className="p-2 text-slate-400 hover:text-[#4A45B6] hover:bg-violet-50 rounded-sm transition-all" title="View">
                                                <Eye size={16} />
                                            </button>
                                            <button onClick={() => handleDownload(file.name)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-sm transition-all" title="Download">
                                                <Download size={16} />
                                            </button>

                                            {/* Status Actions */}
                                            {file.status === "Pending" ? (
                                                <>
                                                    <button onClick={() => handleVerify(file.id)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-sm transition-all" title="Verify">
                                                        <ShieldCheck size={16} />
                                                    </button>
                                                    <button onClick={() => handleReject(file.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-sm transition-all" title="Reject">
                                                        <XCircle size={16} />
                                                    </button>
                                                </>
                                            ) : (
                                                <button onClick={() => handleReset(file.id)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-sm transition-all" title="Reset to Pending">
                                                    <RotateCcw size={16} />
                                                </button>
                                            )}

                                            <button onClick={() => handleDelete(file.id, file.name)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-sm transition-all" title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                <div className="px-6 py-4 bg-slate-50/50 flex items-center justify-between border-t border-slate-100">
                    <p className="text-xs text-slate-400 font-medium">Showing 1 to {files.length} of {files.length} documents</p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 text-xs font-bold text-slate-400 border border-slate-200 rounded-sm bg-white hover:bg-slate-50">Prev</button>
                        <button className="px-3 py-1 text-xs font-bold text-white bg-[#4A45B6] rounded-sm border border-[#4A45B6]">1</button>
                        <button className="px-3 py-1 text-xs font-bold text-slate-400 border border-slate-200 rounded-sm bg-white hover:bg-slate-50">Next</button>
                    </div>
                </div>
            </div>

            {/* Workflow Preview Section (Optional UI) */}
            <div className="mt-10">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Document Lifecycle</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    {[
                        { actor: "Admin", title: "Create", sub: "from template", color: "bg-[#EEEDFE] text-[#3C3489]" },
                        { actor: "Admin", title: "Assign", sub: "to employee", color: "bg-[#EEEDFE] text-[#3C3489]" },
                        { actor: "Employee", title: "Sign", sub: "e-signature", color: "bg-[#E6F1FB] text-[#0C447C]" },
                        { actor: "System", title: "Vault", sub: "auto-filing", color: "bg-[#F1EFE8] text-[#444441]" },
                        { actor: "Manager", title: "Review", sub: "team docs", color: "bg-[#E1F5EE] text-[#085041]" },
                    ].map((step, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="flex-1 p-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl text-center">
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${step.color}`}>{step.actor}</span>
                                <p className="text-sm font-bold text-slate-800 mt-2">{step.title}</p>
                                <p className="text-[11px] text-slate-400 leading-tight">{step.sub}</p>
                            </div>
                            {i < 4 && <ChevronRight className="text-slate-200 hidden md:block" size={20} />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
