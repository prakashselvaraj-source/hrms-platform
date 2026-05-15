"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, SlidersHorizontal, RotateCcw, Plus, FileText,
  Eye, Pencil, RefreshCw, Trash2, X, ChevronLeft,
  ChevronRight, ArrowRight, Calendar, DollarSign, FileCheck,
  ChevronDown, Save, Upload, AlertCircle
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { getAllPromotions, updatePromotion, deletePromotion } from "@/services/promotion";
import { getEmployees } from "@/services/employeeService";
import { useTenant } from "@/hooks/useTenant";
import { uploadImage } from "@/services/uploadService";

// ─── Data ─────────────────────────────────────────────────────────────
// Initial static data replaced by backend fetch

const DESIGNATIONS = [
  "All Designations",
  "Technical Lead",
  "Regional Manager",
  "Senior Auditor",
  "HR Director",
  "QA Lead",
  "Senior Developer",
  "Marketing Executive",
  "Accountant",
  "HR Manager",
  "QA Engineer",
];

const STATUSES = ["All Statuses", "APPROVED", "PENDING", "REJECTED"];
const PER_PAGE_OPTIONS = ["10", "25", "50", "100"];

const avatarColors = {
  JC: "bg-purple-100 text-purple-700",
  RF: "bg-blue-100 text-blue-700",
  CF: "bg-green-100 text-green-700",
  WJ: "bg-orange-100 text-orange-700",
  LA: "bg-pink-100 text-pink-700",
};
const defaultAvatarColor = "bg-gray-100 text-gray-700";

const statusStyles = {
  APPROVED: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  REJECTED: "bg-red-100 text-red-700",
};


const fmt = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
};

