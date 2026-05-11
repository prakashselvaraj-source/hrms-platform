"use client"
import { useTenant } from '@/hooks/useTenant';
import { setSelectedLeave } from '@/redux/slices/leaveSlice';
import { getAllLeaveTypesWithUserIdAndYear } from '@/services/user/leaveService';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';

function LeafSVG() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="var(--icon-leave-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
    );
}

function ApplyLeaveManagement() {

    const [leaveRows, setLeaveRows] = useState([]);
    const tenantId = useTenant();
    const currentYear = new Date().getFullYear();
    const router = useRouter();

    const dispatch = useDispatch();


    useEffect(() => {
        const fetchLeaveRows = async () => {
            const res = await getAllLeaveTypesWithUserIdAndYear(tenantId, currentYear)
            setLeaveRows(res.summary);
            console.log("fetchLeaveRows", res.summary);
        }

        fetchLeaveRows();
    }, []);

    return (
        <>
            {
                leaveRows && leaveRows.length > 0 ? (
                    <>
                        <div className="hidden sm:grid grid-cols-[1fr_120px_120px_140px] gap-4 px-6 py-3"
                            style={{ borderBottom: "1px solid var(--border-default)", background: "var(--surface-muted)" }}>
                            {["Leave Type", "Available", "Booked", ""].map((h, i) => (
                                <p key={i} className={`text-[10px] font-bold uppercase tracking-widest ${i > 0 ? "text-center" : ""}`}
                                    style={{ color: "var(--text-muted)" }}>
                                    {h}
                                </p>
                            ))}
                        </div>

                        <div>
                            {leaveRows?.map((row, i) => (
                                <div key={i}
                                    className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_120px_120px_140px] gap-4 items-center px-6 py-4 group transition-colors"
                                    style={{
                                        borderBottom: i < leaveRows.length - 1 ? "1px solid var(--border-default)" : "none",
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--surface-muted)"}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>

                                    {/* Leave type */}
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{ background: "var(--icon-leave-bg)" }}>
                                            <LeafSVG />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>
                                                {row.leaveType}
                                            </p>
                                            {/* mobile available label */}
                                            <p className="text-[10px] sm:hidden mt-0.5" style={{ color: "var(--text-muted)" }}>
                                                {row?.accrual?.maxCarryForwardDays} days available
                                            </p>
                                            {/* usage bar */}
                                            <div className="hidden sm:block mt-1.5 w-24 h-1 rounded-full overflow-hidden"
                                                style={{ background: "var(--bar-track)" }}>
                                                <div className="h-full rounded-full"
                                                    style={{ width: `${row.pct}%`, background: "var(--bar-primary)" }} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Available */}
                                    <div className="hidden sm:flex flex-col items-center justify-center">
                                        <p className="text-lg font-black leading-none" style={{ color: "var(--text-primary)" }}>
                                            {row?.accrual?.maxAnnualQuota || 0}
                                        </p>
                                        <p className="text-[10px] font-medium mt-0.5" style={{ color: "var(--text-muted)" }}>days</p>
                                    </div>

                                    {/* Booked */}
                                    <div className="hidden sm:flex flex-col items-center justify-center">
                                        <p className="text-lg font-black leading-none"
                                            style={{ color: row.count !== "-" ? "var(--brand-primary)" : "var(--text-muted)" }}>
                                            {row.count}
                                        </p>
                                        {row.booked !== "-" && (
                                            <p className="text-[10px] font-medium mt-0.5" style={{ color: "var(--text-muted)" }}>booked</p>
                                        )}
                                    </div>

                                    {/* Apply button */}
                                    <div className="flex items-center justify-end sm:justify-center">
                                        <button
                                            className="text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl border transition-all whitespace-nowrap"
                                            style={{ borderColor: "var(--brand-accent)", color: "var(--brand-accent)", background: "transparent" }}
                                            onMouseEnter={e => { e.currentTarget.style.background = "var(--brand-accent)"; e.currentTarget.style.color = "#fff"; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--brand-accent)"; }}
                                            onClick={() => {
                                                dispatch(setSelectedLeave(row));
                                                router.push(`/${tenantId}/leaveManagement`)
                                            }}
                                        >
                                            Apply Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center min-h-[200px]">
                        <p className="text-[13px] font-medium text-gray-400">No Leave Data Available</p>
                    </div>
                )
            }

        </>
    )
}

export default ApplyLeaveManagement