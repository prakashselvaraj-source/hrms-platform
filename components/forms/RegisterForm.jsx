"use client";

import { useState } from "react";
import { checkCompanyExists, checkEmailExists, registerCompany, sendOtp, verifyOtp } from "@/services/authService";
import { useRouter } from "next/navigation";

function Input({ name, label, type = "text", value, onChange, icon }) {
  const [focused, setFocused] = useState(false);
  const filled = value && value.length > 0;

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          inset: "-1px",
          borderRadius: "16px",
          pointerEvents: "none",
          background: focused
            ? "linear-gradient(135deg, rgba(139,92,246,0.35), rgba(217,70,239,0.2), rgba(6,182,212,0.25))"
            : "transparent",
          transition: "all 0.3s ease",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: focused
            ? "rgba(255,255,255,0.07)"
            : "rgba(255,255,255,0.04)",
          border: `1px solid ${focused ? "rgba(167,139,250,0.5)" : "rgba(255,255,255,0.1)"}`,
          borderRadius: "16px",
          padding: "12px 16px",
          transition: "all 0.3s ease",
        }}
      >
        <span
          style={{
            color: focused ? "#c4b5fd" : "rgba(255,255,255,0.3)",
            flexShrink: 0,
            transition: "color 0.3s",
          }}
        >
          {icon}
        </span>
        <div style={{ flex: 1, position: "relative", paddingTop: "12px" }}>
          <label
            style={{
              position: "absolute",
              left: 0,
              pointerEvents: "none",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              letterSpacing: "0.03em",
              transition: "all 0.2s ease",
              ...(focused || filled
                ? { top: 0, fontSize: "10px", color: "#c4b5fd" }
                : {
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.38)",
                  }),
            }}
          >
            {label}
          </label>
          <input
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoComplete={type === "password" ? "new-password" : name}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontSize: "14px",
              fontFamily: "'DM Sans', sans-serif",
              paddingTop: "4px",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────
const BuildingIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 21V5a2 2 0 012-2h14a2 2 0 012 2v16" />
    <path d="M3 21h18M9 21v-4h6v4" />
    <path d="M9 7h1m4 0h1M9 11h1m4 0h1" />
  </svg>
);
const UserIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);
const MailIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="M2 7l10 7 10-7" />
  </svg>
);
const LockIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 018 0v4" />
    <circle cx="12" cy="16" r="1.2" fill="currentColor" />
  </svg>
);

// ── Success Modal ─────────────────────────────────────────────
function SuccessModal({ code, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
        animation: "lfUp 0.3s cubic-bezier(.22,1,.36,1) both",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 24,
          padding: "40px 36px",
          maxWidth: 380,
          width: "90%",
          textAlign: "center",
          backdropFilter: "blur(24px)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
          position: "relative",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            margin: "0 auto 20px",
            background:
              "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(192,38,211,0.3))",
            border: "1px solid rgba(167,139,250,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="26"
            height="26"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#c4b5fd"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h3
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 22,
            color: "#fff",
            marginBottom: 8,
          }}
        >
          Company Registered!
        </h3>
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: 13,
            marginBottom: 24,
            lineHeight: 1.6,
          }}
        >
          Share this code with your employees so they can log in.
        </p>

        {/* Code box */}
        <div
          style={{
            background: "rgba(124,58,237,0.12)",
            border: "1px solid rgba(167,139,250,0.3)",
            borderRadius: 14,
            padding: "14px 18px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 22,
              fontWeight: 700,
              color: "#c4b5fd",
              letterSpacing: "0.15em",
            }}
          >
            {code}
          </span>
          <button
            onClick={handleCopy}
            style={{
              background: copied
                ? "rgba(16,185,129,0.2)"
                : "rgba(255,255,255,0.08)",
              border: `1px solid ${copied ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.12)"}`,
              borderRadius: 10,
              padding: "6px 12px",
              cursor: "pointer",
              color: copied ? "#6ee7b7" : "rgba(255,255,255,0.5)",
              fontSize: 12,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              transition: "all 0.2s",
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            border: "none",
            borderRadius: 14,
            padding: "12px",
            background: "linear-gradient(135deg, #6d28d9, #9333ea)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(109,40,217,0.4)",
          }}
        >
          Continue to Login
        </button>
      </div>
    </div>
  );
}

