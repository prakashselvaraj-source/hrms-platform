"use client";
import { useState, useEffect, useRef } from "react";

// ─── Icons (inline SVG to avoid dependencies) ────────────────────────────────

const Icons = {
  Logo: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="url(#logoGrad)" />
      <circle cx="16" cy="16" r="6" stroke="white" strokeWidth="2" fill="none" />
      <circle cx="16" cy="16" r="2" fill="white" />
      <path d="M16 4v4M16 24v4M4 16h4M24 16h4" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  ),
  Users: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  Clock: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
    </svg>
  ),
  Calendar: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  DollarSign: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  ),
  BarChart: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  Shield: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  ArrowRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Zap: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Globe: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  ),
  Lock: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
  Rocket: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
    </svg>
  ),
  Menu: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  X: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Star: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const features = [
  { icon: "Users",     title: "Employee Management",  desc: "Centralize employee profiles, documents, onboarding, and org charts in one elegant workspace.",    color: "from-violet-500 to-indigo-500" },
  { icon: "Clock",     title: "Attendance Tracking",   desc: "Real-time attendance with biometric integration, geo-fencing, and shift scheduling.",              color: "from-cyan-500 to-blue-500" },
  { icon: "Calendar",  title: "Leave Management",      desc: "Automated leave workflows, accrual policies, carry-forward rules, and team calendars.",            color: "from-emerald-500 to-teal-500" },
  { icon: "DollarSign",title: "Payroll System",        desc: "Error-free payroll processing with tax calculations, payslips, and compliance reports.",           color: "from-amber-500 to-orange-500" },
  { icon: "BarChart",  title: "Reports & Analytics",   desc: "Beautiful dashboards with workforce insights, trends, and exportable reports at a glance.",        color: "from-pink-500 to-rose-500" },
  { icon: "Shield",    title: "Role-Based Access",     desc: "Granular permissions for admins, managers, and employees — zero unauthorized access.",            color: "from-purple-500 to-fuchsia-500" },
];

const steps = [
  { n: "01", title: "Create Your Company",  desc: "Set up your isolated workspace in under 2 minutes. Configure branding, timezone, and policies." },
  { n: "02", title: "Add Employees",        desc: "Bulk import or manually add employees. Send onboarding invites with a single click." },
  { n: "03", title: "Manage HR Operations", desc: "Run payroll, approve leaves, track attendance, and generate reports — all from one place." },
];

const benefits = [
  { emoji: "⚡", title: "Save Time",           desc: "Automate 80% of repetitive HR tasks so your team can focus on what matters." },
  { emoji: "🎯", title: "Reduce Errors",       desc: "Eliminate manual data entry mistakes with smart validations and approval workflows." },
  { emoji: "📈", title: "Boost Productivity",  desc: "Streamlined processes mean happier teams and measurable output improvements." },
  { emoji: "🏛️",  title: "Centralized System", desc: "One source of truth for all HR data — no more spreadsheets or scattered tools." },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Perfect for small teams just getting started.",
    features: ["Up to 10 employees", "Basic attendance tracking", "Leave management", "Email support"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    desc: "Everything you need for a growing business.",
    features: ["Unlimited employees", "Advanced payroll", "Analytics & reports", "Priority support", "Custom roles", "API access"],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    desc: "Tailored solutions for large organizations.",
    features: ["Everything in Pro", "Dedicated account manager", "Custom integrations", "SLA guarantee", "SSO & SAML", "On-premise option"],
    cta: "Contact Sales",
    highlight: false,
  },
];

const testimonials = [
  { name: "Sarah Chen",    role: "Head of HR, TechNova",      stars: 5, text: "WorkSphere transformed how we manage 200+ employees. The automation alone saves us 15 hours a week." },
  { name: "Marcus Reid",   role: "COO, Foundry Labs",          stars: 5, text: "The cleanest HR tool I've ever used. Setup took minutes and the team adopted it instantly." },
  { name: "Priya Nair",    role: "People Ops, ScaleUp Inc",    stars: 5, text: "Multi-tenant setup is a game changer. Every department feels like it has its own private workspace." },
];

// ─── Reusable Components ──────────────────────────────────────────────────────

