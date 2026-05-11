import { getReportingManager } from '@/services/user/overviewService';
import { MessageSquare } from 'lucide-react';
import React, { useEffect, useState } from 'react'

function SideCard({ children }) {
    return (
        <div className="rounded-2xl p-5 flex-shrink-0"
            style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-default)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
            }}>
            {children}
        </div>
    );
}

function ReportingManager() {

    const [reportingManager, setReportingManager] = useState([]);

    useEffect(() => {
        const fetchReportingManager = async () => {
            const res = await getReportingManager(tenantId);
            setReportingManager(res);

            console.log("reportingManager", reportingManager);
        }

        fetchReportingManager();
    }, []);

    return (
        <div>
            <SideCard>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h4 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Reporting Manager</h4>
                        <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: "var(--text-muted)" }}>
                            Direct Supervisor
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3.5 rounded-2xl p-4"
                    style={{ background: "var(--surface-muted)", border: "1px solid var(--border-subtle)" }}>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #fbbf24, #f97316)" }}>
                        MT
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Marcus Thorne</p>
                        <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "var(--brand-primary)" }}>
                            Director of Design
                        </p>
                    </div>
                    <button className="w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
                        style={{ background: "var(--surface-card)", color: "var(--brand-primary)", border: "1px solid var(--border-default)" }}>
                        <MessageSquare size={14} />
                    </button>
                </div>
            </SideCard>
        </div>
    )
}

export default ReportingManager