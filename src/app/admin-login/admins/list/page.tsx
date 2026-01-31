"use client";

import React, { useState } from "react";

interface Admin {
    id: string;
    name: string;
    email: string;
    mobile: string;
    role: string;
    status: string;
    lastLogin: string;
    avatar: string;
}

// Helper function to get relative time
const getRelativeTime = (dateString: string | undefined | null): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString.replace(" ", "T"));
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const intervals = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "week", seconds: 604800 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
    ];
    for (const interval of intervals) {
        const count = Math.floor(diffInSeconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
        }
    }
    return "Just now";
};

const Modal = ({ isOpen, onClose, title, children, size = "md" }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: "md" | "lg" | "xl" }) => {
    if (!isOpen) return null;
    const sizeClasses = {
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl"
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative z-10 w-full ${sizeClasses[size]} mx-4 bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-white/[0.1] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto`}>
                <div className="flex items-center justify-between p-6 border-b border-white/[0.08] sticky top-0 bg-[#1a1a1a]">
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">{title}</h3>
                    <button onClick={onClose} className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    const config: Record<string, { className: string }> = {
        active: { className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
        inactive: { className: "bg-white/[0.06] text-white/50 border-white/[0.08]" },
        suspended: { className: "bg-red-500/20 text-red-400 border-red-500/30" },
    };
    const c = config[status] || config.inactive;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${c.className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

const RoleBadge = ({ role }: { role: string }) => {
    const config: Record<string, { className: string }> = {
        "super-admin": { className: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
        admin: { className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
        moderator: { className: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
        editor: { className: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
        viewer: { className: "bg-white/[0.08] text-white/60 border-white/[0.1]" },
    };
    const c = config[role] || config.viewer;
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${c.className}`}>
            {role.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
        </span>
    );
};

// Mock data
const mockAdmins: Admin[] = [
    { id: "ADM001", name: "John Smith", email: "john@admin.com", mobile: "+91 9876543210", role: "super-admin", status: "active", lastLogin: "2026-01-31 10:30", avatar: "JS" },
    { id: "ADM002", name: "Sarah Johnson", email: "sarah@admin.com", mobile: "+91 9876543211", role: "admin", status: "active", lastLogin: "2026-01-30 15:45", avatar: "SJ" },
    { id: "ADM003", name: "Mike Davis", email: "mike@admin.com", mobile: "+91 9876543212", role: "admin", status: "active", lastLogin: "2026-01-29 09:20", avatar: "MD" },
    { id: "ADM004", name: "Emily Brown", email: "emily@admin.com", mobile: "+91 9876543213", role: "admin", status: "inactive", lastLogin: "2026-01-15 14:10", avatar: "EB" },
    { id: "ADM005", name: "Alex Wilson", email: "alex@admin.com", mobile: "+91 9876543214", role: "super-admin", status: "active", lastLogin: "2026-01-10 11:00", avatar: "AW" },
];

