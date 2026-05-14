"use client";

import { useState } from "react";
import { loginUser, tenantsData } from "@/services/authService";
import { useRouter } from "next/navigation";

function Input({ name, label, type = "text", value, onChange, icon }) {
  const [focused, setFocused] = useState(false);
  const filled = value && value.length > 0;

  return (
    <div style={{ position: "relative" }}>
      {/* Glow ring */}
      <div style={{
        position: "absolute", inset: "-1px", borderRadius: "16px", pointerEvents: "none",
        background: focused
          ? "linear-gradient(135deg, rgba(139,92,246,0.35), rgba(217,70,239,0.2), rgba(6,182,212,0.25))"
          : "transparent",
        transition: "all 0.3s ease",
      }} />

      <div style={{
        position: "relative", display: "flex", alignItems: "center", gap: "12px",
        background: focused ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${focused ? "rgba(167,139,250,0.5)" : "rgba(255,255,255,0.1)"}`,
        borderRadius: "16px", padding: "12px 16px", transition: "all 0.3s ease",
      }}>
        <span style={{ color: focused ? "#c4b5fd" : "rgba(255,255,255,0.3)", flexShrink: 0, transition: "color 0.3s" }}>
          {icon}
        </span>
        <div style={{ flex: 1, position: "relative", paddingTop: "12px" }}>
          <label style={{
            position: "absolute", left: 0, pointerEvents: "none",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500, letterSpacing: "0.03em",
            transition: "all 0.2s ease",
            ...(focused || filled
              ? { top: 0, fontSize: "10px", color: "#c4b5fd" }
              : { top: "50%", transform: "translateY(-50%)", fontSize: "14px", color: "rgba(255,255,255,0.38)" }),
          }}>
            {label}
          </label>
          <input
            name={name} type={type} value={value} onChange={onChange}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            autoComplete={type === "password" ? "current-password" : name}
            style={{
              width: "100%", background: "transparent", border: "none", outline: "none",
              color: "#fff", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", paddingTop: "4px",
            }}
          />
        </div>
      </div>
    </div>
  );
}

const MailIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="3" /><path d="M2 7l10 7 10-7" />
  </svg>
);
const LockIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" /><circle cx="12" cy="16" r="1.2" fill="currentColor" />
  </svg>
);
const BuildingIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21V5a2 2 0 012-2h14a2 2 0 012 2v16" /><path d="M3 21h18M9 21v-4h6v4" /><path d="M9 7h1m4 0h1M9 11h1m4 0h1" />
  </svg>
);

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginUser(form);

      // console.log("Login response:", res);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userEmail", form.email);

      const tenantsRes = await tenantsData();
      if (tenantsRes.data) {
        const company = tenantsRes.data.companyName;
        const role = res.data.role;
        // Match user's routing: ADMIN -> manager, others -> admin/home
        const target = role === "ADMIN" ? "manager" : (role === "SUPER_ADMIN" || role === "MANAGER") ? "admin" : "home";
        router.push(`/${company}/${target}/dashboard`);
      }

    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');


        .lf-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #0a0812;
          position: relative;
          overflow: hidden;
        }

        .lf-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .lf-orb-1 {
          width: 500px; height: 500px;
          top: -130px; left: -90px;
          background: radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%);
          filter: blur(60px);
          animation: lfDrift1 12s ease-in-out infinite;
        }
        .lf-orb-2 {
          width: 440px; height: 440px;
          bottom: -110px; right: -70px;
          background: radial-gradient(circle, rgba(192,38,211,0.28) 0%, transparent 70%);
          filter: blur(60px);
          animation: lfDrift2 15s ease-in-out infinite;
        }
        .lf-orb-3 {
          width: 320px; height: 320px;
          top: 38%; left: 52%;
          background: radial-gradient(circle, rgba(8,145,178,0.2) 0%, transparent 70%);
          filter: blur(50px);
          animation: lfDrift3 10s ease-in-out infinite;
        }

        @keyframes lfDrift1 {
          0%,100% { transform: translate(0,0); }
          33%      { transform: translate(30px,-22px); }
          66%      { transform: translate(-18px,26px); }
        }
        @keyframes lfDrift2 {
          0%,100% { transform: translate(0,0); }
          33%      { transform: translate(-26px,16px); }
          66%      { transform: translate(22px,-32px); }
        }
        @keyframes lfDrift3 {
          0%,100% { transform: translate(0,0); }
          50%      { transform: translate(18px,22px); }
        }

        .lf-grid {
          position: absolute; inset: 0; pointer-events: none;
          opacity: 0.04;
          background-image:
            linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .lf-card {
          position: relative;
          width: 100%;
          max-width: 440px;
          margin: 0 16px;
          border-radius: 28px;
          padding: 40px 36px;
          background: rgba(255,255,255,0.035);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow:
            0 40px 90px rgba(0,0,0,0.65),
            inset 0 1px 0 rgba(255,255,255,0.06);
        }

        .lf-top-line {
          position: absolute;
          top: 0; left: 32px; right: 32px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(167,139,250,0.7), transparent);
          border-radius: 999px;
        }

        @keyframes lfUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .lf-su1 { animation: lfUp 0.6s cubic-bezier(.22,1,.36,1) 0.05s both; }
        .lf-su2 { animation: lfUp 0.6s cubic-bezier(.22,1,.36,1) 0.18s both; }
        .lf-su3 { animation: lfUp 0.6s cubic-bezier(.22,1,.36,1) 0.32s both; }
        .lf-su4 { animation: lfUp 0.6s cubic-bezier(.22,1,.36,1) 0.44s both; }

        .lf-btn {
          width: 100%;
          border: none;
          border-radius: 16px;
          padding: 14px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.04em;
          color: #fff;
          cursor: pointer;
          background: linear-gradient(135deg, #6d28d9, #9333ea, #7c3aed);
          background-size: 200% auto;
          box-shadow: 0 8px 30px rgba(109,40,217,0.45);
          transition: background-position 0.5s ease, transform 0.15s ease, box-shadow 0.3s ease, opacity 0.3s;
        }
        .lf-btn:hover:not(:disabled) {
          background-position: right center;
          transform: translateY(-2px);
          box-shadow: 0 14px 40px rgba(109,40,217,0.55);
        }
        .lf-btn:active:not(:disabled) { transform: translateY(0); }
        .lf-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .lf-btn-inner {
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }

        @keyframes lfSpin { to { transform: rotate(360deg); } }
        .lf-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.25);
          border-top-color: #fff;
          border-radius: 50%;
          animation: lfSpin 0.75s linear infinite;
        }

        .lf-link-btn {
          background: none; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.2s;
        }
      `}</style>

      <div className="lf-root">
        <div className="lf-orb lf-orb-1" />
        <div className="lf-orb lf-orb-2" />
        <div className="lf-orb lf-orb-3" />
        <div className="lf-grid" />

        <div className="lf-card">
          <div className="lf-top-line" />

          {/* Logo */}
          <div className="lf-su1" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 13,
              background: "linear-gradient(135deg, #7c3aed, #c026d3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 24px rgba(124,58,237,0.45)",
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                <line x1="12" y1="22" x2="12" y2="15.5" />
                <polyline points="22 8.5 12 15.5 2 8.5" />
              </svg>
            </div>
            <span style={{ color: "rgba(255,255,255,0.65)", fontWeight: 500, fontSize: 14, letterSpacing: "0.06em" }}>
              WorkSphere
            </span>
          </div>

          {/* Heading */}
          <div className="lf-su2" style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: "#fff", lineHeight: 1.15, marginBottom: 8 }}>
              Welcome{" "}
              <em style={{ color: "#c4b5fd", fontStyle: "italic" }}>back</em>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, fontWeight: 300, letterSpacing: "0.04em" }}>
              Sign in to your workspace
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="lf-su3" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Input name="email" label="Email address" type="email" value={form.email} onChange={handleChange} icon={MailIcon} />
              <Input name="password" label="Password" type="password" value={form.password} onChange={handleChange} icon={LockIcon} />
            </div>

            {/* Error */}
            {error && (
              <div style={{
                display: "flex", gap: 8, alignItems: "flex-start",
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.22)",
                borderRadius: 12, padding: "10px 14px", marginTop: 14,
              }}>
                <svg style={{ flexShrink: 0, marginTop: 1 }} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#f87171" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <p style={{ color: "#fca5a5", fontSize: 12, lineHeight: 1.5 }}>{error}</p>
              </div>
            )}

            {/* Forgot */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
              <button
                type="button"
                className="lf-link-btn"
                style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, letterSpacing: "0.03em" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#c4b5fd")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}

                onClick={() => router.push("/forgot-password")}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <div className="lf-su4" style={{ marginTop: 20 }}>
              <button type="submit" disabled={loading} className="lf-btn">
                <span className="lf-btn-inner">
                  {loading ? (
                    <><span className="lf-spinner" /> Signing in…</>
                  ) : (
                    <>
                      Sign In
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>

          {/* Footer */}
          <p style={{ marginTop: 28, textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.2)", letterSpacing: "0.03em" }}>
            Don&apos;t have an account?{" "}
            <button
              type="button"
              className="lf-link-btn"
              onClick={() => router.push("/register")}
              style={{ color: "rgba(196,181,253,0.55)", fontWeight: 500, fontSize: 12 }}
              onMouseEnter={e => (e.currentTarget.style.color = "#c4b5fd")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(196,181,253,0.55)")}
            >
              Contact your admin
            </button>
          </p>
        </div>
      </div>
    </>
  );
}