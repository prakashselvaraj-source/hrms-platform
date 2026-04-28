"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "@/services/authService";

export default function ResetPasswordPage() {
    const params = useSearchParams();
    const router = useRouter();

    const token = params.get("token");

    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            setMessage("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);

            await resetPassword({
                token,
                newPassword: password,
            });

            setMessage("Password reset successful ✅");

            setTimeout(() => {
                router.push("/login");
            }, 2000);

        } catch (err) {
            setMessage("Invalid or expired link ❌");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0812" }}>
            <form
                onSubmit={handleSubmit}
                style={{
                    width: 400,
                    padding: 30,
                    borderRadius: 20,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                }}
            >
                <h2 style={{ marginBottom: 20 }}>Reset Password</h2>

                <input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        width: "100%",
                        padding: 12,
                        borderRadius: 10,
                        border: "1px solid rgba(255,255,255,0.1)",
                        marginBottom: 10,
                        background: "transparent",
                        color: "#fff",
                    }}
                />

                {message && (
                    <p style={{ fontSize: 12, marginBottom: 10 }}>{message}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: 12,
                        borderRadius: 10,
                        border: "none",
                        background: "#7c3aed",
                        color: "#fff",
                    }}
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
}