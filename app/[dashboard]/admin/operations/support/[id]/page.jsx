"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock, User, FileText, XCircle, Loader2, UserPlus, Send, AlertCircle, MessageSquare, ShieldCheck, Fingerprint, Award, History, CheckCircle2 } from "lucide-react";
import { getTicketById, updateTicket, assignTicket, takeTicket, resolveTicket, getTicketMessages } from "@/services/ticketService";
import { getEmployees } from "@/services/employeeService";
import { useTenant } from "@/hooks/useTenant";
import socketService from "@/services/websocketService";

// ─── Shared Components ───────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const statusConfig = {
    OPEN: { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", label: "Open", dot: "bg-blue-500" },
    IN_PROGRESS: { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", label: "In Progress", dot: "bg-amber-500" },
    RESOLVED: { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", label: "Resolved", dot: "bg-emerald-500" },
    CLOSED: { text: "text-slate-500", bg: "bg-slate-50", border: "border-slate-200", label: "Closed", dot: "bg-slate-400" },
  };

  const config = statusConfig[status] || statusConfig.OPEN;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border ${config.bg} ${config.border} ${config.text} text-xs font-semibold`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

function InfoItem({ label, value, icon: Icon }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon size={12} className="text-gray-400" />}
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      </div>
      <p className="text-sm font-medium text-gray-800">{value ?? "—"}</p>
    </div>
  );
}

function SectionHeader({ title, icon: Icon }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
        <Icon size={16} />
      </div>
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
    </div>
  ); SectionHeader
}

export default function TicketDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const tenantId = useTenant();

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [currentUserName, setCurrentUserName] = useState(null);
  const [role, setRole] = useState(null);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolutionNote, setResolutionNote] = useState("");
  const [userList, setUserList] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedEmail = localStorage.getItem("userEmail");
    const storedName = localStorage.getItem("userName") || "Support Agent";
    setRole(storedRole);
    setCurrentUserEmail(storedEmail);
    setCurrentUserName(storedName);
  }, [tenantId]);

  const fetchTicketAndHistory = async () => {
    if (!tenantId || !id) return;
    try {
      setLoading(true);
      const [ticketRes, historyRes] = await Promise.all([
        getTicketById(id, tenantId),
        getTicketMessages(id, tenantId)
      ]);
      setTicket(ticketRes.data);
      setMessages(historyRes.data);
    } catch (err) {
      console.error("Failed to fetch ticket detail", err);
      setError("Unable to load ticket details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketAndHistory();

    socketService.connect(() => {
      socketService.subscribe(`/topic/ticket/${id}`, (data) => {
        if (data.content) {
          setMessages((prev) => {
            if (prev.find(m => m.id === data.id)) return prev;
            return [...prev, data];
          });
        } else {
          setTicket(data);
        }
      });
    });

    return () => {
      socketService.unsubscribe(`/topic/ticket/${id}`);
    };
  }, [tenantId, id]);

  const handleSendMessage = () => {
    if (!replyText.trim()) return;

    const chatMessage = {
      ticketId: id,
      senderEmail: currentUserEmail,
      senderName: currentUserName,
      content: replyText,
      isAdmin: true
    };

    socketService.sendMessage("/app/chat.sendMessage", chatMessage);
    setReplyText("");
  };

  const handleAssign = async (userId) => {
    if (!ticket || !tenantId) return;
    try {
      setActionLoading(true);
      await assignTicket(ticket.id, userId, tenantId);
      setShowAssignModal(false);
      fetchTicketAndHistory();
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
      fetchTicketAndHistory();
    } catch (err) {
      console.error("Take ownership failed", err);
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
      fetchTicketAndHistory();
    } catch (err) {
      console.error("Resolve failed", err);
    } finally {
      setActionLoading(false);
    }
  };

  const openAssignModal = async () => {
    setShowAssignModal(true);
    try {
      const res = await getEmployees(tenantId, 0, 100);
      setUserList(res.data.employees || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2 size={32} className="animate-spin text-indigo-500" />
          <p className="text-sm font-medium uppercase tracking-wide">Loading Ticket Intelligence...</p>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-xl border border-gray-100 p-8 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mx-auto mb-4">
            <XCircle size={24} />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Access Interrupted</h2>
          <p className="text-sm text-gray-500 mb-6">{error || "The requested ticket is unreachable."}</p>
          <button
            onClick={() => router.back()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-black transition-all"
          >
            <ChevronLeft size={16} /> Back to Terminal
          </button>
        </div>
      </div>
    );
  }

  const formatDateTime = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50/60 pb-20 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1400px] mx-auto py-8">

        {/* Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-2">
            <nav className="flex items-center gap-1.5 text-xs font-medium uppercase text-gray-400">
              <span className="hover:text-indigo-600 cursor-pointer" onClick={() => router.push(`/${tenantId}/admin/operations/support`)}>Support</span>
              <ChevronRight size={14} className="text-gray-300" />
              <span className="text-indigo-600">Ticket Details</span>
            </nav>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
                Ticket #{ticket.id}
              </h1>
              <StatusBadge status={ticket.status} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {role === "ADMIN" && ticket.status === "OPEN" && !ticket.assignedTo && (
              <button onClick={openAssignModal} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-2">
                <UserPlus size={16} /> Assign Agent
              </button>
            )}

            {(role === "ADMIN" || role === "HR" || role === "IT") && ticket.status === "OPEN" && !ticket.assignedTo && (
              <button disabled={actionLoading} onClick={() => handleTakeOwnership(ticket.id)} className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2">
                <Fingerprint size={16} /> Take Ownership
              </button>
            )}

            {ticket.status === "IN_PROGRESS" && ticket.assignedTo && ticket.assignedTo === currentUserEmail && (
              <button onClick={() => setShowResolveModal(true)} className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-all shadow-sm flex items-center gap-2">
                Resolve Ticket <CheckCircle2 size={16} />
              </button>
            )}

            <div className="w-px h-8 bg-gray-200 mx-1 hidden md:block" />

            <button onClick={() => router.back()} className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2">
              <ChevronLeft size={16} /> Exit
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">

            {/* Ticket Payload Card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <SectionHeader title="Ticket Intelligence" icon={FileText} />

              <div className="mb-8">
                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1.5">Subject</p>
                <h2 className="text-lg font-semibold text-gray-800 leading-tight">{ticket.subject}</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <InfoItem label="Category" value={ticket.category} />
                <InfoItem label="Priority" value={ticket.priority} />
                <InfoItem label="Requester" value={ticket.raisedByName || ticket.raisedBy} icon={User} />
                <InfoItem label="Created At" value={formatDateTime(ticket.createdAt)} icon={Clock} />
                <InfoItem label="Assigned To" value={ticket.assignedTo} icon={History} />
                <InfoItem label="Resolved At" value={formatDateTime(ticket.resolvedAt)} icon={CheckCircle2} />
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</p>
                <div className="bg-white rounded-lg p-4 border border-gray-100 text-sm text-gray-600 leading-relaxed font-medium">
                  {ticket.description || "No description provided."}
                </div>
              </div>
            </div>

            {/* Resolution Section */}
            {ticket.status === "RESOLVED" && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <SectionHeader title="Resolution Analysis" icon={Award} />
                <div className="bg-emerald-50/50 rounded-lg p-4 border border-emerald-100 text-sm text-gray-700 font-medium leading-relaxed">
                  {ticket.resolutionNote || "Issue resolved successfully."}
                </div>
              </div>
            )}

            {/* Communication Thread */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                    <MessageSquare size={16} />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800">Activity Log</h3>
                </div>
                <span className="text-xs font-semibold text-indigo-600 bg-white px-2.5 py-1 rounded-full border border-indigo-50 shadow-sm">
                  {messages.length} Messages
                </span>
              </div>

              <div className="p-6">
                <div className="space-y-6 mb-8 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {messages.length > 0 ? (
                    messages.map((msg, i) => {
                      const isMe = msg.isAdmin || msg.senderEmail === currentUserEmail;
                      const displayName = isMe
                        ? (msg.senderName && msg.senderName !== 'User' ? msg.senderName : currentUserName)
                        : (msg.senderName && msg.senderName !== 'User' ? msg.senderName : (ticket.raisedByName || 'User'));

                      const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

                      return (
                        <div key={i} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`flex items-start gap-3 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* Avatar */}
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border shadow-sm overflow-hidden text-xs font-bold ${isMe ? "bg-indigo-50 border-indigo-100 text-indigo-600" : "bg-gray-50 border-gray-100 text-gray-500"}`}>
                              {msg.senderPhotoUrl ? (
                                <img src={msg.senderPhotoUrl} alt="" className="w-full h-full object-cover" />
                              ) : !isMe && ticket.raisedByPhotoUrl ? (
                                <img src={ticket.raisedByPhotoUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span>{initials}</span>
                              )}
                            </div>

                            {/* Message Bubble */}
                            <div className={`flex flex-col space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                              <div className={`flex items-center gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                <p className="text-xs font-semibold text-gray-800">
                                  {displayName}
                                </p>
                                <span className="text-[10px] font-medium text-gray-400">{formatDateTime(msg.createdAt)}</span>
                              </div>

                              <div className={`p-3 rounded-xl text-sm leading-relaxed border ${isMe
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                : "bg-white text-gray-600 border-gray-100 shadow-sm"
                                }`}>
                                {msg.content}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-3 text-gray-300">
                        <MessageSquare size={20} />
                      </div>
                      <p className="text-sm font-medium text-gray-400">No communication recorded yet.</p>
                    </div>
                  )}
                </div>

                {/* Reply Nexus */}
                <div className="pt-6 border-t border-gray-50">
                  <div className="flex gap-4 items-start p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-indigo-600 flex-shrink-0 shadow-sm">
                      <ShieldCheck size={20} />
                    </div>
                    <div className="flex-1 space-y-4">
                      <textarea
                        placeholder="Type your response here..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all min-h-[100px] resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setReplyText("")} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">Clear</button>
                        <button onClick={handleSendMessage} className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-2">
                          <Send size={14} /> Send Message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <SectionHeader title="Personal Details" icon={User} />
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-11 h-11 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-indigo-600 shadow-sm overflow-hidden">
                  {ticket.raisedByPhotoUrl ? <img src={ticket.raisedByPhotoUrl} className="w-full h-full object-cover" /> : <User size={20} />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{ticket.raisedByName || "Personnel"}</p>
                  <p className="text-xs text-gray-400 font-medium truncate">{ticket.raisedBy}</p>
                </div>
              </div>
              <div className="space-y-4">
                <InfoItem label="Reference ID" value={ticket.id} />
                <InfoItem label="Signal Source" value="Direct Support Request" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <SectionHeader title="Protocol Status" icon={ShieldCheck} />
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Current State</p>
                  <StatusBadge status={ticket.status} />
                </div>
                <div className="h-px bg-gray-50" />
                <InfoItem label="Assigned Resolution Node" value={ticket.assignedTo} icon={History} />
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Assign Modal - Surgical Standard */}
      {showAssignModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-base font-semibold text-gray-800">Assign Ticket</h3>
              <button onClick={() => setShowAssignModal(false)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-md transition-all">
                <XCircle size={18} />
              </button>
            </div>
            <div className="p-6">
              <div className="max-h-[400px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {userList.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleAssign(user.workEmail)}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-indigo-500 hover:bg-indigo-50/50 group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-indigo-600 text-sm font-bold overflow-hidden shadow-sm">
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
                          {user.designation}
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-base font-semibold text-gray-800">Resolve Ticket</h3>
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
                  placeholder="Enter final resolution details..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-medium text-gray-700 focus:outline-none focus:border-indigo-500 transition-all resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResolveModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  disabled={actionLoading || !resolutionNote.trim()}
                  onClick={handleResolve}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2 rounded-lg transition-all disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <><CheckCircle2 size={16} /> Resolve</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
