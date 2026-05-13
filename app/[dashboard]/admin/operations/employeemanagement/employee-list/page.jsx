"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Search,
  Filter,
  Plus,
  Users,
  Eye,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  MoreVertical,
  UserPlus,
  ArrowRight,
  User,
  ShieldCheck,
  Mail,
  Building2,
  CalendarDays,
  Sparkles,
  Loader2
} from "lucide-react";

import { getEmployees, deleteEmployee } from "@/services/employeeService";
import { usePathname, useRouter, useParams } from "next/navigation";
import { useTenant } from "@/hooks/useTenant";
import { getDepartments } from "@/services/departmentService";

// ─── Constants ───────────────────────────────────────────────────────────────
const STATUSES = [
  { value: "", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const AVATAR_COLORS = [
  { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100" },
  { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100" },
  { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
  { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
  { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
];

const TABLE_COLUMNS = ["Personnel", "Reference ID", "Division", "Role", "Status", "Joined", "Actions"];
const PER_PAGE_OPTIONS = [10, 20, 50];

// ─── Custom Dropdown ─────────────────────────────────────────────────────────
function SelectDropdown({ id, label, options = [], value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const selected = options.find((o) => o.value === value) || options[0] || { label: "Select..." };

  console.log(`Dropdown ${label} state:`, { open, optionsCount: options.length, selectedValue: value });

  return (
    <div ref={ref} className="w-full sm:flex-1 sm:min-w-[160px] relative" id={id}>
      <p className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5 ml-0.5">
        {label}
      </p>

      <button
        type="button"
        onClick={() => {
          console.log(`Toggling ${label} dropdown from ${open} to ${!open}`);
          setOpen((p) => !p);
        }}
        className="w-full flex items-center justify-between bg-white border border-gray-200 text-sm text-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer shadow-sm"
      >
        <span className="font-semibold text-gray-700">{selected?.label}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
            className="absolute z-[100] mt-1.5 w-full bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden py-1"
          >
            {options.length > 0 ? (
              options.map((opt) => (
                <li
                  key={opt.value}
                  onClick={() => {
                    console.log(`Selected ${label}:`, opt);
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`px-4 py-2 text-xs cursor-pointer transition-colors ${opt.value === value
                    ? "bg-indigo-600 text-white font-semibold"
                    : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                    }`}
                >
                  {opt.label}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-xs text-gray-400 italic">No options available</li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── TableRow ─────────────────────────────────────────────────────────────────
function TableRow({ employee, index, onView, onEdit, onDelete }) {
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const initials = (employee.firstName?.[0] || "") + (employee.lastName?.[0] || "");
  const isActive = employee.status === "Active";

  return (
    <tr className="hover:bg-gray-50/50 transition-colors duration-200 border-b border-gray-100 group">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg ${color.bg} border ${color.border} flex items-center justify-center text-xs font-bold ${color.text} shadow-sm flex-shrink-0`}>
            {employee.photoUrl ? <img src={employee.photoUrl} className="w-full h-full object-cover rounded-lg" /> : initials.toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 leading-tight">{employee.firstName} {employee.lastName}</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">{employee.workEmail}</p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-xs font-semibold text-gray-400">#{employee.id}</span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-gray-600 uppercase tracking-tight">{employee.department || "—"}</td>
      <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-gray-600">{employee.designation || "—"}</td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${isActive ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-gray-100 text-gray-400 border border-gray-200"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-gray-400"}`}></span>
          {employee.status}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-medium">{employee.dateOfJoining}</td>

      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onView(employee.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all" title="View Detail">
            <Eye size={14} />
          </button>
          <button onClick={() => onEdit(employee.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-all" title="Edit Profile">
            <Pencil size={14} />
          </button>
          <button onClick={() => onDelete(employee)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all" title="Remove">
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────
function DeleteModal({ employee, onConfirm, onCancel, loading }) {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden p-8 text-center animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5">
          <Trash2 size={28} />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Remove Personnel</h2>
        <p className="text-gray-500 mt-2 text-sm font-medium leading-relaxed">
          Are you sure you want to remove <span className="font-bold text-gray-700">{employee.firstName} {employee.lastName}</span> from the active directory?
        </p>
        <div className="grid gap-3 mt-8">
          <button onClick={onConfirm} disabled={loading} className="w-full py-2.5 rounded-lg bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-all disabled:opacity-50">
            {loading ? "Processing..." : "Confirm Removal"}
          </button>
          <button onClick={onCancel} disabled={loading} className="w-full py-2.5 rounded-lg bg-white border border-gray-200 text-gray-500 font-semibold text-sm hover:bg-gray-50 transition-all">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EmployeesPage() {
  const tenantId = useTenant();
  const params = useParams();
  const route = useRouter();
  const current_path = usePathname();

  const [showFilters, setShowFilters] = useState(true);
  const [department, setDepartment] = useState([{ value: "", label: "All Departments" }]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [selectedDept, setSelectedDept] = useState("");

  const [employees, setEmployees] = useState({ employees: [], totalElements: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalEntries = employees.totalElements || 0;
  const totalPages = employees.totalPages || 0;
  const from = totalEntries === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const to = Math.min(currentPage * rowsPerPage, totalEntries);

  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (currentPage <= 3) return i + 1;
    if (currentPage >= totalPages - 2) return totalPages - 4 + i;
    return currentPage - 2 + i;
  });

  const handleReset = () => { setSelectedDept(""); setSearch(""); setStatus(""); fetchEmployees(); };

  const fetchEmployees = async (appliedFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getEmployees(tenantId, currentPage - 1, rowsPerPage, appliedFilters);
      setEmployees(res.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initPage = async () => {
      if (!tenantId) return;
      try {
        setLoading(true);
        await fetchEmployees();
        const response = await getDepartments(tenantId);
        console.log(response, "departmentresponse");

        // Handle both direct array and nested data array
        const departmentData = Array.isArray(response.data)
          ? response.data
          : (response.data?.data && Array.isArray(response.data.data) ? response.data.data : []);

        if (departmentData.length > 0) {
          const formatted = departmentData.map(d => ({
            value: d.id,
            label: d.name
          }));
          setDepartment([{ value: "", label: "All Departments" }, ...formatted]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initPage();
  }, [tenantId, currentPage, rowsPerPage]);

  const handleSearch = () => {
    setSelectedDept("");
    setStatus("");
    fetchEmployees({ search });
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setSearch("");
    const filters = {
      department: selectedDept,
      status
    };
    fetchEmployees(filters);
    setCurrentPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteEmployee(deleteTarget.id, tenantId);
      await fetchEmployees();
      toast.success("Employee deleted successfully");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete employee");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60 p-4 sm:p-8 lg:p-10">
      <div className="max-w-[1400px] mx-auto">

        {/* Header Module */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium uppercase text-gray-400 mb-1">
              <span className="hover:text-indigo-600 cursor-pointer" onClick={() => route.push(`/${params.dashboard}/admin/operations/employeemanagement`)}>Staffing</span>
              <ChevronRight size={14} className="text-gray-300" />
              <span className="text-indigo-600">Employee Directory</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">Active Personnel</h1>
            <p className="text-sm text-gray-500">Manage and monitor organizational staff profiles and protocols.</p>
          </div>
          <button
            onClick={() => route.push(`/${params.dashboard}/admin/operations/employeemanagement/add-employee`)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-indigo-700 transition-all active:scale-95"
          >
            <UserPlus size={16} /> Enroll Personnel
          </button>
        </div>

        {/* Filter Interface */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Filter size={15} />
              </div>
              <h3 className="text-sm font-semibold text-gray-800">Search Protocols</h3>
            </div>
            <button onClick={() => setShowFilters((p) => !p)} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider">
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-visible"
              >
                <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-5">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5 ml-0.5">Global Query</p>
                    <div className="relative">
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Search Name, Email, or Reference ID..."
                        className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
                      />
                      <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <SelectDropdown label="Division" options={department} value={selectedDept} onChange={setSelectedDept} />
                  <SelectDropdown label="Status" options={STATUSES} value={status} onChange={setStatus} />
                  <div className="flex items-center gap-2">
                    <button onClick={handleReset} className="px-4 py-2.5 text-xs font-semibold text-gray-400 hover:text-indigo-600 transition-colors uppercase">Reset</button>
                    <button onClick={handleApplyFilters} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold shadow-sm hover:bg-indigo-700 transition-all uppercase tracking-wide">Apply Filters</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Data Registry */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  {TABLE_COLUMNS.map((col, idx) => (
                    <th key={col} className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 ${idx === 0 ? "w-1/3" : ""}`}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 size={32} className="animate-spin text-indigo-500" />
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Scanning Active Directory...</p>
                      </div>
                    </td>
                  </tr>
                ) : employees?.employees?.length > 0 ? (
                  employees.employees.map((emp, idx) => (
                    <TableRow
                      key={emp.id}
                      employee={emp}
                      index={idx + (currentPage - 1) * rowsPerPage}
                      onView={(id) => route.push(`${current_path}/${id}`)}
                      onEdit={(id) => route.push(`/${params.dashboard}/admin/operations/employeemanagement/add-employee?id=${id}`)}
                      onDelete={(emp) => setDeleteTarget(emp)}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-30">
                        <Users size={48} className="text-gray-400" />
                        <p className="text-sm font-semibold uppercase tracking-widest">No matching personnel identified</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Control Hub */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-gray-50/30 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Scale</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="rounded-lg px-2.5 py-1 bg-white border border-gray-200 text-xs font-bold text-indigo-600 outline-none cursor-pointer shadow-sm hover:border-indigo-200 transition-colors"
                >
                  {PER_PAGE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <p className="text-xs font-medium text-gray-400">Showing {from} – {to} of {totalEntries}</p>
            </div>

            <div className="flex items-center gap-1.5">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-indigo-600 hover:border-indigo-600 disabled:opacity-20 transition-all shadow-sm"><ChevronLeft size={14} /></button>
              {pages.map((page) => (
                <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all shadow-sm ${currentPage === page ? "bg-indigo-600 text-white shadow-sm border-indigo-600" : "bg-white border border-gray-200 text-gray-400 hover:text-indigo-600 hover:border-indigo-200"}`}>{page}</button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-indigo-600 hover:border-indigo-600 disabled:opacity-20 transition-all shadow-sm"><ChevronRight size={14} /></button>
            </div>
          </div>
        </div>
      </div>
      <DeleteModal employee={deleteTarget} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} loading={isDeleting} />
    </div>
  );
}