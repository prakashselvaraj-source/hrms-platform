"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTenant } from "@/hooks/useTenant";
import {
    SlidersHorizontal,
    FileText,
    Plus,
    LayoutList,
    CalendarDays,
    Eye,
    Pencil,
    Trash2,
    X,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Flag,
    Building2,
    Sparkles,
} from "lucide-react";
import HolidayCalendarPage from "@/components/holidays/holidaycalender";
import { createHoliday, getAllHolidays, updateHoliday, deleteHoliday } from "@/services/holidayService";




const categoryColors = {
    "Company Specific": "bg-purple-100 text-purple-700",
    Religious: "bg-emerald-100 text-emerald-700",
    National: "bg-violet-100 text-violet-700",
};

const barColors = {
    "01": "bg-purple-500",
    "02": "bg-purple-500",
    "03": "bg-emerald-400",
    "04": "bg-emerald-400",
    "05": "bg-violet-400",
};

const categoryOptions = ["National", "Regional", "Religious", "Company Specific", "Internal"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function HeaderButton({ icon: Icon, label, onClick, primary }) {
    if (primary) {
        return (
            <button
                onClick={onClick}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-white text-sm font-semibold cursor-pointer shadow-md bg-[#4A45B6]"
            >
                <Icon size={15} />
                {label}
            </button>
        );
    }
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#E0E3E5]  text-[#434655] text-sm font-medium shadow-sm transition"
        >
            <Icon size={15} className="text-[#191C1E]" />
            {label}
        </button>
    );
}

function CategoryBadge({ category }) {
    const normalizedCategory = category?.charAt(0).toUpperCase() + category?.slice(1).toLowerCase();
    const displayCategory = category?.charAt(0).toUpperCase() + category?.slice(1).toLowerCase();

    // Mapping for colors based on normalized casing or literal uppercase if needed
    const colorClass = categoryColors[displayCategory] || categoryColors[category] || "bg-gray-200 text-gray-600";

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
            {displayCategory}
        </span>
    );
}

function TypeBadge({ type }) {
    if (type?.toUpperCase() === "RESTRICTED") {
        return (
            <span className="flex items-center gap-1.5 text-sm text-amber-500 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                Restricted holiday
            </span>
        );
    }
    return (
        <span className="flex items-center gap-1.5 text-sm text-[#434655] font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            Holiday
        </span>
    );
}

