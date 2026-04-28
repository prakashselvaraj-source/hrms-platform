"use client";

import { useState } from "react";
import { forgotPassword } from "@/services/authService";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await forgotPassword(email);

      setSuccess(true);
    } catch (err) {
      setError("Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0812",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          padding: "40px 32px",
          borderRadius: 24,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(20px)",
        }}
      >
        <h2
          style={{
            color: "#fff",
            fontSize: 26,
            marginBottom: 10,
            fontWeight: 600,
          }}
        >
          Forgot Password
        </h2>

        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: 13,
            marginBottom: 24,
          }}
        >
          Enter your email and we’ll send you a reset link.
        </p>

        {success ? (
          <div
            style={{
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.3)",
              padding: 16,
              borderRadius: 12,
              color: "#6ee7b7",
              fontSize: 13,
              textAlign: "center",
            }}
          >
            Reset link sent to your email 📩
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
                marginBottom: 12,
                outline: "none",
              }}
            />

            {error && (
              <p style={{ color: "#f87171", fontSize: 12, marginBottom: 10 }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #6d28d9, #9333ea)",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <p
          style={{
            marginTop: 20,
            textAlign: "center",
            fontSize: 12,
            color: "rgba(255,255,255,0.4)",
          }}
        >
          Remember your password?{" "}
          <span
            onClick={() => router.push("/login")}
            style={{ color: "#c4b5fd", cursor: "pointer" }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}