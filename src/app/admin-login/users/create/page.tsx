"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateUser() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "", lastName: "", email: "", phone: "", role: "User", password: "", confirmPassword: "",
        sendWelcomeEmail: true, requireKyc: true
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        router.push("/admin-login/users/list");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent mb-2">Create New User</h1>
                <p className="text-white/40">Add a new user to the system.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08]">
                    <h2 className="text-lg font-semibold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent mb-6 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        Personal Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className="block text-white/50 text-sm mb-2">First Name *</label><input type="text" required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-white/[0.08] text-white/90 placeholder-white/30 focus:outline-none focus:border-white/[0.2]" placeholder="Enter first name" /></div>
                        <div><label className="block text-white/50 text-sm mb-2">Last Name *</label><input type="text" required value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-white/[0.08] text-white/90 placeholder-white/30 focus:outline-none focus:border-white/[0.2]" placeholder="Enter last name" /></div>
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08]">
                    <h2 className="text-lg font-semibold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent mb-6 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                        Contact Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className="block text-white/50 text-sm mb-2">Email Address *</label><input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-white/[0.08] text-white/90 placeholder-white/30 focus:outline-none focus:border-white/[0.2]" placeholder="email@example.com" /></div>
                        <div><label className="block text-white/50 text-sm mb-2">Phone Number</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-white/[0.08] text-white/90 placeholder-white/30 focus:outline-none focus:border-white/[0.2]" placeholder="+1 234 567 8901" /></div>
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08]">
                    <h2 className="text-lg font-semibold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent mb-6 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        Account Settings
                    </h2>
                    <div className="space-y-6">
                        <div><label className="block text-white/50 text-sm mb-2">Role *</label><select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-white/[0.08] text-white/90 focus:outline-none focus:border-white/[0.2] cursor-pointer"><option value="User">User</option><option value="Moderator">Moderator</option><option value="Admin">Admin</option></select></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="block text-white/50 text-sm mb-2">Password *</label><input type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-white/[0.08] text-white/90 placeholder-white/30 focus:outline-none focus:border-white/[0.2]" placeholder="••••••••" /></div>
                            <div><label className="block text-white/50 text-sm mb-2">Confirm Password *</label><input type="password" required value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-white/[0.08] text-white/90 placeholder-white/30 focus:outline-none focus:border-white/[0.2]" placeholder="••••••••" /></div>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08]">
                    <h2 className="text-lg font-semibold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent mb-6 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                        Additional Options
                    </h2>
                    <div className="space-y-4">
                        <label className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer hover:bg-white/[0.04] transition-colors">
                            <input type="checkbox" checked={formData.sendWelcomeEmail} onChange={(e) => setFormData({ ...formData, sendWelcomeEmail: e.target.checked })} className="w-5 h-5 rounded border-white/[0.2] bg-[#0f0f0f] text-white focus:ring-white/20 focus:ring-offset-0" />
                            <div><p className="text-white/80 font-medium">Send Welcome Email</p><p className="text-white/40 text-sm">Send login credentials to user&apos;s email</p></div>
                        </label>
                        <label className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer hover:bg-white/[0.04] transition-colors">
                            <input type="checkbox" checked={formData.requireKyc} onChange={(e) => setFormData({ ...formData, requireKyc: e.target.checked })} className="w-5 h-5 rounded border-white/[0.2] bg-[#0f0f0f] text-white focus:ring-white/20 focus:ring-offset-0" />
                            <div><p className="text-white/80 font-medium">Require KYC Verification</p><p className="text-white/40 text-sm">User must complete identity verification</p></div>
                        </label>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button type="button" onClick={() => router.back()} className="flex-1 py-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-white/70 font-medium transition-colors">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 py-4 rounded-xl bg-gradient-to-r from-white/15 to-white/10 hover:from-white/20 hover:to-white/15 text-white font-medium transition-all border border-white/[0.1] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {isSubmitting ? (<><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Creating...</>) : "Create User"}
                    </button>
                </div>
            </form>
        </div>
    );
}
