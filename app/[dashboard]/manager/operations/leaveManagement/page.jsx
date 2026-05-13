"use client";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  Calendar,
  Search,
  Plus,
  MoreHorizontal,
  RefreshCw,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTenant } from "@/hooks/useTenant";
import { getLeaveTypes } from "@/services/leaveService";

// ─── Tag config ───────────────────────────────────────────────────────────────

const TAG_STYLES = {
  "DOC REQUIRED": "bg-orange-50 text-orange-600 ring-orange-200",
  "NO CLAIMING": "bg-red-50 text-red-500 ring-red-200",
  "AUTO-APPLY": "bg-blue-50 text-blue-600 ring-blue-200",
  "SALARY DEDUCT": "bg-purple-50 text-purple-600 ring-purple-200",
  PAID: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  UNPAID: "bg-red-50 text-red-500 ring-red-200",
  APPROVAL: "bg-amber-50 text-amber-700 ring-amber-200",
  AUTO: "bg-blue-50 text-blue-600 ring-blue-200",
};

const tagClass = (tag) =>
  `text-[9px] font-bold px-2 py-0.5 rounded-full ring-1 tracking-wider uppercase ${TAG_STYLES[tag] || "bg-gray-100 text-gray-500 ring-gray-200"
  }`;

// ─── Leave Card ───────────────────────────────────────────────────────────────

