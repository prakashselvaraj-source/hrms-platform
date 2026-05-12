"use client";

import { useState, useEffect } from "react";
import { useTenant } from "@/hooks/useTenant";
import { useParams, useRouter } from "next/navigation";
import { getTicketById, updateTicket, getTicketMessages } from "@/services/ticketService";
import socketService from "@/services/websocketService";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Tag,
  FileText,
  Download,
  MessageSquare,
  User,
  ShieldCheck,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from "lucide-react";

const priorityConfig = {
  HIGH: "bg-rose-100 text-rose-700 border-rose-200",
  MED: "bg-amber-100 text-amber-700 border-amber-200",
  LOW: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const statusConfig = {
  Open: { dot: "bg-blue-500", text: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
  "In Progress": { dot: "bg-amber-500", text: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
  Resolved: { dot: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
  Closed: { dot: "bg-slate-500", text: "text-slate-600", bg: "bg-slate-50 border-slate-100" },
};

export default function TicketDetail() {
  const tenant = useTenant();
  const params = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [currentUserName, setCurrentUserName] = useState(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    const storedName = localStorage.getItem("userName") || "User";
    setCurrentUserEmail(storedEmail);
    setCurrentUserName(storedName);
  }, []);

  useEffect(() => {
    if (!tenant || !params?.ticketId) return;

    const fetchTicketAndHistory = async () => {
      try {
        const [ticketRes, historyRes] = await Promise.all([
          getTicketById(params.ticketId, tenant),
          getTicketMessages(params.ticketId, tenant)
        ]);
        setTicket(ticketRes.data);
        setMessages(historyRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load ticket details");
      } finally {
        setLoading(false);
      }
    };

    fetchTicketAndHistory();

    // WebSocket Setup
    socketService.connect(() => {
      socketService.subscribe(`/topic/ticket/${params.ticketId}`, (data) => {
        if (data.content) {
          // It's a chat message
          setMessages((prev) => {
            if (prev.find(m => m.id === data.id)) return prev;
            return [...prev, data];
          });
        } else {
          // It's a ticket status/update
          setTicket(data);
        }
      });
    });

    return () => {
      socketService.unsubscribe(`/topic/ticket/${params.ticketId}`);
    };
  }, [tenant, params?.ticketId]);


  const handlePostUpdate = async () => {
    if (!additionalInfo?.trim()) return;

    const chatMessage = {
      ticketId: params.ticketId,
      senderEmail: currentUserEmail,
      senderName: currentUserName,
      content: additionalInfo,
      isAdmin: false // Assuming user side
    };

    try {
      socketService.sendMessage("/app/chat.sendMessage", chatMessage);
      setAdditionalInfo("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  }
  const formatId = (id) => `#TK-${String(id).padStart(4, "0")}`;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
        />
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading ticket details...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-[#F8FAFC]">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-rose-500" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900">Oops! Something went wrong</h2>
          <p className="text-slate-500 mt-2 max-w-xs">{error || "The ticket you're looking for doesn't exist or has been removed."}</p>
        </div>
        <button
          onClick={() => router.push(`/${tenant}/support`)}
          className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-2.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Support
        </button>
      </div>
    );
  }

  const rawId = ticket.ticketId || ticket.id;
  const displayId = typeof rawId === "number" ? formatId(rawId) : rawId;
  const status = ticket.status || "Open";
  const priority = ticket.priority || "LOW";
  const sc = statusConfig[status] || statusConfig.Open;
  const pc = priorityConfig[priority] || priorityConfig.LOW;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-10 font-sans text-slate-900">
      {/* Navigation & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <button
          onClick={() => router.push(`/${tenant}/support`)}
          className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors w-fit"
        >
          <div className="p-2 rounded-lg bg-white border border-slate-200 group-hover:border-indigo-200 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to Dashboard
        </button>

        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all shadow-sm">
            <MoreVertical className="w-5 h-5" />
          </button>
          {ticket.assignedTo === currentUserEmail && ticket.status !== "Resolved" && (
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Resolve Ticket
            </button>
          )}
        </div>
      </div>

      {/* Main Ticket Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-black bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full uppercase tracking-widest">
                  {displayId}
                </span>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${sc.bg} ${sc.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                  <span className="text-xs font-bold">{status}</span>
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {ticket.subject || ticket.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-6">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-600">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Requested by You</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-600">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <span className="capitalize">{ticket.category || "General Support"}</span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              {/* Description */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Issue Description
                </h3>
                <div className="bg-slate-50 rounded-2xl p-5 text-slate-700 leading-relaxed text-sm border border-slate-100 whitespace-pre-wrap">
                  {ticket.description || "No description provided."}
                </div>
              </div>

              {/* Attachments */}
              {ticket.attachments && ticket.attachments.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Download className="w-4 h-4 text-indigo-600" />
                    Attached Files ({ticket.attachments.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ticket.attachments.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                            <FileText className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-700 truncate">Attachment_{i + 1}.pdf</p>
                            <p className="text-[10px] text-slate-400">Click to view/download</p>
                          </div>
                        </div>
                        <Download className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Conversation Section */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <h2 className="text-lg font-black flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                Activity Feed
              </h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">
                {messages?.length || 0} Update{(messages?.length !== 1) ? 's' : ''}
              </span>
            </div>

            <div className="p-6 sm:p-8">
              {(messages && messages.length > 0) ? (
                <div className="space-y-8 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  {messages.map((msg, i) => (
                    <div key={i} className="flex gap-4 relative z-10">
                      <div className="w-10 h-10 rounded-full bg-white border-2 border-indigo-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                        {msg.isAdmin ? (
                          <ShieldCheck className="w-5 h-5 text-indigo-600" />
                        ) : (
                          <User className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-black text-slate-900">
                            {msg.senderName} {msg.senderEmail === currentUserEmail ? "(You)" : ""}
                          </p>
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(msg.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.isAdmin
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                          : "bg-slate-50 text-slate-700 border border-slate-100"
                          }`}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 flex flex-col items-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Clock className="w-8 h-8 text-slate-300" />
                  </div>
                  <h4 className="text-slate-900 font-bold">Waiting for response</h4>
                  <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
                    Our support team will review your request and get back to you shortly. Typical response time is under 4 hours.
                  </p>
                </div>
              )}

              {/* Reply Box */}
              <div className="mt-8 pt-8 border-t border-slate-100">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <textarea
                      placeholder="Add a comment or update your request..."
                      value={additionalInfo || ""}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all min-h-[100px] resize-none"
                    />
                    <div className="flex justify-end gap-3">
                      <button
                        className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
                        onClick={() => setAdditionalInfo("")}
                      >
                        Discard
                      </button>
                      <button className="bg-slate-900 hover:bg-black text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm" onClick={handlePostUpdate}>
                        Post Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-wider">Ticket Summary</h3>
            <div className="space-y-4">
              <SidebarItem
                label="Priority"
                value={priority}
                subText="Criticality of the issue"
                tagColor={pc}
              />
              <SidebarItem
                label="Created"
                value={new Date(ticket.createdAt).toLocaleDateString()}
                subText={new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              />
              <SidebarItem
                label="Response Time"
                value="Under 4h"
                subText="Expected initial contact"
                highlight
              />
              <SidebarItem
                label="Last Activity"
                value="2 hours ago"
                subText="Recent status change"
              />
            </div>
          </div>

          <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100">
            <HelpCircle className="w-10 h-10 opacity-20 mb-4" />
            <h4 className="text-lg font-black">Need faster help?</h4>
            <p className="text-indigo-100 text-xs mt-2 leading-relaxed">
              Check our documentation while you wait. 80% of issues are resolved by searching the Knowledge Base.
            </p>
            <button className="w-full mt-6 bg-white text-indigo-600 py-3 rounded-2xl text-xs font-black hover:bg-indigo-50 transition-all">
              Visit Help Center
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

function SidebarItem({ label, value, subText, tagColor, highlight }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-50 pb-4 last:border-0 last:pb-0">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      <div className="flex items-center justify-between">
        {tagColor ? (
          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${tagColor}`}>
            {value}
          </span>
        ) : (
          <span className={`text-sm font-black ${highlight ? "text-indigo-600" : "text-slate-900"}`}>{value}</span>
        )}
        <span className="text-[10px] font-semibold text-slate-400">{subText}</span>
      </div>
    </div>
  );
}
