"use client";

import { useState, useEffect } from "react";
import { 
  BadgeCheck, Hourglass, CircleX, ArrowLeft, 
  FileText, BarChart2, Calendar, Mail, User
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { getLeaveRequestById } from "@/services/user/leaveService";
import { useTenant } from "@/hooks/useTenant";
import Header from "../../components/header";

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  approved: {
    icon: BadgeCheck,
    color: "text-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    label: "Approved",
  },
  pending: {
    icon: Hourglass,
    color: "text-amber-500",
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
    label: "Pending",
  },
  rejected: {
    icon: CircleX,
    color: "text-red-500",
    badge: "bg-red-50 text-red-600 ring-red-200",
    label: "Rejected",
  },
};

// ─── Helper Components ────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ring-1 uppercase tracking-wider ${cfg.badge}`}>
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

function DetailItem({ label, value, icon: Icon }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      <div className="flex items-center gap-2">
        {Icon && <Icon size={14} className="text-gray-300" />}
        <span className="text-[14px] font-medium text-gray-700">{value || "—"}</span>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, color = "text-gray-700" }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <span className="text-[12px] text-gray-500 font-medium">{label}</span>
      <span className={`text-[14px] font-bold ${color}`}>{value}</span>
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function LeaveDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const tenantId = useTenant();
  
  const [leaveDetail, setLeaveDetail] = useState(null);
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token") || "");
    }
  }, []);

  useEffect(() => {
    if (!tenantId || !token || !id) return;

    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const res = await getLeaveRequestById(tenantId, token, id);
        const raw = res?.data || res;
        
        // Map backend response to UI structure
        const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
        
        const formatted = {
          id: raw.id,
          employee: raw.employeeName || "Current User",
          leaveType: raw.leaveType || raw.leavePolicy?.name || "Leave",
          status: raw.status || "Pending",
          date: raw.startDate ? `${fmtDate(raw.startDate)} – ${fmtDate(raw.endDate)}` : "—",
          duration: raw.numberOfDays ? `${raw.numberOfDays} Day(s)` : raw.dayType || "1 Day(s)",
          email: raw.teamMailId || "user@company.com",
          balance: raw.availableBalance || 0,
          current: raw.currentBooking || 1,
          after: raw.balanceAfterBooking || 0,
          estimated: raw.estimatedBalance || 0,
          dateOfRequest: fmtDate(raw.createdAt || raw.startDate)
        };
        
        setLeaveDetail(formatted);
      } catch (err) {
        console.error("Failed to fetch leave detail:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [tenantId, token, id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!leaveDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center max-w-sm">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CircleX className="text-red-500" size={32} />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Request Not Found</h2>
          <p className="text-sm text-gray-400 mt-2">The leave request you're looking for doesn't exist or you don't have access.</p>
          <button onClick={() => router.back()} className="mt-6 w-full py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const data = leaveDetail;

  return (
    <div className="min-h-screen bg-[#FDFDFF] font-sans">
      <Header />
      
      <main className="max-w-9xl mx-auto p-4 md:p-8">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 transition-all mb-8 group"
        >
          <div className="w-8 h-8 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:border-indigo-100 group-hover:bg-indigo-50/50 transition-all">
            <ArrowLeft size={14} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest">Back to Requests</span>
        </button>

        {/* Content Card */}
        <div className="bg-white rounded-[24px] shadow-xl shadow-indigo-500/5 border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="px-8 py-10 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-gradient-to-br from-white to-gray-50/30">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <FileText size={28} />
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{data.leaveType}</h1>
                  <StatusBadge status={data.status} />
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-[12px] text-gray-400 font-medium">Request ID: <span className="text-indigo-600 font-mono">#{data.id}</span></p>
                  <div className="w-1 h-1 rounded-full bg-gray-200" />
                  <p className="text-[12px] text-gray-400 font-medium">Requested on {data.dateOfRequest}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
               <button className="px-6 py-2.5 rounded-xl bg-gray-900 text-white text-[13px] font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
                 Download PDF
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
             {/* Left: Main Details */}
             <div className="lg:col-span-2 p-8 space-y-10">
                <div>
                   <h2 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-6">General Information</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                      <DetailItem label="Employee Name" value={data.employee} icon={User} />
                      <DetailItem label="Team Email ID" value={data.email} icon={Mail} />
                      <DetailItem label="Leave Type" value={data.leaveType} icon={FileText} />
                      <DetailItem label="Request Date" value={data.dateOfRequest} icon={Calendar} />
                   </div>
                </div>

                <div className="pt-2">
                   <h2 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-6">Duration Breakdown</h2>
                   <div className="bg-gray-50/50 rounded-[20px] border border-gray-100 overflow-hidden">
                      <table className="w-full">
                         <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100">
                               <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date Range</th>
                               <th className="text-right px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Duration</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-50/50">
                            <tr>
                               <td className="px-6 py-5 text-[13px] font-medium text-gray-700">{data.date}</td>
                               <td className="px-6 py-5 text-right text-[13px] font-bold text-gray-900">{data.duration}</td>
                            </tr>
                            <tr className="bg-white/80">
                               <td className="px-6 py-5 text-[13px] font-black text-gray-900">Total Calculation</td>
                               <td className="px-6 py-5 text-right text-[15px] font-black text-indigo-600">{data.duration}</td>
                            </tr>
                         </tbody>
                      </table>
                   </div>
                </div>
             </div>

             {/* Right: Balance Sidebar */}
             <div className="bg-gray-50/20 p-8 space-y-8">
                <div>
                   <h2 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-6">Balance Summary</h2>
                   <div className="bg-white rounded-2xl border border-gray-100 p-2 shadow-sm">
                      <div className="space-y-1">
                        <SummaryCard label="Available Balance" value={`${data.balance} Days`} color="text-emerald-600" />
                        <SummaryCard label="Current Booking" value={`${data.current} Days`} />
                        <div className="p-3 mt-1 bg-indigo-50/50 rounded-xl border border-indigo-100/50 flex items-center justify-between">
                           <span className="text-[12px] text-indigo-700 font-bold">New Balance</span>
                           <span className="text-[16px] font-black text-indigo-700">{data.after} Days</span>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                         <Calendar size={16} />
                      </div>
                      <span className="text-[12px] font-bold text-gray-900">Annual Projection</span>
                   </div>
                   <SummaryCard label="Estimated (Year End)" value={`${data.estimated} Days`} />
                </div>

                <button className="w-full py-3.5 px-4 rounded-2xl bg-white border border-gray-200 text-gray-700 text-[13px] font-bold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2 shadow-sm group">
                   <BarChart2 size={16} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
                   View Leave Report
                </button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}