function LeaveCard({ leave, tenantId }) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col relative overflow-hidden">

      {/* Top accent strip using leave color */}
      <div className="h-[3px] w-full" style={{ backgroundColor: leave.color || "#6366F1" }} />

      {/* System / menu badge */}
      <div className="absolute top-4 right-4">
        {leave.system ? (
          <span className="bg-gray-800 text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">
            SYSTEM
          </span>
        ) : (
          <button className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <MoreHorizontal size={15} />
          </button>
        )}
      </div>

      <div className="p-5 flex-1">
        {/* Active / Inactive pill */}
        <div className="mb-3">
          <span
            className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ring-1 uppercase tracking-wider ${leave.active
                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                : "bg-gray-100 text-gray-400 ring-gray-200"
              }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${leave.active ? "bg-emerald-500" : "bg-gray-400"
                }`}
            />
            {leave.active ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Code badge */}
        <div
          className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold mb-3 text-white shadow-sm"
          style={{ backgroundColor: leave.color || "#6366F1" }}
        >
          {leave.code}
        </div>

        {/* Name */}
        <h3
          className={`font-semibold text-[13px] mb-1 leading-snug ${leave.active ? "text-gray-900" : "text-gray-400 line-through"
            }`}
        >
          {leave.name}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-[11px] leading-relaxed mb-4 line-clamp-2">
          {leave.description}
        </p>

        {/* Meta rows */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-[11px] text-gray-600">
            <div className="w-5 h-5 rounded-md bg-indigo-50 flex items-center justify-center shrink-0">
              <Calendar size={11} className="text-indigo-500" />
            </div>
            {leave.days}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-600">
            <div className="w-5 h-5 rounded-md bg-orange-50 flex items-center justify-center shrink-0">
              <RefreshCw size={11} className="text-orange-500" />
            </div>
            {leave.accrual}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-600">
            <div className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
              <FileText size={11} className="text-gray-400" />
            </div>
            {leave.rule}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {leave.tags?.map((tag) => (
            <span key={tag} className={tagClass(tag)}>{tag}</span>
          ))}
          {leave.extraTag && (
            <span className={tagClass(leave.extraTag)}>{leave.extraTag}</span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-50 px-5 py-3 bg-gray-50/40">
        <button
          onClick={() =>
            router.push(`/${tenantId}/admin/operations/leaveManagement/${leave.id}`)
          }
          className="text-[12px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Configure Policy →
        </button>
      </div>
    </div>
  );
}

// ─── Create New Card ──────────────────────────────────────────────────────────

function CreateNewCard({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-200 flex flex-col items-center justify-center gap-3 cursor-pointer group min-h-[220px] p-6"
    >
      <div className="w-11 h-11 rounded-xl border-2 border-dashed border-gray-300 group-hover:border-indigo-400 group-hover:bg-indigo-50 flex items-center justify-center transition-all duration-200">
        <Plus size={18} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
      </div>
      <div className="text-center">
        <p className="text-[13px] font-semibold text-gray-600 group-hover:text-indigo-600 transition-colors">
          Create New Type
        </p>
        <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
          Define custom rules, accruals,<br />and policy logic
        </p>
      </div>
    </div>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
      <div className="h-[3px] w-full bg-gray-100 rounded mb-4" />
      <div className="h-5 w-16 bg-gray-100 rounded-full mb-3" />
      <div className="h-10 w-10 bg-gray-100 rounded-xl mb-3" />
      <div className="h-4 w-3/4 bg-gray-100 rounded mb-2" />
      <div className="h-3 w-full bg-gray-100 rounded mb-1" />
      <div className="h-3 w-5/6 bg-gray-100 rounded mb-4" />
      <div className="space-y-2 mb-4">
        {[1, 2, 3].map(i => <div key={i} className="h-3 w-2/3 bg-gray-100 rounded" />)}
      </div>
      <div className="flex gap-1.5">
        <div className="h-4 w-12 bg-gray-100 rounded-full" />
        <div className="h-4 w-16 bg-gray-100 rounded-full" />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LeaveTypes() {
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [search, setSearch] = useState("");
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const tenantId = useTenant();

  useEffect(() => {
    if (!tenantId) return;

    const fetchData = async () => {
      try {
        const res = await getLeaveTypes(tenantId);

        const formatted = res.data.map((item) => ({
          id: item.id,
          code: item.code,
          name: item.name,
          description: item.description,
          color: item.color,
          active: item.active,
          paid: item.paid ?? false,
          requiresApproval: item.requiresApproval ?? false,
          attachmentRequired: item.attachmentRequired ?? false,
          days: (item.paid ?? false) ? "Paid Leave" : "Unpaid Leave",
          accrual: (item.requiresApproval ?? false) ? "Approval Required" : "Auto Approved",
          rule: (item.attachmentRequired ?? false) ? "Attachment Required" : "No Attachment",
          tags: [
            (item.paid ?? false) ? "PAID" : "UNPAID",
            (item.requiresApproval ?? false) ? "APPROVAL" : "AUTO",
          ],
          extraTag: (item.attachmentRequired ?? false) ? "DOC REQUIRED" : null,
          system: false,
        }));

        setLeaveTypes(formatted);
      } catch (error) {
        console.error("Failed to fetch leave types", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tenantId]);

  const filtered = leaveTypes.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "All Statuses" ||
      (statusFilter === "Active" && l.active) ||
      (statusFilter === "Inactive" && !l.active);
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50/70 font-sans">
      <main className="p-6">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-5 font-medium tracking-wide">
          <span>Leave Management</span>
          <span className="text-gray-300">›</span>
          <span className="text-gray-600">Leave Policies</span>
        </nav>

        {/* ── Page Header ── */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-[22px] font-semibold text-gray-900 tracking-tight">Leave Types</h1>
            <p className="text-[12px] text-gray-400 mt-1 font-medium">
              Configure and manage company-wide leave policies.
            </p>
          </div>
          <button
            onClick={() =>
              router.push(`/${tenantId}/admin/leaveManagement/Createleavetype`)
            }
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <Plus size={14} />
            New Leave Type
          </button>
        </div>

        {/* ── Search + Filter ── */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search leave types..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 bg-white shadow-sm transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-[12px] font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 cursor-pointer shadow-sm transition-all"
            >
              <option>All Statuses</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <button
            onClick={() => { }} // search already live-filters
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            Search
          </button>
        </div>

        {/* ── Stats summary strip ── */}
        <div className="flex items-center gap-4 mb-5 text-[11px] font-medium text-gray-400">
          <span>
            <span className="text-gray-700 font-semibold">{leaveTypes.length}</span> total types
          </span>
          <span className="w-px h-3 bg-gray-200" />
          <span className="flex items-center gap-1">
            <CheckCircle size={11} className="text-emerald-500" />
            <span className="text-gray-700 font-semibold">{leaveTypes.filter(l => l.active).length}</span> active
          </span>
          <span className="w-px h-3 bg-gray-200" />
          <span className="flex items-center gap-1">
            <XCircle size={11} className="text-gray-400" />
            <span className="text-gray-700 font-semibold">{leaveTypes.filter(l => !l.active).length}</span> inactive
          </span>
        </div>

        {/* ── Cards Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.map((leave) => (
              <LeaveCard key={leave.id} leave={leave} tenantId={tenantId} />
            ))}

          {!loading && (
            <CreateNewCard
              onClick={() =>
                router.push(`/${tenantId}/admin/leaveManagement/Createleavetype`)
              }
            />
          )}
        </div>

        {/* ── Empty state ── */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FileText size={20} className="text-gray-300" />
            </div>
            <p className="text-[13px] font-medium text-gray-500">No leave types found</p>
            <p className="text-[11px] mt-1">Try adjusting your search or filter.</p>
          </div>
        )}
      </main>
    </div>
  );
}