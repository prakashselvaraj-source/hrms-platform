"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Mail,
    Building2,
    Lock,
    ArrowRight,
    Loader2,
    Eye,
    EyeOff,
    Box,
} from "lucide-react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { loginUser, registerUser } from "@/services/authService";

// ─── Gradient Orbs ────────────────────────────────────────────────────────────
function Orbs() {
    return (
        <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
            {/* Purple top-left */}
            <div className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-purple-700/30 blur-[120px]" />
            {/* Fuchsia bottom-right */}
            <div className="absolute -bottom-40 -right-20 h-[520px] w-[520px] rounded-full bg-fuchsia-700/25 blur-[140px]" />
            {/* Cyan centre-right */}
            <div className="absolute top-1/2 right-1/4 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-cyan-600/10 blur-[100px]" />
        </div>
    );
}

// ─── Grid overlay ─────────────────────────────────────────────────────────────
function GridOverlay() {
    return (
        <div
            aria-hidden
            className="pointer-events-none fixed inset-0"
            style={{
                backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
            }}
        />
    );
}

// ─── Floating-label Input ─────────────────────────────────────────────────────
function FloatingInput({
    id,
    label,
    type = "text",
    icon: Icon,
    value,
    onChange,
    error,
    rightSlot,
    disabled = false,
    delay = 0,
}) {
    const hasValue = value.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: "easeOut" }}
            className="relative"
        >
            {/* gradient border wrapper */}
            <div
                className={`relative rounded-xl p-px transition-all duration-300 ${error
                    ? "bg-red-500/60"
                    : hasValue
                        ? "bg-gradient-to-r from-purple-500/60 via-fuchsia-500/60 to-violet-500/60"
                        : "bg-white/10 focus-within:bg-gradient-to-r focus-within:from-purple-500/70 focus-within:via-fuchsia-500/70 focus-within:to-violet-500/70"
                    }`}
            >
                <div className="relative flex items-center rounded-xl bg-[#120e1e]/80 backdrop-blur-sm px-4 py-3.5">
                    {/* left icon */}
                    <Icon
                        size={16}
                        className={`mr-3 shrink-0 transition-colors duration-200 ${hasValue ? "text-fuchsia-400" : "text-white/30"
                            }`}
                    />

                    {/* input */}
                    <div className="relative flex-1">
                        <input
                            id={id}
                            type={type}
                            value={value}
                            onChange={onChange}
                            placeholder=" "
                            className={`peer w-full bg-transparent text-sm text-white/90 placeholder-transparent outline-none ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
                            autoComplete="off"
                            disabled={disabled}
                        />
                        {/* floating label */}
                        <label
                            htmlFor={id}
                            className="absolute left-0 top-1/2 -translate-y-1/2 text-sm text-white/35 pointer-events-none select-none transition-all duration-200
    peer-focus:opacity-0
    peer-not-placeholder-shown:opacity-0"
                        >
                            {label}
                        </label>
                    </div>

                    {/* optional right slot (eye toggle) */}
                    {rightSlot && <div className="ml-2 shrink-0">{rightSlot}</div>}
                </div>
            </div>

            {/* error */}
            <AnimatePresence>
                {error && (
                    <motion.p
                        key="err"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-1.5 pl-1 text-xs text-red-400"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SignupPage() {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        company: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const searchParams = useSearchParams();
    const emailParam = searchParams.get('email');
    const nameParam = searchParams.get('name');
    const { dashboard } = useParams();

    const router = useRouter();

    useEffect(() => {
        if (emailParam || nameParam || dashboard) {
            setForm((prev) => ({
                ...prev,
                email: emailParam || prev.email,
                fullName: nameParam || prev.fullName,
                company: dashboard || prev.company,
            }));
        }
    }, [emailParam, nameParam, dashboard]);

    function handleChange(field) {
        return (e) => {
            setForm((prev) => ({ ...prev, [field]: e.target.value }));
            if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
        };
    }

    function validate() {
        const errs = {};
        if (!form.fullName.trim()) errs.fullName = "Full name is required.";
        if (!form.email.trim()) errs.email = "Email address is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            errs.email = "Enter a valid email address.";
        if (!form.company.trim()) errs.company = "Company name is required.";
        if (!form.password) errs.password = "Password is required.";
        else if (form.password.length < 8)
            errs.password = "Password must be at least 8 characters.";
        return errs;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }
        setLoading(true);
        console.log("dashboard", dashboard)
        await registerUser(dashboard, form);
        setLoading(false);
        setSubmitted(true);



        setTimeout(() => {
            router.push(`/login`);
        }, 2000);
    }

    return (
        <div
            className="relative min-h-screen w-full flex items-center justify-center px-4 py-12"
            style={{ backgroundColor: "#0a0812" }}
        >
            <GridOverlay />
            <Orbs />

            <AnimatePresence mode="wait">
                {submitted ? (
                    /* ── Success state ── */
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="relative z-10 flex flex-col items-center gap-4 text-center"
                    >
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 shadow-lg shadow-fuchsia-900/50">
                            <ArrowRight size={32} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">You&apos;re in!</h2>
                        <p className="text-sm text-white/50">
                            Account created successfully. Check your inbox.
                        </p>
                    </motion.div>
                ) : (
                    /* ── Form card ── */
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 32 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="relative z-10 w-full max-w-md"
                    >
                        {/* glassmorphism card */}
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/60 backdrop-blur-xl sm:p-10">

                            {/* Logo + Brand */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.05 }}
                                className="mb-8 flex items-center gap-3"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 shadow-md shadow-fuchsia-900/40">
                                    <Box size={18} className="text-white" />
                                </div>
                                <span className="text-base font-semibold tracking-tight text-white/90">
                                    {dashboard}
                                </span>
                            </motion.div>

                            {/* Headline */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className="mb-8"
                            >
                                <h1 className="text-3xl font-bold tracking-tight text-white">
                                    Create an{" "}
                                    <span className="bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent italic">
                                        account
                                    </span>
                                </h1>
                                <p className="mt-1.5 text-sm text-white/40">
                                    Start your journey with WorkSphere today.
                                </p>
                            </motion.div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                                <FloatingInput
                                    id="fullName"
                                    label="Full Name"
                                    icon={User}
                                    value={form.fullName}
                                    onChange={handleChange("fullName")}
                                    error={errors.fullName}
                                    disabled={!!nameParam}
                                    delay={0.15}
                                />

                                <FloatingInput
                                    id="email"
                                    label="Email Address"
                                    type="email"
                                    icon={Mail}
                                    value={form.email}
                                    onChange={handleChange("email")}
                                    error={errors.email}
                                    disabled={!!emailParam}
                                    delay={0.2}
                                />

                                <FloatingInput
                                    id="company"
                                    label="Company Name"
                                    icon={Building2}
                                    value={form.company}
                                    onChange={handleChange("company")}
                                    error={errors.company}
                                    disabled={!!dashboard}
                                    delay={0.25}
                                />

                                <FloatingInput
                                    id="password"
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    icon={Lock}
                                    value={form.password}
                                    onChange={handleChange("password")}
                                    error={errors.password}
                                    delay={0.3}
                                    rightSlot={
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            className="text-white/30 hover:text-white/60 transition-colors"
                                            tabIndex={-1}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    }
                                />

                                {/* Submit button */}
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.35 }}
                                    className="mt-1"
                                >
                                    <motion.button
                                        type="submit"
                                        disabled={loading}
                                        whileHover={!loading ? { scale: 1.02, y: -1 } : {}}
                                        whileTap={!loading ? { scale: 0.98 } : {}}
                                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                        className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-900/40 transition-shadow duration-300 hover:shadow-fuchsia-700/50 disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {/* shimmer on hover */}
                                        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 hover:translate-x-full" />

                                        <span className="relative flex items-center justify-center gap-2">
                                            {loading ? (
                                                <>
                                                    <Loader2 size={16} className="animate-spin" />
                                                    Creating account…
                                                </>
                                            ) : (
                                                <>
                                                    Sign Up
                                                    <ArrowRight size={16} />
                                                </>
                                            )}
                                        </span>
                                    </motion.button>
                                </motion.div>
                            </form>


                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}