"use client";
import { useEffect, useState } from "react";
import {
  Bell,
  HelpCircle,
  ChevronDown,
  Calendar,
  Search,
  Plus,
  MoreHorizontal,
  RefreshCw,
  FileText,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useTenant } from "@/hooks/useTenant";
import { getLeaveTypes } from "@/services/leaveService";



function LeaveCard({ leave, tenantId }) {
  const router = useRouter();

  console.log("tenantId_Page",tenantId);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col relative">
      {leave.system && (
        <span className="absolute top-3 right-3 bg-gray-800 text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
          SYSTEM
        </span>
      )}
      {!leave.system && (
        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
          <MoreHorizontal size={16} />
        </button>
      )}

      <div className="p-5 flex-1">
          {/* Status badge */}
  <div className="flex justify-between items-center mb-2">
    <span
      className={`text-[9px] px-2 py-0.5 rounded font-semibold ${
        leave.active
          ? "bg-green-100 text-green-600"
          : "bg-gray-100 text-gray-500"
      }`}
    >
      {leave.active ? "ACTIVE" : "INACTIVE"}
    </span>
  </div>
      <div
  className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold mb-3 text-white"
  style={{ backgroundColor: leave.color || "#6366F1" }}
>
  {leave.code}
</div>
      <h3 className={`font-semibold text-sm mb-1 ${leave.active ? "text-gray-900" : "text-gray-400 line-through"}`}>
  {leave.name}
</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">
          {leave.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar size={13} className="text-indigo-500 shrink-0" />
            {leave.days}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <RefreshCw size={13} className="text-orange-500 shrink-0" />
            {leave.accrual}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <FileText size={13} className="text-gray-400 shrink-0" />
            {leave.rule}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {leave?.tags?.map((tag) => (
            <span
              key={tag}
              className={`text-[9px] font-bold px-2 py-0.5 rounded tracking-wider uppercase ${
                tag === "DOC REQUIRED"
                  ? "bg-orange-100 text-orange-600"
                  : tag === "NO CLAIMING"
                    ? "bg-red-100 text-red-600"
                    : tag === "AUTO-APPLY"
                      ? "bg-blue-100 text-blue-600"
                      : tag === "SALARY DEDUCT"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-gray-100 text-gray-600"
              }`}
            >
              {tag}
            </span>
          ))}
          {leave.extraTag && (
            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-600 tracking-wider uppercase">
              {leave.extraTag}
            </span>
          )}
        </div>
      </div>

      <div className="border-t border-gray-100 px-5 py-3">
        <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors" 
        onClick={() => router.push(`/${tenantId}/admin/leaves/${leave.id}`)}
          >
          {leave.configLink}
        </button>
      </div>
    </div>
  );
}


function CreateNewCard() {
  return (
    <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 hover:border-indigo-400 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer group min-h-[200px] p-6">
      <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 group-hover:border-indigo-400 flex items-center justify-center transition-colors">
        <Plus
          size={18}
          className="text-gray-400 group-hover:text-indigo-500 transition-colors"
        />
      </div>
      <p className="text-sm font-semibold text-gray-600 group-hover:text-indigo-600 transition-colors">
        Create New Type
      </p>
      <p className="text-xs text-gray-400 text-center">
        Define custom rules, accruals, and policy logic
      </p>
    </div>
  );
}

export default function LeaveTypes() {
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [search, setSearch] = useState("");
  const router = useRouter();

   const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const tenantId = useTenant();

 useEffect(() => {
  if (!tenantId) return;

  const fetchData = async () => {
    try {
      console.log("before getting the data");
      
  const res = await getLeaveTypes(tenantId);

  const formatted = res.data.map((item) => ({
  id: item.id,
  code: item.code,
  name: item.name,
  description: item.description,
  color: item.color,
  active: item.active,

  // fallback safe values
  paid: item.paid ?? false,
  requiresApproval: item.requiresApproval ?? false,
  attachmentRequired: item.attachmentRequired ?? false,

  // UI mapping
  days: (item.paid ?? false) ? "Paid Leave" : "Unpaid Leave",
  accrual: (item.requiresApproval ?? false)
    ? "Approval Required"
    : "Auto Approved",
  rule: (item.attachmentRequired ?? false)
    ? "Attachment Required"
    : "No Attachment",

  tags: [
    (item.paid ?? false) ? "PAID" : "UNPAID",
    (item.requiresApproval ?? false) ? "APPROVAL" : "AUTO",
  ],

  extraTag: (item.attachmentRequired ?? false)
    ? "DOC REQUIRED"
    : null,

  configLink: "Configure Policy →",
  system: false,
}));
  
      setLeaveTypes(formatted);
      console.log("formatted data", formatted);
    } catch (error) {
      console.error("Failed to fetch leave types", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [tenantId]);


  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="pt-12">
        <div className="p-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-xs text-gray-400 mb-4">
            <span>LEAVE MANAGEMENT</span>
            <span>›</span>
            <span className="text-gray-600 font-medium">LEAVE POLICIES</span>
          </nav>

          {/* Page header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Leave Types</h1>
              <p className="text-sm text-gray-500 mt-1">
                Configure and manage company-wide leave policies.
              </p>
            </div>
            <button
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
              onClick={() =>
                router.push(`/${tenantId}/admin/leaves/Createleavetype`)
              }
            >
              <Plus size={15} />
              Leave type
            </button>
          </div>

          {/* Search + Filter */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search leave types..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
              >
                <option>All Statuses</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <ChevronDown
                size={13}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
              Search
            </button>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4">
            {leaveTypes.map((leave) => (
              <LeaveCard key={leave.id} leave={leave} tenantId={tenantId} />
            ))}
            <CreateNewCard />
          </div>
        </div>
      </main>
    </div>
  );
}
