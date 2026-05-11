"use client";

import React, { useEffect, useState } from "react";
import { useTenant } from "@/hooks/useTenant";
import { getMyTasks } from "@/services/user/taskService";
import {
    CheckCircle2,
    Clock3,
    AlertTriangle,
    ClipboardList,
    Sparkles,
    Calendar,
    User2,
    ArrowUpRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import AssignTask from "../AssignTask/page";

const PRIORITY_CONFIG = {
    URGENT: { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", dot: "#7c3aed" },
    HIGH: { color: "#ef4444", bg: "#fef2f2", border: "#fecaca", dot: "#ef4444" },
    MEDIUM: { color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", dot: "#f59e0b" },
    LOW: { color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0", dot: "#22c55e" },
};

const STATUS_CONFIG = {
    COMPLETED: { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", icon: CheckCircle2, label: "Completed" },
    IN_PROGRESS: { color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe", icon: Clock3, label: "In Progress" },
    PENDING: { color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", icon: Clock3, label: "Pending" },
};

function Badge({ config, text }) {
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "4px 10px", borderRadius: 999,
            background: config.bg, border: `1px solid ${config.border}`,
            color: config.color, fontSize: 11, fontWeight: 700,
            letterSpacing: "0.04em", fontFamily: "'DM Sans', sans-serif",
            whiteSpace: "nowrap",
        }}>
            {config.dot && (
                <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: config.dot, flexShrink: 0,
                }} />
            )}
            {text}
        </span>
    );
}

function SkeletonRow() {
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
            gap: 16, padding: "18px 28px",
            borderBottom: "1px solid #e0e7ff",
            alignItems: "center",
        }}>
            {[200, 80, 90, 100, 80].map((w, i) => (
                <div key={i} style={{
                    height: 14, borderRadius: 8,
                    background: "linear-gradient(90deg, #e0e7ff 25%, #eef2ff 50%, #e0e7ff 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.4s infinite",
                    width: w, maxWidth: "100%",
                }} />
            ))}
        </div>
    );
}

function EmptyState() {
    return (
        <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            minHeight: 320, gap: 16, padding: 48,
        }}>
            <div style={{
                width: 72, height: 72, borderRadius: 24,
                background: "#eef2ff", display: "flex",
                alignItems: "center", justifyContent: "center",
            }}>
                <ClipboardList size={32} color="#a5b4fc" />
            </div>
            <div style={{ textAlign: "center" }}>
                <h3 style={{
                    fontSize: 18, fontWeight: 700, color: "#1e1b4b",
                    fontFamily: "'Fraunces', serif", marginBottom: 6,
                }}>
                    No tasks yet
                </h3>
                <p style={{ fontSize: 13, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }}>
                    Tasks assigned to you will appear here
                </p>
            </div>
        </div>
    );
}

