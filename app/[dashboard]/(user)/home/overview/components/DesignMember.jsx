import { useTenant } from '@/hooks/useTenant';
import { getDesignMember } from '@/services/user/overviewService';
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

function Avatar({ name, color, size = 36 }) {
    const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2);
    return (
        <div style={{ width: size, height: size, background: color, flexShrink: 0 }}
            className="rounded-full flex items-center justify-center text-white font-bold text-xs">
            {initials}
        </div>
    );
}


function DesignMember() {


    const [designMember, setDesignMember] = useState([]);
    const tenantId = useTenant();

    useEffect(() => {
        const fetchDesignMember = async () => {
            if (!tenantId) return;
            const res = await getDesignMember(tenantId);
            setDesignMember(res);

            console.log("designMemer", res);
        }
        fetchDesignMember();
    }, [tenantId]);
    return (
        <div>
            <SideCard>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h4 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Design Members</h4>
                        <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: "var(--text-muted)" }}>
                            Your Core Team
                        </p>
                    </div>
                    <button className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg"
                        style={{ background: "var(--surface-muted)", color: "var(--brand-primary)" }}>
                        See All
                    </button>
                </div>

                <div className="space-y-3">
                    {designMember.map((m) => (
                        <div key={m.name} className="flex items-center gap-3 p-2.5 rounded-xl transition-colors hover:bg-opacity-60"
                            style={{ background: "var(--surface-muted)" }}>
                            <div className="relative flex-shrink-0">
                                <Avatar name={m.name} color={m.avatarColor} size={34} />
                                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 ${m.online ? "bg-green-400" : "bg-gray-300"}`}
                                    style={{ borderColor: "var(--surface-muted)" }} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>{m.name}</p>
                                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{m.role}</p>
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: m.online ? "#4ade80" : "var(--border-default)" }} />
                        </div>
                    ))}
                </div>

                <button className="mt-4 w-full text-xs font-semibold py-2.5 rounded-xl border transition-all"
                    style={{ background: "transparent", borderColor: "var(--border-default)", color: "var(--text-secondary)" }}>
                    Request Collaboration
                </button>
            </SideCard>
        </div>
    )
}

export default DesignMember