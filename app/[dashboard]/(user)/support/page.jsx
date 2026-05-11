"use client";

import { useState, Fragment, useEffect } from "react";
import Link from "next/link";
import { useTenant } from "@/hooks/useTenant";
import { ChevronLeft, ChevronRight, Loader2, PlusCircle, Zap, Send, AlertCircle, XCircle, Plus } from "lucide-react";
import { getAllTickets, updateTicketStatus, resolveTicket } from "@/services/ticketService";

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, totalItems, rowsPerPage, onPage, onRowsPerPageChange }) {
  const from = (page - 1) * rowsPerPage + 1;
  const to = Math.min(page * rowsPerPage, totalItems);
  const pages = Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 border-t border-[#F1F5F9]">
      <div className="flex items-center gap-3 text-[12px] text-[#6B7280]">
        <div className="flex items-center gap-1.5">
          <span className="text-[#434655]">Per Page:</span>
          <select
            id="per-page-select"
            value={rowsPerPage}
            onChange={(e) => { onRowsPerPageChange(Number(e.target.value)); onPage(1); }}
            className="rounded-md px-2 py-0.5 text-[12px] text-[#4A45B6] bg-white border border-gray-200 focus:outline-none"
          >
            {[5, 10, 20].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <span className="text-[#434655]">Showing {from} to {to} of {totalItems} entries</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          id="prev-page-btn"
          onClick={() => onPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="w-7 h-7 flex items-center justify-center rounded-md border border-[#E2E8F0] text-[#434655] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={14} />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            id={`page-btn-${p}`}
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
          id="next-page-btn"
          onClick={() => onPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="w-7 h-7 flex items-center justify-center rounded-md border border-[#E2E8F0] text-[#434655] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

const priorityConfig = {
  High: "bg-red-100 text-red-700 border border-red-200",
  Medium: "bg-amber-100 text-amber-700 border border-amber-200",
  Low: "bg-sky-100 text-sky-700 border border-sky-200",
  Urgent: "bg-purple-100 text-purple-700 border border-purple-200",
};

const statusConfig = {
  OPEN: { dot: "bg-blue-500", text: "text-blue-600", label: "Open" },
  IN_PROGRESS: { dot: "bg-amber-500", text: "text-amber-600", label: "In Progress" },
  RESOLVED: { dot: "bg-emerald-500", text: "text-emerald-600", label: "Resolved" },
};

export default function SupportTickets() {
  const [chatOpen, setChatOpen] = useState(null);
  const [updatingTicketId, setUpdatingTicketId] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [resolutionNote, setResolutionNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const tenantId = useTenant();

  // Pagination state
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tickets, setTickets] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openTicketsCount, setOpenTicketsCount] = useState(0);
  const [resolvedTicketsCount, setResolvedTicketsCount] = useState(0);
  const [sortOrder, setSortOrder] = useState("createdAt,desc");

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    setCurrentUserEmail(storedEmail);
  }, []);

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
        const resolved = data.tickets.filter(t => t.status === "RESOLVED").length;
        setOpenTicketsCount(open);
        setResolvedTicketsCount(resolved);
      }
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [tenantId, page, rowsPerPage]);

  const handleStartFixing = async (ticketId) => {
    if (!tenantId) return;
    try {
      setUpdatingTicketId(ticketId);
      await updateTicketStatus(ticketId, "IN_PROGRESS", tenantId);
      fetchTickets();
    } catch (err) {
      console.error("Failed to update ticket status", err);
      alert("Failed to start fixing.");
    } finally {
      setUpdatingTicketId(null);
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Help & Support
            </h1>
            <p className="text-slate-500 text-lg max-w-xl">
              Manage your support requests and track resolution progress in real-time.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-sm px-3 py-2 shadow-sm">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sort:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="text-sm font-semibold text-gray-700 bg-transparent border-none focus:ring-0 cursor-pointer outline-none"
              >
                <option value="createdAt,desc">Newest First</option>
                <option value="createdAt,asc">Oldest First</option>
              </select>
            </div>
            <Link href={`/${tenantId}/support/raise-ticket`}>
              <button
                className="inline-flex items-center gap-2 bg-[#4A45B6] hover:bg-[#3d389e] active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-sm shadow-md transition-all duration-150"
              >
                <PlusCircle size={18} />
                Raise Ticket
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-sm border border-gray-100 shadow-sm bg-[#F2F4F6] p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
              Open Tickets
            </p>
            <p className="text-4xl font-extrabold text-[#4A45B6]">{openTicketsCount}</p>
          </div>
          <div className="rounded-sm border border-gray-100 shadow-sm bg-[#F2F4F6] p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
              Resolved (MTD)
            </p>
            <p className="text-4xl font-extrabold text-emerald-500">{resolvedTicketsCount}</p>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                {["Ticket ID", "Issue Description", "Priority", "Status", "Action"].map((h) => (
                  <th key={h} className="px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="animate-spin text-[#4A45B6]" size={32} />
                      <p className="text-sm text-gray-500 font-medium">Loading tickets...</p>
                    </div>
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <p className="text-sm text-gray-500 font-medium">No tickets found.</p>
                  </td>
                </tr>
              ) : (
                tickets.map((ticket, idx) => {
                  const sc = statusConfig[ticket.status] || { text: "text-gray-600", dot: "bg-gray-400", label: ticket.status };
                  const pc = priorityConfig[ticket.priority] || "bg-gray-100 text-gray-600 border-gray-200";
                  const uniqueKey = `${ticket.id}-${idx}`;
                  return (
                    <Fragment key={uniqueKey}>
                      <tr className="hover:bg-indigo-50/30 transition-colors">
                        <td className="px-6 py-4 align-top">
                          <p className="text-sm font-bold text-[#4A45B6]">#{ticket.id}</p>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <p className="text-sm font-semibold text-gray-800">{ticket.subject}</p>
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{ticket.description}</p>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-md ${pc}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <span className={`flex items-center gap-1.5 text-xs font-semibold ${sc.text}`}>
                            <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
                            {sc.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="flex items-center gap-2">
                            {ticket.status === "OPEN" && currentUserEmail !== ticket.raisedBy && (
                              <button
                                disabled={updatingTicketId === ticket.id}
                                onClick={() => handleStartFixing(ticket.id)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg disabled:opacity-50"
                              >
                                {updatingTicketId === ticket.id ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                                Start Fix
                              </button>
                            )}
                            {ticket.status === "IN_PROGRESS" && ticket.assignedTo === currentUserEmail && (
                              <button
                                onClick={() => { setSelectedTicket(ticket); setShowResolveModal(true); }}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg"
                              >
                                Resolve
                              </button>
                            )}
                            {ticket.status === "RESOLVED" && (
                              <button
                                onClick={() => setChatOpen(chatOpen === ticket.id ? null : ticket.id)}
                                className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-600"
                                title="View Info"
                              >
                                <AlertCircle size={20} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {chatOpen === ticket.id && (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 bg-indigo-50/20">
                            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                              <p className="font-semibold text-indigo-700 text-sm mb-1">Resolution Details</p>
                              <p className="text-gray-600 text-xs">{ticket.resolutionNote || "No details provided."}</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>

          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={setRowsPerPage}
            onPage={setPage}
          />
        </div>
      </div>

      {/* Resolve Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Resolve Ticket #{selectedTicket?.id}</h3>
              <button onClick={() => setShowResolveModal(false)} className="p-1 hover:bg-gray-200 rounded-full">
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
              </div>
              <button
                disabled={actionLoading || !resolutionNote.trim()}
                onClick={handleResolve}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg disabled:opacity-50 transition-all"
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
