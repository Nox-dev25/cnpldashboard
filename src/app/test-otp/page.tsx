"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
    ConfirmationResult,
} from "firebase/auth";
import { toast } from "sonner";

export default function PhoneOtpTest() {
    const [phone, setPhone] = useState("");
    const [confirmationResult, setConfirmationResult] =
        useState<ConfirmationResult | null>(null);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(false);

    // Setup reCAPTCHA
    useEffect(() => {
        if (typeof window !== "undefined" && !window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                auth,
                "recaptcha-container",
                { size: "invisible" }
            );
        }
    }, []);

    // Send OTP
    const sendOtp = async () => {
        try {
            setLoading(true);
            const result = await signInWithPhoneNumber(
                auth,
                phone,
                window.recaptchaVerifier!
            );
            setConfirmationResult(result);
            toast.success("OTP sent");
        } catch (err) {
            console.error(err);
            toast.error("Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP
    const verifyOtp = async () => {
        try {
            if (!confirmationResult) return;
            setLoading(true);
            await confirmationResult.confirm(otp.join(""));
            setVerified(true);
            toast.success("Phone verified");
        } catch (err) {
            console.error(err);
            toast.error("Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-100">
            <div className="bg-white p-8 rounded-xl w-full max-w-md space-y-6">
                <h1 className="text-xl font-bold text-black">Firebase Phone OTP Test</h1>

                {/* Phone Input */}
                <input
                    type="tel"
                    placeholder="+919876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border px-4 py-3 text-black rounded-lg"
                />

                {/* Send OTP */}
                <button
                    onClick={sendOtp}
                    disabled={loading}
                    className="w-full bg-black text-white py-3 rounded-lg"
                >
                    Send OTP
                </button>

                {/* OTP Inputs */}
                {confirmationResult && !verified && (
                    <>
                        <div className="flex gap-2 justify-center">
                            {otp.map((d, i) => (
                                <input
                                    key={i}
                                    maxLength={1}
                                    value={d}
                                    onChange={(e) => {
                                        const next = [...otp];
                                        next[i] = e.target.value.slice(-1);
                                        setOtp(next);
                                    }}
                                    className="w-12 h-12 text-center border text-black rounded-lg text-xl"
                                />
                            ))}
                        </div>

                        <button
                            onClick={verifyOtp}
                            disabled={loading}
                            className="w-full bg-green-600 text-black py-3 rounded-lg"
                        >
                            Verify OTP
                        </button>
                    </>
                )}

                {verified && (
                    <p className="text-green-600 font-medium text-center">
                        ✅ Phone number verified successfully
                    </p>
                )}

                {/* Required for Firebase */}
                <div id="recaptcha-container"></div>
            </div>
        </div>
    );
}