import { motion } from 'framer-motion';
import { useTenant } from '@/hooks/useTenant';
import { getDesignMember } from '@/services/user/overviewService';
import React, { useEffect, useState } from 'react';
import { Users, MoreHorizontal } from 'lucide-react';

function SideCard({ children, title, action }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">{title}</h3>
                {action && action}
            </div>
            <div className="p-2">
                {children}
            </div>
        </div>
    );
}

function DesignMember() {
    const [designMember, setDesignMember] = useState([]);
    const tenantId = useTenant();

    useEffect(() => {
        const fetchDesignMember = async () => {
            if (!tenantId) return;
            try {
                console.log("SetDesignMember");

                const res = await getDesignMember(tenantId);
                setDesignMember(res || []);
                console.log("SetDesignMember", res);

            } catch (error) {
                console.error(error);
            }
        }
        fetchDesignMember();
    }, [tenantId]);

    return (
        <SideCard
            title="Design Team"
            action={<button className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700">View All</button>}
        >
            <div className="flex flex-col">
                {designMember.map((m, idx) => (
                    <div
                        key={m.employeeId || idx}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-all group"
                    >
                        <div className="relative">
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs uppercase">
                                {m.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${m.online ? "bg-emerald-500" : "bg-slate-300"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-slate-900 truncate">{m.name}</p>
                            <p className="text-[11px] font-medium text-slate-400">{m.role}</p>
                        </div>
                        <button className="p-1.5 rounded-md text-slate-300 hover:text-slate-600 hover:bg-slate-200 transition-all">
                            <MoreHorizontal size={14} />
                        </button>
                    </div>
                ))}
            </div>
            <button className="w-full mt-2 py-2 text-[12px] font-semibold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all border border-transparent hover:border-indigo-100">
                Collaborate with Team
            </button>
        </SideCard>
    );
}

export default DesignMember;