export default function AdminList() {
    const [admins] = useState<Admin[]>(mockAdmins);
    const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
    const [modalType, setModalType] = useState<"view" | "create" | "edit" | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Form state for create/edit
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        role: "admin",
        status: "active",
        password: "",
        confirmPassword: "",
    });

    // Validation errors state
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Trim all values
        const trimmedName = formData.name.trim();
        const trimmedEmail = formData.email.trim();
        const trimmedMobile = formData.mobile.trim();
        const trimmedPassword = formData.password.trim();
        const trimmedConfirmPassword = formData.confirmPassword.trim();

        // Full Name validation
        if (!trimmedName) {
            newErrors.name = "Full name is required";
        }

        // Email validation
        if (!trimmedEmail) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            newErrors.email = "Please enter a valid email";
        }

        // Mobile validation
        if (!trimmedMobile) {
            newErrors.mobile = "Mobile number is required";
        }

        // Password validation (required on create, optional on edit)
        if (modalType === "create") {
            if (!trimmedPassword) {
                newErrors.password = "Password is required";
            } else if (trimmedPassword.length < 6) {
                newErrors.password = "Password must be at least 6 characters";
            }
        }

        // Confirm password validation (only if password is entered)
        if (trimmedPassword || trimmedConfirmPassword) {
            if (trimmedPassword !== trimmedConfirmPassword) {
                newErrors.confirmPassword = "Passwords do not match";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submit
    const handleSubmit = () => {
        if (!validateForm()) return;

        // Trim all values before submitting
        const submitData = {
            ...formData,
            name: formData.name.trim(),
            email: formData.email.trim(),
            mobile: formData.mobile.trim(),
            password: formData.password.trim(),
        };

        console.log("Submitting:", submitData);
        // TODO: API call here

        // Close modal on success
        setSelectedAdmin(null);
        setModalType(null);
        setErrors({});
    };

    // Clear errors when modal closes
    const closeModal = () => {
        setSelectedAdmin(null);
        setModalType(null);
        setErrors({});
    };

    const filteredAdmins = admins.filter((admin) =>
        admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openCreateModal = () => {
        setFormData({ name: "", email: "", mobile: "", role: "admin", status: "active", password: "", confirmPassword: "" });
        setErrors({});
        setModalType("create");
    };

    const openEditModal = (admin: Admin) => {
        setSelectedAdmin(admin);
        setFormData({ name: admin.name, email: admin.email, mobile: admin.mobile, role: admin.role, status: admin.status, password: "", confirmPassword: "" });
        setErrors({});
        setModalType("edit");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent mb-2">Admin Management</h1>
                    {/* <p className="text-white/40">Manage administrators and their access levels.</p> */}
                </div>
                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-white/15 to-white/10 hover:from-white/20 hover:to-white/15 text-white font-medium transition-all border border-white/[0.1]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                    Add Admin
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08]">
                    <p className="text-white/50 text-sm mb-1">Total Admins</p>
                    <p className="text-2xl font-bold text-white/90">{admins.length}</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08]">
                    <p className="text-white/50 text-sm mb-1">Active</p>
                    <p className="text-2xl font-bold text-emerald-400">{admins.filter(a => a.status === "active").length}</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08]">
                    <p className="text-white/50 text-sm mb-1">Super Admins</p>
                    <p className="text-2xl font-bold text-purple-400">{admins.filter(a => a.role === "super-admin").length}</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08]">
                    <p className="text-white/50 text-sm mb-1">Suspended</p>
                    <p className="text-2xl font-bold text-red-400">{admins.filter(a => a.status === "suspended").length}</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                <input
                    type="text"
                    placeholder="Search by name, email, or role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08] text-white/90 placeholder-white/30 focus:outline-none focus:border-white/[0.2]"
                />
            </div>

            {/* Table */}
            <div className="rounded-2xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08] overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/[0.08]">
                            <th className="text-left py-4 px-6 text-white/50 text-sm font-medium">Users Name</th>
                            <th className="text-left py-4 px-6 text-white/50 text-sm font-medium hidden md:table-cell">Users Email</th>
                            <th className="text-left py-4 px-6 text-white/50 text-sm font-medium">Role</th>
                            <th className="text-left py-4 px-6 text-white/50 text-sm font-medium hidden lg:table-cell">Status</th>
                            <th className="text-left py-4 px-6 text-white/50 text-sm font-medium hidden lg:table-cell">Last Login</th>
                            <th className="text-right py-4 px-6 text-white/50 text-sm font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAdmins.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-white/40">
                                    {searchQuery ? "No admins found matching your search." : "No admins found."}
                                </td>
                            </tr>
                        ) : (
                            filteredAdmins.map((admin) => (
                                <tr key={admin.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/15 to-white/5 flex items-center justify-center border border-white/[0.1]">
                                                <span className="text-white/80 font-semibold text-sm">{admin.avatar}</span>
                                            </div>
                                            <div>
                                                <p className="text-white/90 font-medium">{admin.name}</p>
                                                <p className="text-white/40 text-sm md:hidden">{admin.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 hidden md:table-cell">
                                        <p className="text-white/70">{admin.email}</p>
                                    </td>
                                    <td className="py-4 px-6">
                                        <RoleBadge role={admin.role} />
                                    </td>
                                    <td className="py-4 px-6 hidden lg:table-cell">
                                        <StatusBadge status={admin.status} />
                                    </td>
                                    <td className="py-4 px-6 hidden lg:table-cell">
                                        <div className="flex flex-col">
                                            <span className="text-white/80">{admin.lastLogin}</span>
                                            <span className="text-white/40 text-sm">{getRelativeTime(admin.lastLogin)}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => { setSelectedAdmin(admin); setModalType("view"); }}
                                                className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05]"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                            </button>
                                            <button
                                                onClick={() => openEditModal(admin)}
                                                className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05]"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* View Modal */}
            <Modal isOpen={modalType === "view"} onClose={() => { setSelectedAdmin(null); setModalType(null); }} title="Admin Details">
                {selectedAdmin && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border border-white/[0.12]">
                                <span className="text-white font-bold text-xl">{selectedAdmin.avatar}</span>
                            </div>
                            <div>
                                <h4 className="text-white/90 font-semibold text-lg">{selectedAdmin.name}</h4>
                                <div className="flex gap-2 mt-1">
                                    <RoleBadge role={selectedAdmin.role} />
                                    <StatusBadge status={selectedAdmin.status} />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                                <p className="text-white/40 text-sm">Email</p>
                                <p className="text-white/80">{selectedAdmin.email}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                                <p className="text-white/40 text-sm">Last Login</p>
                                <p className="text-white/80">{selectedAdmin.lastLogin}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => { setSelectedAdmin(null); setModalType(null); }}
                            className="w-full py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-white/70 font-medium"
                        >
                            Close
                        </button>
                    </div>
                )}
            </Modal>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={modalType === "create" || modalType === "edit"}
                onClose={closeModal}
                title={modalType === "create" ? "Create Admin" : "Edit Admin"}
                size="xl">
                <div className="space-y-6">
                    {/* Row 1: Full Name & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-white/50 text-sm mb-2">Full Name <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => { setFormData({ ...formData, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: "" }); }}
                                placeholder="Enter full name"
                                className={`w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border ${errors.name ? "border-red-500/50" : "border-white/[0.08]"} text-white/90 focus:border-white/[0.2] focus:outline-none`}
                            />
                            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-white/50 text-sm mb-2">Email <span className="text-red-400">*</span></label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => { setFormData({ ...formData, email: e.target.value }); if (errors.email) setErrors({ ...errors, email: "" }); }}
                                placeholder="Enter email address"
                                className={`w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border ${errors.email ? "border-red-500/50" : "border-white/[0.08]"} text-white/90 focus:border-white/[0.2] focus:outline-none`}
                            />
                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                        </div>
                    </div>

                    {/* Row 2: Mobile & Role */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-white/50 text-sm mb-2">Mobile <span className="text-red-400">*</span></label>
                            <input
                                type="tel"
                                value={formData.mobile}
                                onChange={(e) => { setFormData({ ...formData, mobile: e.target.value }); if (errors.mobile) setErrors({ ...errors, mobile: "" }); }}
                                placeholder="Enter mobile number"
                                className={`w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border ${errors.mobile ? "border-red-500/50" : "border-white/[0.08]"} text-white/90 focus:border-white/[0.2] focus:outline-none`}
                            />
                            {errors.mobile && <p className="text-red-400 text-xs mt-1">{errors.mobile}</p>}
                        </div>
                        <div>
                            <label className="block text-white/50 text-sm mb-2">Role</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-white/[0.08] text-white/90 focus:outline-none cursor-pointer">
                                <option value="super-admin">Super Admin</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>

                    {/* Row 3: New Password & Confirm Password */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-white/50 text-sm mb-2">
                                {modalType === "create" ? "Password" : "New Password"} {modalType === "create" && <span className="text-red-400">*</span>}
                                {modalType === "edit" && <span className="text-white/30 ml-1">(leave blank to keep current)</span>}
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => { setFormData({ ...formData, password: e.target.value }); if (errors.password) setErrors({ ...errors, password: "" }); }}
                                placeholder={modalType === "create" ? "Enter password" : "Enter new password"}
                                className={`w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border ${errors.password ? "border-red-500/50" : "border-white/[0.08]"} text-white/90 focus:border-white/[0.2] focus:outline-none`}
                            />
                            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                        </div>
                        <div>
                            <label className="block text-white/50 text-sm mb-2">Confirm Password {modalType === "create" && <span className="text-red-400">*</span>}</label>
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => { setFormData({ ...formData, confirmPassword: e.target.value }); if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" }); }}
                                placeholder="Confirm password"
                                className={`w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border ${errors.confirmPassword ? "border-red-500/50" : "border-white/[0.08]"} text-white/90 focus:border-white/[0.2] focus:outline-none`}
                            />
                            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                        </div>
                    </div>

                    {/* Row 4: Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-white/50 text-sm mb-2">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-white/[0.08] text-white/90 focus:outline-none cursor-pointer">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={closeModal}
                            className="flex-1 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-white/70 font-medium transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-white/15 to-white/10 hover:from-white/20 hover:to-white/15 text-white font-medium border border-white/[0.1] transition-all">
                            {modalType === "create" ? "Create Admin" : "Save Changes"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