function CustomDropdown({ value, onChange, options }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((p) => !p)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-md bg-gray-200 text-[#434655] text-sm font-medium focus:outline-none"
            >
                {value}
                <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.ul
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 mt-1 w-full bg-white  rounded-md shadow-lg overflow-hidden"
                    >
                        {options.map((opt) => (
                            <li
                                key={opt}
                                onClick={() => { onChange(opt); setOpen(false); }}
                                className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-purple-50 hover:text-purple-700 transition ${opt === value ? "bg-purple-50 text-purple-700 font-semibold" : "text-[#434655]"}`}
                            >
                                {opt}
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
}

function HolidayFormModal({ open, onClose, holiday, onSuccess }) {
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [selectedType, setSelectedType] = useState("Holiday");
    const [category, setCategory] = useState("National");
    const tenantId = useTenant();

    const isEdit = !!holiday;

    useEffect(() => {
        if (open) {
            if (holiday) {
                setName(holiday.holidayName || holiday.name || "");
                setDate(holiday.date || "");
                const normalizedType =
                    holiday.type?.toLowerCase() === "restricted"
                        ? "Restricted"
                        : "Holiday";

                setSelectedType(normalizedType);
                setCategory(holiday.category || "National");
            } else {
                setName("");
                setDate("");
                setSelectedType("Holiday");
                setCategory("National");
            }
        }
    }, [holiday, open]);

    // ✅ Validation check
    const isFormValid =
        name.trim() !== "" &&
        date.trim() !== "" &&
        category.trim() !== "" &&
        selectedType.trim() !== "";

    const handleSubmit = async () => {
        if (!isFormValid) return; // extra safety

        const holidayData = {
            holidayName: name,
            date: date,
            category: category,
            type: selectedType,
        };

        try {
            if (isEdit) {
                await updateHoliday(holiday.id, holidayData, tenantId);
                console.log("Holiday Updated:", holidayData);
            } else {
                await createHoliday(holidayData, tenantId);
                console.log("New Holiday Created:", holidayData);
            }
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error(`Error ${isEdit ? 'updating' : 'creating'} holiday:`, error);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-[#FFFFFF] rounded-2xl shadow-2xl w-full max-w-lg p-5 sm:p-8 relative overflow-y-auto max-h-[90vh]"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 28 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 sm:top-5 sm:right-5 text-gray-400 hover:text-gray-600 transition"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-xl sm:text-2xl font-bold text-[#191C1E]">
                                {isEdit ? "Edit Holiday" : "Add Holiday"}
                            </h2>

                            <p className="text-xs sm:text-sm text-[#434655] mt-1 mb-6">
                                {isEdit
                                    ? "Update the details of the existing holiday."
                                    : "Create a new holiday entry for the calendar."}
                            </p>

                            {/* Holiday Name */}
                            <div className="mb-5">
                                <label className="block text-xs font-semibold text-[#191C1E] uppercase tracking-wide mb-2">
                                    Holiday Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Annual Staff Gala"
                                    className="w-full px-4 py-3 rounded-md bg-gray-200 text-sm text-[#434655] focus:outline-none focus:ring-2 focus:ring-purple-300"
                                />
                                {name.trim() === "" && (
                                    <p className="text-xs text-red-500 mt-1 ml-2">
                                        Holiday name is required
                                    </p>
                                )}
                            </div>

                            {/* Date + Category */}
                            <div className="grid grid-cols-2 gap-4 mb-5">
                                <div>
                                    <label className="block text-xs font-semibold text-[#191C1E] uppercase tracking-wide mb-2">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full px-4 py-3 rounded-md bg-gray-200 text-sm text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-purple-300"
                                    />
                                    {date.trim() === "" && (
                                        <p className="text-xs text-red-500 mt-1 ml-2">
                                            Date is required
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#191C1E] uppercase tracking-wide mb-2">
                                        Category
                                    </label>
                                    <CustomDropdown
                                        value={category}
                                        onChange={setCategory}
                                        options={categoryOptions}
                                    />
                                </div>
                            </div>

                            {/* Type */}
                            <div className="mb-8">
                                <label className="block text-xs font-semibold text-[#191C1E] uppercase tracking-wide mb-2">
                                    Type
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {["Holiday", "Restricted"].map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setSelectedType(t)}
                                            className={`flex items-center justify-center gap-2 px-2 py-3 rounded-md text-sm font-semibold transition ${selectedType === t
                                                ? "border-2 border-[#4A45B6] bg-gray-200 text-[#3B35A7]"
                                                : "bg-gray-200 text-[#191C1E]"
                                                }`}
                                        >
                                            <CalendarDays size={16} />
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 sm:gap-4">
                                <button
                                    onClick={onClose}
                                    className="w-full sm:w-auto text-[#4A45B6] font-semibold text-sm hover:underline py-2"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleSubmit}
                                    disabled={!isFormValid}
                                    className={`w-full sm:w-auto px-6 py-2.5 rounded-md text-sm font-bold shadow ${isFormValid
                                        ? "bg-[#4A45B6] text-white cursor-pointer"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                >
                                    {isEdit ? "Update Holiday" : "Add Holiday"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function ViewHolidayModal({ open, onClose, holiday }) {
    if (!holiday) return null;
    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
                    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
                            <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition"><X size={20} /></button>
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${holiday.type === 'restricted' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                    <CalendarDays size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">{holiday.holidayName || holiday.name}</h2>
                                <p className="text-gray-500 mt-1">{holiday.date}</p>

                                <div className="mt-8 w-full space-y-4 text-left">
                                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                        <span className="text-sm font-medium text-gray-500">Category</span>
                                        <CategoryBadge category={holiday.category} />
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                        <span className="text-sm font-medium text-gray-500">Type</span>
                                        <TypeBadge type={holiday.type} />
                                    </div>
                                    <div className="flex justify-between items-center py-3">
                                        <span className="text-sm font-medium text-gray-500">ID</span>
                                        <span className="text-sm font-bold text-gray-800">#{holiday.id}</span>
                                    </div>
                                </div>

                                <button onClick={onClose} className="mt-8 w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition">Close</button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Removed EditHolidayModal as it is now merged into HolidayFormModal

function DeleteHolidayModal({ open, onClose, holiday, onSuccess }) {
    const tenantId = useTenant();
    if (!holiday) return null;
    const handleDelete = async () => {
        try {
            await deleteHoliday(holiday.id, tenantId);
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("Error deleting holiday:", error);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
                    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center relative" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
                            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Delete Holiday?</h2>
                            <p className="text-gray-500 mt-2">Are you sure you want to delete <span className="font-bold text-gray-800">"{holiday.holidayName || holiday.name}"</span>? This action cannot be undone.</p>

                            <div className="flex flex-col gap-3 mt-8">
                                <button onClick={handleDelete} className="w-full py-3 rounded-xl bg-red-500 text-white font-bold shadow-lg shadow-red-200 hover:bg-red-600 transition">Delete Permanently</button>
                                <button onClick={onClose} className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition">Cancel</button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HolidaysPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("List View");
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [holidays, setHolidays] = useState([]);
    const [totalEntries, setTotalEntries] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedHoliday, setSelectedHoliday] = useState(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const tenantId = useTenant();
    const fetchHolidays = async () => {
        try {
            const res = await getAllHolidays(tenantId, currentPage, rowsPerPage);
            if (res.data?.holidays) {
                setHolidays(res.data.holidays);
                setTotalEntries(res.data.totalElements ?? 0);
                setTotalPages(res.data.totalPages ?? 0);
            } else {
                setHolidays(res.data || []);
                setTotalEntries((res.data || []).length);
                setTotalPages(Math.ceil((res.data || []).length / rowsPerPage));
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (tenantId) fetchHolidays();
    }, [tenantId, currentPage, rowsPerPage]);

    const from = totalEntries === 0 ? 0 : currentPage * rowsPerPage + 1;
    const to = Math.min((currentPage + 1) * rowsPerPage, totalEntries);
    const pages = Array.from({ length: totalPages }, (_, i) => i).filter(
        (p) => p >= Math.max(0, currentPage - 1) && p <= Math.min(totalPages - 1, currentPage + 1)
    );
    const PER_PAGE_OPTIONS = [10, 20, 50];

    const displayHolidays = holidays;


    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingHolidays = holidays
        .filter((h) => {
            const holidayDate = new Date(h.date);
            return holidayDate > today;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 4)
        .map((h) => {
            const d = new Date(h.date);

            return {
                month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
                day: d.getDate().toString().padStart(2, "0"),
                name: h.holidayName,
                sub: `${h.category} • ${h.type === "RESTRICTED" ? "Restricted" : "Holiday"}`,
            };
        });
    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#191C1E]">Holidays</h1>
                        <p className="text-xs sm:text-sm text-[#434655] mt-1">Manage corporate and regional holiday calendars for the 2024 fiscal year.</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <HeaderButton icon={SlidersHorizontal} label="Filter" />
                        <HeaderButton icon={FileText} label="Export PDF" />
                        <HeaderButton icon={Plus} label="Add Holiday" primary onClick={() => setModalOpen(true)} />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-1 bg-[#ECEEF0] rounded-md shadow-sm ">
                        {["List View", "Calendar View"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition ${activeTab === tab
                                    ? "bg-white shadow text-gray-800 "
                                    : "text-[#191C1E] hover:text-[#434655]"
                                    }`}
                            >
                                {tab === "List View" ? <LayoutList size={14} /> : <CalendarDays size={14} />}
                                {tab}
                            </button>
                        ))}
                    </div>
                    <span className="text-sm font-semibold text-[#434655]">March 2024</span>
                </div>



                {activeTab == "List View" ? (
                    <div>
                        {/* Table */}
                        <div className="bg-white rounded-2xl shadow-sm  overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className=" bg-gray-50">
                                            {["#", "Holiday Name", "Date", "Category", "Type", "Actions"].map((col) => (
                                                <th key={col} className="px-5 py-3.5 text-left text-xs font-bold text-[#434655] bg-[#F2F4F6] uppercase tracking-wider whitespace-nowrap">
                                                    {col}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {displayHolidays.map((h, index) => {
                                            const globalIndex = currentPage * rowsPerPage + index;
                                            return (
                                                <tr key={h.id} className="hover:bg-gray-50/60 transition group">
                                                    <td className="px-5 py-4 text-sm text-[#434655] font-medium">{globalIndex + 1}</td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-1 h-8 rounded-full flex-shrink-0 ${barColors[h.id]}`} />
                                                            <span className="text-sm font-bold text-gray-800">{h.holidayName}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 text-sm text-[#191C1E] whitespace-nowrap">{h.date}</td>
                                                    <td className="px-5 py-4"><CategoryBadge category={h.category} /></td>
                                                    <td className="px-5 py-4"><TypeBadge type={h.type} /></td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <button onClick={() => { setSelectedHoliday(h); setViewOpen(true); }} className="text-[#4A45B6] hover:bg-purple-50 p-1.5 rounded-lg transition"><Eye size={17} /></button>
                                                            <button onClick={() => { setSelectedHoliday(h); setModalOpen(true); }} className="text-[#4A45B6] hover:bg-purple-50 p-1.5 rounded-lg transition"><Pencil size={17} /></button>
                                                            <button onClick={() => { setSelectedHoliday(h); setDeleteOpen(true); }} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition"><Trash2 size={17} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-4 border-t border-[#F1F5F9] gap-3">
                                <div className="flex items-center gap-3 text-sm text-[#6B7280]">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[#434655]">Per Page:</span>
                                        <select
                                            value={rowsPerPage}
                                            onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(0); }}
                                            className="rounded-md px-2 py-0.5 text-[12px] text-[#4A45B6] bg-white border border-gray-200 focus:outline-none focus:border-[#4A45B6]"
                                        >
                                            {PER_PAGE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
                                        </select>
                                    </div>
                                    <span className="text-[#434655]">Showing {from} to {to} of {totalEntries} entries</span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                                        disabled={currentPage === 0}
                                        className="w-7 h-7 flex items-center justify-center rounded-md border border-[#E2E8F0] text-[#434655] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft size={14} />
                                    </button>
                                    {pages.map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-7 h-7 flex items-center justify-center rounded-md text-[12px] font-medium transition-colors ${currentPage === page
                                                ? 'bg-[#4A45B6] text-white'
                                                : 'border border-[#E2E8F0] text-[#6B7280]'
                                                }`}
                                        >
                                            {page + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                                        disabled={currentPage === totalPages - 1}
                                        className="w-7 h-7 flex items-center justify-center rounded-md border border-[#E2E8F0] text-[#434655] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Bottom section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 md:mt-8">
                            {/* Holiday Statistics */}
                            <div className="bg-white rounded-2xl shadow-sm  p-6">
                                <h3 className="text-xs font-bold text-[#434655] uppercase tracking-widest mb-5">Holiday Statistics</h3>
                                <div className="space-y-3">
                                    {[
                                        { label: "Total Days", value: holidays?.length || 0, icon: Flag, color: "bg-purple-100 text-purple-600" },
                                        { label: "National", value: holidays?.filter((h) => h.category === "NATIONAL").length || 0, icon: Building2, color: "bg-purple-100 text-purple-600" },
                                        { label: "Regional", value: holidays?.filter((h) => h.category === "REGIONAL").length || 0, icon: Sparkles, color: "bg-teal-100 text-teal-600" },
                                    ].map(({ label, value, icon: Icon, color }) => (
                                        <div key={label} className="flex items-center justify-between bg-[#F2F4F6] rounded-md px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-md flex items-center justify-center ${color}`}>
                                                    <Icon size={17} />
                                                </div>
                                                <span className="text-sm font-semibold text-[#191C1E]">{label}</span>
                                            </div>
                                            <span className={`text-xl font-extrabold ${label === "Regional" ? "text-[#006058]" : "text-[#4A45B6]"}`}>{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Upcoming Holiday Glance */}
                            <div className="bg-white rounded-2xl lg:col-span-2 shadow-sm  p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-xs font-bold text-[#434655] uppercase tracking-widest">Upcoming Holiday Glance</h3>
                                    <button className="text-xs font-bold text-[#4A45B6] hover:underline">View Full Calendar</button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {upcomingHolidays.map((h) => (
                                        <div key={`${h.month}-${h.day}`} className="flex items-start gap-3 border border-[#C3C6D726] p-2 rounded-md">
                                            <div className="text-center min-w-[40px] bg-[#F2F4F6] px-2 py-1 rounded-md">
                                                <div className="text-xs font-bold text-purple-500">{h.month}</div>
                                                <div className="text-2xl font-extrabold text-gray-800 leading-tight">{h.day}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-[#191C1E]">{h.name}</div>
                                                <div className="text-xs text-[#434655] mt-0.5">{h.sub}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) :
                    (
                        <HolidayCalendarPage holidays={holidays} />
                    )
                }
            </div>

            {/* Modals */}
            <HolidayFormModal open={modalOpen} onClose={() => { setModalOpen(false); setSelectedHoliday(null); }} holiday={selectedHoliday} onSuccess={fetchHolidays} />
            <ViewHolidayModal open={viewOpen} onClose={() => { setViewOpen(false); setSelectedHoliday(null); }} holiday={selectedHoliday} />
            <DeleteHolidayModal open={deleteOpen} onClose={() => { setDeleteOpen(false); setSelectedHoliday(null); }} holiday={selectedHoliday} onSuccess={fetchHolidays} />
        </div>
    );
}