function GlowOrb({ className }) {
  return <div className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`} />;
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase
                     text-cyan-400 border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
      {children}
    </span>
  );
}

function GradientButton({ children, variant = "primary", className = "", ...props }) {
  if (variant === "primary") {
    return (
      <button
        className={`relative group overflow-hidden px-6 py-3 rounded-xl font-semibold text-sm text-white
                    bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400
                    shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40
                    transition-all duration-300 hover:-translate-y-0.5 ${className}`}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    );
  }
  return (
    <button
      className={`px-6 py-3 rounded-xl font-semibold text-sm text-gray-300
                  border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white
                  backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 ${className}`}
      {...props}
    >
      <span className="flex items-center gap-2">{children}</span>
    </button>
  );
}

function FeatureCard({ icon, title, desc, color }) {
  const Icon = Icons[icon];
  return (
    <div className="group relative p-6 rounded-2xl border border-white/8 bg-white/3
                    hover:border-white/20 hover:bg-white/6 transition-all duration-300
                    hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 cursor-default">
      <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl
                       bg-gradient-to-br ${color} mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <span className="text-white"><Icon /></span>
      </div>
      <h3 className="text-base font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function StepCard({ n, title, desc, isLast }) {
  return (
    <div className="flex gap-5 items-start">
      <div className="flex flex-col items-center shrink-0">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500
                        flex items-center justify-center text-white font-black text-sm shadow-lg shadow-violet-500/30">
          {n}
        </div>
        {!isLast && <div className="w-px flex-1 mt-3 bg-gradient-to-b from-violet-500/40 to-transparent h-12" />}
      </div>
      <div className="pt-2 pb-8">
        <h3 className="text-lg font-bold text-white mb-1.5">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed max-w-xs">{desc}</p>
      </div>
    </div>
  );
}

function PricingCard({ plan }) {
  return (
    <div className={`relative flex flex-col p-7 rounded-2xl border transition-all duration-300
                     ${plan.highlight
                       ? "border-violet-500/60 bg-gradient-to-b from-violet-900/40 to-cyan-900/20 shadow-2xl shadow-violet-500/20 scale-105"
                       : "border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/5"}`}>
      {plan.highlight && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}
      <div className="mb-5">
        <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
        <div className="flex items-end gap-1 mb-2">
          <span className="text-4xl font-black text-white">{plan.price}</span>
          <span className="text-gray-400 text-sm mb-1.5">/ {plan.period}</span>
        </div>
        <p className="text-xs text-gray-400">{plan.desc}</p>
      </div>
      <ul className="space-y-2.5 mb-7 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-sm text-gray-300">
            <span className="text-cyan-400 shrink-0"><Icons.Check /></span>
            {f}
          </li>
        ))}
      </ul>
      <GradientButton variant={plan.highlight ? "primary" : "secondary"} className="w-full justify-center">
        {plan.cta}
      </GradientButton>
    </div>
  );
}

// ─── Mock Dashboard UI ────────────────────────────────────────────────────────

function DashboardMock() {
  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Glow behind */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-cyan-500/20 blur-3xl rounded-3xl" />

      <div className="relative rounded-2xl border border-white/10 bg-gray-900/80 backdrop-blur-xl overflow-hidden shadow-2xl">
        {/* Top bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8 bg-white/3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-amber-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <div className="flex-1 mx-4">
            <div className="h-5 bg-white/5 rounded-md w-48 mx-auto flex items-center justify-center">
              <span className="text-[10px] text-gray-500">app.worksphere.io/dashboard</span>
            </div>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="flex h-64">
          {/* Sidebar mini */}
          <div className="w-12 border-r border-white/8 bg-white/2 flex flex-col items-center py-4 gap-3">
            {["violet", "cyan", "emerald", "amber", "pink"].map((c, i) => (
              <div key={i} className={`w-7 h-7 rounded-lg bg-${c}-500/20 border border-${c}-500/30`} />
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 p-4 space-y-3">
            {/* Stat row */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Employees", val: "248", color: "from-violet-500/20 to-indigo-500/20", border: "border-violet-500/30" },
                { label: "On Leave",  val: "12",  color: "from-amber-500/20 to-orange-500/20",  border: "border-amber-500/30" },
                { label: "Present",   val: "231", color: "from-emerald-500/20 to-teal-500/20",  border: "border-emerald-500/30" },
                { label: "Payroll",   val: "$84k", color: "from-cyan-500/20 to-blue-500/20",    border: "border-cyan-500/30" },
              ].map((s) => (
                <div key={s.label} className={`rounded-xl p-2.5 bg-gradient-to-br ${s.color} border ${s.border}`}>
                  <p className="text-[9px] text-gray-400 uppercase tracking-wide">{s.label}</p>
                  <p className="text-base font-bold text-white mt-0.5">{s.val}</p>
                </div>
              ))}
            </div>

            {/* Chart placeholder */}
            <div className="rounded-xl border border-white/8 bg-white/3 p-3">
              <div className="flex items-end gap-1 h-14">
                {[35, 55, 45, 70, 60, 80, 65, 90, 75, 85, 70, 95].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className="flex-1 rounded-sm bg-gradient-to-t from-violet-500/60 to-cyan-500/40"
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1">
                {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => (
                  <span key={m} className="text-[7px] text-gray-600">{m}</span>
                ))}
              </div>
            </div>

            {/* Table mini */}
            <div className="rounded-xl border border-white/8 bg-white/2 overflow-hidden">
              {[
                { name: "Alex Morgan",  dept: "Engineering", status: "Present", dot: "bg-emerald-400" },
                { name: "Jamie Lee",    dept: "Design",       status: "On Leave", dot: "bg-amber-400" },
              ].map((e) => (
                <div key={e.name} className="flex items-center gap-2 px-3 py-1.5 border-b border-white/5 last:border-0">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-400 to-cyan-400" />
                  <span className="text-[10px] text-white font-medium flex-1">{e.name}</span>
                  <span className="text-[9px] text-gray-500">{e.dept}</span>
                  <span className={`flex items-center gap-1 text-[9px] ${e.dot === "bg-emerald-400" ? "text-emerald-400" : "text-amber-400"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${e.dot}`} />
                    {e.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300
                     ${scrolled ? "bg-gray-950/80 backdrop-blur-xl border-b border-white/8 shadow-xl shadow-black/20" : ""}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <Icons.Logo />
          <span className="text-lg font-black text-white tracking-tight">
            Work<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Sphere</span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {["Features", "Pricing", "About"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`}
               className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200">
              {l}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <a href="/login"
             className="text-sm font-semibold text-gray-300 hover:text-white px-4 py-2 rounded-lg hover:bg-white/8 transition-all">
            Login
          </a>
          <GradientButton>
            Get Started <Icons.ArrowRight />
          </GradientButton>
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden text-gray-300 hover:text-white" onClick={() => setMobileOpen((p) => !p)}>
          {mobileOpen ? <Icons.X /> : <Icons.Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-gray-950/95 backdrop-blur-xl border-t border-white/8 px-6 py-5 space-y-4">
          {["Features", "Pricing", "About"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`}
               className="block text-sm font-medium text-gray-300 hover:text-white"
               onClick={() => setMobileOpen(false)}>
              {l}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            <a href="/login" className="flex-1 text-center text-sm font-semibold text-gray-300 border border-white/10 rounded-xl py-2.5 hover:bg-white/5">Login</a>
            <a href="/signup" className="flex-1 text-center text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-cyan-500 rounded-xl py-2.5">Get Started</a>
          </div>
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-4 overflow-hidden">
      {/* Background orbs */}
      <GlowOrb className="w-[600px] h-[600px] bg-violet-600 -top-40 -left-32" />
      <GlowOrb className="w-[500px] h-[500px] bg-cyan-500 -bottom-20 -right-20" />
      <GlowOrb className="w-[300px] h-[300px] bg-indigo-500 top-1/3 left-1/3" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
           style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <Badge>Now in Public Beta — Join 500+ Companies</Badge>

        <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight">
          All-in-One HR<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
            Management Platform
          </span><br />
          for Modern Teams
        </h1>

        <p className="mt-6 text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
          Streamline employee management, payroll, attendance, and leave — all in a single elegant workspace.
          Built for teams that move fast and scale further.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <GradientButton className="text-base px-8 py-4">
            <Icons.Zap /> Get Started Free
          </GradientButton>
          <GradientButton variant="secondary" className="text-base px-8 py-4">
            Book a Demo <Icons.ArrowRight />
          </GradientButton>
        </div>

        <p className="mt-5 text-xs text-gray-500">No credit card required · Free for teams up to 10</p>

        {/* Social proof */}
        <div className="mt-8 flex items-center justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-amber-400"><Icons.Star /></span>
          ))}
          <span className="ml-2 text-sm text-gray-400">Rated <strong className="text-white">4.9/5</strong> by 200+ HR teams</span>
        </div>

        {/* Dashboard preview */}
        <div className="mt-16">
          <DashboardMock />
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 px-4 overflow-hidden">
      <GlowOrb className="w-96 h-96 bg-violet-600 -left-20 top-20" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge>Features</Badge>
          <h2 className="mt-4 text-4xl sm:text-5xl font-black text-white tracking-tight">
            Everything your HR team needs
          </h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            A complete suite of tools designed to replace spreadsheets, disconnected apps, and manual processes.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => <FeatureCard key={f.title} {...f} />)}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <GlowOrb className="w-96 h-96 bg-cyan-500 -right-20 top-0" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Badge>How It Works</Badge>
            <h2 className="mt-4 text-4xl sm:text-5xl font-black text-white tracking-tight">
              Up and running<br />in minutes
            </h2>
            <p className="mt-4 text-gray-400 leading-relaxed">
              WorkSphere is designed for zero-friction setup. No IT team required. Just sign up, configure, and go.
            </p>
            <div className="mt-10 space-y-0">
              {steps.map((s, i) => <StepCard key={s.n} {...s} isLast={i === steps.length - 1} />)}
            </div>
          </div>

          {/* Right side visual */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-cyan-500/10 rounded-3xl blur-2xl" />
            <div className="relative rounded-3xl border border-white/10 bg-gray-900/60 backdrop-blur-xl p-8 space-y-4">
              {[
                { icon: "🏢", title: "TechNova Inc",  sub: "250 employees · New York",    badge: "Active",  badgeColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
                { icon: "🚀", title: "ScaleUp Labs",  sub: "48 employees · San Francisco", badge: "Active",  badgeColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
                { icon: "🌿", title: "GreenBuild Co", sub: "120 employees · Austin",       badge: "Trial",   badgeColor: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
              ].map((c) => (
                <div key={c.title} className="flex items-center gap-4 p-4 rounded-2xl border border-white/8 bg-white/3 hover:bg-white/5 transition-colors">
                  <span className="text-2xl">{c.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{c.title}</p>
                    <p className="text-xs text-gray-500">{c.sub}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${c.badgeColor}`}>
                    {c.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MultiTenantSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-900/30 via-gray-900 to-cyan-900/20 p-10 sm:p-16 overflow-hidden relative">
          <GlowOrb className="w-80 h-80 bg-violet-500 -right-10 -top-10" />
          <GlowOrb className="w-60 h-60 bg-cyan-500 -left-10 bottom-0" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge>Multi-Tenant SaaS</Badge>
              <h2 className="mt-4 text-4xl font-black text-white tracking-tight">
                Each company gets<br />its own secure world
              </h2>
              <p className="mt-5 text-gray-300 leading-relaxed">
                WorkSphere is built on a multi-tenant architecture — every organization runs in a fully isolated workspace.
                Your data never touches another company's environment.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  "Complete data isolation per organization",
                  "Custom roles, policies & configurations",
                  "SOC 2 compliant infrastructure",
                  "99.9% uptime SLA",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-3 text-sm text-gray-300">
                    <span className="text-cyan-400"><Icons.Check /></span>
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Visual grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Icons.Globe />, title: "Isolated Workspaces",  color: "from-violet-500/20 to-indigo-500/20", border: "border-violet-500/30" },
                { icon: <Icons.Lock />,  title: "End-to-End Encrypted", color: "from-cyan-500/20 to-blue-500/20",    border: "border-cyan-500/30" },
                { icon: <Icons.Shield />,title: "Access Control",       color: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/30" },
                { icon: <Icons.Rocket />,title: "Auto-Scaling",         color: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/30" },
              ].map((item) => (
                <div key={item.title} className={`p-5 rounded-2xl border bg-gradient-to-br ${item.color} ${item.border} text-center`}>
                  <div className="flex justify-center text-gray-300 mb-2">{item.icon}</div>
                  <p className="text-xs font-semibold text-white">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RoleBasedSection() {
  const [tab, setTab] = useState("admin");

  const adminItems = [
    "Full payroll management & tax reports",
    "Approve/reject leave & attendance",
    "Employee lifecycle management",
    "Analytics & workforce insights",
    "Role & permission configuration",
  ];
  const empItems = [
    "View own payslips & salary history",
    "Apply for leave & track balance",
    "Clock in/out with geo-location",
    "Access company documents",
    "Update personal profile",
  ];

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <GlowOrb className="w-96 h-96 bg-fuchsia-500 left-1/3 top-0" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge>Role-Based Access</Badge>
          <h2 className="mt-4 text-4xl sm:text-5xl font-black text-white tracking-tight">
            The right tools for every role
          </h2>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-10">
          <div className="flex p-1 rounded-xl border border-white/10 bg-white/3 backdrop-blur-sm gap-1">
            {["admin", "employee"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 capitalize
                            ${tab === t
                              ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg"
                              : "text-gray-400 hover:text-white"}`}
              >
                {t === "admin" ? "Admin Dashboard" : "Employee Dashboard"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* List */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6 capitalize">
              {tab === "admin" ? "Admin has full control" : "Employees stay informed"}
            </h3>
            <ul className="space-y-3">
              {(tab === "admin" ? adminItems : empItems).map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-cyan-400 mt-0.5 shrink-0"><Icons.Check /></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Mock panel */}
          <div className="rounded-2xl border border-white/10 bg-gray-900/60 backdrop-blur-xl p-6 space-y-3">
            <div className={`h-2 w-24 rounded-full bg-gradient-to-r ${tab === "admin" ? "from-violet-500 to-fuchsia-500" : "from-cyan-500 to-emerald-500"}`} />
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
              {tab === "admin" ? "Admin Panel" : "Employee Portal"}
            </p>
            {(tab === "admin"
              ? [
                  { label: "Total Employees", val: "248", sub: "+12 this month" },
                  { label: "Pending Approvals", val: "7", sub: "Leave requests" },
                  { label: "Payroll Status", val: "Ready", sub: "Process by Nov 30" },
                ]
              : [
                  { label: "Leave Balance", val: "12 days", sub: "Casual + Earned" },
                  { label: "Attendance", val: "96.2%", sub: "This month" },
                  { label: "Next Payslip", val: "Nov 30", sub: "₹58,000 estimated" },
                ]
            ).map((stat) => (
              <div key={stat.label} className="flex items-center justify-between p-3 rounded-xl border border-white/6 bg-white/3">
                <div>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className="text-base font-bold text-white">{stat.val}</p>
                </div>
                <span className="text-xs text-gray-500">{stat.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <GlowOrb className="w-80 h-80 bg-indigo-600 right-0 top-10" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <Badge>Testimonials</Badge>
          <h2 className="mt-4 text-4xl font-black text-white">Loved by HR teams worldwide</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t.name} className="p-6 rounded-2xl border border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/5 transition-all duration-300">
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.stars)].map((_, i) => <span key={i} className="text-amber-400"><Icons.Star /></span>)}
              </div>
              <p className="text-sm text-gray-300 leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <GlowOrb className="w-96 h-96 bg-emerald-500/30 left-10 top-10" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <Badge>Benefits</Badge>
          <h2 className="mt-4 text-4xl font-black text-white">Why teams choose WorkSphere</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((b) => (
            <div key={b.title} className="p-6 rounded-2xl border border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 text-center group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{b.emoji}</div>
              <h3 className="text-base font-bold text-white mb-2">{b.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="relative py-24 px-4 overflow-hidden">
      <GlowOrb className="w-96 h-96 bg-violet-600 left-1/2 -translate-x-1/2 top-0" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <Badge>Pricing</Badge>
          <h2 className="mt-4 text-4xl sm:text-5xl font-black text-white tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-gray-400">No hidden fees. Cancel anytime.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5 items-center">
          {plans.map((p) => <PricingCard key={p.name} plan={p} />)}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-900/50 to-cyan-900/30 p-12 sm:p-20 relative overflow-hidden">
          <GlowOrb className="w-80 h-80 bg-violet-500 -left-10 -top-10" />
          <GlowOrb className="w-60 h-60 bg-cyan-500 -right-10 bottom-0" />
          <div className="relative z-10">
            <Badge>Get Started Today</Badge>
            <h2 className="mt-5 text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Start managing your<br />workforce today
            </h2>
            <p className="mt-4 text-gray-300 text-lg max-w-lg mx-auto">
              Join 500+ companies already using WorkSphere to run efficient, modern HR operations.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <GradientButton className="text-base px-10 py-4">
                <Icons.Rocket /> Create Your Company
              </GradientButton>
              <GradientButton variant="secondary" className="text-base px-8 py-4">
                Talk to Sales <Icons.ArrowRight />
              </GradientButton>
            </div>
            <p className="mt-5 text-xs text-gray-500">Free 14-day trial · No credit card required · Cancel anytime</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/8 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Icons.Logo />
              <span className="text-base font-black text-white">Work<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Sphere</span></span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Modern HR management for teams that move fast and scale further.
            </p>
          </div>
          {[
            { title: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap"] },
            { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
            { title: "Legal",   links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"] },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-xs font-bold text-white uppercase tracking-widest mb-4">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-6 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">© 2025 WorkSphere. All rights reserved.</p>
          <p className="text-xs text-gray-600">Built with ❤️ for HR teams everywhere</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <MultiTenantSection />
      <RoleBasedSection />
      <TestimonialsSection />
      <BenefitsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}