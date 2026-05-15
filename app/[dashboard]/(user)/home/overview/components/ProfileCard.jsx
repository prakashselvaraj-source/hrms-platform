import { useTenant } from '@/hooks/useTenant';
import { getUserData } from '@/services/user/overviewService';
import { BadgeCheck, Mail, MapPin, Pencil } from 'lucide-react';
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

/* ── Stat Chip ── */
function StatChip({ value, label, active }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl px-4 py-2.5 text-center"
            style={{
                backgroundColor: active ? "var(--brand-accent)" : "var(--surface-muted)",
                border: `1px solid ${active ? "var(--brand-accent)" : "var(--border-default)"}`,
            }}>
            <span className="text-lg font-black leading-none" style={{ color: active ? "#fff" : "var(--text-primary)" }}>
                {value}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest mt-1"
                style={{ color: active ? "rgba(255,255,255,0.75)" : "var(--text-muted)" }}>
                {label}
            </span>
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
            setProfile(res);

            console.log("fetchUser", res);
        }
        fetchUser();
    }, [tenantId]);

    if (!profile) return null;

    return (
        <div>
            <SideCard>
                {/* Top strip accent */}
                <div className="h-1 -mx-5 -mt-5 mb-5 rounded-t-2xl"
                    style={{ background: "var(--brand-gradient)" }} />

                <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #a78bfa, #ec4899)" }}>
                            {(profile?.firstName?.charAt(0) || '') + (profile?.lastName?.charAt(0) || '')}
                        </div>
                        <div>
                            <h3 className="text-sm font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
                                {profile?.firstName + " " + profile?.lastName}
                            </h3>
                            <p className="text-[11px] font-semibold mt-0.5" style={{ color: "var(--brand-primary)" }}>
                                {profile?.designation}                            </p>
                            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                                {profile?.department}
                            </p>
                        </div>
                    </div>
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                        style={{ background: "var(--surface-muted)", color: "var(--brand-primary)" }}>
                        <Pencil size={12} />
                    </button>
                </div>

                {/* Info pills */}
                <div className="space-y-2 mb-5">
                    {[
                        { icon: <BadgeCheck size={13} />, text: "EMP-1024" },
                        { icon: <MapPin size={13} />, text: profile?.currentCity },
                        { icon: <Mail size={13} />, text: profile?.workEmail },
                    ].map(({ icon, text }) => (
                        <div key={text} className="flex items-center gap-2.5 text-xs rounded-xl px-3 py-2"
                            style={{ background: "var(--surface-muted)", color: "var(--text-secondary)" }}>
                            <span style={{ color: "var(--text-muted)" }}>{icon}</span>
                            <span className="truncate">{text}</span>
                        </div>
                    ))}
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                    <StatChip value="4.2" label="Rating" />
                    <StatChip value="32" label="Projects" active />
                    <StatChip value="6yr" label="Tenure" />
                </div>

                <div className="flex gap-2">
                    <button className="flex-1 text-white text-xs font-bold py-2.5 rounded-xl transition-all"
                        style={{ background: "var(--brand-accent)" }}>
                        Edit Profile
                    </button>
                    <button className="flex-1 text-xs font-bold py-2.5 rounded-xl border transition-all"
                        style={{ borderColor: "var(--brand-accent)", color: "var(--brand-accent)", background: "transparent" }}>
                        View ID Card
                    </button>
                </div>
            </SideCard>
        </div>
    )
}

export default ProfileCard