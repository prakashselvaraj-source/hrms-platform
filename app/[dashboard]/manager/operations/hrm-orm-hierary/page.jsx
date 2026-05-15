"use client";
/**
 * HRM Organization Hierarchy Management
 * Full-featured enterprise SaaS org chart with drag-and-drop, search, and employee details
 * Tech: React, Tailwind CSS, React Flow, Framer Motion, DnD Kit
 */

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    MarkerType,
    Panel,
    Handle,
    Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import { useTenant } from "@/hooks/useTenant";
import { getEmployees, updateEmployee } from "@/services/employeeService";
import { toast } from "react-hot-toast";
import {
    FiUsers,
    FiBriefcase,
    FiCode,
    FiUser,
    FiLayers,
    FiChevronRight,
    FiChevronDown,
    FiSearch,
    FiFilter,
    FiZoomIn,
    FiZoomOut,
    FiSave,
    FiRefreshCw,
    FiX,
    FiMail,
    FiPhone,
    FiMapPin,
    FiCalendar,
    FiHash,
    FiEdit2,
    FiMoreVertical,
    FiCheck,
} from "react-icons/fi";
import {
    HiOutlineOfficeBuilding,
    HiOutlineAdjustments,
    HiOutlineChartBar,
} from "react-icons/hi";
import { RiOrganizationChart } from "react-icons/ri";

// ─── Constants ──────────────────────────────────────────────────────────────

const STATUS_STYLES = {
    active: "bg-emerald-100 text-emerald-700",
    "on-leave": "bg-amber-100 text-amber-700",
    remote: "bg-blue-100 text-blue-700",
};

// ─── Build Tree Nodes ────────────────────────────────────────────────────────

function buildFlowElements(employees, collapsedNodes = new Set()) {
    const nodes = [];
    const edges = [];
    const levelMap = {};
    const childrenMap = {};

    // Grouping by reporting manager (email or name)
    employees.forEach((e) => {
        const mid = e.reportingManager || "root";
        if (!childrenMap[mid]) childrenMap[mid] = [];
        childrenMap[mid].push(e.workEmail);
    });

    function assignLevel(email, level) {
        levelMap[email] = level;
        if (!collapsedNodes.has(email) && childrenMap[email]) {
            childrenMap[email].forEach((cEmail) => assignLevel(cEmail, level + 1));
        }
    }

    // Roots are employees with no reporting manager or whose manager isn't in the list
    const employeeEmails = new Set(employees.map(e => e.workEmail));
    const roots = employees.filter(e => !e.reportingManager || !employeeEmails.has(e.reportingManager));
    
    roots.forEach((e) => assignLevel(e.workEmail, 0));

    const levelCounts = {};
    const levelPositions = {};
    employees.forEach((e) => {
        const lv = levelMap[e.workEmail] ?? 0;
        levelCounts[lv] = (levelCounts[lv] || 0) + 1;
        levelPositions[lv] = 0;
    });

    const xSpacing = 350;
    const ySpacing = 220;

    employees.forEach((e) => {
        const lv = levelMap[e.workEmail] ?? 0;
        const count = levelCounts[lv];
        const pos = levelPositions[lv]++;
        const xOffset = -(count - 1) * xSpacing * 0.5 + pos * xSpacing;

        nodes.push({
            id: e.workEmail,
            type: "employeeCard",
            position: { x: xOffset + 1000, y: lv * ySpacing + 100 },
            data: { 
                employee: e, 
                hasChildren: !!(childrenMap[e.workEmail] && childrenMap[e.workEmail].length > 0), 
                isCollapsed: collapsedNodes.has(e.workEmail) 
            },
        });

        if (e.reportingManager && employeeEmails.has(e.reportingManager) && !collapsedNodes.has(e.reportingManager)) {
            edges.push({
                id: `edge-${e.reportingManager}-${e.workEmail}`,
                source: e.reportingManager,
                target: e.workEmail,
                type: "smoothstep",
                animated: false,
                style: { stroke: "var(--brand-primary, #6366f1)", strokeWidth: 2 },
                markerEnd: { type: MarkerType.ArrowClosed, color: "#6366f1", width: 16, height: 16 },
            });
        }
    });

    return { nodes, edges };
}

