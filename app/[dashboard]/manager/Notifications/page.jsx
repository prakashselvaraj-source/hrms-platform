"use client";

import { useState } from "react";
import {
    CheckCheck,
    ChevronRight,
    AlertTriangle,
    Clock,
    CheckCircle2,
    Bell,
    UserCheck,
    CalendarCheck,
    ShieldAlert,
} from "lucide-react";

const initialNotifications = [
    {
        id: 1,
        dot: "red",
        title: "LOP Warning — Priya Sharma",
        description: "Priya has exceeded the 2-leave monthly limit. Next leave will be LOP.",
        time: "5 minutes ago",
        actions: [
            { label: "Review Case", variant: "solid" },
            { label: "Dismiss", variant: "outline" },
        ],
        read: false,
    },
    {
        id: 2,
        dot: "red",
        title: "New Leave Request — Vikram Kota",
        description: "EL request for Apr 17–19 is awaiting your approval.",
        time: "1 hour ago",
        actions: [
            { label: "Approve", variant: "outline-green" },
            { label: "Reject", variant: "outline-red" },
        ],
        read: false,
    },
    {
        id: 3,
        dot: "red",
        title: "New Leave Request — Sonia Kaur",
        description: "CL request for Apr 14–15 flagged with sandwich leave warning.",
        time: "2 hours ago",
        actions: [
            { label: "View Details", variant: "outline-green" },
        ],
        read: false,
    },
    {
        id: 4,
        dot: "blue",
        title: "Attendance Regularization — Sonia Kaur",
        description: "Missed punch on Apr 7 requires your review.",
        time: "3 hours ago",
        actions: [
            { label: "Resolve", variant: "outline" },
        ],
        read: false,
    },
    {
        id: 5,
        dot: "blue",
        title: "Attendance Regularization — Arjun Das",
        description: "Late arrival on Apr 8 needs approval. Reason: metro delay.",
        time: "5 hours ago",
        actions: [
            { label: "Approve Reason", variant: "solid" },
        ],
        read: false,
    },
    {
        id: 6,
        dot: "gray",
        title: "Leave Approved — Meena Raj",
        description: "You approved Meena's CL for Apr 7–8.",
        time: "Yesterday",
        actions: [],
        read: true,
    },
];

const stats = [
    {
        label: "Critical Issues",
        value: "01",
        sub: "Needs immediate attention",
        icon: AlertTriangle,
        color: "text-[#93000A]",
        bg: "bg-[#FFDAD6]",


    },
    {
        label: "Pending Approval",
        value: "04",
        sub: "Requires your sign-off",
        icon: Clock,
        color: "text-[#5A00C6]",
        bg: "bg-[#EADDFF]",
    },

    {
        label: "Processed",
        value: "28",
        sub: "In the last 7 days",
        icon: CheckCircle2,
        color: "text-[#006058]",
        bg: "bg-[#6BD8CB]",

    },
];

const dotColors = {
    red: "bg-rose-500",
    blue: "bg-blue-500",
    gray: "bg-slate-300",
};

function ActionButton({ label, variant, onClick }) {
    const base = "px-4 py-1.5 rounded-sm text-xs font-semibold transition-all active:scale-95";
    const styles = {
        solid: `${base} bg-[#4A45B6] text-white hover:bg-violet-700`,
        outline: `${base} bg-[#E6E8EA] text-[#434655] hover:bg-slate-50`,
        "outline-green": `${base} bg-[#E2DFFF] text-[#434655] hover:bg-emerald-50`,
        "outline-red": `${base} bg-[#FFDAD6] text-[#93000A] hover:bg-rose-50`,
    };


    return (
        <button className={styles[variant] || styles.outline} onClick={onClick}>
            {label}
        </button>
    );
}

export default function Notifications() {
    const [notifications, setNotifications] = useState(initialNotifications);

    const markAllRead = () =>
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    const handleAction = (id, label) => {
        if (label === "Dismiss") {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
            return;
        }
        if (label === "Approve" || label === "Approve Reason") {
            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === id ? { ...n, dot: "gray", read: true, actions: [] } : n
                )
            );
            return;
        }
        if (label === "Reject") {
            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === id ? { ...n, dot: "gray", read: true, actions: [] } : n
                )
            );
            return;
        }
        if (label === "Resolve") {
            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === id ? { ...n, dot: "gray", read: true, actions: [] } : n
                )
            );
            return;
        }
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <div className="min-h-screen p-6 md:p-10 font-sans">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                <span>Home</span>
                <ChevronRight size={14} />
                <span className="text-slate-700 font-semibold uppercase tracking-wide text-xs">Notification</span>
            </div>
            <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-slate-100">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Notifications</h1>
                    <p className="text-sm text-slate-400 mt-0.5">Manage your alerts and pending approvals.</p>
                </div>

                {unreadCount > 0 && (
                    <button
                        onClick={markAllRead}
                        className="flex items-center gap-1.5 text-sm text-[#4A45B6] hover:text-violet-800 
                        font-semibold transition-colors"
                    >
                        <CheckCheck size={15} />
                        Mark all read
                    </button>
                )}
            </div>
            {/* Main Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

                {/* Header */}


                {/* Notification List */}
                <div className="divide-y divide-slate-50">
                    {notifications.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-300">
                            <Bell size={40} strokeWidth={1.5} className="mb-3" />
                            <p className="text-sm font-medium">No notifications</p>
                        </div>
                    )}

                    {notifications.map((n) => (
                        <div
                            key={n.id}
                            className={`flex gap-4 px-6 py-5 transition-colors ${n.read ? "bg-white" : "bg-slate-50/60"}`}
                        >
                            {/* Dot */}
                            <div className="pt-1.5 flex-shrink-0">
                                <span className={`w-2.5 h-2.5 rounded-full block ${dotColors[n.dot]}`} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                    <p className={`text-sm font-semibold ${n.read ? "text-slate-500" : "text-[#191C1E]"}`}>
                                        {n.title}

                                    </p>

                                    <span className="text-xs text-[#737686] whitespace-nowrap flex-shrink-0">{n.time}</span>
                                </div>

                                <p className="text-sm text-[#434655] mt-0.5 leading-relaxed">{n.description}</p>

                                {n.actions.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {n.actions.map((a) => (
                                            <ActionButton
                                                key={a.label}
                                                label={a.label}
                                                variant={a.variant}
                                                onClick={() => handleAction(n.id, a.label)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>


            </div>
            {/* Stats Footer */}
            <div className="grid grid-cols-1 lg:grid-cols-3 border-t gap-1 lg:gap-4 border-slate-100">
                {stats.map(({ label, value, sub, icon: Icon, color, bg }, i) => (
                    <div

                        key={label}
                        className={`flex flex-col gap-4 px-6 py-5 bg-[#F2F4F6] shadow-lg p-2  my-4  rounded-sm ${i < 2 ? "sm:border-r border-slate-100" : ""}`}
                    >
                        <div className="flex gap-2 items-center">
                            <div className={`w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0 ${bg}`}>
                                <Icon size={20} className={color} />

                            </div>
                            <p className="text-sm  text-[#191C1E] font-bold">{label}</p>

                        </div>

                        <div>

                            <p className={`text-4xl font-bold leading-tight ${color}`}>{value}</p>
                            <p className="text-[13px] text-[#737686] mt-0.5">{sub}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