// ── Step indicator ────────────────────────────────────────────
function Steps({ current }) {
  const steps = ["Company", "Admin", "Security", "Verify"];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        marginBottom: 32,
      }}
    >
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              flex: i < steps.length - 1 ? 1 : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: done
                    ? "linear-gradient(135deg, #7c3aed, #c026d3)"
                    : active
                      ? "rgba(124,58,237,0.2)"
                      : "rgba(255,255,255,0.06)",
                  border: `1.5px solid ${done ? "transparent" : active ? "rgba(167,139,250,0.7)" : "rgba(255,255,255,0.1)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.4s ease",
                  boxShadow: done ? "0 4px 16px rgba(124,58,237,0.4)" : "none",
                }}
              >
                {done ? (
                  <svg
                    width="13"
                    height="13"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#fff"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: active ? "#c4b5fd" : "rgba(255,255,255,0.25)",
                    }}
                  >
                    {i + 1}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                  color: active
                    ? "#c4b5fd"
                    : done
                      ? "rgba(196,181,253,0.6)"
                      : "rgba(255,255,255,0.2)",
                }}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 1,
                  margin: "0 8px",
                  marginBottom: 18,
                  background: done
                    ? "linear-gradient(90deg, #7c3aed, rgba(124,58,237,0.3))"
                    : "rgba(255,255,255,0.08)",
                  transition: "all 0.4s ease",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function RegisterForm() {
  const [form, setForm] = useState({
    companyName: "",
    adminName: "",
    email: "",
    password: "",
    otp: "",
  });
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [companyCode, setCompanyCode] = useState(null);

  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const nextStep = async () => {
    if (step === 0) {
      if (!form.companyName.trim()) {
        setError("Company name is required.");
        return;
      }

      try {
        setLoading(true);
        const res = await checkCompanyExists(form.companyName);

        console.log("checkCompanyExists response:", res);

        if (res.data === true) {
          setError("Company name already registered. Try another.");
          setLoading(false);
          return;
        }

        setError("");
        setStep(1);
      } catch (error) {
        setError("Error checking company name.");
      } finally {
        setLoading(false);
      }

      return;
    }
    if (step === 1){
      if (!form.adminName.trim() || !form.email.trim()) {
        setError("Please fill in all fields.");
        return;
      }

      try {
        setLoading(true);

        console.log("checkEmailExists",form.email);
        const res = await checkEmailExists(form.email);

        if(res.data === true){
          setError("Email already registered. Try another");
          return;
        }

        setError("");
        setStep(2);
      } catch {
        setError("Error checking email.");
      } finally{
        setLoading(false);
      }
      return;
    }

    if (step === 2) {
      if (!form.password || form.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }

      try {
        setLoading(true);
        // Send OTP
        await sendOtp(form.email);
        setError("");
        setStep(3);
      } catch {
        setError("Error sending OTP. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }
  };

  const prevStep = () => {
    setError("");
    setStep((s) => s - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.otp || form.otp.length < 4) {
      setError("Please enter a valid OTP.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Verify OTP first
      await verifyOtp(form.email, form.otp);

      console.log("form data being submitted:", form);
      const res = await registerCompany(form);
      console.log("handleSubmit response:", res);
      setCompanyCode(res.data.companyCode);
    } catch (error) {
      setError(error.response?.data?.message || "OTP Verification or Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const stepContent = [
    {
      heading: "Your company",
      sub: "Let's start with your organization's name",
      fields: (
        <Input
          name="companyName"
          label="Company Name"
          value={form.companyName}
          onChange={handleChange}
          icon={BuildingIcon}
        />
      ),
    },
    {
      heading: "Admin details",
      sub: "Who will manage this workspace?",
      fields: (
        <>
          <Input
            name="adminName"
            label="Admin Name"
            value={form.adminName}
            onChange={handleChange}
            icon={UserIcon}
          />
          <Input
            name="email"
            label="Work Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            icon={MailIcon}
          />
        </>
      ),
    },
    {
      heading: "Set password",
      sub: "Choose a secure password for your account",
      fields: (
        <Input
          name="password"
          label="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          icon={LockIcon}
        />
      ),
    },
    {
      heading: "Verify Email",
      sub: `Enter the code sent to ${form.email}`,
      fields: (
        <Input
          name="otp"
          label="One Time Password"
          type="text"
          value={form.otp}
          onChange={handleChange}
          icon={LockIcon}
        />
      ),
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .rf-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          background-color: #0a0812;
          position: relative; overflow: hidden;
        }
        .rf-orb {
          position: absolute; border-radius: 50%; pointer-events: none;
        }
        .rf-orb-1 {
          width: 500px; height: 500px; top: -130px; left: -90px;
          background: radial-gradient(circle, rgba(124,58,237,0.32) 0%, transparent 70%);
          filter: blur(60px);
          animation: rfDrift1 13s ease-in-out infinite;
        }
        .rf-orb-2 {
          width: 440px; height: 440px; bottom: -110px; right: -70px;
          background: radial-gradient(circle, rgba(192,38,211,0.26) 0%, transparent 70%);
          filter: blur(60px);
          animation: rfDrift2 16s ease-in-out infinite;
        }
        .rf-orb-3 {
          width: 320px; height: 320px; top: 35%; left: 50%;
          background: radial-gradient(circle, rgba(8,145,178,0.18) 0%, transparent 70%);
          filter: blur(50px);
          animation: rfDrift3 11s ease-in-out infinite;
        }
        @keyframes rfDrift1 {
          0%,100% { transform: translate(0,0); }
          33%      { transform: translate(28px,-20px); }
          66%      { transform: translate(-16px,24px); }
        }
        @keyframes rfDrift2 {
          0%,100% { transform: translate(0,0); }
          33%      { transform: translate(-22px,18px); }
          66%      { transform: translate(20px,-28px); }
        }
        @keyframes rfDrift3 {
          0%,100% { transform: translate(0,0); }
          50%      { transform: translate(16px,20px); }
        }
        .rf-grid {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.04;
          background-image:
            linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .rf-card {
          position: relative; width: 100%; max-width: 440px; margin: 0 16px;
          border-radius: 28px; padding: 40px 36px;
          background: rgba(255,255,255,0.035);
          backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 40px 90px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .rf-top-line {
          position: absolute; top: 0; left: 32px; right: 32px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(167,139,250,0.7), transparent);
          border-radius: 999px;
        }
        @keyframes lfUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rfSlide {
          from { opacity: 0; transform: translateX(18px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .rf-su1 { animation: lfUp 0.55s cubic-bezier(.22,1,.36,1) 0.05s both; }
        .rf-su2 { animation: lfUp 0.55s cubic-bezier(.22,1,.36,1) 0.15s both; }
        .rf-fields { animation: rfSlide 0.4s cubic-bezier(.22,1,.36,1) both; }

        .rf-btn {
          border: none; border-radius: 14px; padding: 13px 24px;
          font-size: 14px; font-weight: 600; font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.04em; color: #fff; cursor: pointer;
          background: linear-gradient(135deg, #6d28d9, #9333ea, #7c3aed);
          background-size: 200% auto;
          box-shadow: 0 8px 28px rgba(109,40,217,0.42);
          transition: background-position 0.5s, transform 0.15s, box-shadow 0.3s, opacity 0.3s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .rf-btn:hover:not(:disabled) {
          background-position: right center;
          transform: translateY(-1px);
          box-shadow: 0 12px 36px rgba(109,40,217,0.52);
        }
        .rf-btn:active:not(:disabled) { transform: translateY(0); }
        .rf-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .rf-ghost-btn {
          border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 13px 20px;
          font-size: 14px; font-weight: 500; font-family: 'DM Sans', sans-serif;
          color: rgba(255,255,255,0.45); background: rgba(255,255,255,0.04);
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; gap: 6px;
        }
        .rf-ghost-btn:hover { border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.7); }

        @keyframes rfSpin { to { transform: rotate(360deg); } }
        .rf-spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.25);
          border-top-color: #fff; border-radius: 50%;
          animation: rfSpin 0.75s linear infinite;
        }
        .rf-link-btn {
          background: none; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; transition: color 0.2s;
        }
      `}</style>

      <div className="rf-root">
        <div className="rf-orb rf-orb-1" />
        <div className="rf-orb rf-orb-2" />
        <div className="rf-orb rf-orb-3" />
        <div className="rf-grid" />

        <div className="rf-card">
          <div className="rf-top-line" />

          {/* Logo */}
          <div
            className="rf-su1"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 13,
                background: "linear-gradient(135deg, #7c3aed, #c026d3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(124,58,237,0.45)",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                <line x1="12" y1="22" x2="12" y2="15.5" />
                <polyline points="22 8.5 12 15.5 2 8.5" />
              </svg>
            </div>
            <span
              style={{
                color: "rgba(255,255,255,0.65)",
                fontWeight: 500,
                fontSize: 14,
                letterSpacing: "0.06em",
              }}
            >
              WorkSphere
            </span>
          </div>

          {/* Step indicator */}
          <div className="rf-su2">
            <Steps current={step} />
          </div>

          {/* Heading */}
          <div className="rf-su2" style={{ marginBottom: 28 }}>
            <h1
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 28,
                color: "#fff",
                lineHeight: 1.2,
                marginBottom: 6,
              }}
            >
              {stepContent[step].heading}
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: 13,
                fontWeight: 300,
                letterSpacing: "0.04em",
              }}
            >
              {stepContent[step].sub}
            </p>
          </div>

          {/* Fields */}
          <form onSubmit={handleSubmit}>
            <div
              key={step}
              className="rf-fields"
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              {stepContent[step].fields}
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-start",
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.22)",
                  borderRadius: 12,
                  padding: "10px 14px",
                  marginTop: 14,
                }}
              >
                <svg
                  style={{ flexShrink: 0, marginTop: 1 }}
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#f87171"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  />
                </svg>
                <p style={{ color: "#fca5a5", fontSize: 12, lineHeight: 1.5 }}>
                  {error}
                </p>
              </div>
            )}

            {/* Nav buttons */}
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              {step > 0 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="rf-ghost-btn"
                >
                  <svg
                    width="15"
                    height="15"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                    />
                  </svg>
                  Back
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={loading}
                  className="rf-btn"
                  style={{ flex: 1 }}
                >
                  {loading && step === 2 ? (
                    <>
                      <span className="rf-spinner" /> Sending OTP...
                    </>
                  ) : (
                    <>
                      {step === 2 ? "Send OTP" : "Continue"}
                      <svg
                        width="15"
                        height="15"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="rf-btn"
                  style={{ flex: 1 }}
                >
                  {loading ? (
                    <>
                      <span className="rf-spinner" /> Creating…
                    </>
                  ) : (
                    <>
                      Create Workspace
                      <svg
                        width="15"
                        height="15"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Footer */}
          <p
            style={{
              marginTop: 28,
              textAlign: "center",
              fontSize: 12,
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.03em",
            }}
          >
            Already have an account?{" "}
            <button
              type="button"
              className="rf-link-btn"
              onClick={() => router.push("/login")}
              style={{
                color: "rgba(196,181,253,0.55)",
                fontWeight: 500,
                fontSize: 12,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#c4b5fd")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(196,181,253,0.55)")
              }
            >
              Sign in instead
            </button>
          </p>
        </div>
      </div>

      {/* Success modal */}
      {companyCode && (
        <SuccessModal
          code={companyCode}
          onClose={() => (window.location.href = "/login")}
        />
      )}
    </>
  );
}
