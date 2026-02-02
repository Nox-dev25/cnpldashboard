"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    ShieldCheck,
    Server,
    Globe,
    Cpu,
    Star,
    ArrowRight,
    Eye,
    EyeOff,
    ChevronDown,
    Check,
    X,
    AlertCircle
} from 'lucide-react';
import {
    signInWithPhoneNumber,
    RecaptchaVerifier,
    ConfirmationResult
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

// Country codes data with flags (emoji)
const countryCodes = [
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+1', country: 'United States', flag: '🇺🇸' },
    { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+81', country: 'Japan', flag: '🇯🇵' },
    { code: '+86', country: 'China', flag: '🇨🇳' },
    { code: '+82', country: 'South Korea', flag: '🇰🇷' },
    { code: '+65', country: 'Singapore', flag: '🇸🇬' },
    { code: '+971', country: 'UAE', flag: '🇦🇪' },
    { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
    { code: '+55', country: 'Brazil', flag: '🇧🇷' },
    { code: '+52', country: 'Mexico', flag: '🇲🇽' },
    { code: '+7', country: 'Russia', flag: '🇷🇺' },
    { code: '+39', country: 'Italy', flag: '🇮🇹' },
    { code: '+34', country: 'Spain', flag: '🇪🇸' },
    { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
    { code: '+46', country: 'Sweden', flag: '🇸🇪' },
    { code: '+47', country: 'Norway', flag: '🇳🇴' },
    { code: '+45', country: 'Denmark', flag: '🇩🇰' },
    { code: '+358', country: 'Finland', flag: '🇫🇮' },
    { code: '+48', country: 'Poland', flag: '🇵🇱' },
    { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
    { code: '+43', country: 'Austria', flag: '🇦🇹' },
    { code: '+32', country: 'Belgium', flag: '🇧🇪' },
    { code: '+351', country: 'Portugal', flag: '🇵🇹' },
    { code: '+30', country: 'Greece', flag: '🇬🇷' },
    { code: '+353', country: 'Ireland', flag: '🇮🇪' },
    { code: '+64', country: 'New Zealand', flag: '🇳🇿' },
    { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
    { code: '+66', country: 'Thailand', flag: '🇹🇭' },
    { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
    { code: '+63', country: 'Philippines', flag: '🇵🇭' },
    { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
    { code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
    { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
    { code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
    { code: '+977', country: 'Nepal', flag: '🇳🇵' },
    { code: '+27', country: 'South Africa', flag: '🇿🇦' },
    { code: '+20', country: 'Egypt', flag: '🇪🇬' },
    { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
    { code: '+254', country: 'Kenya', flag: '🇰🇪' },
    { code: '+972', country: 'Israel', flag: '🇮🇱' },
    { code: '+90', country: 'Turkey', flag: '🇹🇷' },
];

interface FormErrors {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

    // Phone OTP States
    const [phoneOtpSent, setPhoneOtpSent] = useState(false);
    const [phoneOtp, setPhoneOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [phoneOtpVerified, setPhoneOtpVerified] = useState(false);
    const [phoneOtpTimer, setPhoneOtpTimer] = useState(0);
    const [sendingPhoneOtp, setSendingPhoneOtp] = useState(false);
    const [verifyingPhoneOtp, setVerifyingPhoneOtp] = useState(false);

    // Email OTP States
    const [emailOtpSent, setEmailOtpSent] = useState(false);
    const [emailOtp, setEmailOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [emailOtpVerified, setEmailOtpVerified] = useState(false);
    const [emailOtpTimer, setEmailOtpTimer] = useState(0);
    const [sendingEmailOtp, setSendingEmailOtp] = useState(false);
    const [verifyingEmailOtp, setVerifyingEmailOtp] = useState(false);

    // OTP Timer
    useEffect(() => {
        if (phoneOtpTimer > 0) {
            const timer = setTimeout(() => setPhoneOtpTimer(t => t - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [phoneOtpTimer]);

    useEffect(() => {
        if (typeof window !== "undefined" && !window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                auth,
                "recaptcha-container",
                {
                    size: "invisible",
                }
            );
        }
    }, []);

    useEffect(() => {
        if (emailOtpTimer > 0) {
            const t = setTimeout(() => setEmailOtpTimer(p => p - 1), 1000);
            return () => clearTimeout(t);
        }
    }, [emailOtpTimer]);

    // Validation functions
    const validateFirstName = (value: string): string | undefined => {
        if (!value.trim()) return 'First name is required';
        if (value.trim().length < 2) return 'First name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'First name can only contain letters';
        return undefined;
    };

    const validateLastName = (value: string): string | undefined => {
        if (!value.trim()) return 'Last name is required';
        if (value.trim().length < 2) return 'Last name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Last name can only contain letters';
        return undefined;
    };

    const validatePhone = (value: string): string | undefined => {
        if (!value.trim()) return 'Phone number is required';
        if (!/^\d{10}$/.test(value.replace(/\s/g, ''))) return 'Enter a valid 10-digit phone number';
        return undefined;
    };

    const validateEmail = (value: string): string | undefined => {
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address';
        return undefined;
    };

    const validatePassword = (value: string): string | undefined => {
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
        if (!/[!@#$%^&*]/.test(value)) return 'Password must contain at least one special character (!@#$%^&*)';
        return undefined;
    };

    const validateConfirmPassword = (value: string): string | undefined => {
        if (!value) return 'Please confirm your password';
        if (value !== password) return 'Passwords do not match';
        return undefined;
    };

    // Handle field blur for validation
    const handleBlur = (field: string) => {
        setTouched({ ...touched, [field]: true });
        validateForm();
    };

    // Validate entire form
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {
            firstName: validateFirstName(firstName),
            lastName: validateLastName(lastName),
            phone: validatePhone(phone),
            email: validateEmail(email),
            password: validatePassword(password),
            confirmPassword: validateConfirmPassword(confirmPassword),
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== undefined);
    };

    // Send Phone OTP
    const handleSendPhoneOtp = async () => {
        try {
            setSendingPhoneOtp(true);

            const fullPhone = `${selectedCountry.code}${phone}`;
            const appVerifier = window.recaptchaVerifier!;

            const result = await signInWithPhoneNumber(
                auth,
                fullPhone,
                appVerifier
            );

            setConfirmationResult(result);
            setPhoneOtpSent(true);
            setPhoneOtpTimer(60);
            toast.success("OTP sent to your phone");

        } catch (error) {
            console.error(error);
            toast.error("Failed to send OTP");
        } finally {
            setSendingPhoneOtp(false);
        }
    };


    // Send Email OTP
    const handleSendEmailOtp = async () => {
        const emailError = validateEmail(email);
        if (emailError) {
            setErrors(p => ({ ...p, email: emailError }));
            setTouched(p => ({ ...p, email: true }));
            return;
        }

        setSendingEmailOtp(true);
        await new Promise(r => setTimeout(r, 1500)); // API
        setSendingEmailOtp(false);

        setEmailOtpSent(true);
        setEmailOtpTimer(60);
        setEmailOtp(['', '', '', '', '', '']);
    };

    // Handle OTP input
    const handleOtpChange = (
        index: number,
        value: string,
        otp: string[],
        setOtp: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        if (!/^\d*$/.test(value)) return;

        const next = [...otp];
        next[index] = value.slice(-1);
        setOtp(next);

        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    // Handle OTP key down for backspace
    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    // Verify Phone OTP
    const handleVerifyPhoneOtp = async () => {
        try {
            if (!confirmationResult) return;

            setVerifyingPhoneOtp(true);

            const code = phoneOtp.join("");
            await confirmationResult.confirm(code);

            setPhoneOtpVerified(true);
            setPhoneOtpSent(false);
            toast.success("Phone number verified");

        } catch (error) {
            console.error(error);
            toast.error("Invalid OTP");
        } finally {
            setVerifyingPhoneOtp(false);
        }
    };

    // Verify Phone OTP
    const handleVerifyEmailOtp = async () => {
        if (emailOtp.join('').length !== 6) return;

        setVerifyingEmailOtp(true);
        await new Promise(r => setTimeout(r, 1500)); // API
        setVerifyingEmailOtp(false);

        setEmailOtpVerified(true);
        setEmailOtpSent(false);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validate form
        if (!validateForm()) return;

        // 2. Check OTP
        if (!phoneOtpVerified) {
            setErrors(prev => ({
                ...prev,
                phone: "Please verify your phone number",
            }));
            return;
        }

        if (!emailOtpVerified) {
            setErrors(prev => ({
                ...prev,
                email: "Please verify your email address",
            }));
            return;
        }

        try {
            setIsLoading(true);

            // 3. Call register API
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    phone,
                    countryCode: selectedCountry.code,
                    email,
                    password,
                }),
            });

            const data = await res.json();

            setIsLoading(false);

            // 4. Handle error
            if (!res.ok) {
                alert(data.error || "Registration failed");
                return;
            }

            // 5. Success → redirect
            window.location.href = "/login";

        } catch (err) {
            console.error("Registration error:", err);
            setIsLoading(false);
            alert("Something went wrong. Please try again.");
        }
    };

    const services = [
        { icon: <Server className="w-4 h-4" />, name: "Cloud Hosting" },
        { icon: <Globe className="w-4 h-4" />, name: "Domain Registration" },
        { icon: <Cpu className="w-4 h-4" />, name: "Dedicated Servers" }
    ];

    const avatars = [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64&q=80",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64&q=80",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64&q=80"
    ];

    // Password strength indicator
    const getPasswordStrength = () => {
        if (!password) return { strength: 0, label: '', color: '' };
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[!@#$%^&*]/.test(password)) strength++;

        if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-500' };
        if (strength <= 3) return { strength, label: 'Fair', color: 'bg-yellow-500' };
        if (strength <= 4) return { strength, label: 'Good', color: 'bg-blue-500' };
        return { strength, label: 'Strong', color: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength();

    return (
        <div className="min-h-screen bg-black text-white flex flex-col md:flex-row font-sans selection:bg-white selection:text-black">

            {/* Left Section: Information & Social Proof */}
            <div className="hidden md:flex md:w-1/2 lg:w-3/5 p-12 lg:p-24 flex-col justify-between relative overflow-hidden bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
                {/* Subtle decorative background element */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-48 -mt-48"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-12">
                        <Image src="/logo/cantech-logo.svg" alt="Logo" width={130} height={55} />
                    </div>

                    <h1 className="text-3xl lg:text-5xl font-extrabold leading-tight mb-8">
                        Enterprise <span className="text-zinc-500">Infrastructure.</span>
                    </h1>

                    <p className="text-zinc-400 text-lg max-w-md mb-10 leading-relaxed">
                        Deploy your applications on our high-performance global network. Managed solutions for scale-hungry businesses.
                    </p>

                    <div className="grid grid-cols-1 gap-4">
                        {services.map((service, i) => (
                            <div key={i} className="flex items-center gap-3 group cursor-default">
                                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                                    {service.icon}
                                </div>
                                <span className="text-zinc-300 group-hover:text-white transition-colors">{service.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 mt-4 space-y-8">
                    {/* Trustpilot Review Section */}
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex gap-1 text-green-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-current" />
                                ))}
                            </div>
                            <span className="text-sm font-medium">Trustpilot 4.9/5</span>
                        </div>
                        <p className="text-zinc-300 italic mb-4">"The fastest deployment I've ever experienced. Their support team is available 24/7 and actually knows what they're doing."</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img src={avatars[0]} className="w-8 h-8 rounded-full border border-white/20" alt="User" />
                                <div>
                                    <p className="text-sm font-bold">Marcus Thorne</p>
                                    <p className="text-xs text-zinc-500">CTO, Vertex Media</p>
                                </div>
                            </div>
                            <ShieldCheck className="w-5 h-5 text-white/20" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                            {avatars.map((url, i) => (
                                <img key={i} src={url} className="w-10 h-10 rounded-full border-2 border-black" alt="Customer" />
                            ))}
                        </div>
                        <div className="text-sm">
                            <span className="font-bold text-white">12k+</span>
                            <span className="text-zinc-500 ml-1">users trusting our cloud</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section: Registration Form */}
            <div className="flex-1 flex flex-col justify-center p-8 sm:p-12 lg:p-16 bg-white text-black overflow-y-auto">
                <div className="w-full mx-auto">
                    <div className="md:hidden flex items-center gap-2 mb-8">
                        <Image src="/logo/cantech-logo-dark.svg" alt="Logo" width={130} height={55} />
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome to Signup!</h2>
                        <p className="text-zinc-500">Let's Get You Started.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* First Name & Last Name */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider font-mulish text-zinc-400" htmlFor="firstName">
                                    First Name<span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    className={`w-full px-4 py-3.5 bg-zinc-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all ${touched.firstName && errors.firstName ? 'border-red-500' : 'border-zinc-200'
                                        }`}
                                    placeholder="Enter your first name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    onBlur={() => handleBlur('firstName')}
                                />
                                {touched.firstName && errors.firstName && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.firstName}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider font-mulish text-zinc-400" htmlFor="lastName">
                                    Last Name<span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    className={`w-full px-4 py-3.5 bg-zinc-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all ${touched.lastName && errors.lastName ? 'border-red-500' : 'border-zinc-200'
                                        }`}
                                    placeholder="Enter your last name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    onBlur={() => handleBlur('lastName')}
                                />
                                {touched.lastName && errors.lastName && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.lastName}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Phone Number with Country Code */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider font-mulish text-zinc-400" htmlFor="phone">
                                Phone No.<span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                                {/* Country Code Dropdown */}
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                        className="flex items-center gap-2 px-3 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all min-w-[100px]"
                                    >
                                        <span className="text-xl">{selectedCountry.flag}</span>
                                        <span className="text-sm font-medium">{selectedCountry.code}</span>
                                        <ChevronDown className="w-4 h-4 text-zinc-400" />
                                    </button>

                                    {showCountryDropdown && (
                                        <div className="absolute top-full left-0 mt-1 w-64 max-h-60 overflow-y-auto bg-white border border-zinc-200 rounded-xl shadow-xl z-50">
                                            {countryCodes.map((country) => (
                                                <button
                                                    key={country.code}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedCountry(country);
                                                        setShowCountryDropdown(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-50 transition-colors text-left"
                                                >
                                                    <span className="text-xl">{country.flag}</span>
                                                    <span className="text-sm">{country.country}</span>
                                                    <span className="text-sm text-zinc-400 ml-auto">{country.code}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Phone Input */}
                                <div className="flex-1 relative">
                                    <input
                                        id="phone"
                                        type="tel"
                                        className={`w-full px-4 py-3.5 bg-zinc-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all ${touched.phone && errors.phone ? 'border-red-500' : 'border-zinc-200'
                                            } ${phoneOtpVerified ? 'pr-10' : ''}`}
                                        placeholder="Enter your phone number"
                                        value={phone}
                                        onChange={(e) => {
                                            setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                                            if (phoneOtpVerified) {
                                                setPhoneOtpVerified(false);
                                                setPhoneOtpSent(false);
                                            }
                                        }}
                                        onBlur={() => handleBlur('phone')}
                                        disabled={phoneOtpVerified}
                                    />
                                    {phoneOtpVerified && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <Check className="w-5 h-5 text-green-500" />
                                        </div>
                                    )}

                                    {/* Verify Button */}
                                    {!phoneOtpVerified && (
                                        <button
                                            type="button"
                                            onClick={handleSendPhoneOtp}
                                            disabled={sendingPhoneOtp || (phoneOtpSent && phoneOtpTimer > 0)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-black hover:text-black transition-colors whitespace-nowrap disabled:opacity-50"
                                        >
                                            {sendingPhoneOtp ? (
                                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                            ) : phoneOtpSent && phoneOtpTimer > 0 ? (
                                                `Resend (${phoneOtpTimer}s)`
                                            ) : phoneOtpSent ? (
                                                'Resend OTP'
                                            ) : (
                                                'Verify Mobile (Send OTP)'
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                            {touched.phone && errors.phone && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.phone}
                                </p>
                            )}

                            {/* OTP Input */}
                            {phoneOtpSent && !phoneOtpVerified && (
                                <div className="mt-4 p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                                    <p className="text-sm text-zinc-600 mb-3">Enter the 6-digit OTP sent to {selectedCountry.code} {phone}</p>
                                    <div className="flex gap-2 justify-center mb-4">
                                        {phoneOtp.map((digit, index) => (
                                            <input
                                                key={index}
                                                id={`otp-${index}`}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value, phoneOtp, setPhoneOtp)}
                                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                className="w-12 h-12 text-center text-xl font-bold bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
                                            />
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleVerifyPhoneOtp}
                                        disabled={phoneOtp.join('').length !== 6 || verifyingPhoneOtp}
                                        className="w-full py-3 bg-black text-white rounded-xl font-bold text-sm hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {verifyingPhoneOtp ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Check className="w-4 h-4" />
                                                Verify OTP
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                            {phoneOtpVerified && (
                                <p className="text-xs text-green-500 flex items-center gap-1">
                                    <Check className="w-3 h-3" />
                                    Phone number verified successfully
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider font-mulish text-zinc-400" htmlFor="email">
                                Email<span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    className={`w-full px-4 py-3.5 bg-zinc-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all ${touched.email && errors.email ? 'border-red-500' : 'border-zinc-200'
                                        }`}
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onBlur={() => handleBlur('email')}
                                />
                                {emailOtpVerified && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <Check className="w-5 h-5 text-green-500" />
                                    </div>
                                )}

                                {/* Verify Button */}
                                {!emailOtpVerified && (
                                    <button
                                        type="button"
                                        onClick={handleSendEmailOtp}
                                        disabled={sendingEmailOtp || (emailOtpSent && emailOtpTimer > 0)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-black hover:text-black transition-colors whitespace-nowrap disabled:opacity-50"
                                    >
                                        {sendingEmailOtp ? (
                                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        ) : emailOtpSent && emailOtpTimer > 0 ? (
                                            `Resend (${emailOtpTimer}s)`
                                        ) : emailOtpSent ? (
                                            'Resend Code'
                                        ) : (
                                            'Verify Email'
                                        )}
                                    </button>
                                )}
                            </div>
                            {touched.email && errors.email && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.email}
                                </p>
                            )}

                            {/* OTP Input */}
                            {emailOtpSent && !emailOtpVerified && (
                                <div className="mt-4 p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                                    <p className="text-sm text-zinc-600 mb-3">Enter the 6-digit OTP sent to {email}</p>
                                    <div className="flex gap-2 justify-center mb-4">
                                        {emailOtp.map((digit, index) => (
                                            <input
                                                key={index}
                                                id={`otp-${index}`}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value, emailOtp, setEmailOtp)}
                                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                className="w-12 h-12 text-center text-xl font-bold bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
                                            />
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleVerifyEmailOtp}
                                        disabled={emailOtp.join('').length !== 6 || verifyingEmailOtp}
                                        className="w-full py-3 bg-black text-white rounded-xl font-bold text-sm hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {verifyingEmailOtp ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Check className="w-4 h-4" />
                                                Verify OTP
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                            {emailOtpVerified && (
                                <p className="text-xs text-green-500 flex items-center gap-1">
                                    <Check className="w-3 h-3" />
                                    Email verified successfully
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider font-mulish text-zinc-400" htmlFor="password">
                                Password<span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className={`w-full px-4 py-3.5 pr-12 bg-zinc-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all ${touched.password && errors.password ? 'border-red-500' : 'border-zinc-200'
                                        }`}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onBlur={() => handleBlur('password')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {/* Password Strength Indicator */}
                            {password && (
                                <div className="space-y-1">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((level) => (
                                            <div
                                                key={level}
                                                className={`h-1 flex-1 rounded-full transition-all ${level <= passwordStrength.strength ? passwordStrength.color : 'bg-zinc-200'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className={`text-xs ${passwordStrength.color.replace('bg-', 'text-')}`}>
                                        Password strength: {passwordStrength.label}
                                    </p>
                                </div>
                            )}
                            {touched.password && errors.password && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider font-mulish text-zinc-400" htmlFor="confirmPassword">
                                Confirm Password<span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    className={`w-full px-4 py-3.5 pr-12 bg-zinc-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all ${touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : 'border-zinc-200'
                                        }`}
                                    placeholder="Enter your confirm password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onBlur={() => handleBlur('confirmPassword')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors"
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {confirmPassword && password === confirmPassword && (
                                <p className="text-xs text-green-500 flex items-center gap-1">
                                    <Check className="w-3 h-3" />
                                    Passwords match
                                </p>
                            )}
                            {touched.confirmPassword && errors.confirmPassword && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>
                        <div id="recaptcha-container" className="hidden"></div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all active:scale-[0.98] disabled:opacity-70"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    SIGN UP
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-zinc-500">
                        Already have an account? <Link href="/login" className="font-bold text-black hover:underline">LOGIN</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}