// ─── Employee Card Node ──────────────────────────────────────────────────────

function EmployeeCardNode({ data, selected }) {
    const { employee, hasChildren, isCollapsed } = data;
    const initials = (employee.firstName?.[0] || "") + (employee.lastName?.[0] || "");

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-white rounded-2xl border-2 transition-all duration-200 w-72 cursor-pointer group
        ${selected ? "border-indigo-500 shadow-xl shadow-indigo-100" : "border-gray-100 hover:border-indigo-300 shadow-md hover:shadow-lg"}`}
        >
            {/* Top Handle (Target) */}
            <Handle type="target" position={Position.Top} className="w-3 h-3 bg-indigo-400 border-2 border-white" />

            <div className="p-5">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold text-white shadow-lg flex-shrink-0"
                         style={{ background: "var(--brand-gradient, linear-gradient(135deg, #6366f1, #a855f7))" }}>
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800 text-sm truncate">{employee.firstName} {employee.lastName}</p>
                        <p className="text-xs text-indigo-600 font-bold truncate mt-0.5">{employee.designation}</p>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mt-1">{employee.department}</p>
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider ${employee.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {employee.status}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">{employee.workEmail}</span>
                </div>
            </div>
            {hasChildren && (
                <div className="border-t border-gray-100 px-5 py-2.5 flex items-center justify-between bg-gray-50/50 rounded-b-2xl">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {isCollapsed ? "Expand Team" : "Collapse Team"}
                    </span>
                    <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center">
                        {isCollapsed ? <FiChevronRight size={12} className="text-indigo-600" /> : <FiChevronDown size={12} className="text-indigo-600" />}
                    </div>
                </div>
            )}

            {/* Bottom Handle (Source) */}
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-fuchsia-400 border-2 border-white" />
        </motion.div>
    );
}

const nodeTypes = { employeeCard: EmployeeCardNode };

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HRMOrgHierarchy() {
    const tenantId = useTenant();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [collapsedNodes, setCollapsedNodes] = useState(new Set());

    const fetchEmployees = async () => {
        if (!tenantId) return;
        setLoading(true);
        try {
            const res = await getEmployees(tenantId, 0, 100);
            setEmployees(res.data.employees || []);
        } catch (err) {
            toast.error("Failed to load hierarchy data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [tenantId]);

    const departments = useMemo(() => {
        const deps = [...new Set(employees.map(e => e.department))].filter(Boolean);
        return deps.sort();
    }, [employees]);

    const filteredEmployees = useMemo(() => {
        return employees.filter((e) => {
            const fullName = `${e.firstName} ${e.lastName}`.toLowerCase();
            const matchesDept = !selectedDepartment || e.department === selectedDepartment;
            const matchesSearch = !searchQuery || 
                fullName.includes(searchQuery.toLowerCase()) || 
                e.designation.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesDept && matchesSearch;
        });
    }, [employees, selectedDepartment, searchQuery]);

    const { nodes: initialNodes, edges: initialEdges } = useMemo(
        () => buildFlowElements(filteredEmployees, collapsedNodes),
        [filteredEmployees, collapsedNodes]
    );

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    useEffect(() => {
        const { nodes: n, edges: e } = buildFlowElements(filteredEmployees, collapsedNodes);
        setNodes(n);
        setEdges(e);
    }, [filteredEmployees, collapsedNodes]);

    const onNodeClick = useCallback((_, node) => {
        const emp = employees.find((e) => e.workEmail === node.id);
        if (emp) {
            setSelectedEmployee(emp);
        }
    }, [employees]);

    const onConnect = useCallback(async (params) => {
        const subordinate = employees.find(e => e.workEmail === params.target);
        if (!subordinate) return;

        toast.promise(
            updateEmployee(subordinate.id, { ...subordinate, reportingManager: params.source }, tenantId),
            {
                loading: 'Updating reporting structure...',
                success: 'Reporting manager updated!',
                error: 'Failed to update structure',
            }
        ).then(() => fetchEmployees());
    }, [employees, tenantId]);

    const handleReset = () => {
        fetchEmployees();
        setCollapsedNodes(new Set());
        setSelectedDepartment(null);
        setSearchQuery("");
    };

    if (loading && employees.length === 0) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <FiRefreshCw className="animate-spin text-indigo-600" size={32} />
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Building Hierarchy...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            {/* Sidebar */}
            <SidebarDepartments
                employees={employees}
                departments={departments}
                selectedDepartment={selectedDepartment}
                onSelectDepartment={setSelectedDepartment}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            {/* Main */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <StatsBar employees={employees} />
                <HierarchyToolbar
                    onReset={handleReset}
                    selectedDepartment={selectedDepartment}
                    onClearFilter={() => setSelectedDepartment(null)}
                />

                {/* Flow Canvas */}
                <div className="flex-1 relative">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                        onNodeClick={onNodeClick}
                        fitView
                        fitViewOptions={{ padding: 0.2 }}
                        minZoom={0.2}
                        maxZoom={1.5}
                    >
                        <Background color="#cbd5e1" gap={20} size={1} />
                        <Controls
                            showInteractive={false}
                            className="bg-white border-gray-200 rounded-xl shadow-lg"
                        />
                        <MiniMap
                            className="border border-gray-200 rounded-xl shadow-lg"
                            maskColor="rgba(241, 245, 249, 0.7)"
                        />
                        <Panel position="top-right" className="bg-white/80 backdrop-blur px-4 py-3 rounded-xl border border-gray-200 shadow-sm m-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Connect Nodes</p>
                            <p className="text-[11px] text-gray-600">Drag from a <span className="font-bold text-indigo-600">Manager</span> to a <span className="font-bold text-fuchsia-600">Subordinate</span> to reassign.</p>
                        </Panel>
                    </ReactFlow>
                </div>
            </div>

            {/* Drawer */}
            <AnimatePresence>
                {selectedEmployee && (
                    <EmployeeDrawer
                        employee={selectedEmployee}
                        employees={employees}
                        tenantId={tenantId}
                        onClose={() => setSelectedEmployee(null)}
                        onUpdate={fetchEmployees}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Sub-components with integrated logic ───────────────────────────────────

function SidebarDepartments({ employees, departments, selectedDepartment, onSelectDepartment, searchQuery, onSearchChange }) {
    return (
        <div className="w-80 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col h-full shadow-sm">
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        <RiOrganizationChart size={20} />
                    </div>
                    <div>
                        <h1 className="text-sm font-black text-gray-800 uppercase tracking-tight">Organization</h1>
                        <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Hierarchy Flow</p>
                    </div>
                </div>
                <div className="relative">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Find an employee..."
                        className="w-full pl-10 pr-4 py-2.5 text-xs font-bold rounded-xl border-2 border-gray-100 focus:border-indigo-400 focus:bg-white bg-gray-50/50 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
                <div className="flex items-center justify-between mb-4 px-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Departments</p>
                    <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">{departments.length}</span>
                </div>
                
                <button
                    onClick={() => onSelectDepartment(null)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${!selectedDepartment ? "bg-indigo-50 text-indigo-700 shadow-sm" : "text-gray-500 hover:bg-gray-50"}`}
                >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${!selectedDepartment ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-400"}`}>
                        <FiLayers size={16} />
                    </div>
                    <span className="flex-1 text-left text-xs font-bold">Overall View</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${!selectedDepartment ? "bg-indigo-200" : "bg-gray-100"}`}>
                        {employees.length}
                    </span>
                </button>

                {departments.map((dept) => {
                    const isActive = selectedDepartment === dept;
                    const count = employees.filter(e => e.department === dept).length;
                    return (
                        <button
                            key={dept}
                            onClick={() => onSelectDepartment(isActive ? null : dept)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? "bg-indigo-50 text-indigo-700 shadow-sm" : "text-gray-500 hover:bg-gray-50"}`}
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-400"}`}>
                                <FiBriefcase size={16} />
                            </div>
                            <span className="flex-1 text-left text-xs font-bold truncate">{dept}</span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${isActive ? "bg-indigo-200" : "bg-gray-100"}`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function StatsBar({ employees }) {
    const stats = [
        { label: "Total Workforce", value: employees.length, icon: FiUsers, color: "text-indigo-600 bg-indigo-50" },
        { label: "Active Members", value: employees.filter(e => e.status === "active").length, icon: FiCheck, color: "text-emerald-600 bg-emerald-50" },
        { label: "Pending Setup", value: employees.filter(e => e.status === "pending").length, icon: FiRefreshCw, color: "text-amber-600 bg-amber-50" },
    ];

    return (
        <div className="flex gap-4 p-6 bg-white border-b border-gray-100">
            {stats.map((s) => (
                <div key={s.label} className="flex-1 flex items-center gap-4 bg-gray-50 rounded-2xl px-5 py-4 border border-gray-100">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                        <s.icon size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                        <p className="text-xl font-black text-gray-800">{s.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function EmployeeDrawer({ employee, employees, tenantId, onClose, onUpdate }) {
    const handleSetManager = async (managerEmail) => {
        try {
            await updateEmployee(employee.id, { ...employee, reportingManager: managerEmail }, tenantId);
            toast.success("Structure updated successfully");
            onUpdate();
        } catch (err) {
            toast.error("Failed to update structure");
        }
    };

    return (
        <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40" onClick={onClose} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-[450px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden">
                <div className="p-8 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Employee Profile</span>
                        <button onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors">
                            <FiX size={20} className="text-gray-400" />
                        </button>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-indigo-100"
                             style={{ background: "var(--brand-gradient, linear-gradient(135deg, #6366f1, #a855f7))" }}>
                            {employee.firstName?.[0]}{employee.lastName?.[0]}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-800 tracking-tight">{employee.firstName} {employee.lastName}</h2>
                            <p className="text-indigo-600 font-bold text-sm">{employee.designation}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest">{employee.department}</span>
                                <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest">{employee.status}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-10">
                    <section>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Management Structure</p>
                        <div className="space-y-4">
                            <div className="p-5 rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/50">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Reports To</p>
                                <select 
                                    value={employee.reportingManager || ""}
                                    onChange={(e) => handleSetManager(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 text-xs font-bold outline-none focus:border-indigo-400"
                                >
                                    <option value="">No Manager (Root)</option>
                                    {employees.filter(e => e.workEmail !== employee.workEmail).map(e => (
                                        <option key={e.workEmail} value={e.workEmail}>{e.firstName} {e.lastName} ({e.designation})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Information</p>
                        <div className="grid grid-cols-1 gap-5">
                            {[
                                { icon: FiMail, label: "Work Email", value: employee.workEmail },
                                { icon: FiPhone, label: "Mobile Number", value: employee.mobileNumber },
                                { icon: FiMapPin, label: "Work Location", value: employee.workLocation },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all">
                                        <item.icon size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
                                        <p className="text-sm font-bold text-gray-700">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </motion.div>
        </>
    );
}

function HierarchyToolbar({ onReset, selectedDepartment, onClearFilter }) {
    return (
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shadow-sm z-10">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <span>Org Chart</span>
                    <FiChevronRight size={14} />
                    <span className="text-gray-800">Visual Flow</span>
                    {selectedDepartment && (
                        <>
                            <FiChevronRight size={14} />
                            <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md flex items-center gap-2 font-black uppercase">
                                {selectedDepartment}
                                <FiX className="cursor-pointer" onClick={onClearFilter} />
                            </span>
                        </>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={onReset} className="p-2.5 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                    <FiRefreshCw size={18} />
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all active:scale-95">
                    <FiSave size={16} />
                    Export Chart
                </button>
            </div>
        </div>
    );
}