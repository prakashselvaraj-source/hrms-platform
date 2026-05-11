"use client";

import React, { useEffect, useState } from "react";
import { useTenant } from "@/hooks/useTenant";
import API from "@/utils/api";
import { assignTask } from "@/services/user/taskService";
import {
    ClipboardList,
    CalendarDays,
    AlertTriangle,
    User,
    FileText,
    Sparkles,
    ChevronDown,
    ArrowRight,
    CheckCircle2,
} from "lucide-react";
import { getEmployees } from "@/services/employeeService";

const PRIORITY_CONFIG = {
    LOW: { color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0", label: "Low" },
    MEDIUM: { color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", label: "Medium" },
    HIGH: { color: "#ef4444", bg: "#fef2f2", border: "#fecaca", label: "High" },
    URGENT: { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", label: "Urgent" },
};

function FieldLabel({ children }) {
    return (
        <label
            style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#6366f1",
                display: "block",
                marginBottom: "8px",
                fontFamily: "'DM Sans', sans-serif",
            }}
        >
            {children}
        </label>
    );
}

function InputBase({ children, style = {} }) {
    return (
        <div
            style={{
                position: "relative",
                background: "#f8f8ff",
                borderRadius: "14px",
                border: "1.5px solid #e0e7ff",
                transition: "border-color 0.2s, box-shadow 0.2s",
                ...style,
            }}
            onFocus={(e) => {
                e.currentTarget.style.borderColor = "#6366f1";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.08)";
            }}
            onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e0e7ff";
                e.currentTarget.style.boxShadow = "none";
            }}
        >
            {children}
        </div>
    );
}

