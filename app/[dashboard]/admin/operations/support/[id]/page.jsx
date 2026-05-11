"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Clock, User, FileText, XCircle, Loader2, UserPlus, CircleQuestionMark, Send, AlertCircle } from "lucide-react";
import { getTicketById, updateTicketStatus, assignTicket, takeTicket, resolveTicket } from "@/services/ticketService";
import { getEmployees } from "@/services/employeeService";
import { useTenant } from "@/hooks/useTenant";

function StatusBadge({ status }) {
  const statusConfig = {
    OPEN: { dot: "bg-blue-500", text: "text-blue-600", label: "Open" },
    IN_PROGRESS: { dot: "bg-amber-500", text: "text-amber-600", label: "In Progress" },
    RESOLVED: { dot: "bg-emerald-500", text: "text-emerald-600", label: "Resolved" },
    CLOSED: { dot: "bg-gray-500", text: "text-gray-600", label: "Closed" },
  };

  const config = statusConfig[status] || statusConfig.OPEN;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${config.text} border-current`}>
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      <span className="text-[11px] font-semibold uppercase tracking-wider">{config.label}</span>
    </div>
  );
}

export default function TicketDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const tenantId = useTenant();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Current user state
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [role, setRole] = useState(null);

  // Modals & Action state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolutionNote, setResolutionNote] = useState("");
  const [userList, setUserList] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedEmail = localStorage.getItem("userEmail");
    setRole(storedRole);
    setCurrentUserEmail(storedEmail);
  }, [tenantId]);

  const fetchTicket = async () => {
    if (!tenantId || !id) return;
    try {
      setLoading(true);
      const res = await getTicketById(id, tenantId);
      setTicket(res.data);
    } catch (err) {
      console.error("Failed to fetch ticket detail", err);
      setError("Unable to load ticket details.");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (userId) => {
    if (!ticket || !tenantId) return;
    try {
      setActionLoading(true);
      await assignTicket(ticket.id, userId, tenantId);
      setShowAssignModal(false);
      fetchTicket();
    } catch (err) {
      console.error("Assign failed", err);
      alert("Failed to assign ticket.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleTakeOwnership = async (ticketId) => {
    if (!tenantId) return;
    try {
      setActionLoading(true);
      await takeTicket(ticketId, tenantId);
      // Update status to IN_PROGRESS when assigning to self
      await updateTicketStatus(ticketId, "IN_PROGRESS", tenantId);
      fetchTicket();
    } catch (err) {
      console.error("Take ownership failed", err);
      alert("Failed to take ownership.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!ticket || !resolutionNote.trim() || !tenantId) return;
    try {
      setActionLoading(true);
      await resolveTicket(ticket.id, resolutionNote, tenantId);
      setShowResolveModal(false);
      setResolutionNote("");
      fetchTicket();
    } catch (err) {
      console.error("Resolve failed", err);
      alert("Failed to resolve ticket.");
    } finally {
      setActionLoading(false);
    }
  };

  const openAssignModal = async () => {
    setShowAssignModal(true);
    try {
      // Fetch fresh list of employees every time modal opens
      const res = await getEmployees(tenantId, 0, 100);
      setUserList(res.data.employees || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [tenantId, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-sm text-gray-500">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <XCircle size={48} className="mx-auto text-red-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Ticket not found</h2>
          <p className="text-sm text-gray-500 mb-6">{error || "The ticket details could not be loaded."}</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all"
          >
            <ChevronLeft size={16} /> Back
          </button>
        </div>
      </div>
    );
  }

  const formatDateTime = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Ticket #{ticket.id}</h1>
          <p className="text-sm text-gray-500 mt-1">Essential details for this support request.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Action Buttons */}
          {role === "ADMIN" && ticket.status === "OPEN" && !ticket.assignedTo && (
            <button
              onClick={openAssignModal}
              className="flex items-center gap-1 px-4 py-2 bg-[#4A45B6] text-white text-sm font-bold rounded-lg hover:bg-[#3d389e] transition-all shadow-sm"
            >
              <UserPlus size={16} /> Assign to Others
            </button>
          )}

          {(role === "ADMIN" || role === "HR" || role === "IT") && ticket.status === "OPEN" && !ticket.assignedTo && (
            <button
              disabled={actionLoading}
              onClick={() => handleTakeOwnership(ticket.id)}
              className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-all shadow-sm"
            >
              <UserPlus size={16} /> Assign to Me
            </button>
          )}

          {ticket.status === "IN_PROGRESS" && ticket.assignedTo && ticket.assignedTo === currentUserEmail && (
            <button
              onClick={() => setShowResolveModal(true)}
              className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition-all shadow-sm"
            >
              Resolve <CircleQuestionMark size={16} />
            </button>
          )}

          <div className="h-8 w-[1px] bg-gray-200 mx-1" />

          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <Link
            href="../"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
          >
            Support list
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-widest mb-2">Subject</p>
                <h2 className="text-xl font-bold text-gray-900">{ticket.subject}</h2>
              </div>
              <div className="space-y-2 text-right">
                <StatusBadge status={ticket.status} />
                <p className="text-xs text-gray-500">Priority: {ticket.priority || "—"}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Category</p>
                <p className="text-sm text-gray-800">{ticket.category || "—"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Raised By</p>
                <p className="text-sm text-gray-800">{ticket.raisedByName || ticket.raisedBy || "Unknown"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Created At</p>
                <p className="text-sm text-gray-800">{formatDateTime(ticket.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Assigned To</p>
                <p className="text-sm text-gray-800">{ticket.assignedTo || "—"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Assigned At</p>
                <p className="text-sm text-gray-800">{formatDateTime(ticket.assignedAt)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Resolved At</p>
                <p className="text-sm text-gray-800">{formatDateTime(ticket.resolvedAt)}</p>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Description</p>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-sm text-gray-700">
                {ticket.description || "No description provided."}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 text-gray-500">
              <Clock size={18} />
              <p className="text-sm font-semibold text-gray-900">Resolution</p>
            </div>
            <div className="text-sm text-gray-700">
              {ticket.resolutionNote ? (
                <p>{ticket.resolutionNote}</p>
              ) : (
                <p className="text-gray-500">No resolution note yet.</p>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <User size={24} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400">Raised by</p>
                <p className="text-sm font-semibold text-gray-900">{ticket.raisedByName || ticket.raisedBy || "Unknown user"}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Email</p>
                <p className="text-sm text-gray-700">{ticket.raisedBy || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Ticket ID</p>
                <p className="text-sm text-gray-700">{ticket.id}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 text-gray-500 mb-4">
              <FileText size={18} />
              <p className="text-sm font-semibold text-gray-900">Status details</p>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Current status</p>
                <StatusBadge status={ticket.status} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Assigned to</p>
                <p className="text-sm text-gray-700">{ticket.assignedTo || "—"}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Assign Ticket #{ticket.id}</h3>
              <button onClick={() => setShowAssignModal(false)} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                <XCircle size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-4">Select a team member to handle this request.</p>
              <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                {userList.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleAssign(user.workEmail)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[#4A45B6] hover:bg-indigo-50 group transition-all"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-[#4A45B6] text-sm font-bold overflow-hidden border-2 border-white shadow-sm">
                        {user.photoUrl ? (
                          <img src={user.photoUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          user.firstName ? user.firstName[0] : "?"
                        )}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-gray-800 group-hover:text-[#4A45B6] leading-tight">
                          {user.firstName} {user.lastName}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                          <span className="text-[10px] text-[#4A45B6] font-semibold bg-indigo-50 px-1.5 rounded">
                            {user.designation}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">
                            {user.department}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5 italic">{user.workEmail}</p>
                      </div>
                    </div>
                    <ChevronLeft className="rotate-180" size={14} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Resolve Ticket #{ticket.id}</h3>
              <button onClick={() => setShowResolveModal(false)} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                <XCircle size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Resolution Note</label>
                <textarea
                  required
                  rows={4}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Explain how the issue was resolved..."
                  className="w-full bg-[#F2F4F6] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A45B6] resize-none"
                />
                {!resolutionNote.trim() && (
                  <p className="text-[10px] text-red-500 mt-1 font-medium flex items-center gap-1">
                    <AlertCircle size={10} /> Resolution note is required.
                  </p>
                )}
              </div>
              <button
                disabled={actionLoading || !resolutionNote.trim()}
                onClick={handleResolve}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-100 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <><Send size={18} /> Submit Resolution</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
