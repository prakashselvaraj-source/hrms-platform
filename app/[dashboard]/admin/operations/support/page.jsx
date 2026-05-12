"use client";

import { useState, Fragment, useEffect } from "react";
import Link from "next/link";
import { useTenant } from "@/hooks/useTenant";
import { ChevronLeft, ChevronRight, Loader2, Filter, CheckCircle2, Clock, AlertCircle, UserPlus, XCircle, Send, CircleQuestionMark, Eye } from "lucide-react";
import { getAllTickets, updateTicket, assignTicket, takeTicket, resolveTicket } from './../../../../../services/ticketService';
import { getEmployees } from "@/services/employeeService";
import socketService from "@/services/websocketService";

// ─── Status Badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const statusConfig = {
    OPEN: { dot: "bg-blue-500", text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", label: "Open" },
    IN_PROGRESS: { dot: "bg-amber-500", text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", label: "In Progress" },
    RESOLVED: { dot: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", label: "Resolved" },
    CLOSED: { dot: "bg-gray-500", text: "text-gray-600", bg: "bg-gray-50", border: "border-gray-100", label: "Closed" },
  };

  const config = statusConfig[status] || statusConfig.OPEN;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${config.bg} ${config.border} ${config.text} text-[10px] font-bold uppercase tracking-wider`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, totalItems, rowsPerPage, onPage, onRowsPerPageChange }) {
  const from = (page - 1) * rowsPerPage + 1;
  const to = Math.min(page * rowsPerPage, totalItems);
  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 border-t border-[#F1F5F9]">
      <div className="flex items-center gap-3 text-[12px] text-[#6B7280]">
        <div className="flex items-center gap-1.5">
          <span className="text-[#434655]">Per Page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => { onRowsPerPageChange(Number(e.target.value)); onPage(1); }}
            className="rounded-md px-2 py-0.5 text-[12px] text-[#4A45B6] bg-white border border-gray-200 focus:outline-none"
          >
            {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <span className="text-[#434655]">Showing {from} to {to} of {totalItems} entries</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="w-7 h-7 flex items-center justify-center rounded-md border border-[#E2E8F0] text-[#434655] disabled:opacity-40"
        >
          <ChevronLeft size={14} />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={`w-7 h-7 flex items-center justify-center rounded-md text-[12px] font-medium transition-colors ${page === p
              ? "bg-[#5B3CC4] text-white"
              : "border border-[#E2E8F0] text-[#6B7280]"
              }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="w-7 h-7 flex items-center justify-center rounded-md border border-[#E2E8F0] text-[#434655] disabled:opacity-40"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default function AdminSupportPage() {
  const tenantId = useTenant();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Current user state
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [role, setRole] = useState(null);

  // Modals & Action state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [resolutionNote, setResolutionNote] = useState("");
  const [userList, setUserList] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedEmail = localStorage.getItem("userEmail");
    setRole(storedRole);
    setCurrentUserEmail(storedEmail);
  }, [tenantId]);

  // Stats
  const [stats, setStats] = useState({ open: 0, resolved: 0, total: 0 });

  // Pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchTickets = async () => {
    if (!tenantId) return;
    try {
      setLoading(true);
      const res = await getAllTickets(tenantId, page - 1, rowsPerPage);
      const data = res.data;

      if (data.tickets) {
        setTickets(data.tickets);
        setTotalItems(data.totalElements || 0);
        setTotalPages(data.totalPages || 0);

        const open = data.tickets.filter(t => t.status === "OPEN").length;
        const resCount = data.tickets.filter(t => t.status === "RESOLVED").length;
        const inProgCount = data.tickets.filter(t => t.status === "IN_PROGRESS").length;
        setStats({ open, resolved: resCount, total: data.totalElements });
      }
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();

    // WebSocket Setup for real-time list updates
    socketService.connect(() => {
      socketService.subscribe("/topic/tickets", (updatedTicket) => {
        setTickets((prev) => {
          const index = prev.findIndex(t => t.id === updatedTicket.id);
          if (index !== -1) {
            const newTickets = [...prev];
            newTickets[index] = updatedTicket;
            return newTickets;
          }
          // If it's a new ticket and we are on the first page, add it
          if (page === 1) {
            return [updatedTicket, ...prev].slice(0, rowsPerPage);
          }
          return prev;
        });
      });
    });

    return () => {
      socketService.unsubscribe("/topic/tickets");
    };
  }, [tenantId, page, rowsPerPage]);

  const handleAssign = async (userId) => {
    if (!selectedTicket || !tenantId) return;
    try {
      setActionLoading(true);
      await assignTicket(selectedTicket.id, userId, tenantId);
      setShowAssignModal(false);
      fetchTickets();
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
      await updateTicket(ticketId, { status: "IN_PROGRESS" }, tenantId);
      fetchTickets();
    } catch (err) {
      console.error("Take ownership failed", err);
      alert("Failed to take ownership.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!selectedTicket || !resolutionNote.trim() || !tenantId) return;
    try {
      setActionLoading(true);
      await resolveTicket(selectedTicket.id, resolutionNote, tenantId);
      setShowResolveModal(false);
      setResolutionNote("");
      fetchTickets();
    } catch (err) {
      console.error("Resolve failed", err);
      alert("Failed to resolve ticket.");
    } finally {
      setActionLoading(false);
    }
  };

  const openAssignModal = async (ticket) => {
    setSelectedTicket(ticket);
    setShowAssignModal(true);
    try {
      // Fetch fresh list of employees every time modal opens
      const res = await getEmployees(tenantId, 0, 100);
      setUserList(res.data.employees || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const priorityConfig = {
    High: "bg-red-100 text-red-700 border-red-200",
    Medium: "bg-amber-100 text-amber-700 border-amber-200",
    Low: "bg-sky-100 text-sky-700 border-sky-200",
    Urgent: "bg-purple-100 text-purple-700 border-purple-200",
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Ticket Management</h1>
          <p className="text-sm text-gray-500 mt-1">Review and resolve support requests from employees across the organization.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
            <Filter size={16} />
            Filters
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Open Tickets</p>
            <p className="text-2xl font-extrabold text-[#1E293B]">{stats.open}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Resolved</p>
            <p className="text-2xl font-extrabold text-[#1E293B]">{stats.resolved}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Requests</p>
            <p className="text-2xl font-extrabold text-[#1E293B]">{stats.total}</p>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1400px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Employee", "Ticket Info", "Status", "Created At", "Assigned To", "View", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin text-[#4A45B6]" size={32} />
                      <p className="text-sm text-gray-500 font-medium">Fetching organization tickets...</p>
                    </div>
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-24 text-center text-gray-500 font-medium">
                    No active tickets found.
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Employee info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-[#4A45B6] text-xs font-bold overflow-hidden border border-gray-100">
                          {ticket.raisedByPhotoUrl ? (
                            <img src={ticket.raisedByPhotoUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            ticket.raisedByName ? ticket.raisedByName[0].toUpperCase() : (ticket.raisedBy ? ticket.raisedBy[0].toUpperCase() : "?")
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-800 truncate">{ticket.raisedByName || ticket.raisedBy || "Unknown User"}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>

                    {/* Ticket details */}
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-[#4A45B6]">#{ticket.id} - {ticket.subject}</p>
                      <p className="text-xs text-gray-500 line-clamp-1 max-w-xs">{ticket.description}</p>
                    </td>

                    {/* Status Display */}
                    <td className="px-6 py-4">
                      <StatusBadge status={ticket.status} />
                    </td>

                    {/* Created At */}
                    <td className="px-6 py-4">
                      <p className="text-xs text-gray-600">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                      <p className="text-[10px] text-gray-400">{new Date(ticket.createdAt).toLocaleTimeString()}</p>
                    </td>

                    {/* Assigned To */}
                    <td className="px-6 py-4">
                      <p className="text-xs text-gray-600">{ticket.assignedTo || "—"}</p>
                    </td>

                    {/* View Details */}
                    <td className="px-6 py-4">
                      <Link
                        href={`/${tenantId}/admin/operations/support/${ticket.id}`}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
                        title="View ticket details"
                      >
                        <Eye size={16} />
                      </Link>
                    </td>

                    {/* Action buttons */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-start gap-2">
                        {/* ADMIN Assign */}
                        {role === "ADMIN" && ticket.status === "OPEN" && !ticket.assignedTo && (
                          <button
                            onClick={() => openAssignModal(ticket)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-[#4A45B6] text-white text-[11px] font-bold rounded-lg hover:bg-[#3d389e] transition-all"
                          >
                            <UserPlus size={14} /> Assign
                          </button>
                        )}

                        {/* ADMIN / HR / IT Assign to Me */}
                        {(role === "ADMIN" || role === "HR" || role === "IT") && ticket.status === "OPEN" && !ticket.assignedTo && (
                          <button
                            disabled={actionLoading}
                            onClick={() => handleTakeOwnership(ticket.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-[11px] font-bold rounded-lg hover:bg-blue-700 transition-all"
                          >
                            <UserPlus size={14} /> Take
                          </button>
                        )}

                        {/* Resolve (Assigned User Only) */}
                        {ticket.status === "IN_PROGRESS" && ticket.assignedTo && ticket.assignedTo === currentUserEmail && (
                          <button
                            onClick={() => { setSelectedTicket(ticket); setShowResolveModal(true); }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-[11px] font-bold rounded-lg hover:bg-emerald-700 transition-all"
                          >
                            Resolve <CircleQuestionMark size={14} />
                          </button>
                        )}


                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          rowsPerPage={rowsPerPage}
          onPage={setPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Assign Ticket #{selectedTicket?.id}</h3>
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
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-[#4A45B6]" />
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
              <h3 className="text-lg font-bold text-gray-800">Resolve Ticket #{selectedTicket?.id}</h3>
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
