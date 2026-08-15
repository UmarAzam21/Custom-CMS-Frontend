"use client";

import { useState } from "react";
import Toast from "../../components/ui/Toast";
import Modal from "../../components/ui/Modal";
import Link from "next/link";

export default function ForgotForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const TOAST_DURATION = 3000; // visible time before hiding (ms)

    async function sendResetEmail(showModal = true) {
        if (!email.trim()) {
            const msg = "Please fill all the fields.";
            setError(msg);
            setToastMessage(msg);
            setToastVisible(true);
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const res = await fetch("/api/proxy/admin/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const text = await res.text();

            if (!res.ok) {
                // backend may return JSON or plain text
                throw new Error(text || `Request failed with status ${res.status}`);
            }

            // success — show friendly message
            let successMsg = "If an account with that email exists, a reset link has been sent.";
            try {
                const parsed = JSON.parse(text);
                if (parsed && parsed.detail) successMsg = String(parsed.detail);
                else if (typeof parsed === 'string') successMsg = parsed;
            } catch (e) {
                if (text && text.trim().length > 0) successMsg = text;
            }

            setToastMessage(successMsg);
            setToastVisible(true);
            if (showModal) setModalVisible(true);
        } catch (err: any) {
            const raw = err?.message || "Login failed";

            // Try to parse JSON responses like {"detail":"..."}
            let friendly = "Login failed. Please try again.";
            try {
                const parsed = JSON.parse(raw);
                if (parsed && parsed.detail) {
                    const detail = String(parsed.detail);
                    if (/invalid email|invalid password|invalid email or password/i.test(detail)) {
                        friendly = "Invalid email or password.";
                    } else {
                        friendly = detail;
                    }
                } else if (typeof parsed === 'string') {
                    friendly = parsed;
                }
            } catch (e) {
                // not JSON — derive a nicer message from raw text
                if (/invalid email|invalid password|invalid email or password/i.test(raw)) {
                    friendly = "Invalid email or password.";
                } else if (raw && raw !== 'Login failed') {
                    friendly = raw;
                }
            }

            setError(friendly);
            setToastMessage(friendly);
            setToastVisible(true);
        } finally {
            setLoading(false);
        }
    }

    function closeModal() {
        setModalVisible(false);
        setEmail("");
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await sendResetEmail();
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="mt-8 space-y-5 mb-10">
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter Email or User Name"
                        className="w-full rounded-md border border-gray-300 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C8102E]/40 focus:border-[#C8102E]"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-md bg-primary py-3 text-sm font-semibold text-white hover:bg-[#a50d24] transition-colors disabled:opacity-50"
                >
                    {loading ? "Sending reset link..." : "Send Reset Link"}
                </button>

                <div className="text-center">
                    <Link
                        href="/login"
                        className="text-sm text-gray-700 hover:text-primary transition-colors"
                    >
                        Back to  <span className="text-primary font-semibold">Sign In</span>
                    </Link>
                </div>
                {/* Toast popup (reusable) */}
                <Toast
                    open={toastVisible}
                    title={"Forgot Password"}
                    message={toastMessage || "An error occurred while sending the reset link."}
                    duration={TOAST_DURATION}
                    onClose={() => {
                        setToastVisible(false);
                        setError(null);
                        setToastMessage("");
                    }}
                    variant={error ? "error" : "success"}
                />

                <Modal
                    open={modalVisible}
                    title="Verify your Email"
                    description="Check your email for Reset Link to continue."
                    primaryLabel="Go to inbox"
                    onClose={closeModal}
                    onPrimary={() => {
                        window.open("https://mail.google.com", "_blank");
                        closeModal();
                    }}
                    onResend={() => {
                        closeModal();
                        sendResetEmail(false);
                    }}
                />

                <p className="text-center text-xs text-gray leading-relaxed">
                    By signing in, you agree to Filernow{" "}
                    <Link href="/terms" className="text-[#C8102E] hover:underline">
                        Terms &amp; Conditions 
                    </Link>{" "}
                    and Privacy Policy.
                </p>
            </form>
        </>
    );
}