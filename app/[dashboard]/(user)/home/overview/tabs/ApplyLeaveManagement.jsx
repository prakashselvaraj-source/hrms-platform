"use client"
import { useTenant } from '@/hooks/useTenant';
import { setSelectedLeave } from '@/redux/slices/leaveSlice';
import { getAllLeaveTypesWithUserIdAndYear } from '@/services/user/leaveService';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronRight, PieChart, Sparkles, Calendar } from 'lucide-react';

function ApplyLeaveManagement() {
    const [leaveRows, setLeaveRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const tenantId = useTenant();
    const currentYear = new Date().getFullYear();
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchLeaveRows = async () => {
            if (!tenantId) return;
            try {
                const res = await getAllLeaveTypesWithUserIdAndYear(tenantId, currentYear);
                setLeaveRows(res.summary || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchLeaveRows();
    }, [tenantId]);

    return (
        <div className="flex flex-col bg-white">
            {/* Header */}
            <div className="px-6 py-6 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-3">
                   <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                      <Calendar size={18} />
                   </div>
                   <div>
                      <h3 className="text-[15px] font-bold text-slate-900">Leave Balance</h3>
                      <p className="text-[12px] font-medium text-slate-400">Available quotas for the current year</p>
                   </div>
                </div>
            </div>

            <div className="p-6">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
                            <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Checking Quotas</span>
                        </div>
                    ) : leaveRows.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {leaveRows?.map((row, i) => (
                                <div 
                                    key={i}
                                    className="p-6 rounded-xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all group bg-white"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-2.5 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                            <Calendar size={20} />
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-bold text-slate-900">{row?.accrual?.maxAnnualQuota || 0}</span>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Days</p>
                                        </div>
                                    </div>

                                    <h4 className="text-[15px] font-bold text-slate-900 mb-4">{row.leaveType}</h4>

                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-tight">
                                            <span className="text-slate-400">Consumption</span>
                                            <span className="text-slate-700">{row.count || 0} Used</span>
                                        </div>
                                        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(((row.count || 0) / (row?.accrual?.maxAnnualQuota || 1)) * 100, 100)}%` }}
                                                className="h-full bg-indigo-600 rounded-full"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            dispatch(setSelectedLeave(row));
                                            router.push(`/${tenantId}/leaveManagement`)
                                        }}
                                        className="w-full flex items-center justify-center gap-2 py-2 text-[12px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-lg transition-all"
                                    >
                                        Request Leave
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-200 mb-4 border border-slate-100">
                                <PieChart size={32} />
                            </div>
                            <h4 className="text-[16px] font-bold text-slate-900">No Allocations Found</h4>
                            <p className="text-[13px] font-medium text-slate-400 mt-1 max-w-xs">Your leave types and quotas will be initialized soon by HR.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default ApplyLeaveManagement