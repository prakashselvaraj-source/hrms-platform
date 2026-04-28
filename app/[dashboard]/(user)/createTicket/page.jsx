"use client";

import { useState, useRef, useEffect } from "react";

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
    Low: "bg-sky-100 text-sky-700 border-sky-200 ring-sky-300",
    Medium: "bg-violet-100 text-violet-700 border-violet-200 ring-violet-300",
    High: "bg-amber-100 text-amber-700 border-amber-200 ring-amber-300",
    Urgent: "bg-red-100 text-red-700 border-red-200 ring-red-300",
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
    const fileRef = useRef(null);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setCategoryOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const applyFormat = (tag) => {
        const textarea = document.getElementById("desc-area");
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = description.slice(start, end);
        const wrapped =
            tag === "ul"
                ? "\n• " + selected
                : `<${tag}>${selected}</${tag}>`;
        setDescription(description.slice(0, start) + wrapped + description.slice(end));
    };

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

    const handleSubmit = () => {
        if (!subject.trim()) return;
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2">Ticket Submitted!</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Our team typically responds within 2–4 business hours.
                    </p>
                    <button
                        onClick={() => { setSubmitted(false); setSubject(""); setDescription(""); setFiles([]); }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
                    >
                        Raise Another Ticket
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f6fa] p-4 sm:p-8 lg:p-12">
            <div className="w-full">
                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="text-xl sm:text-3xl font-bold text-[#1E293B] tracking-tight">
                        Create Support Ticket
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Our team typically responds within 2–4 business hours.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-8 space-y-7">

                    {/* Category + Priority Row */}
                    <div className="flex flex-col sm:flex-row gap-6">

                        {/* Ticket Category — custom dropdown */}
                        <div className="flex-1" ref={dropdownRef}>
                            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                                Ticket Category
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setCategoryOpen(!categoryOpen)}
                                    className="w-full flex items-center justify-between border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 bg-white hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                                >
                                    <span>{category}</span>
                                    <svg
                                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${categoryOpen ? "rotate-180" : ""}`}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {categoryOpen && (
                                    <ul className="absolute z-20 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg  overflow-hidden">
                                        {categories.map((c) => (
                                            <li key={c}>
                                                <button
                                                    type="button"
                                                    onClick={() => { setCategory(c); setCategoryOpen(false); }}
                                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2
                                                        ${category === c
                                                            ? "bg-indigo-50 text-indigo-700 font-semibold"
                                                            : "text-gray-700 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    <span className={`w-4 text-indigo-500 ${category === c ? "opacity-100" : "opacity-0"}`}>
                                                        ✓
                                                    </span>
                                                    {c}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Priority Level */}
                        <div className="flex-1">
                            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                                Priority Level
                            </label>
                            <div className="flex gap-2 flex-wrap">
                                {priorities.map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPriority(p)}
                                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-100
                                            ${priority === p
                                                ? `${priorityStyles[p]} ring-2`
                                                : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300"
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                            Subject
                        </label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Summary of your request"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                        />
                    </div>

                    {/* Issue Description */}
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                            Issue Description
                        </label>
                        <div className="flex items-center gap-1 border border-b-0 border-gray-200 rounded-t-xl px-3 py-2 bg-gray-50">
                            {[
                                { icon: "B", tag: "b", label: "Bold" },
                                { icon: "I", tag: "i", label: "Italic" },
                            ].map(({ icon, tag, label }) => (
                                <button
                                    key={tag}
                                    onClick={() => applyFormat(tag)}
                                    title={label}
                                    className="w-7 h-7 rounded-md text-xs font-bold text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors flex items-center justify-center"
                                >
                                    {icon}
                                </button>
                            ))}
                            <button
                                onClick={() => applyFormat("ul")}
                                title="Bullet list"
                                className="w-7 h-7 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors flex items-center justify-center"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                            </button>
                            <button
                                title="Link"
                                className="w-7 h-7 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors flex items-center justify-center"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            </button>
                        </div>
                        <textarea
                            id="desc-area"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Please provide detailed information about your inquiry..."
                            rows={6}
                            className="w-full border border-gray-200 rounded-b-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition resize-none"
                        />
                    </div>

                    {/* Attachments */}
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                            Attachments
                        </label>
                        <div
                            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => fileRef.current.click()}
                            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-150
                                ${dragging
                                    ? "border-indigo-400 bg-indigo-50"
                                    : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                                }`}
                        >
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-semibold text-gray-700">
                                    Click to upload or drag and drop
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">PDF, PNG, JPG, DOCX up to 10MB</p>
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

                        {files.length > 0 && (
                            <div className="mt-3 space-y-2">
                                {files.map((file, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-gray-700 truncate">{file.name}</p>
                                                <p className="text-[10px] text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFile(i)}
                                            className="text-gray-300 hover:text-red-400 transition-colors ml-3 flex-shrink-0"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-1">
                        <button
                            onClick={() => { setSubject(""); setDescription(""); setFiles([]); setPriority("Low"); setCategoryOpen(false); }}
                            className="sm:w-32 text-sm font-semibold text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700 py-3 rounded-sm transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!subject.trim()}
                            className="bg-[#4A45B6] text-white text-sm font-semibold p-3 rounded-sm transition-all duration-150 active:scale-95 shadow-md shadow-indigo-200"
                        >
                            Submit Ticket
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
