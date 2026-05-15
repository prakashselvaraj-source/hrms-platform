"use client";
import { useEffect, useState } from "react";
import {
  Calendar,
  Search,
  Plus,
  MoreHorizontal,
  RefreshCw,
  FileText,
  ArrowRight,
  ShieldCheck,
  Settings,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  `text-[8px] font-black px-2 py-0.5 rounded-md ring-1 ring-inset tracking-widest uppercase transition-all whitespace-nowrap ${
    TAG_STYLES[tag] || "bg-slate-100 text-slate-500 ring-slate-200"
  }`;

// ─── Leave Card ───────────────────────────────────────────────────────────────

function LeaveCard({ leave, tenantId }) {
  const router = useRouter();
  const color = leave.color || "#6366F1";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white rounded-[24px] border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.01)] hover:shadow-[0_12px_30px_rgba(99,102,241,0.06)] transition-all duration-400 flex flex-col overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-bl-[40px] pointer-events-none transition-transform group-hover:scale-110 duration-700" />
      
      <div className="p-6 flex-1 relative z-10 flex flex-col">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-5">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white shadow-lg transform group-hover:scale-105 transition-all duration-500 shrink-0"
            style={{ 
                background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                boxShadow: `0 8px 16px -6px ${color}88` 
            }}
          >
            {leave.code}
          </div>
          
          <div className="flex flex-col items-end gap-1.5">
            <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm border ${
              leave.active ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-100 text-slate-400 border-slate-200"
            }`}>
              {leave.active ? "Active" : "Inactive"}
            </span>
            <button className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-50 hover:text-indigo-600 transition-all duration-300">
                <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors duration-300">
              {leave.name}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mt-2 leading-relaxed line-clamp-2 italic">
              {leave.description || "Custom defined leave policy framework."}
            </p>
          </div>

          <div className="flex items-center gap-4 py-3.5 border-y border-slate-50/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all duration-300 shrink-0">
                <Calendar size={12} />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest leading-none mb-0.5">Billing</span>
                <span className="text-[9px] font-bold text-slate-700 uppercase tracking-tight leading-none">{leave.paid ? "Paid" : "Unpaid"}</span>
              </div>
            </div>
            <div className="w-px h-5 bg-slate-100 shrink-0" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-500 transition-all duration-300 shrink-0">
                <RefreshCw size={12} />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest leading-none mb-0.5">Workflow</span>
                <span className="text-[9px] font-bold text-slate-700 uppercase tracking-tight leading-none">{leave.requiresApproval ? "Approval" : "Auto"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {leave.tags?.map((tag) => (
              <span key={tag} className={tagClass(tag)}>{tag}</span>
            ))}
            {leave.extraTag && (
              <span className={tagClass(leave.extraTag)}>{leave.extraTag}</span>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between group-hover:bg-indigo-50/20 transition-colors duration-500 mt-auto">
        <div className="flex items-center gap-1.5">
           <ShieldCheck size={10} className="text-slate-300" />
           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">ID: #{leave.id.toString().slice(-4)}</span>
        </div>
        <button
          onClick={() => router.push(`/${tenantId}/manager/operations/leaveManagement/${leave.id}`)}
          className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all duration-300 shadow-sm active:scale-90 shrink-0"
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Create New Card ──────────────────────────────────────────────────────────

function CreateNewCard({ onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="relative bg-white rounded-[24px] border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/10 transition-all duration-500 flex flex-col items-center justify-center gap-4 cursor-pointer min-h-[300px] overflow-hidden group"
    >
      <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-700 shadow-sm shrink-0">
        <Plus size={28} className="group-hover:rotate-90 transition-transform duration-700" />
      </div>
      <div className="text-center space-y-1.5 px-8 relative z-10">
        <h4 className="text-base font-black text-slate-900 tracking-tight uppercase tracking-wider">New Policy</h4>
        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
          Initialize custom leave archetypes.
        </p>
      </div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-[40px] group-hover:bg-indigo-500/10 transition-colors duration-700 pointer-events-none" />
    </motion.div>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 animate-pulse h-[320px] flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-6">
           <div className="w-10 h-10 bg-slate-100 rounded-xl shrink-0" />
           <div className="w-16 h-4 bg-slate-100 rounded-full" />
        </div>
        <div className="space-y-3">
          <div className="h-5 w-3/4 bg-slate-100 rounded-lg" />
          <div className="h-2.5 w-full bg-slate-50 rounded-md" />
          <div className="h-2.5 w-5/6 bg-slate-50 rounded-md" />
        </div>
      </div>
      <div className="h-10 w-full bg-slate-50 rounded-lg" />
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
    <div className="min-h-screen bg-[#FDFDFF] font-sans pb-20">
      
      {/* Header with Background Gradient */}
      <div className="relative bg-white pt-10 pb-20 overflow-hidden border-b border-slate-50">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-indigo-50/20 via-indigo-50/5 to-transparent rounded-full blur-[80px] -mr-60 -mt-60 pointer-events-none" />
        
        <div className="max-w-[1440px] mx-auto px-8 relative z-10">
          <nav className="flex items-center gap-2.5 text-[8px] text-slate-400 font-black uppercase tracking-widest mb-6">
            <span className="hover:text-indigo-600 cursor-pointer transition-colors">Operations</span>
            <span className="text-slate-200">/</span>
            <span className="text-slate-900">Policies</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-0.5 rounded-full bg-indigo-600 shrink-0" />
                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest leading-none">Governance</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Policy <span className="text-indigo-600">Architecture</span>
              </h1>
              <p className="text-[12px] text-slate-400 mt-4 font-medium leading-relaxed max-w-sm">
                Configure organizational time-off rules and workflows with precision.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
                <button className="p-3 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm shrink-0">
                    <Settings size={18} />
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(`/${tenantId}/manager/operations/leaveManagement/Createleavetype`)}
                  className="group flex items-center gap-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-8 py-3.5 rounded-xl shadow-lg shadow-slate-200 transition-all hover:bg-black shrink-0"
                >
                  <Plus size={16} className="group-hover:rotate-90 transition-transform duration-500" />
                  New Policy
                </motion.button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-8 -mt-10 relative z-20">
        
        {/* Floating Action Bar */}
        <div className="bg-white/90 backdrop-blur-xl border border-white/50 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.04)] rounded-[24px] p-3 flex flex-col lg:flex-row items-center gap-6 mb-12">
          <div className="relative flex-1 w-full flex items-center">
            <Search size={18} className="absolute left-5 text-slate-300" />
            <input
              type="text"
              placeholder="Search by policy name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 text-[13px] border-none bg-transparent focus:ring-0 placeholder:text-slate-300 font-semibold text-slate-700"
            />
          </div>

          <div className="hidden lg:block h-8 w-px bg-slate-100 shrink-0" />

          <div className="flex items-center gap-1.5 p-1 bg-slate-50/50 rounded-xl border border-slate-100">
            {["All Statuses", "Active", "Inactive"].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                  statusFilter === status 
                  ? "bg-white text-indigo-600 shadow-sm border border-indigo-50" 
                  : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          
          <div className="hidden lg:block h-8 w-px bg-slate-100 shrink-0" />

          <div className="flex items-center gap-10 px-6 shrink-0">
            <div className="flex flex-col items-center justify-center">
              <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1.5">Total</span>
              <p className="text-xl font-black text-slate-900 leading-none">{leaveTypes.length}</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-[7px] font-black text-emerald-300 uppercase tracking-widest leading-none mb-1.5">Live</span>
              <p className="text-xl font-black text-emerald-600 leading-none">{leaveTypes.filter(l => l.active).length}</p>
            </div>
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : filtered.map((leave) => (
                <LeaveCard key={leave.id} leave={leave} tenantId={tenantId} />
              ))}
          </AnimatePresence>

          {!loading && filtered.length < 12 && (
            <CreateNewCard
              onClick={() =>
                router.push(`/${tenantId}/manager/operations/leaveManagement/Createleavetype`)
              }
            />
          )}
        </div>

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white rounded-[24px] border border-slate-100 shadow-sm mt-8 flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 shadow-sm">
              <Search size={24} className="text-slate-200" />
            </div>
            <h3 className="text-base font-black text-slate-900 tracking-tight uppercase tracking-widest">No matching policies</h3>
            <p className="text-slate-400 font-medium mt-3 max-w-xs mx-auto text-[12px]">
              Refine your search parameters.
            </p>
            <button 
              onClick={() => { setSearch(""); setStatusFilter("All Statuses"); }}
              className="mt-6 text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:text-indigo-700 transition-colors border-b border-indigo-100 pb-0.5"
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}