// ─── Custom Dropdown ──────────────────────────────────────────────────────────
function Dropdown({ label, options, value, onChange, className = "", align = "left", menuWidth = "min-w-[160px]" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 text-sm rounded-md px-3 py-2 bg-white text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-[#4A45B6]/30 hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
      >
        <span className="truncate">{value}</span>
        <ChevronDown size={14} className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className={`absolute z-50 mt-1 w-full ${menuWidth} bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden ${align === "right" ? "right-0" : "left-0"}`}>
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${value === opt ? "bg-[#4A45B6] text-white" : "text-[#191C1E] hover:bg-gray-50"
                }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


// ─── File Preview ─────────────────────────────────────────────────────────────
function FilePreview({ file }) {
  if (!file) return null;
  const url = URL.createObjectURL(file);
  if (file.type.startsWith("image/")) {
    return (
      <div className="rounded-md overflow-hidden h-24 bg-gray-100">
        <img src={url} alt={file.name} className="w-full h-full object-cover" />
      </div>
    );
  }
  if (file.type === "application/pdf") {
    return (
      <div className="rounded-md overflow-hidden h-24 bg-gray-100">
        <iframe src={url} title={file.name} className="w-full h-full border-0" />
      </div>
    );
  }
  return (
    <div className="bg-gray-100 rounded-md h-20 flex flex-col items-center justify-center gap-1 px-2">
      <FileText size={20} className="text-[#4A45B6]" />
      <p className="text-xs text-gray-600 truncate max-w-full">{file.name}</p>
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditModal({ promo, onClose, onSave }) {
  const [form, setForm] = useState({
    name: promo.employee.name,
    email: promo.employee.email,
    prevDesignation: promo.prevDesignation,
    newDesignation: promo.newDesignation,
    promotionDate: promo.promotionDate,
    effectiveDate: promo.effectiveDate,
    salaryAdj: promo.salaryAdj,
    salaryRaw: promo.salaryRaw,
    status: promo.status,
    reason: promo.reason,
    document: promo.document,
  });

  const fileRef = useRef(null);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) set("document", file);
  };

  const handleSave = () => {
    onSave(promo.id, {
      employee: { name: form.name, email: form.email, avatar: promo.employee.avatar },
      prevDesignation: form.prevDesignation,
      newDesignation: form.newDesignation,
      promotionDate: form.promotionDate,
      effectiveDate: form.effectiveDate,
      salaryAdj: form.salaryAdj,
      salaryRaw: form.salaryRaw,
      status: form.status,
      reason: form.reason,
      document: form.document,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-[95vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-[#DADADA] bg-white sticky top-0 z-10">
          <h2 className="text-base sm:text-lg font-semibold text-[#191C1E]">Edit Promotion</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors p-1 rounded-md hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Employee */}
          <div>
            <h3 className="text-sm font-semibold text-[#191C1E] mb-3">Employee Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#434655] font-medium mb-1">Full Name</label>
                <input
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className="w-full text-sm rounded-md px-3 py-2 border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#4A45B6]/30"
                />
              </div>
              <div>
                <label className="block text-xs text-[#434655] font-medium mb-1">Email</label>
                <input
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  className="w-full text-sm rounded-md px-3 py-2 border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#4A45B6]/30"
                />
              </div>
            </div>
          </div>

          {/* Designations */}
          <div>
            <h3 className="text-sm font-semibold text-[#191C1E] mb-3">Designation Change</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#434655] font-medium mb-1">Previous Designation</label>
                <input
                  value={form.prevDesignation}
                  onChange={(e) => set("prevDesignation", e.target.value)}
                  className="w-full text-sm rounded-md px-3 py-2 border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#4A45B6]/30"
                />
              </div>
              <div>
                <label className="block text-xs text-[#434655] font-medium mb-1">New Designation</label>
                <input
                  value={form.newDesignation}
                  onChange={(e) => set("newDesignation", e.target.value)}
                  className="w-full text-sm rounded-md px-3 py-2 border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#4A45B6]/30"
                />
              </div>
            </div>
          </div>

          {/* Dates + Salary */}
          <div>
            <h3 className="text-sm font-semibold text-[#191C1E] mb-3">Timeline & Salary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-[#434655] font-medium mb-1">Promotion Date</label>
                <input
                  type="date"
                  value={form.promotionDate}
                  onChange={(e) => set("promotionDate", e.target.value)}
                  className="w-full text-sm rounded-md px-3 py-2 border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#4A45B6]/30"
                />
              </div>
              <div>
                <label className="block text-xs text-[#434655] font-medium mb-1">Effective Date</label>
                <input
                  type="date"
                  value={form.effectiveDate}
                  onChange={(e) => set("effectiveDate", e.target.value)}
                  className="w-full text-sm rounded-md px-3 py-2 border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#4A45B6]/30"
                />
              </div>
              <div>
                <label className="block text-xs text-[#434655] font-medium mb-1">Salary Adjustment</label>
                <input
                  value={form.salaryAdj}
                  onChange={(e) => set("salaryAdj", e.target.value)}
                  className="w-full text-sm rounded-md px-3 py-2 border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#4A45B6]/30"
                />
              </div>
              <div>
                <label className="block text-xs text-[#434655] font-medium mb-1">Gross Amount</label>
                <input
                  value={form.salaryRaw}
                  onChange={(e) => set("salaryRaw", e.target.value)}
                  className="w-full text-sm rounded-md px-3 py-2 border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#4A45B6]/30"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-sm font-semibold text-[#191C1E] mb-3">Status</h3>
            <div className="flex flex-wrap gap-2">
              {["APPROVED", "PENDING", "REJECTED"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set("status", s)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${form.status === s ? statusStyles[s] + " ring-2 ring-offset-1 ring-current" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs text-[#434655] font-semibold uppercase tracking-wide mb-1">Reason for Promotion</label>
            <textarea
              value={form.reason}
              onChange={(e) => set("reason", e.target.value)}
              rows={3}
              className="w-full text-sm rounded-md px-3 py-2 border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#4A45B6]/30 resize-none"
            />
          </div>

          {/* Document Upload */}
          <div>
            <h3 className="text-sm font-semibold text-[#191C1E] mb-2">Attach Document</h3>
            <input ref={fileRef} type="file" className="hidden" accept=".pdf,image/*" onChange={handleFileChange} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 text-sm text-[#4A45B6] border border-[#4A45B6] px-4 py-2 rounded-md hover:bg-[#4A45B6]/5 transition-colors"
            >
              <Upload size={14} />
              {form.document ? form.document.name : "Upload File (PDF / Image)"}
            </button>
            {form.document && (
              <div className="mt-2">
                <FilePreview file={form.document} />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 bg-gray-50 sticky bottom-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-[#434655] bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-[#4A45B6] rounded-md hover:bg-[#3835a0] transition-colors"
          >
            <Save size={14} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Modal ────────────────────────────────────────────────────────────────
function AddModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "", email: "", avatar: "",
    prevDesignation: "", newDesignation: "",
    promotionDate: "", effectiveDate: "",
    salaryAdj: "", salaryRaw: "", status: "PENDING", reason: "", document: null,
  });
  const fileRef = useRef(null);
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));




}

// ─── Delete Modal ─────────────────────────────────────────────────────────────
function DeletePromotionModal({ open, onClose, promo, onSuccess, tenantId }) {
  if (!promo) return null;

  const handleDelete = async () => {
    try {
      await deletePromotion(promo.id, tenantId);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting promotion:", error);
      alert("Failed to delete promotion record");
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center relative"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Delete Promotion?</h2>
              <p className="text-gray-500 mt-2 text-sm">
                Are you sure you want to delete the promotion record for <span className="font-bold text-gray-800">"{promo.employee.name}"</span>?
              </p>

              <div className="flex flex-col gap-3 mt-8">
                <button
                  onClick={handleDelete}
                  className="w-full py-3 rounded-xl bg-red-500 text-white font-bold shadow-lg shadow-red-200 hover:bg-red-600 transition"
                >
                  Delete Permanently
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PromotionsPage() {
  const route = useRouter();
  const param = useParams();
  const tenantId = useTenant();
  const [promotions, setPromotions] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [searchVal, setSearchVal] = useState("");
  const [filterEmployee, setFilterEmployee] = useState("All Employees");
  const [filterDesignation, setFilterDesignation] = useState("All Designations");
  const [filterStatus, setFilterStatus] = useState("All Statuses");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [perPage, setPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  const [editPromo, setEditPromo] = useState(null);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState({
    employee: "All Employees",
    designation: "All Designations",
    status: "All Statuses",
    dateFrom: "",
    dateTo: "",
  });

  const fetchPromotions = useCallback(async () => {
    if (!tenantId) return;
    try {
      const [promoRes, empRes] = await Promise.all([
        getAllPromotions(tenantId),
        getEmployees(tenantId)
      ]);
      const employees = Array.isArray(empRes.data) ? empRes.data : (empRes.data?.employees || empRes.data?.content || []);
      const mapped = (promoRes.data || []).map(p => {
        const emp = employees.find(e => e.id === p.employeeId) || p.employee || {};
        return {
          id: p.id,
          employee: {
            name: emp.firstName ? `${emp.firstName} ${emp.lastName}` : `Employee ${p.employeeId || "Unknown"}`,
            email: emp.email || "N/A",
            avatar: emp.firstName ? `${emp.firstName[0]}${emp.lastName?.[0] || ""}`.toUpperCase() : "U",
          },
          prevDesignation: p.previousDesignation || "-",
          newDesignation: p.newDesignation || "-",
          promotionDate: p.promotionDate || null,
          effectiveDate: p.promotionDate || null, // Backend doesn't explicitly store effectiveDate
          salaryAdj: p.salaryAdjustment ? `Rs.${p.salaryAdjustment}` : "-",
          prevCTC: p.prevAnnualCTC ? `Rs.${p.prevAnnualCTC}` : "-",
          currentCTC: p.currentAnnualCTC ? `Rs.${p.currentAnnualCTC}` : "-",
          salaryRaw: p.basicSalary ? `Rs.${p.basicSalary}` : "-",
          status: p.status || "APPROVED", // Fallback to APPROVED
          reason: p.reason || "",
          document: p.promotionLetterUrl || p.promotionLetter ? { name: (p.promotionLetterUrl || p.promotionLetter).split('/').pop(), url: p.promotionLetterUrl || p.promotionLetter } : null,
        };
      });
      setPromotions(mapped);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const handleDelete = (promo) => {
    setSelectedPromo(promo);
    setDeleteOpen(true);
  };

  // Employee dropdown options
  const employeeOptions = ["All Employees", ...Array.from(new Set(promotions.map((p) => p.employee.name)))];

  // Filter + Search
  const filteredData = promotions.filter((p) => {
    const q = searchVal.toLowerCase();
    const matchSearch =
      !q ||
      p.employee.name.toLowerCase().includes(q) ||
      p.employee.email.toLowerCase().includes(q) ||
      p.prevDesignation.toLowerCase().includes(q) ||
      p.newDesignation.toLowerCase().includes(q) ||
      p.status.toLowerCase().includes(q);

    const matchEmployee = appliedFilters.employee === "All Employees" || p.employee.name === appliedFilters.employee;
    const matchDesig = appliedFilters.designation === "All Designations" || p.prevDesignation === appliedFilters.designation || p.newDesignation === appliedFilters.designation;
    const matchStatus = appliedFilters.status === "All Statuses" || p.status === appliedFilters.status;

    const promoTs = p.promotionDate ? new Date(p.promotionDate).getTime() : null;
    const matchFrom = !appliedFilters.dateFrom || (promoTs && promoTs >= new Date(appliedFilters.dateFrom).getTime());
    const matchTo = !appliedFilters.dateTo || (promoTs && promoTs <= new Date(appliedFilters.dateTo).getTime());

    return matchSearch && matchEmployee && matchDesig && matchStatus && matchFrom && matchTo;
  });

  const perPageNum = parseInt(perPage, 10);
  const totalPages = Math.max(1, Math.ceil(filteredData.length / perPageNum));
  const safePage = Math.min(currentPage, totalPages);
  const pageData = filteredData.slice((safePage - 1) * perPageNum, safePage * perPageNum);

  // Reset page when search/filters change
  useEffect(() => { setCurrentPage(1); }, [searchVal, appliedFilters, perPage]);

  const handleApply = () => {
    setAppliedFilters({ employee: filterEmployee, designation: filterDesignation, status: filterStatus, dateFrom, dateTo });
  };

  const handleReset = () => {
    setFilterEmployee("All Employees");
    setFilterDesignation("All Designations");
    setFilterStatus("All Statuses");
    setDateFrom("");
    setDateTo("");
    setSearchVal("");
    setAppliedFilters({ employee: "All Employees", designation: "All Designations", status: "All Statuses", dateFrom: "", dateTo: "" });
  };

  const handleSaveEdit = useCallback(async (id, updated) => {
    if (!tenantId) return;
    try {
      let finalDocUrl = null;
      if (updated.document && updated.document instanceof File) {
        finalDocUrl = await uploadImage(updated.document);
        updated.document = { name: updated.document.name, url: finalDocUrl };
      } else if (updated.document && updated.document.url) {
        finalDocUrl = updated.document.url;
      } else if (typeof updated.document === 'string') {
        finalDocUrl = updated.document;
      }

      const original = promotions.find(p => p.id === id);

      const payload = {
        employeeId: original ? original.employeeId : null,
        previousDesignation: updated.prevDesignation,
        newDesignation: updated.newDesignation,
        promotionDate: updated.promotionDate,
        basicSalary: updated.salaryRaw ? parseFloat(updated.salaryRaw.toString().replace(/[^0-9.-]+/g, "")) : null,
        salaryAdjustment: updated.salaryAdj ? parseFloat(updated.salaryAdj.toString().replace(/[^0-9.-]+/g, "")) : null,
        reason: updated.reason,
        status: updated.status,
        promotionLetterUrl: finalDocUrl
      };

      await updatePromotion(id, payload, tenantId);

      setPromotions((prev) => prev.map((p) => p.id === id ? { ...p, ...updated } : p));
      alert("Promotion updated successfully!");
    } catch (error) {
      console.error("Failed to update promotion", error);
      alert("Failed to update promotion. Please try again.");
    }
  }, [tenantId, promotions]);

  const handleAdd = useCallback((newPromo) => {
    setPromotions((prev) => [...prev, { id: Date.now(), ...newPromo }]);
  }, []);

  // Pagination helpers
  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (safePage <= 3) return [1, 2, 3, "...", totalPages];
    if (safePage >= totalPages - 2) return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", safePage, "...", totalPages];
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#191C1E]">Promotions</h1>
          <p className="text-sm text-[#434655] mt-0.5">Manage and track employee career advancement</p>
        </div>
        <button
          onClick={() => route.push(`/${param.dashboard}/admin/operations/promotion/add`)}
          className="flex items-center gap-1.5 bg-[#4A45B6] hover:bg-[#3835a0] text-white text-sm font-medium px-4 py-2 rounded-md cursor-pointer transition-colors self-start sm:self-auto"
        >
          <Plus size={16} /> Add Promotion
        </button>
      </div>

      {/* Search + Filter Card */}
      <div className="bg-[#F2F4F6] rounded-xl p-4 mb-4">
        {/* Top Row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search by name, role, status..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A45B6]/30 bg-white text-[#191C1E] border border-gray-200"
            />
          </div>
          <div className="flex items-center gap-2 sm:ml-auto">
            <button
              onClick={() => setShowFilters((f) => !f)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-md text-sm text-[#434655] border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal size={14} className="text-[#434655]" />
              <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
            </button>
            <span className="text-xs text-[#C3C6D7] hidden sm:block">PER PAGE</span>
            <Dropdown
              options={PER_PAGE_OPTIONS}
              value={perPage}
              onChange={setPerPage}
              className="w-20"
              align="right"
              menuWidth="min-w-full"
            />
          </div>
        </div>

        {/* Filters Row */}
        <div
          className={`transition-all duration-300 ${showFilters ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#434655] font-medium uppercase tracking-wide">Employee</label>
              <Dropdown options={employeeOptions} value={filterEmployee} onChange={setFilterEmployee} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#434655] font-medium uppercase tracking-wide">Designation</label>
              <Dropdown options={DESIGNATIONS} value={filterDesignation} onChange={setFilterDesignation} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#434655] font-medium uppercase tracking-wide">Status</label>
              <Dropdown options={STATUSES} value={filterStatus} onChange={setFilterStatus} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#434655] font-medium uppercase tracking-wide">Date From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="text-sm rounded-md px-3 py-2 bg-white text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-[#4A45B6]/30 border border-gray-200"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#434655] font-medium uppercase tracking-wide">Date To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="text-sm rounded-md px-3 py-2 bg-white text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-[#4A45B6]/30 border border-gray-200"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleApply}
                className="flex-1 bg-[#4A45B6] hover:bg-[#3835a0] text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
              >
                Apply
              </button>
              <button
                onClick={handleReset}
                className="rounded-md p-2 text-[#BA1A1A] bg-[#FFDAD6] hover:bg-red-100 transition-colors"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="bg-[#ECEEF0]">
                {["#", "EMPLOYEE", "PREVIOUS DESIGNATION", "NEW DESIGNATION", "PROMOTION DATE", "EFFECTIVE DATE", "PREV CTC", "SALARY ADJUST", "CURRENT CTC", "STATUS", "DOCS", "ACTIONS"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-[#434655] px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-gray-400 text-sm">
                    No results found. Try adjusting your search or filters.
                  </td>
                </tr>
              ) : (
                pageData.map((p, idx) => (
                  <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3 text-[#434655] font-medium whitespace-nowrap">
                      {String((safePage - 1) * perPageNum + idx + 1).padStart(2, "0")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-semibold ${avatarColors[p.employee.avatar] || defaultAvatarColor}`}>
                          {p.employee.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[#191C1E] whitespace-nowrap">{p.employee.name}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[160px]">{p.employee.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#737686] whitespace-nowrap">{p.prevDesignation}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-blue-600 font-medium">{p.newDesignation}</span>
                    </td>
                    <td className="px-4 py-3 text-[#737686] whitespace-nowrap">{fmt(p.promotionDate)}</td>
                    <td className="px-4 py-3 text-[#737686] whitespace-nowrap">{fmt(p.effectiveDate)}</td>
                    <td className="px-4 py-3 font-semibold text-[#006058] whitespace-nowrap">{p.prevCTC}</td>
                    <td className="px-4 py-3 font-semibold text-[#712AE2] whitespace-nowrap">+{p.salaryAdj}</td>
                    <td className="px-4 py-3 font-semibold text-[#006058] whitespace-nowrap">{p.currentCTC}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusStyles[p.status]}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <FileText
                        size={16}
                        className={`transition-colors ${p.document ? "cursor-pointer text-[#4A45B6] hover:text-[#3835a0]" : "cursor-not-allowed text-gray-300"}`}
                        title={p.document ? p.document.name : "No document"}
                        onClick={() => p.document && window.open(p.document.url, '_blank')}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => route.push(`/${param.dashboard}/admin/promotion/${p.id}`)} title="View" className="text-[#4A45B6] hover:text-[#3835a0] transition-colors cursor-pointer hover:bg-[#4A45B6]/5 p-1 rounded">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => route.push(`/${param.dashboard}/admin/promotion/${p.id}?edit=true`)} title="Edit" className="text-[#4A45B6] hover:text-[#3835a0] transition-colors hover:bg-[#4A45B6]/5 p-1 rounded">
                          <Pencil size={15} />
                        </button>
                        <button
                          title="Cycle Status"
                          className="text-[#4A45B6] hover:text-[#3835a0] transition-colors hover:bg-[#4A45B6]/5 p-1 rounded"
                        >
                          <RefreshCw size={15} />
                        </button>
                        <button onClick={() => handleDelete(p)} title="Delete" className="text-red-400 hover:text-red-600 transition-colors hover:bg-red-50 p-1 rounded">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-[#F2F4F6]">
          <span className="text-xs text-blue-400 font-medium tracking-wide uppercase">
            Showing {pageData.length} of {filteredData.length} Records
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={15} />
            </button>
            {getPageNumbers().map((page, i) => (
              <button
                key={i}
                onClick={() => typeof page === "number" && setCurrentPage(page)}
                disabled={page === "..."}
                className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${page === safePage ? "bg-[#4A45B6] text-white" : page === "..." ? "text-gray-400 cursor-default" : "text-[#191C1E] hover:bg-gray-200"
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {editPromo && <EditModal promo={editPromo} onClose={() => setEditPromo(null)} onSave={() => { }} />}
      <DeletePromotionModal
        open={deleteOpen}
        onClose={() => { setDeleteOpen(false); setSelectedPromo(null); }}
        promo={selectedPromo}
        onSuccess={fetchPromotions}
        tenantId={tenantId}
      />
    </div>
  );
}
