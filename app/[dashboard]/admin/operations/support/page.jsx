"use client";

import { useState, Fragment, useEffect } from "react";
import Link from "next/link";
import { useTenant } from "@/hooks/useTenant";
import { ChevronLeft, ChevronRight, Loader2, Filter, CheckCircle2, Clock, AlertCircle, UserPlus, XCircle, Send, Eye, LayoutDashboard, History, Ticket, Fingerprint, Award, Smartphone } from "lucide-react";
import { getAllTickets, updateTicket, assignTicket, takeTicket, resolveTicket } from './../../../../../services/ticketService';
import { getEmployees } from "@/services/employeeService";
import socketService from "@/services/websocketService";

// ─── Status Badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const statusConfig = {
    OPEN: { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", label: "Open", dot: "bg-blue-500" },
    IN_PROGRESS: { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", label: "Processing", dot: "bg-amber-500" },
    RESOLVED: { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", label: "Resolved", dot: "bg-emerald-500" },
    CLOSED: { text: "text-slate-500", bg: "bg-slate-50", border: "border-slate-200", label: "Closed", dot: "bg-slate-400" },
  };

  const config = statusConfig[status] || statusConfig.OPEN;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border ${config.bg} ${config.border} ${config.text} text-[10px] font-bold uppercase tracking-wide`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, totalItems, rowsPerPage, onPage, onRowsPerPageChange }) {
  const from = (page - 1) * rowsPerPage + 1;
  const to = Math.min(page * rowsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-gray-50/30">
      <div className="flex items-center gap-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <span>Rows:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => { onRowsPerPageChange(Number(e.target.value)); onPage(1); }}
            className="bg-white border border-gray-200 rounded px-1 py-0.5 text-indigo-600 focus:outline-none shadow-sm"
          >
            {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <span>{from}-{to} of {totalItems}</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-indigo-600 disabled:opacity-30 transition-all"
        >
          <ChevronLeft size={14} />
        </button>

        <div className="flex items-center gap-1 px-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
            .map((p, i, arr) => (
              <Fragment key={p}>
                {i > 0 && p - arr[i - 1] > 1 && <span className="text-gray-300 text-xs">...</span>}
                <button
                  onClick={() => onPage(p)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${page === p
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-indigo-600"
                    }`}
                >
                  {p}
                </button>
              </Fragment>
            ))}
        </div>

        <button
          onClick={() => onPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-indigo-600 disabled:opacity-30 transition-all"
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

  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [role, setRole] = useState(null);

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

  const [stats, setStats] = useState({ open: 0, resolved: 0, total: 0 });

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

    socketService.connect(() => {
      socketService.subscribe("/topic/tickets", (updatedTicket) => {
        setTickets((prev) => {
          const index = prev.findIndex(t => t.id === updatedTicket.id);
          if (index !== -1) {
            const newTickets = [...prev];
            newTickets[index] = updatedTicket;
            return newTickets;
          }
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
    } finally {
      setActionLoading(false);
    }
  };

  const handleTakeOwnership = async (ticketId) => {
    if (!tenantId) return;
    try {
      setActionLoading(true);
      await takeTicket(ticketId, tenantId);
      await updateTicket(ticketId, { status: "IN_PROGRESS" }, tenantId);
      fetchTickets();
    } catch (err) {
      console.error("Take ownership failed", err);
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
    } finally {
      setActionLoading(false);
    }
  };

  const openAssignModal = async (ticket) => {
    setSelectedTicket(ticket);
    setShowAssignModal(true);
    try {
      const res = await getEmployees(tenantId, 0, 100);
      setUserList(res.data.employees || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60 pb-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">

        {/* Header Module */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium uppercase text-gray-400 mb-1">
              <span>Operations</span>
              <ChevronRight size={14} className="text-gray-300" />
              <span className="text-indigo-600">Support Hub</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">Support Management</h1>
            <p className="text-sm text-gray-500">Monitor and resolve organizational service requests</p>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2">
              <Filter size={16} /> Filter Results
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Active Tickets", value: stats.open, icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Resolved Today", value: stats.resolved, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Total Volume", value: stats.total, icon: Ticket, color: "text-indigo-600", bg: "bg-indigo-50" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 group transition-all hover:border-indigo-100">
              <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color} shadow-inner`}>
                <stat.icon size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 leading-none mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Data Module */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Requester</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Subject & Details</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Created</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Assignment</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Protocol</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 size={28} className="animate-spin text-indigo-500" />
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Synchronizing Tickets...</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-indigo-600 text-xs font-bold overflow-hidden shadow-sm">
                            {ticket.raisedByPhotoUrl ? (
                              <img src={ticket.raisedByPhotoUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              ticket.raisedByName ? ticket.raisedByName[0].toUpperCase() : "?"
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800 tracking-tight">{ticket.raisedByName || "User"}</p>
                            <p className="text-xs text-gray-400 font-medium">{ticket.raisedByEmail || "Private Agent"}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="max-w-[280px]">
                          <p className="text-sm font-semibold text-indigo-600 truncate">#{ticket.id} — {ticket.subject}</p>
                          <p className="text-xs text-gray-500 truncate leading-tight mt-0.5">{ticket.description}</p>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={ticket.status} />
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-semibold text-gray-700">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-gray-600">{ticket.assignedTo ? ticket.assignedTo : <span className="text-gray-300 italic">Pending</span>}</p>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <Link
                          href={`/${tenantId}/admin/operations/support/${ticket.id}`}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
                        >
                          <Eye size={16} />
                        </Link>
                      </td>

                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {role === "ADMIN" && ticket.status === "OPEN" && !ticket.assignedTo && (
                            <button
                              onClick={() => openAssignModal(ticket)}
                              className="px-3 py-1.5 bg-indigo-600 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-indigo-700 shadow-sm transition-all flex items-center gap-1.5"
                            >
                              <UserPlus size={12} /> Assign
                            </button>
                          )}

                          {(role === "ADMIN" || role === "HR" || role === "IT") && ticket.status === "OPEN" && !ticket.assignedTo && (
                            <button
                              disabled={actionLoading}
                              onClick={() => handleTakeOwnership(ticket.id)}
                              className="px-3 py-1.5 bg-white border border-gray-200 text-indigo-600 text-[10px] font-bold uppercase rounded-lg hover:bg-gray-50 transition-all shadow-sm flex items-center gap-1.5"
                            >
                              <Fingerprint size={12} /> Take
                            </button>
                          )}

                          {ticket.status === "IN_PROGRESS" && ticket.assignedTo && ticket.assignedTo === currentUserEmail && (
                            <button
                              onClick={() => { setSelectedTicket(ticket); setShowResolveModal(true); }}
                              className="px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-emerald-700 shadow-sm transition-all flex items-center gap-1.5"
                            >
                              Resolve <Send size={12} />
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
      </div>

      {/* Assign Modal - Surgical Standard */}
      {showAssignModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="space-y-0.5">
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-tight">Assign Ticket Node</h3>
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Protocol Reference: #{selectedTicket?.id}</p>
              </div>
              <button onClick={() => setShowAssignModal(false)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-md transition-all">
                <XCircle size={18} />
              </button>
            </div>
            <div className="p-6">
              <div className="max-h-[350px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {userList.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleAssign(user.workEmail)}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-indigo-500 hover:bg-indigo-50/30 group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-indigo-600 text-xs font-bold overflow-hidden shadow-sm">
                        {user.photoUrl ? (
                          <img src={user.photoUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          user.firstName ? user.firstName[0] : "?"
                        )}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-400 font-medium">
                          {user.designation} — {user.department}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Modal - Surgical Standard */}
      {showResolveModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="space-y-0.5">
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-tight">Final Resolution</h3>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Closing Signal: #{selectedTicket?.id}</p>
              </div>
              <button onClick={() => setShowResolveModal(false)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-md transition-all">
                <XCircle size={18} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Resolution Note</label>
                <textarea
                  required
                  rows={4}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Enter the final outcome of this request..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none shadow-inner"
                />
              </div>
              <button
                disabled={actionLoading || !resolutionNote.trim()}
                onClick={handleResolve}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold uppercase tracking-widest py-3 rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-40"
              >
                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <><Send size={16} /> Confirm Resolution</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