function MyTasks() {
    const tenantId = useTenant();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredRow, setHoveredRow] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await getMyTasks(tenantId);
                console.log("fetchTasks", res);
                setTasks(res || []);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        if (tenantId) fetchTasks();
    }, [tenantId]);

    const completed = tasks.filter((t) => t.status === "COMPLETED").length;
    const pending = tasks.filter((t) => t.status !== "COMPLETED").length;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,300;0,700;1,300&display=swap');
                @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .task-row { transition: background 0.15s; }
                .task-row:hover { background: #f5f3ff !important; }
            `}</style>

            <div style={{
                fontFamily: "'DM Sans', sans-serif",
                margin: "10px",
                borderRadius: 28,
                overflow: "hidden",
                border: "1.5px solid #e0e7ff",
                boxShadow: "0 4px 40px rgba(99,102,241,0.08), 0 1px 4px rgba(0,0,0,0.04)",
                animation: "fadeUp 0.4s ease both",
            }}>

                {/* ── HEADER ── */}
                <div style={{
                    background: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
                    padding: "32px 36px",
                    position: "relative", overflow: "hidden",
                }}>
                    {/* Decorative circles */}
                    <div style={{
                        position: "absolute", top: -50, right: -50,
                        width: 180, height: 180, borderRadius: "50%",
                        background: "rgba(255,255,255,0.06)",

                    }} />
                    <div style={{
                        position: "absolute", bottom: -30, right: 140,
                        width: 100, height: 100, borderRadius: "50%",
                        background: "rgba(255,255,255,0.04)",
                    }} />

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
                        {/* Left: title */}

                        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                            <div style={{
                                width: 52, height: 52, borderRadius: 16,
                                background: "rgba(255,255,255,0.15)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                backdropFilter: "blur(4px)",
                            }}>
                                <ClipboardList size={24} color="#fff" />
                            </div>
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                                    <Sparkles size={12} color="rgba(255,255,255,0.6)" />
                                    <span style={{
                                        fontSize: 10, fontWeight: 700,
                                        letterSpacing: "0.12em", textTransform: "uppercase",
                                        color: "rgba(255,255,255,0.55)",
                                    }}>My Workspace</span>
                                </div>
                                <h2 style={{
                                    fontFamily: "'Fraunces', serif",
                                    fontSize: 26, fontWeight: 700,
                                    color: "#fff", lineHeight: 1.1,
                                }}>My Tasks</h2>
                            </div>
                        </div>

                        <button style={{ backgroundColor: '#6366f1', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', position: "relative", zIndex: 2 }} onClick={() => setShowAddModal(true)}>Add New Task</button>


                        {/* Right: stat pills */}
                        {!loading && tasks.length > 0 && (
                            <div style={{ display: "flex", gap: 12 }}>
                                {[
                                    { label: "Total", value: tasks.length, bg: "rgba(255,255,255,0.12)", color: "#fff" },
                                    { label: "Done", value: completed, bg: "rgba(34,197,94,0.15)", color: "#86efac" },
                                    { label: "Pending", value: pending, bg: "rgba(251,191,36,0.15)", color: "#fde68a" },
                                ].map((stat) => (
                                    <div key={stat.label} style={{
                                        padding: "10px 18px", borderRadius: 14,
                                        background: stat.bg,
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        textAlign: "center",
                                    }}>
                                        <div style={{ fontSize: 20, fontWeight: 700, color: stat.color, fontFamily: "'Fraunces', serif" }}>
                                            {stat.value}
                                        </div>
                                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}

                            </div>
                        )}
                    </div>
                </div>

                {/* ── SECTION LABEL ── */}
                <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "20px 28px 0",
                }}>
                    <Sparkles size={13} color="#6366f1" />
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        All Assignments
                    </span>
                    <div style={{ flex: 1, height: 1, background: "#e0e7ff", marginLeft: 8 }} />
                </div>

                {/* ── BODY ── */}
                {loading ? (
                    <div style={{ paddingTop: 12 }}>
                        {[1, 2, 3, 4].map((i) => <SkeletonRow key={i} />)}
                    </div>
                ) : tasks.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div style={{ overflowX: "auto", paddingTop: 12 }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ background: "#f8f8ff" }}>
                                    {["Task", "Priority", "Due Date", "Assigned By", "Status"].map((h, i) => (
                                        <th key={h} style={{
                                            padding: i === 0 ? "12px 28px" : "12px 16px",
                                            textAlign: "left", fontSize: 10,
                                            fontWeight: 700, letterSpacing: "0.1em",
                                            textTransform: "uppercase", color: "#6366f1",
                                            borderBottom: "1.5px solid #e0e7ff",
                                            whiteSpace: "nowrap",
                                        }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task, idx) => {
                                    const pCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.LOW;
                                    const sCfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.PENDING;
                                    const StatusIcon = sCfg.icon;
                                    const isHovered = hoveredRow === idx;

                                    return (
                                        <tr
                                            key={task.id}
                                            className="task-row"
                                            onMouseEnter={() => setHoveredRow(idx)}
                                            onMouseLeave={() => setHoveredRow(null)}
                                            style={{
                                                borderBottom: "1px solid #e0e7ff",
                                                background: isHovered ? "#f5f3ff" : "#fff",
                                                cursor: "default",
                                                animation: `fadeUp 0.3s ease ${idx * 0.05}s both`,
                                            }}
                                        >
                                            {/* Task */}
                                            <td style={{ padding: "18px 28px", maxWidth: 280 }}>
                                                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                                                    <div style={{
                                                        width: 36, height: 36, borderRadius: 10,
                                                        background: isHovered ? "#eef2ff" : "#f8f8ff",
                                                        border: "1.5px solid #e0e7ff",
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        flexShrink: 0, transition: "background 0.15s",
                                                    }}>
                                                        <ClipboardList size={15} color="#6366f1" />
                                                    </div>
                                                    <div>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                            <p style={{
                                                                fontSize: 14, fontWeight: 700,
                                                                color: "#1e1b4b", lineHeight: 1.3,
                                                            }}>
                                                                {task.title}
                                                            </p>
                                                            {isHovered && (
                                                                <ArrowUpRight size={13} color="#6366f1" />
                                                            )}
                                                        </div>
                                                        <p style={{
                                                            fontSize: 12, color: "#94a3b8",
                                                            marginTop: 2, lineHeight: 1.4,
                                                            display: "-webkit-box",
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: "vertical",
                                                            overflow: "hidden",
                                                        }}>
                                                            {task.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Priority */}
                                            <td style={{ padding: "18px 16px", whiteSpace: "nowrap" }}>
                                                <Badge config={pCfg} text={task.priority} />
                                            </td>

                                            {/* Due Date */}
                                            <td style={{ padding: "18px 16px", whiteSpace: "nowrap" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                    <Calendar size={13} color="#a5b4fc" />
                                                    <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>
                                                        {task.dueDate
                                                            ? new Date(task.dueDate).toLocaleDateString("en-US", {
                                                                month: "short", day: "numeric", year: "numeric",
                                                            })
                                                            : "—"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Assigned By */}
                                            <td style={{ padding: "18px 16px", whiteSpace: "nowrap" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                                    <div style={{
                                                        width: 26, height: 26, borderRadius: "50%",
                                                        background: "linear-gradient(135deg,#6366f1,#4338ca)",
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        flexShrink: 0,
                                                    }}>
                                                        <User2 size={12} color="#fff" />
                                                    </div>
                                                    <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>
                                                        {task.assignedBy || "—"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td style={{ padding: "18px 16px", whiteSpace: "nowrap" }}>
                                                <span style={{
                                                    display: "inline-flex", alignItems: "center", gap: 5,
                                                    padding: "5px 11px", borderRadius: 999,
                                                    background: sCfg.bg, border: `1px solid ${sCfg.border}`,
                                                    color: sCfg.color, fontSize: 11, fontWeight: 700,
                                                    letterSpacing: "0.04em",
                                                }}>
                                                    <StatusIcon size={12} />
                                                    {sCfg.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ── FOOTER ── */}
                {!loading && tasks.length > 0 && (
                    <div style={{
                        padding: "14px 28px",
                        borderTop: "1px solid #e0e7ff",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        background: "#fafafe",
                    }}>
                        <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>
                            Showing <span style={{ color: "#6366f1", fontWeight: 700 }}>{tasks.length}</span> task{tasks.length !== 1 ? "s" : ""}
                        </p>
                        <div style={{ display: "flex", gap: 6 }}>
                            {/* Progress bar */}
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{
                                    width: 120, height: 6, borderRadius: 999,
                                    background: "#e0e7ff", overflow: "hidden",
                                }}>
                                    <div style={{
                                        height: "100%",
                                        width: `${tasks.length ? (completed / tasks.length) * 100 : 0} % `,
                                        background: "linear-gradient(90deg, #6366f1, #4338ca)",
                                        borderRadius: 999,
                                        transition: "width 0.6s ease",
                                    }} />
                                </div>
                                <span style={{ fontSize: 11, color: "#6366f1", fontWeight: 700 }}>
                                    {tasks.length ? Math.round((completed / tasks.length) * 100) : 0}% complete
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div >

            {
                showAddModal && (
                    <div
                        style={{
                            position: "fixed",
                            inset: 0,
                            minHeight: "100vh",
                            background: "rgba(15,23,42,0.55)",
                            backdropFilter: "blur(2px)",
                            zIndex: 999,
                            display: "flex",
                            justifyContent: "flex-end",
                            overflow: "hidden",
                        }}
                        onClick={() => setShowAddModal(false)}
                    >
                        {/* SIDE PANEL */}

                        <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                width: "100%",
                                maxWidth: 650,
                                height: "100vh",
                                overflowY: "auto",
                                position: "relative",
                                animation: "slideInRight 0.35s ease forwards",
                            }}
                        >
                            {/* CLOSE BUTTON */}

                            <div >
                                <AssignTask />
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}

export default MyTasks;