function AssignTask() {
    const tenantId = useTenant();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "MEDIUM",
        dueDate: "",
        assignedToId: "",
    });

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await getEmployees(tenantId);
                console.log("fetchEmployees", res.data.employees);
                setEmployees(res.data.employees);
            } catch (error) {
                console.log("Failed to fetch employees", error);
            }
        };
        if (tenantId) fetchEmployees();
    }, [tenantId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await assignTask(tenantId, {
                ...formData,
                assignedToId: Number(formData.assignedToId),
            });
            setSuccess(true);
            setFormData({ title: "", description: "", priority: "MEDIUM", dueDate: "", assignedToId: "" });
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.log(error);
            alert("Failed to assign task");
        } finally {
            setLoading(false);
        }
    };

    const selectedPriority = PRIORITY_CONFIG[formData.priority];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,300;0,700;1,300&display=swap');

                .assign-input:focus {
                    outline: none;
                    border-color: #6366f1 !important;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.08) !important;
                }
                .assign-input::placeholder { color: #c7d2fe; }
                .assign-textarea:focus {
                    outline: none;
                    border-color: #6366f1 !important;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.08) !important;
                }
                .assign-textarea::placeholder { color: #c7d2fe; }
                .assign-select:focus { outline: none; }
                .step-row { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 20px; }
                .step-num {
                    width: 26px; height: 26px; border-radius: 50%;
                    background: #eef2ff; color: #6366f1;
                    font-size: 11px; font-weight: 700;
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0; margin-top: 2px;
                }
                .step-label { font-size: 12px; color: #64748b; line-height: 1.5; }
                .submit-btn {
                    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                    color: #fff; border: none; cursor: pointer;
                    transition: transform 0.15s, box-shadow 0.15s;
                }
                .submit-btn:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 25px rgba(99,102,241,0.35);
                }
                .submit-btn:active:not(:disabled) { transform: translateY(0); }
                .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
            `}</style>

            <div style={{
                fontFamily: "'DM Sans', sans-serif",
                display: "flex",

                width: "100%",
                maxWidth: "660px",
                minHeight: "100vh",
                overflow: "hidden",
                boxShadow: "0 4px 40px rgba(99,102,241,0.10), 0 1px 4px rgba(0,0,0,0.04)",
                border: "1.5px solid #e0e7ff",
                background: "#ffffff",
            }}>



                {/* ── RIGHT FORM PANEL ── */}
                <div style={{ flex: 1, padding: "40px 40px", background: "#fff", overflowY: "auto" }}>

                    {/* Section label */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
                        <Sparkles size={14} color="#6366f1" />
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#6366f1", letterSpacing: "0.08em" }}>
                            New Assignment
                        </span>
                        <div style={{ flex: 1, height: 1, background: "#e0e7ff", marginLeft: 8 }} />
                    </div>

                    <form onSubmit={handleSubmit}>

                        {/* TITLE */}
                        <div style={{ marginBottom: 24 }}>
                            <FieldLabel>Task Title</FieldLabel>
                            <div style={{ position: "relative" }}>
                                <FileText size={16} style={{
                                    position: "absolute", left: 16, top: "50%",
                                    transform: "translateY(-50%)", color: "#a5b4fc", pointerEvents: "none",
                                }} />
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Design the onboarding flow"
                                    required
                                    className="assign-input"
                                    style={{
                                        width: "100%", boxSizing: "border-box",
                                        paddingLeft: 44, paddingRight: 16,
                                        paddingTop: 14, paddingBottom: 14,
                                        borderRadius: 14,
                                        border: "1.5px solid #e0e7ff",
                                        background: "#f8f8ff",
                                        color: "#1e1b4b",
                                        fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                                        fontWeight: 500,
                                        transition: "border-color 0.2s, box-shadow 0.2s",
                                    }}
                                />
                            </div>
                        </div>

                        {/* DESCRIPTION */}
                        <div style={{ marginBottom: 24 }}>
                            <FieldLabel>Description</FieldLabel>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Describe the scope, goals, and expected outcome…"
                                required
                                className="assign-textarea"
                                style={{
                                    width: "100%", boxSizing: "border-box",
                                    padding: "14px 16px",
                                    borderRadius: 14,
                                    border: "1.5px solid #e0e7ff",
                                    background: "#f8f8ff",
                                    color: "#1e1b4b",
                                    fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                                    lineHeight: 1.6, resize: "none",
                                    transition: "border-color 0.2s, box-shadow 0.2s",
                                }}
                            />
                        </div>

                        {/* ASSIGN + PRIORITY ROW */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>

                            {/* Assign Employee */}
                            <div>
                                <FieldLabel>Assign To</FieldLabel>
                                <div style={{ position: "relative" }}>
                                    <User size={16} style={{
                                        position: "absolute", left: 14, top: "50%",
                                        transform: "translateY(-50%)", color: "#a5b4fc", pointerEvents: "none",
                                    }} />
                                    <ChevronDown size={14} style={{
                                        position: "absolute", right: 14, top: "50%",
                                        transform: "translateY(-50%)", color: "#a5b4fc", pointerEvents: "none",
                                    }} />
                                    <select
                                        name="assignedToId"
                                        value={formData.assignedToId}
                                        onChange={handleChange}
                                        required
                                        className="assign-select"
                                        style={{
                                            width: "100%",
                                            paddingLeft: 40, paddingRight: 36,
                                            paddingTop: 14, paddingBottom: 14,
                                            borderRadius: 14,
                                            border: "1.5px solid #e0e7ff",
                                            background: "#f8f8ff",
                                            color: formData.assignedToId ? "#1e1b4b" : "#a5b4fc",
                                            fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                                            fontWeight: 500, appearance: "none",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <option value="">Select employee</option>
                                        {employees?.map((emp) => (
                                            <option key={emp.id} value={emp.id}>
                                                {emp.firstName} {emp.lastName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Priority */}
                            <div>
                                <FieldLabel>Priority Level</FieldLabel>
                                <div style={{ position: "relative" }}>
                                    <div style={{
                                        position: "absolute", left: 14, top: "50%",
                                        transform: "translateY(-50%)",
                                        width: 8, height: 8, borderRadius: "50%",
                                        background: selectedPriority.color,
                                        pointerEvents: "none",
                                    }} />
                                    <ChevronDown size={14} style={{
                                        position: "absolute", right: 14, top: "50%",
                                        transform: "translateY(-50%)", color: "#a5b4fc", pointerEvents: "none",
                                    }} />
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        className="assign-select"
                                        style={{
                                            width: "100%",
                                            paddingLeft: 32, paddingRight: 36,
                                            paddingTop: 14, paddingBottom: 14,
                                            borderRadius: 14,
                                            border: `1.5px solid ${selectedPriority.border}`,
                                            background: selectedPriority.bg,
                                            color: selectedPriority.color,
                                            fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                                            fontWeight: 600, appearance: "none",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {Object.entries(PRIORITY_CONFIG).map(([key, val]) => (
                                            <option key={key} value={key}>{val.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* DUE DATE */}
                        <div style={{ marginBottom: 36 }}>
                            <FieldLabel>Due Date</FieldLabel>
                            <div style={{ position: "relative" }}>
                                <CalendarDays size={16} style={{
                                    position: "absolute", left: 16, top: "50%",
                                    transform: "translateY(-50%)", color: "#a5b4fc", pointerEvents: "none",
                                }} />
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleChange}
                                    required
                                    className="assign-input"
                                    style={{
                                        width: "100%", boxSizing: "border-box",
                                        paddingLeft: 44, paddingRight: 16,
                                        paddingTop: 14, paddingBottom: 14,
                                        borderRadius: 14,
                                        border: "1.5px solid #e0e7ff",
                                        background: "#f8f8ff",
                                        color: formData.dueDate ? "#1e1b4b" : "#a5b4fc",
                                        fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                                        fontWeight: 500,
                                        transition: "border-color 0.2s, box-shadow 0.2s",
                                    }}
                                />
                            </div>
                        </div>

                        {/* DIVIDER */}
                        <div style={{ height: 1, background: "#e0e7ff", marginBottom: 28 }} />

                        {/* SUBMIT */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="submit-btn"
                            style={{
                                width: "100%", padding: "16px 24px",
                                borderRadius: 16, fontSize: 15,
                                fontFamily: "'DM Sans', sans-serif",
                                fontWeight: 700, letterSpacing: "0.02em",
                                display: "flex", alignItems: "center",
                                justifyContent: "center", gap: 10,
                            }}
                        >
                            {loading ? (
                                <>
                                    <div style={{
                                        width: 18, height: 18, borderRadius: "50%",
                                        border: "2px solid rgba(255,255,255,0.3)",
                                        borderTopColor: "#fff",
                                        animation: "spin 0.7s linear infinite",
                                    }} />
                                    Assigning…
                                </>
                            ) : success ? (
                                <>
                                    <CheckCircle2 size={18} />
                                    Task Assigned!
                                </>
                            ) : (
                                <>
                                    Assign Task
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>

                    </form>
                </div>


            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </>
    );
}

export default AssignTask;