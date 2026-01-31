"use client";

import React, { useState } from "react";

interface Permission {
    id: string;
    name: string;
    description: string;
    module: string;
}

interface Role {
    id: string;
    name: string;
    description: string;
    permissions: string[];
    usersCount: number;
    createdAt: string;
}

const Modal = ({ isOpen, onClose, title, children, size = "md" }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: "md" | "lg" }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative z-10 w-full ${size === "lg" ? "max-w-2xl" : "max-w-lg"} mx-4 bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-white/[0.1] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto`}>
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

// All available permissions grouped by module
const allPermissions: Permission[] = [
    // Dashboard
    { id: "dashboard.view", name: "View Dashboard", description: "Access to dashboard overview", module: "Dashboard" },
    { id: "dashboard.analytics", name: "View Analytics", description: "Access to analytics data", module: "Dashboard" },

    // User Management
    { id: "users.view", name: "View Users", description: "View user list and details", module: "User Management" },
    { id: "users.create", name: "Create Users", description: "Create new users", module: "User Management" },
    { id: "users.edit", name: "Edit Users", description: "Edit user information", module: "User Management" },
    { id: "users.delete", name: "Delete Users", description: "Delete users from system", module: "User Management" },
    { id: "users.export", name: "Export Users", description: "Export user data", module: "User Management" },

    // KYC Management
    { id: "kyc.view", name: "View KYC", description: "View KYC submissions", module: "KYC Management" },
    { id: "kyc.approve", name: "Approve KYC", description: "Approve KYC submissions", module: "KYC Management" },
    { id: "kyc.reject", name: "Reject KYC", description: "Reject KYC submissions", module: "KYC Management" },

    // Admin Management
    { id: "admins.view", name: "View Admins", description: "View admin list", module: "Admin Management" },
    { id: "admins.create", name: "Create Admins", description: "Create new admins", module: "Admin Management" },
    { id: "admins.edit", name: "Edit Admins", description: "Edit admin information", module: "Admin Management" },
    { id: "admins.delete", name: "Delete Admins", description: "Remove admins", module: "Admin Management" },

    // Role Management
    { id: "roles.view", name: "View Roles", description: "View roles and permissions", module: "Role Management" },
    { id: "roles.create", name: "Create Roles", description: "Create new roles", module: "Role Management" },
    { id: "roles.edit", name: "Edit Roles", description: "Edit role permissions", module: "Role Management" },
    { id: "roles.delete", name: "Delete Roles", description: "Delete roles", module: "Role Management" },

    // Settings
    { id: "settings.view", name: "View Settings", description: "View system settings", module: "Settings" },
    { id: "settings.edit", name: "Edit Settings", description: "Modify system settings", module: "Settings" },
];

// Mock roles data
const mockRoles: Role[] = [
    {
        id: "role-1",
        name: "Super Admin",
        description: "Full system access with all permissions",
        permissions: allPermissions.map(p => p.id),
        usersCount: 2,
        createdAt: "2025-01-01",
    },
    {
        id: "role-2",
        name: "Admin",
        description: "Administrative access without role management",
        permissions: ["dashboard.view", "dashboard.analytics", "users.view", "users.create", "users.edit", "kyc.view", "kyc.approve", "kyc.reject", "admins.view"],
        usersCount: 5,
        createdAt: "2025-01-15",
    },
    {
        id: "role-3",
        name: "Moderator",
        description: "User and KYC management",
        permissions: ["dashboard.view", "users.view", "users.edit", "kyc.view", "kyc.approve", "kyc.reject"],
        usersCount: 8,
        createdAt: "2025-02-01",
    },
    {
        id: "role-4",
        name: "Editor",
        description: "Limited user management",
        permissions: ["dashboard.view", "users.view", "users.edit"],
        usersCount: 12,
        createdAt: "2025-03-01",
    },
    {
        id: "role-5",
        name: "Viewer",
        description: "Read-only access",
        permissions: ["dashboard.view", "users.view", "kyc.view"],
        usersCount: 20,
        createdAt: "2025-03-15",
    },
];

// Group permissions by module
const groupedPermissions = allPermissions.reduce((acc, perm) => {
    if (!acc[perm.module]) acc[perm.module] = [];
    acc[perm.module].push(perm);
    return acc;
}, {} as Record<string, Permission[]>);

export default function RolesPermissions() {
    const [roles, setRoles] = useState<Role[]>(mockRoles);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [modalType, setModalType] = useState<"view" | "create" | "edit" | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        permissions: [] as string[],
    });

    const filteredRoles = roles.filter((role) =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openCreateModal = () => {
        setFormData({ name: "", description: "", permissions: [] });
        setModalType("create");
    };

    const openEditModal = (role: Role) => {
        setSelectedRole(role);
        setFormData({ name: role.name, description: role.description, permissions: [...role.permissions] });
        setModalType("edit");
    };

    const togglePermission = (permId: string) => {
        setFormData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(permId)
                ? prev.permissions.filter(p => p !== permId)
                : [...prev.permissions, permId]
        }));
    };

    const toggleModulePermissions = (module: string) => {
        const modulePermIds = groupedPermissions[module].map(p => p.id);
        const allSelected = modulePermIds.every(id => formData.permissions.includes(id));

        setFormData(prev => ({
            ...prev,
            permissions: allSelected
                ? prev.permissions.filter(p => !modulePermIds.includes(p))
                : [...new Set([...prev.permissions, ...modulePermIds])]
        }));
    };

    const selectAllPermissions = () => {
        setFormData(prev => ({
            ...prev,
            permissions: allPermissions.map(p => p.id)
        }));
    };

    const clearAllPermissions = () => {
        setFormData(prev => ({ ...prev, permissions: [] }));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent mb-2">Roles & Permissions</h1>
                    <p className="text-white/40">Manage roles and their access permissions.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-white/15 to-white/10 hover:from-white/20 hover:to-white/15 text-white font-medium transition-all border border-white/[0.1]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                    Create Role
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08]">
                    <p className="text-white/50 text-sm mb-1">Total Roles</p>
                    <p className="text-2xl font-bold text-white/90">{roles.length}</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08]">
                    <p className="text-white/50 text-sm mb-1">Total Permissions</p>
                    <p className="text-2xl font-bold text-blue-400">{allPermissions.length}</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08]">
                    <p className="text-white/50 text-sm mb-1">Permission Modules</p>
                    <p className="text-2xl font-bold text-purple-400">{Object.keys(groupedPermissions).length}</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08]">
                    <p className="text-white/50 text-sm mb-1">Assigned Users</p>
                    <p className="text-2xl font-bold text-emerald-400">{roles.reduce((sum, r) => sum + r.usersCount, 0)}</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                <input
                    type="text"
                    placeholder="Search roles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08] text-white/90 placeholder-white/30 focus:outline-none focus:border-white/[0.2]"
                />
            </div>

            {/* Roles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRoles.map((role) => (
                    <div
                        key={role.id}
                        className="p-5 rounded-2xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08] hover:border-white/[0.15] transition-colors"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-white/90 font-semibold text-lg">{role.name}</h3>
                                <p className="text-white/40 text-sm mt-1">{role.description}</p>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => { setSelectedRole(role); setModalType("view"); }}
                                    className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05]"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                </button>
                                <button
                                    onClick={() => openEditModal(role)}
                                    className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05]"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                <span className="text-white/60 text-sm">{role.usersCount} users</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                <span className="text-white/60 text-sm">{role.permissions.length} permissions</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                            {Object.keys(groupedPermissions).slice(0, 4).map((module) => {
                                const hasAny = groupedPermissions[module].some(p => role.permissions.includes(p.id));
                                return (
                                    <span
                                        key={module}
                                        className={`px-2 py-0.5 rounded text-[10px] font-medium ${hasAny
                                                ? "bg-white/[0.08] text-white/60"
                                                : "bg-white/[0.03] text-white/30"
                                            }`}
                                    >
                                        {module}
                                    </span>
                                );
                            })}
                            {Object.keys(groupedPermissions).length > 4 && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/[0.05] text-white/40">
                                    +{Object.keys(groupedPermissions).length - 4} more
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* View Modal */}
            <Modal isOpen={modalType === "view"} onClose={() => { setSelectedRole(null); setModalType(null); }} title="Role Details" size="lg">
                {selectedRole && (
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-white/90 font-semibold text-lg">{selectedRole.name}</h4>
                            <p className="text-white/50 mt-1">{selectedRole.description}</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center">
                                <p className="text-white/40 text-xs">Users</p>
                                <p className="text-white/90 font-semibold">{selectedRole.usersCount}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center">
                                <p className="text-white/40 text-xs">Permissions</p>
                                <p className="text-white/90 font-semibold">{selectedRole.permissions.length}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center">
                                <p className="text-white/40 text-xs">Created</p>
                                <p className="text-white/90 font-semibold">{selectedRole.createdAt}</p>
                            </div>
                        </div>

                        <div>
                            <h5 className="text-white/70 font-medium mb-3">Permissions by Module</h5>
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                {Object.entries(groupedPermissions).map(([module, perms]) => (
                                    <div key={module} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                                        <p className="text-white/60 text-sm font-medium mb-2">{module}</p>
                                        <div className="flex flex-wrap gap-1">
                                            {perms.map((perm) => (
                                                <span
                                                    key={perm.id}
                                                    className={`px-2 py-0.5 rounded text-[10px] font-medium ${selectedRole.permissions.includes(perm.id)
                                                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                                            : "bg-white/[0.03] text-white/30 border border-white/[0.05]"
                                                        }`}
                                                >
                                                    {perm.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => { setSelectedRole(null); setModalType(null); }}
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
                onClose={() => { setSelectedRole(null); setModalType(null); }}
                title={modalType === "create" ? "Create Role" : "Edit Role"}
                size="lg"
            >
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-white/50 text-sm mb-2">Role Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter role name"
                                className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-white/[0.08] text-white/90 focus:border-white/[0.2] focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-white/50 text-sm mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Enter role description"
                                rows={2}
                                className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-white/[0.08] text-white/90 focus:border-white/[0.2] focus:outline-none resize-none"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-white/50 text-sm">Permissions ({formData.permissions.length} selected)</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={selectAllPermissions}
                                    className="text-xs text-blue-400 hover:text-blue-300"
                                >
                                    Select All
                                </button>
                                <span className="text-white/20">|</span>
                                <button
                                    onClick={clearAllPermissions}
                                    className="text-xs text-white/50 hover:text-white/70"
                                >
                                    Clear All
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                            {Object.entries(groupedPermissions).map(([module, perms]) => {
                                const allSelected = perms.every(p => formData.permissions.includes(p.id));
                                const someSelected = perms.some(p => formData.permissions.includes(p.id));

                                return (
                                    <div key={module} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={allSelected}
                                                    ref={el => { if (el) el.indeterminate = someSelected && !allSelected; }}
                                                    onChange={() => toggleModulePermissions(module)}
                                                    className="w-4 h-4 rounded bg-white/10 border-white/20 text-blue-500 focus:ring-blue-500/50"
                                                />
                                                <span className="text-white/70 text-sm font-medium">{module}</span>
                                            </label>
                                            <span className="text-white/30 text-xs">
                                                {perms.filter(p => formData.permissions.includes(p.id)).length}/{perms.length}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 ml-6">
                                            {perms.map((perm) => (
                                                <label key={perm.id} className="flex items-center gap-2 cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.permissions.includes(perm.id)}
                                                        onChange={() => togglePermission(perm.id)}
                                                        className="w-3.5 h-3.5 rounded bg-white/10 border-white/20 text-blue-500 focus:ring-blue-500/50"
                                                    />
                                                    <span className="text-white/50 text-xs group-hover:text-white/70 transition-colors">{perm.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => { setSelectedRole(null); setModalType(null); }}
                            className="flex-1 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-white/70 font-medium"
                        >
                            Cancel
                        </button>
                        <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-white/15 to-white/10 hover:from-white/20 hover:to-white/15 text-white font-medium border border-white/[0.1]">
                            {modalType === "create" ? "Create Role" : "Save Changes"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
