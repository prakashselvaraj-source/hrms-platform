"use client";

import { useState, Fragment, useEffect, useMemo } from "react";
import Link from "next/link";
import { useTenant } from "@/hooks/useTenant";
import { useRouter } from "next/navigation";
import { getTickets, getTicketStats } from "@/services/ticketService";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Plus, 
  Filter, 
  Ticket, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ChevronRight,
  MessageSquare,
  HelpCircle,
  MoreHorizontal,
  ArrowUpRight,
  Loader2,
  Calendar,
  Tag
} from "lucide-react";

const priorityConfig = {
  HIGH: "bg-rose-100 text-rose-700 border-rose-200",
  MED: "bg-amber-100 text-amber-700 border-amber-200",
  LOW: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const statusConfig = {
  Open: { dot: "bg-blue-500", text: "text-blue-600", bg: "bg-blue-50" },
  Resolved: { dot: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50" },
  "In Progress": { dot: "bg-amber-500", text: "text-amber-600", bg: "bg-amber-50" },
  Closed: { dot: "bg-slate-500", text: "text-slate-600", bg: "bg-slate-50" },
};

export default function SupportTickets() {
  const tenant = useTenant();
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ open: 0, resolved: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    if (!tenant) return;
    const fetchData = async () => {
      try {
        const [ticketRes, statsRes] = await Promise.allSettled([
          getTickets(tenant, { size: 100 }),
          getTicketStats(tenant),
        ]);
        if (ticketRes.status === "fulfilled") {
          const data = ticketRes.value.data;
          setTickets(Array.isArray(data) ? data : data?.content || data?.tickets || []);
        }
        if (statsRes.status === "fulfilled") {
          const data = statsRes.value.data;
          setStats({
            open: data?.open ?? data?.openTickets ?? 0,
            resolved: data?.resolved ?? data?.resolvedTickets ?? 0,
            total: (data?.open ?? 0) + (data?.resolved ?? 0) + (data?.inProgress ?? 0)
          });
        }
      } catch (err) {
        console.error("Failed to load tickets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tenant]);

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesSearch = (ticket.subject || ticket.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (ticket.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                            String(ticket.id).includes(searchQuery);
      const matchesStatus = statusFilter === "All" || ticket.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tickets, searchQuery, statusFilter]);

  const formatId = (id) => `#TK-${String(id).padStart(4, "0")}`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-10 font-sans text-slate-900">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div variants={itemVariants} className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              Help & Support
            </h1>
            <p className="text-slate-500 text-lg max-w-xl">
              Manage your support requests and track resolution progress in real-time.
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Link href={`/${tenant}/createTicket`}>
              <button className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-95">
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                <span>Create New Ticket</span>
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Requests" 
            value={loading ? "..." : stats.total} 
            icon={<Ticket className="w-6 h-6 text-indigo-600" />}
            color="bg-indigo-50"
          />
          <StatCard 
            title="Open Tickets" 
            value={loading ? "..." : stats.open} 
            icon={<Clock className="w-6 h-6 text-amber-600" />}
            color="bg-amber-50"
          />
          <StatCard 
            title="Resolved" 
            value={loading ? "..." : stats.resolved} 
            icon={<CheckCircle className="w-6 h-6 text-emerald-600" />}
            color="bg-emerald-50"
          />
          <StatCard 
            title="Quick Response" 
            value="< 4h" 
            icon={<AlertCircle className="w-6 h-6 text-rose-600" />}
            color="bg-rose-50"
            subtext="Avg. initial response"
          />
        </motion.div>

        {/* Main Content Card */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
        >
          {/* Controls Bar */}
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/50">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search tickets by ID, subject or description..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              {["All", "Open", "In Progress", "Resolved", "Closed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    statusFilter === status 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Ticket Table/List */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                <p className="text-slate-500 font-medium">Fetching your tickets...</p>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <Ticket className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No tickets found</h3>
                <p className="text-slate-500 mt-2 max-w-xs mx-auto">
                  {searchQuery || statusFilter !== "All" 
                    ? "Try adjusting your filters or search query to find what you're looking for."
                    : "You haven't raised any support tickets yet. Click the button above to start."}
                </p>
                {(searchQuery || statusFilter !== "All") && (
                  <button 
                    onClick={() => {setSearchQuery(""); setStatusFilter("All");}}
                    className="mt-6 text-indigo-600 font-semibold hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Ticket Details</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Category & Priority</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTickets.map((ticket) => (
                    <TicketRow 
                      key={ticket.id} 
                      ticket={ticket} 
                      tenant={tenant} 
                      router={router}
                      formatId={formatId}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        {/* Footer Support Section */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <SupportCard 
            title="Knowledge Base"
            description="Browse our documentation and tutorials for quick answers."
            icon={<HelpCircle className="w-6 h-6" />}
            link="#"
          />
          <SupportCard 
            title="Community Forum"
            description="Connect with other users and share your experiences."
            icon={<MessageSquare className="w-6 h-6" />}
            link="#"
          />
          <SupportCard 
            title="Live Chat"
            description="Talk to our support specialists for immediate assistance."
            icon={<MessageSquare className="w-6 h-6 text-indigo-600" />}
            link="#"
            highlight
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

function StatCard({ title, value, icon, color, subtext }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-black text-slate-900">{value}</p>
          {subtext && <p className="text-[10px] text-slate-400">{subtext}</p>}
        </div>
      </div>
    </div>
  );
}

function TicketRow({ ticket, tenant, router, formatId }) {
  const status = ticket.status || "Open";
  const priority = ticket.priority || "LOW";
  const sc = statusConfig[status] || statusConfig.Open;
  const pc = priorityConfig[priority] || priorityConfig.LOW;

  return (
    <tr 
      className="group hover:bg-slate-50/80 transition-colors cursor-pointer"
      onClick={() => router.push(`/${tenant}/support/${ticket.id}`)}
    >
      <td className="px-6 py-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              {formatId(ticket.id)}
            </span>
            <span className="text-slate-900 font-semibold group-hover:text-indigo-600 transition-colors line-clamp-1">
              {ticket.subject || ticket.title}
            </span>
          </div>
          <p className="text-xs text-slate-500 line-clamp-1 pl-1">
            {ticket.description}
          </p>
          <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(ticket.createdAt || Date.now()).toLocaleDateString()}
            </span>
            {ticket.lastUpdated && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Updated 2h ago
              </span>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium capitalize">
            <Tag className="w-3 h-3 text-slate-400" />
            {ticket.category || "General"}
          </div>
          <span className={`w-fit text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full border ${pc}`}>
            {priority}
          </span>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full w-fit ${sc.bg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
          <span className={`text-xs font-bold ${sc.text}`}>{status}</span>
        </div>
      </td>
      <td className="px-6 py-5 text-right">
        <button 
          className="p-2 hover:bg-white rounded-full transition-all text-slate-400 hover:text-indigo-600 hover:shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/${tenant}/support/${ticket.id}`);
          }}
        >
          <ArrowUpRight className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
}

function SupportCard({ title, description, icon, link, highlight }) {
  return (
    <Link href={link} className={`p-6 rounded-3xl border transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col gap-4 ${
      highlight 
        ? "bg-indigo-600 border-indigo-500 text-white shadow-indigo-100" 
        : "bg-white border-slate-200 text-slate-900"
    }`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
        highlight ? "bg-white/20" : "bg-slate-50 text-indigo-600"
      }`}>
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-lg">{title}</h4>
        <p className={`text-sm mt-1 ${highlight ? "text-indigo-100" : "text-slate-500"}`}>
          {description}
        </p>
      </div>
      <div className={`mt-auto flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
        highlight ? "text-white" : "text-indigo-600"
      }`}>
        Learn More <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  );
}
