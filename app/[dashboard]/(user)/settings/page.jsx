"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useTenant } from "@/hooks/useTenant";
import { motion, AnimatePresence } from "framer-motion";
import { 
    User, 
    Bell, 
    Shield, 
    Globe, 
    Palette, 
    Mail, 
    Lock, 
    Eye, 
    Monitor, 
    Languages, 
    Layout, 
    Code, 
    Save, 
    CheckCircle,
    ChevronRight,
    HelpCircle,
    Smartphone,
    Clock
} from "lucide-react";

/* ── Components ── */

function SettingSection({ id, activeId, icon: Icon, label, onClick }) {
    const isActive = id === activeId;
    return (
        <button
            onClick={() => onClick(id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-[13px] font-semibold transition-all duration-200 border-0 cursor-pointer text-left ${
                isActive 
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 bg-transparent"
            }`}
        >
            <Icon size={16} />
            {label}
        </button>
    );
}

function Toggle({ enabled, setEnabled }) {
    return (
        <button 
            onClick={() => setEnabled(!enabled)}
            className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-all duration-300 cursor-pointer border-0 flex-shrink-0 ${
                enabled ? "bg-indigo-600" : "bg-slate-200"
            }`}
        >
            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${enabled ? "translate-x-5" : "translate-x-0"}`} />
        </button>
    );
}

function FieldGroup({ label, children }) {
    return (
        <div className="space-y-4 pb-8 border-b border-slate-100 last:border-0 last:pb-0">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-indigo-400">{label}</h3>
            <div className="space-y-3">{children}</div>
        </div>
    );
}

function SettingRow({ icon: Icon, label, description, children }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
            <div className="flex items-start gap-3">
                {Icon && (
                    <div className="mt-0.5 p-1.5 rounded bg-slate-50 text-slate-400">
                        <Icon size={14} />
                    </div>
                )}
                <div>
                    <p className="text-[13px] font-bold text-slate-800 leading-tight">{label}</p>
                    {description && <p className="text-[11px] text-slate-400 mt-0.5">{description}</p>}
                </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">{children}</div>
        </div>
    );
}

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const tenant = useTenant();
    const [activeSection, setActiveSection] = useState("profile");
    const [saved, setSaved] = useState(false);

    /* States */
    const [emailNotif, setEmailNotif] = useState({ announcements: true, payroll: true, leave: true });
    const [twoFactor, setTwoFactor] = useState(false);
    const [displayMode, setDisplayMode] = useState("comfortable");
    const [profileVisibility, setProfileVisibility] = useState("company");
    const [language, setLanguage] = useState("en-US");

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const sections = [
        { id: "profile", label: "General Profile", icon: User },
        { id: "security", label: "Security & Login", icon: Lock },
        { id: "appearance", label: "Display & Theme", icon: Palette },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "regional", label: "Regional & Language", icon: Globe },
        { id: "integrations", label: "Integrations & API", icon: Code },
        { id: "accessibility", label: "Accessibility", icon: Eye },
        { id: "data", label: "Account & Data", icon: Smartphone },
    ];

    const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });
    const containerVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };
    const [accessibility, setAccessibility] = useState({ highContrast: false, fontScale: "100%" });
    const [sessionTimeout, setSessionTimeout] = useState("30");
    const [notifSounds, setNotifSounds] = useState(true);

    return (
        <div className="min-h-screen bg-white text-slate-900 pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
                
                {/* ── Header ── */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-indigo-100">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">System Preferences</h1>
                        <p className="text-[13px] text-slate-500 mt-0.5">Manage your personal settings, security, and application behavior.</p>
                    </div>
                    <button 
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-md text-[13px] font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 border-0 cursor-pointer"
                    >
                        {saved ? <CheckCircle size={16} /> : <Save size={16} />}
                        {saved ? "Changes Saved" : "Save Preferences"}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* ── Sidebar Navigation ── */}
                    <div className="lg:col-span-3 space-y-1">
                        {sections.map(s => (
                            <SettingSection 
                                key={s.id} 
                                id={s.id} 
                                activeId={activeSection} 
                                icon={s.icon} 
                                label={s.label} 
                                onClick={setActiveSection} 
                            />
                        ))}
                    </div>

                    {/* ── Content Area ── */}
                    <div className="lg:col-span-9 bg-slate-50/50 border border-slate-200 rounded-md p-8 min-h-[500px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSection}
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="space-y-10"
                            >
                                {activeSection === "profile" && (
                                    <>
                                        <FieldGroup label="Public Identity">
                                            <SettingRow label="Preferred Name" description="How your name appears to colleagues.">
                                                <input type="text" placeholder="User Name" className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs font-bold outline-none focus:border-indigo-500 w-full sm:w-64" />
                                            </SettingRow>
                                            <SettingRow label="Professional Title" description="Your current designation in the organization.">
                                                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">Senior Employee</span>
                                            </SettingRow>
                                            <SettingRow label="Visibility Level" description="Who can see your detailed profile.">
                                                <select 
                                                    value={profileVisibility} 
                                                    onChange={(e) => setProfileVisibility(e.target.value)}
                                                    className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs font-bold outline-none cursor-pointer"
                                                >
                                                    <option value="public">Everyone</option>
                                                    <option value="company">Company Only</option>
                                                    <option value="private">Private</option>
                                                </select>
                                            </SettingRow>
                                        </FieldGroup>
                                        <FieldGroup label="Emergency Ledger">
                                            <SettingRow label="Emergency Contact" description="Primary person to contact in case of critical events.">
                                                <input type="text" placeholder="Contact Name" className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs font-bold outline-none w-full sm:w-64" />
                                            </SettingRow>
                                            <SettingRow label="Relationship" description="Family or legal connection to contact.">
                                                <input type="text" placeholder="e.g. Spouse, Parent" className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs font-bold outline-none w-full sm:w-64" />
                                            </SettingRow>
                                        </FieldGroup>
                                    </>
                                )}

                                {activeSection === "security" && (
                                    <>
                                        <FieldGroup label="Credential Management">
                                            <div className="space-y-4 max-w-md">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold uppercase text-slate-400">Current Password</label>
                                                    <input type="password" placeholder="••••••••" className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-xs font-bold outline-none focus:border-indigo-500" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold uppercase text-slate-400">New Password</label>
                                                    <input type="password" placeholder="••••••••" className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-xs font-bold outline-none focus:border-indigo-500" />
                                                </div>
                                                <button className="bg-slate-900 text-white px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest border-0 cursor-pointer hover:bg-slate-800 transition-colors">Update Credentials</button>
                                            </div>
                                        </FieldGroup>
                                        <FieldGroup label="Account Hardening">
                                            <SettingRow icon={Lock} label="Two-Factor Authentication" description="Require a secure code in addition to your password.">
                                                <Toggle enabled={twoFactor} setEnabled={setTwoFactor} />
                                            </SettingRow>
                                            <SettingRow icon={Smartphone} label="Trusted Devices" description="Manage devices authorized to access your account.">
                                                <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline bg-transparent border-0 cursor-pointer">View List (3 Active)</button>
                                            </SettingRow>
                                            <SettingRow icon={Clock} label="Session Timeout" description="Automatically log out after a period of inactivity.">
                                                <select 
                                                    value={sessionTimeout} 
                                                    onChange={(e) => setSessionTimeout(e.target.value)}
                                                    className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs font-bold outline-none cursor-pointer"
                                                >
                                                    <option value="15">15 Minutes</option>
                                                    <option value="30">30 Minutes</option>
                                                    <option value="60">1 Hour</option>
                                                    <option value="0">Never</option>
                                                </select>
                                            </SettingRow>
                                        </FieldGroup>
                                    </>
                                )}

                                {activeSection === "appearance" && (
                                    <>
                                        <FieldGroup label="Theme Engine">
                                            <div className="grid grid-cols-3 gap-4">
                                                {["light", "dark", "system"].map(t => (
                                                    <button 
                                                        key={t}
                                                        onClick={() => setTheme(t)}
                                                        className={`p-4 rounded-md border flex flex-col items-center gap-3 transition-all cursor-pointer ${
                                                            theme === t ? "border-indigo-600 bg-indigo-50/50 text-indigo-600 shadow-sm" : "border-slate-200 bg-white text-slate-400 hover:border-slate-300"
                                                        }`}
                                                    >
                                                        {t === "light" && <Monitor size={20} />}
                                                        {t === "dark" && <Smartphone size={20} />}
                                                        {t === "system" && <Layout size={20} />}
                                                        <span className="text-[11px] font-bold uppercase tracking-widest">{t}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </FieldGroup>
                                        <FieldGroup label="Interface Layout">
                                            <SettingRow label="Display Density" description="Adjust the amount of information visible on screen.">
                                                <div className="flex bg-white border border-slate-200 p-0.5 rounded-md">
                                                    {["comfortable", "compact"].map(m => (
                                                        <button 
                                                            key={m}
                                                            onClick={() => setDisplayMode(m)}
                                                            className={`px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-all border-0 cursor-pointer ${
                                                                displayMode === m ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 bg-transparent hover:text-slate-600"
                                                            }`}
                                                        >
                                                            {m}
                                                        </button>
                                                    ))}
                                                </div>
                                            </SettingRow>
                                        </FieldGroup>
                                    </>
                                )}

                                {activeSection === "notifications" && (
                                    <>
                                        <FieldGroup label="Alert Channels">
                                            <SettingRow icon={Mail} label="Email Alerts" description="Company announcements and payroll reports.">
                                                <Toggle enabled={emailNotif.announcements} setEnabled={(v) => setEmailNotif(p => ({...p, announcements: v}))} />
                                            </SettingRow>
                                            <SettingRow icon={Bell} label="Push Notifications" description="Real-time browser and mobile alerts.">
                                                <Toggle enabled={true} setEnabled={() => {}} />
                                            </SettingRow>
                                        </FieldGroup>
                                        <FieldGroup label="System Feedback">
                                            <SettingRow label="Notification Sounds" description="Play a tone when a new alert arrives.">
                                                <Toggle enabled={notifSounds} setEnabled={setNotifSounds} />
                                            </SettingRow>
                                        </FieldGroup>
                                    </>
                                )}

                                {activeSection === "accessibility" && (
                                    <FieldGroup label="Visual Support">
                                        <SettingRow icon={Eye} label="High Contrast Mode" description="Increase contrast for better legibility.">
                                            <Toggle enabled={accessibility.highContrast} setEnabled={(v) => setAccessibility(p => ({...p, highContrast: v}))} />
                                        </SettingRow>
                                        <SettingRow icon={Layout} label="Text Scaling" description="Adjust the base font size of the application.">
                                            <select 
                                                value={accessibility.fontScale} 
                                                onChange={(e) => setAccessibility(p => ({...p, fontScale: e.target.value}))}
                                                className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs font-bold outline-none cursor-pointer"
                                            >
                                                <option value="90%">Small (90%)</option>
                                                <option value="100%">Standard (100%)</option>
                                                <option value="110%">Large (110%)</option>
                                                <option value="125%">XL (125%)</option>
                                            </select>
                                        </SettingRow>
                                    </FieldGroup>
                                )}

                                {activeSection === "data" && (
                                    <FieldGroup label="Portability & Ownership">
                                        <SettingRow icon={Save} label="Export Personal Data" description="Download a copy of your records in JSON format.">
                                            <button className="text-[10px] font-bold bg-white border border-slate-200 px-4 py-2 rounded-md uppercase tracking-wider cursor-pointer hover:bg-slate-50">Download Archive</button>
                                        </SettingRow>
                                        <div className="p-4 rounded-md bg-rose-50 border border-rose-100 mt-12">
                                            <h4 className="text-[11px] font-bold text-rose-600 uppercase tracking-widest flex items-center gap-2">
                                                <Shield size={12} /> Danger Zone
                                            </h4>
                                            <p className="text-[11px] text-rose-400 mt-1">Deactivating your account is a permanent action. Please ensure all data is backed up.</p>
                                            <button className="mt-4 bg-rose-600 text-white px-5 py-2.5 rounded-md text-[10px] font-bold uppercase tracking-wider border-0 cursor-pointer hover:bg-rose-700 shadow-md shadow-rose-100">Permanent Deactivation</button>
                                        </div>
                                    </FieldGroup>
                                )}

                                {activeSection === "regional" && (
                                    <FieldGroup label="Localization">
                                        <SettingRow icon={Languages} label="Preferred Language" description="The language used throughout the interface.">
                                            <select 
                                                value={language} 
                                                onChange={(e) => setLanguage(e.target.value)}
                                                className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs font-bold outline-none cursor-pointer"
                                            >
                                                <option value="en-US">English (US)</option>
                                                <option value="en-GB">English (UK)</option>
                                                <option value="fr-FR">Français</option>
                                                <option value="hi-IN">Hindi (India)</option>
                                            </select>
                                        </SettingRow>
                                        <SettingRow icon={Globe} label="Timezone" description="Automatically adjust timestamps to your local time.">
                                            <span className="text-xs font-bold text-slate-500 italic">Asia/Kolkata (IST)</span>
                                        </SettingRow>
                                    </FieldGroup>
                                )}

                                {activeSection === "integrations" && (
                                    <FieldGroup label="Developer Options">
                                        <SettingRow icon={Code} label="API Token Generation" description="Create personal access tokens for system integration.">
                                            <button className="text-[10px] font-bold bg-slate-900 text-white px-4 py-2 rounded-md uppercase tracking-wider border-0 cursor-pointer hover:bg-slate-800 transition-colors">Generate Token</button>
                                        </SettingRow>
                                        <div className="p-5 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-between">
                                            <div>
                                                <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest">Documentation Hub</p>
                                                <p className="text-[11px] text-indigo-400 mt-0.5">Explore our developer documentation to build powerful integrations.</p>
                                            </div>
                                            <a href="#" className="p-2 rounded-full bg-white text-indigo-600 shadow-sm hover:scale-110 transition-transform">
                                                <ChevronRight size={18} />
                                            </a>
                                        </div>
                                    </FieldGroup>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
