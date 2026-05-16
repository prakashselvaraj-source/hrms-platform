import { useTenant } from '@/hooks/useTenant';
import { getUserData } from '@/services/user/overviewService';
import { BadgeCheck, Mail, MapPin, Pencil, ExternalLink, ChevronRight, Phone } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function SideCard({ children, title }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {title && (
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">{title}</h3>
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}

function ProfileCard() {
    const [profile, setProfile] = useState(null);
    const tenantId = useTenant();

    useEffect(() => {
        const fetchUser = async () => {
            if (!tenantId) return;
            const res = await getUserData(tenantId);

            console.log("fetchUser", res);
            setProfile(res);
        }
        fetchUser();
    }, [tenantId]);

    if (!profile) return null;

    return (
        <SideCard>
            <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                    <div className="w-20 h-20 rounded-full border-2 border-indigo-50 p-1 bg-white">
                        <div className="w-full h-full rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-sm">
                            {
                                profile?.photoUrl ? (
                                    <div className="w-full h-full rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-sm overflow-hidden">
                                        <img src={profile?.photoUrl} alt="" className='w-full h-full object-cover' />
                                    </div>
                                ) : (
                                    (profile?.firstName?.charAt(0) || '') + (profile?.lastName?.charAt(0) || '')
                                )
                            }

                        </div>
                    </div>
                    <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-all">
                        <Pencil size={12} />
                    </button>
                </div>

                <h2 className="text-xl font-bold text-slate-900">{profile?.firstName + " " + profile?.lastName}</h2>
                <p className="text-[13px] font-semibold text-indigo-600 mt-0.5">{profile?.designation}</p>
                <div className="flex items-center gap-1.5 mt-2 text-slate-400">
                    <MapPin size={12} />
                    <span className="text-[12px] font-medium">{profile?.currentCity || "San Francisco, CA"}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
                    <span className="block text-[16px] font-bold text-slate-900">4.8</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Performance</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
                    <span className="block text-[16px] font-bold text-slate-900">32</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Project Days</span>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                        <BadgeCheck size={16} />
                    </div>
                    <div className="flex-1">
                        <p className="text-[11px] font-bold text-slate-400 uppercase">Employee ID</p>
                        <p className="text-[13px] font-semibold text-slate-700">EMP-1024</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                        <Mail size={16} />
                    </div>
                    <div className="flex-1">
                        <p className="text-[11px] font-bold text-slate-400 uppercase">Email Address</p>
                        <p className="text-[13px] font-semibold text-slate-700 truncate">{profile?.workEmail}</p>
                    </div>
                </div>
            </div>

            <button className="w-full mt-8 py-2.5 rounded-lg bg-indigo-600 text-white text-[13px] font-semibold hover:bg-indigo-700 transition-all shadow-sm">
                View Full Profile
            </button>
        </SideCard>
    );
}

export default ProfileCard;