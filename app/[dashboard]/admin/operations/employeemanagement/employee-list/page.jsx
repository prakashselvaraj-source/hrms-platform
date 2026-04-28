"use client";

import { useState, useRef, useEffect } from "react";

import { getEmployees } from "@/services/employeeService";
import { usePathname, useRouter, useParams } from "next/navigation";
import { useTenant } from "@/hooks/useTenant";

// ─── Mock Data ───────────────────────────────────────────────────────────────


const DEPARTMENTS = [
  { value: "", label: "All Departments" },
  { value: "tech", label: "Tech Team" },
  { value: "marketing", label: "Marketing" },
  { value: "hr", label: "HR" },
];
const DESIGNATIONS = [
  { value: "", label: "All Designations" },
  { value: "fullstack", label: "Fullstack Developer" },
  { value: "growth", label: "Growth Lead" },
  { value: "recruiter", label: "Recruiter" },
];
const STATUSES = [
  { value: "", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const AVATAR_COLORS = [
  { bg: "#EDE9FE", text: "#6D28D9" },
  { bg: "#FCE7F3", text: "#9D174D" },
  { bg: "#D1FAE5", text: "#065F46" },
  { bg: "#FEF3C7", text: "#92400E" },
  { bg: "#DBEAFE", text: "#1E40AF" },
];

const TABLE_COLUMNS = ["#", "Name", "Employee ID", "Department", "Designation", "Status", "Joined", "Actions"];
const PER_PAGE_OPTIONS = [10, 20, 50];

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const FilterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);
const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

// ─── Custom Dropdown ─────────────────────────────────────────────────────────
function SelectDropdown({ id, label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const selected = options.find((o) => o.value === value) ?? options[0];

  return (
    <div ref={ref} className="flex-1 min-w-[140px] relative" id={id}>
      <p className="block text-[10px] font-semibold text-[#434655] uppercase tracking-widest mb-1">
        {label}
      </p>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between bg-[#F2F4F6] border border-[#E2E8F0] text-[13px] text-[#191C1E] rounded-md px-3 py-2.5 focus:outline-none focus:border-[#4A45B6] cursor-pointer"
      >
        <span>{selected.label}</span>
        <span className={`text-[#9CA3AF] transition-transform duration-150 ${open ? "rotate-180" : ""}`}>
          <ChevronDown />
        </span>
      </button>

      {/* Dropdown list */}
      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-[#E2E8F0] rounded-md shadow-md overflow-hidden">
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`px-3 py-2 text-[13px] cursor-pointer transition-colors ${opt.value === value
                ? "bg-[#E2DFFF] text-[#4A45B6] font-semibold"
                : "text-[#374151] hover:bg-[#F5F3FF] hover:text-[#4A45B6]"
                }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── TableRow ─────────────────────────────────────────────────────────────────
function TableRow({ employee, index, onView }) {
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const initials = employee.firstName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const isActive = employee.status === "Active";

  return (
    <tr className="border-b border-[#F1F5F9] transition-colors duration-100">
      <td className="px-4 py-3.5 text-[13px] text-[#9CA3AF] w-10">{index + 1}</td>

      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
            style={{ background: color.bg, color: color.text }}
          >
            {initials}
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#191C1E] leading-tight">{employee.firstName}</p>
            <p className="text-[11px] text-[#9CA3AF] leading-tight mt-0.5">{employee.workEmail}</p>
          </div>
        </div>
      </td>

      <td className="px-4 py-3.5 text-[13px] text-[#434655]">{employee.id}</td>
      <td className="px-4 py-3.5 text-[13px] text-[#434655]">{employee.department}</td>
      <td className="px-4 py-3.5 text-[13px] text-[#434655]">{employee.designation}</td>

      <td className="px-4 py-3.5">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${isActive ? "bg-green-50 text-green-700 " : "bg-red-50 text-red-600"
          }`}>
          {employee.status}
        </span>
      </td>

      <td className="px-4 py-3.5 text-[13px] text-[#434655] whitespace-nowrap">{employee.joined}</td>

      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          <button id={`view-${employee.id}`} aria-label="View" className="w-7 h-7 flex items-center justify-center rounded-lg text-[#4A45B6] transition-colors" onClick={() => onView(employee.id)} >
            <EyeIcon />
          </button>
          <button id={`edit-${employee.id}`} aria-label="Edit" className="w-7 h-7 flex items-center justify-center rounded-lg text-[#4A45B6] transition-colors">
            <EditIcon />
          </button>
          <button id={`delete-${employee.id}`} aria-label="Delete" className="w-7 h-7 flex items-center justify-center rounded-lg text-[#BA1A1A] transition-colors">
            <TrashIcon />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EmployeesPage() {
  // Filters state
  const tenantId = useTenant();
  const params = useParams();
  const [showFilters, setShowFilters] = useState(true);
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalEntries = 42;
  const totalPages = Math.ceil(totalEntries / rowsPerPage);
  const from = (currentPage - 1) * rowsPerPage + 1;
  const to = Math.min(currentPage * rowsPerPage, totalEntries);
  const pages = Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1);
  const route = useRouter();
  const current_path = usePathname();
  const handleReset = () => { setDepartment(""); setDesignation(""); setStatus(""); };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError(null);


        const res = await getEmployees(tenantId);
        console.log("fetchEmployee", res);

        setEmployees(res.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="min-h-screen bg-[#F2F4F6] p-4 sm:p-6">
      <div className="max-w-[1200px] mx-auto">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-[20px] font-bold text-[#191C1E] leading-tight">Employees Dictionary</h1>
            <p className="text-[12px] mt-0.5">
              <span className="text-[#4A45B6] font-medium">Employee Management</span>
              <span className="text-[#434655]"> / Employee Directory</span>
            </p>
          </div>
          <button id="add-employee-btn" className="flex items-center gap-1 px-4 py-2 bg-[#4A45B6] text-[#FFFFFF] text-[13px] font-semibold rounded-md transition-colors whitespace-nowrap" onClick={() => route.push(`/${params.dashboard}/admin/employeemanagement/add-employee`)}>
            + Add Employee
          </button>
        </div>

        {/* ── Filters Card ── */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-[#191C1E]">
              <span className="text-[#4A45B6]"><FilterIcon /></span>
              Search Filters
            </div>
            <button id="toggle-filters-btn" onClick={() => setShowFilters((p) => !p)} className="text-[12px] text-[#4A45B6] font-semibold">
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {showFilters && (
            <>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <SelectDropdown id="filter-department" label="Department" options={DEPARTMENTS} value={department} onChange={setDepartment} />
                <SelectDropdown id="filter-designation" label="Designation" options={DESIGNATIONS} value={designation} onChange={setDesignation} />
                <SelectDropdown id="filter-status" label="Status" options={STATUSES} value={status} onChange={setStatus} />
              </div>
              <div className="flex justify-end items-center gap-6">
                <button id="reset-filters-btn" onClick={handleReset} className="text-[13px] font-semibold text-[#4A45B6] transition-colors">
                  Reset Filters
                </button>
                <button id="apply-filters-btn" className="px-4 py-2 bg-[#E2DFFF] text-[#3B35A7] text-[13px] font-semibold rounded-md transition-colors">
                  Apply Filters
                </button>
              </div>
            </>
          )}
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  {TABLE_COLUMNS.map((col) => (
                    <th key={col} className="px-4 py-3 text-left text-[11px] bg-[#F2F4F6] font-semibold text-[#434655] uppercase tracking-wide whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, idx) => (
                  <TableRow key={emp.id} employee={emp} index={idx} onView={(id) => route.push(`${current_path}/${id}`)} />
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 border-t border-[#F1F5F9]">
            <div className="flex items-center gap-3 text-[12px] text-[#6B7280]">
              <div className="flex items-center gap-1.5">
                <span className="#434655">Per Page:</span>
                <select
                  id="per-page-select"
                  value={rowsPerPage}
                  onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="rounded-md px-2 py-0.5 text-[12px] text-[#4A45B6] bg-white focus:outline-none focus:border-[#7C3AED]"
                >
                  {PER_PAGE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <span className="text-[#434655]">Showing {from} to {to} of {totalEntries} entries</span>
            </div>

            <div className="flex items-center gap-1">
              <button id="prev-page-btn" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-[#E2E8F0] text-[#434655] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft />
              </button>
              {pages.map((page) => (
                <button key={page} id={`page-btn-${page}`} onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 flex items-center justify-center rounded-md text-[12px] font-medium transition-colors ${currentPage === page ? "bg-[#5B3CC4] text-white" : "border border-[#E2E8F0] text-[#6B7280]"
                    }`}>
                  {page}
                </button>
              ))}
              <button id="next-page-btn" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-[#E2E8F0] text-[#434655] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div >
  );
}