"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Calendar, User, FileText, BadgeCheck, XCircle, Clock } from "lucide-react";
import { getLeaveRequestById, updateLeaveStatus } from "@/services/user/leaveService";
import { useTenant } from "@/hooks/useTenant";

export default function LeaveRequestDetail() {
  const { id } = useParams();
  const router = useRouter();
  const tenantId = useTenant();
  
  const [token, setToken] = useState("");
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    action: null // "APPROVED" | "REJECTED"
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token") || "");
    }
  }, []);

  useEffect(() => {
    if (!tenantId || !token || !id) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await getLeaveRequestById(tenantId, token, id);
        setRequest(data);
      } catch (err) {
        console.error("Failed to fetch leave request detail:", err);
        setError("Could not find this leave request.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [tenantId, token, id]);

  const handleStatusUpdate = async () => {
    const action = confirmModal.action;
    try {
      await updateLeaveStatus(tenantId, token, id, action);
      setRequest((prev) => ({ ...prev, status: action }));
      setConfirmModal({ open: false, action: null });
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Error updating leave status.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-medium text-gray-500">Loading details...</p>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="p-8 text-center min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <XCircle className="mx-auto text-red-400 mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Request Not Found</h2>
          <p className="text-sm text-gray-500 mb-6">{error || "The leave request you are looking for doesn't exist."}</p>
          <button 
            onClick={() => router.back()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED": return "bg-green-50 text-green-600 border-green-100";
      case "REJECTED": return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-amber-50 text-amber-600 border-amber-100";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans">
      
      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors mb-6 group"
      >
        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Leave Requests
      </button>

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
              <User size={32} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{request.employeeName}</h1>
              <p className="text-sm text-gray-400 font-medium">{request.employeeDesignation}</p>
            </div>
          </div>
          
          <div className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${getStatusStyle(request.status)}`}>
            {request.status}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
                <FileText className="text-indigo-500" size={20} />
                <h2 className="text-lg font-bold text-gray-900">Leave Information</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Leave Type</p>
                  <p className="text-sm font-semibold text-gray-800">{request.leaveType}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Duration Type</p>
                  <p className="text-sm font-semibold text-gray-800">{request.dayType || "Full Day"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1 text-center">Leave Period</p>
                  <div className="flex items-center justify-center gap-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="text-center">
                      <p className="text-[10px] text-gray-400 font-bold mb-1">FROM</p>
                      <p className="text-sm font-bold text-gray-800">
                        {new Date(request.startDate).toLocaleDateString("en-US", { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="h-8 w-px bg-gray-200"></div>
                    <div className="text-center">
                      <p className="text-[10px] text-gray-400 font-bold mb-1">TO</p>
                      <p className="text-sm font-bold text-gray-800">
                        {new Date(request.endDate).toLocaleDateString("en-US", { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Reason for Leave</p>
                  <div className="bg-indigo-50/30 p-4 rounded-xl border border-indigo-100/50">
                    <p className="text-sm text-gray-700 leading-relaxed italic">
                      "{request.reason || "No reason provided."}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Meta Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="text-gray-400" size={18} />
                <h3 className="text-sm font-bold text-gray-900">Request Timeline</h3>
              </div>
              <div className="relative pl-4 border-l border-gray-100 py-2">
                <div>
                  <p className="text-[11px] font-bold text-indigo-600 mb-0.5">Submitted On</p>
                  <p className="text-xs text-gray-500">
                    {request.createdAt ? new Date(request.createdAt).toLocaleString("en-US", { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Date unavailable"}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            {request.status?.toUpperCase() === "PENDING" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Actions Required</h3>
                <button 
                  onClick={() => setConfirmModal({ open: true, action: "APPROVED" })}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-green-700 transition-all shadow-md shadow-green-100"
                >
                  <BadgeCheck size={18} />
                  Approve Leave
                </button>
                <button 
                  onClick={() => setConfirmModal({ open: true, action: "REJECTED" })}
                  className="w-full flex items-center justify-center gap-2 border border-red-100 text-red-500 py-3 rounded-xl font-bold text-sm hover:bg-red-50 transition-all"
                >
                  <XCircle size={18} />
                  Reject Request
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal.open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${confirmModal.action === "APPROVED" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
              {confirmModal.action === "APPROVED" ? <BadgeCheck size={32} /> : <XCircle size={32} />}
            </div>
            
            <h2 className="text-xl font-extrabold text-center text-gray-900 mb-2">Are you sure?</h2>
            <p className="text-center text-gray-500 text-sm mb-8 leading-relaxed">
              You are about to <span className={`font-bold ${confirmModal.action === "APPROVED" ? "text-green-600" : "text-red-500"}`}>
                {confirmModal.action === "APPROVED" ? "APPROVE" : "REJECT"}
              </span> the leave request for <span className="font-bold text-gray-900">{request.employeeName}</span>.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal({ open: false, action: null })}
                className="flex-1 px-4 py-3 text-sm font-bold border border-gray-100 rounded-2xl text-gray-500 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                className={`flex-1 px-4 py-3 text-sm font-bold rounded-2xl text-white shadow-lg transition-all ${
                  confirmModal.action === "APPROVED" 
                    ? "bg-green-600 hover:bg-green-700 shadow-green-100" 
                    : "bg-red-500 hover:bg-red-600 shadow-red-100"
                }`}
              >
                Yes, Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}