"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    kycStatus: string;
    createdAt: string;
    updatedAt: string;
    avatar: string;
}

// Helper function to mask email (e.g., b****@gmail.com)
const maskEmail = (email: string): string => {
    const [localPart, domain] = email.split("@");
    if (!localPart || !domain) return email;
    const maskedLocal = localPart.charAt(0) + "****";
    return `${maskedLocal}@${domain}`;
};

// Helper function to get relative time (e.g., "4 months ago")
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

// Verification Badge Component
const VerificationBadge = ({ status }: { status: "verified" | "unverified" }) => {
    const config = {
        verified: { label: "Verified" },
        // pending: { label: "Pending" },
        unverified: { label: "Unverified" }
    };

    const { label } = config[status] || config.unverified;

    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-white/[0.12] to-white/[0.06] text-white/80 border-white/[0.15] text-xs font-medium border w-max">
            {/* <span className="w-1.5 h-1.5 rounded-full bg-current"></span> */}
            {label}
        </span>
    );
};

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-lg mx-4 bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-white/[0.1] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
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
    const config: Record<string, { opacity: string }> = {
        active: { opacity: "from-white/[0.12] to-white/[0.06] text-white/80 border-white/[0.15]" },
        inactive: { opacity: "from-white/[0.06] to-white/[0.03] text-white/50 border-white/[0.08]" },
        suspended: { opacity: "from-white/[0.04] to-white/[0.02] text-white/40 border-white/[0.06]" },
    };
    const c = config[status] || config.inactive;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r ${c.opacity} text-xs font-medium border`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

const KycBadge = ({ status }: { status: string }) => {
    const config: Record<string, { opacity: string; icon: string }> = {
        verified: { opacity: "from-white/[0.1] to-white/[0.05] text-white/80 border-white/[0.12]", icon: "✓" },
        pending: { opacity: "from-white/[0.06] to-white/[0.03] text-white/60 border-white/[0.08]", icon: "⏳" },
        rejected: { opacity: "from-white/[0.04] to-white/[0.02] text-white/40 border-white/[0.06]", icon: "✕" },
    };
    const c = config[status] || config.pending;
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r ${c.opacity} text-xs font-medium border`}>
            {c.icon} {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

const LoadingSkeleton = () => (
    <div className="animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="p-4 rounded-xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08]">
                    <div className="h-4 bg-white/10 rounded w-20 mb-2" />
                    <div className="h-8 bg-white/10 rounded w-16" />
                </div>
            ))}
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08] p-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-4 border-b border-white/[0.04]">
                    <div className="w-10 h-10 rounded-full bg-white/10" />
                    <div className="flex-1">
                        <div className="h-4 bg-white/10 rounded w-32 mb-2" />
                        <div className="h-3 bg-white/10 rounded w-48" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

interface PaginationControlsProps {
    currentPage: number;
    setCurrentPage: (page: number | ((prev: number) => number)) => void;
    itemsPerPage: number;
    setItemsPerPage: (value: number) => void;
    totalItems: number;
    totalPages: number;
    startIndex: number;
    endIndex: number;
    getPageNumbers: () => (number | string)[];
}

const PaginationControls = ({
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    getPageNumbers,
}: PaginationControlsProps) => (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08]">
        {/* Items per page selector */}
        <div className="flex items-center gap-3">
            <span className="text-white/50 text-sm">Showing</span>
            <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-3 py-2 rounded-lg bg-[#0f0f0f] border border-white/[0.08] text-white/90 text-sm focus:outline-none focus:border-white/[0.2] cursor-pointer">
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
            </select>
            <span className="text-white/50 text-sm">of {totalItems}</span>
        </div>

        {/* Page info */}
        {/* <div className="text-white/50 text-sm">
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} Users
        </div> */}

        {/* Pagination buttons */}
        <div className="flex items-center gap-1">
            {/* Previous button */}
            <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
            </button>

            {/* Page numbers */}
            {getPageNumbers().map((page, index) => (
                <button
                    key={index}
                    onClick={() => typeof page === "number" && setCurrentPage(page)}
                    disabled={page === "..."}
                    className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors ${page === currentPage
                        ? "bg-gradient-to-r from-white/15 to-white/10 text-white border border-white/[0.1]"
                        : page === "..."
                            ? "text-white/30 cursor-default"
                            : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                        }`}
                >
                    {page}
                </button>
            ))}

            {/* Next button */}
            <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m9 18 6-6-6-6" />
                </svg>
            </button>
        </div>
    </div>
);

export default function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [modalType, setModalType] = useState<"view" | "edit" | "delete" | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Edit form state
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editStatus, setEditStatus] = useState("");
    const [saveLoading, setSaveLoading] = useState(false);

    // Initialize edit form when selectedUser changes
    useEffect(() => {
        if (selectedUser && modalType === "edit") {
            setEditName(selectedUser.name);
            setEditEmail(selectedUser.email);
            setEditStatus(selectedUser.status);
        }
    }, [selectedUser, modalType]);

    // Handle save user
    const handleSaveUser = async () => {
        if (!selectedUser) return;

        try {
            setSaveLoading(true);
            const response = await fetch("/api/admin/users", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: selectedUser.id,
                    name: editName,
                    email: editEmail,
                    status: editStatus,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Update the user in the local state
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user.id === selectedUser.id ? data.data : user
                    )
                );
                setSelectedUser(null);
                setModalType(null);
            } else {
                alert(data.error || "Failed to update user");
            }
        } catch (err) {
            console.error("Error updating user:", err);
            alert("Failed to update user");
        } finally {
            setSaveLoading(false);
        }
    };

    // Fetch users from API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/admin/users");
                const data = await response.json();

                if (data.success) {
                    setUsers(data.data);
                } else {
                    setError(data.error || "Failed to fetch users");
                }
            } catch (err) {
                setError("Failed to fetch users");
                console.error("Error fetching users:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredData = users.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination calculations
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    // Reset to page 1 when search query or items per page changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, itemsPerPage]);

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push("...");
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push("...");
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push("...");
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push("...");
                pages.push(totalPages);
            }
        }
        return pages;
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent mb-2">Users List</h1>
                        <p className="text-white/40">Manage all registered users in the system.</p>
                    </div>
                </div>
                <LoadingSkeleton />
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent mb-2">User List</h1>
                        <p className="text-white/40">Manage all registered users in the system.</p>
                    </div>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08] p-12 text-center">
                    <svg className="w-12 h-12 mx-auto text-white/30 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-white/60 mb-2">{error}</p>
                    <button onClick={() => window.location.reload()} className="text-white/50 hover:text-white/80 text-sm">Try again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent mb-2">Users List</h1>
                    {/* <p className="text-white/40">Manage all registered users in the system.</p> */}
                </div>
                {/* <Link href="/admin-login/users/create" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-white/15 to-white/10 hover:from-white/20 hover:to-white/15 text-white font-medium transition-all border border-white/[0.1]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                    Add New User
                </Link> */}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08]"><p className="text-white/50 text-sm mb-1">Total Users</p><p className="text-2xl font-bold text-white/90">{users.length}</p></div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08]"><p className="text-white/50 text-sm mb-1">Active</p><p className="text-2xl font-bold text-white/80">{users.filter(u => u.status === "active").length}</p></div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08]"><p className="text-white/50 text-sm mb-1">KYC Verified</p><p className="text-2xl font-bold text-white/80">{users.filter(u => u.kycStatus === "verified").length}</p></div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08]"><p className="text-white/50 text-sm mb-1">Pending KYC</p><p className="text-2xl font-bold text-white/60">{users.filter(u => u.kycStatus === "pending").length}</p></div>
            </div>

            <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                <input type="text" placeholder="Search by name, email, or ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08] text-white/90 placeholder-white/30 focus:outline-none focus:border-white/[0.2]" />
            </div>

            {/* Top Pagination Controls */}
            {totalItems > 0 && (
                <PaginationControls
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                    totalItems={totalItems}
                    totalPages={totalPages}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    getPageNumbers={getPageNumbers}
                />
            )}

            <div className="rounded-2xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08] overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/[0.08]">
                            <th className="text-left py-4 px-6 text-white/50 text-sm font-medium">Full Name</th>
                            <th className="text-left py-4 px-6 text-white/50 text-sm font-medium hidden md:table-cell">Email | Status</th>
                            <th className="text-left py-4 px-6 text-white/50 text-sm font-medium">User Status</th>
                            <th className="text-left py-4 px-6 text-white/50 text-sm font-medium hidden lg:table-cell">KYC Status</th>
                            {/* <th className="text-left py-4 px-6 text-white/50 text-sm font-medium hidden lg:table-cell">Joined At</th> */}
                            <th className="text-left py-4 px-6 text-white/50 text-sm font-medium hidden lg:table-cell">Last Login</th>
                            <th className="text-right py-4 px-6 text-white/50 text-sm font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-white/40">
                                    {searchQuery ? "No users found matching your search." : "No users found."}
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((user) => (
                                <tr key={user.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/15 to-white/5 flex items-center justify-center border border-white/[0.1]">
                                                <span className="text-white/80 font-semibold text-sm">{user.avatar}</span>
                                            </div>
                                            <div><p className="text-white/90 font-medium">{user.name}</p></div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 hidden md:table-cell">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-white/70">{user.email}</p>
                                            {/* <VerificationBadge status="unverified" /> */}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6"><StatusBadge status={user.status} /></td>
                                    <td className="py-4 px-6 hidden lg:table-cell"><KycBadge status={user.kycStatus} /></td>
                                    {/* <td className="py-4 px-6 hidden lg:table-cell">
                                        <div className="flex flex-col">
                                            <span className="text-white/80">{user.createdAt}</span>
                                            <span className="text-white/40 text-sm">{getRelativeTime(user.createdAt)}</span>
                                        </div>
                                    </td> */}
                                    <td className="py-4 px-6 hidden lg:table-cell">
                                        <div className="flex flex-col">
                                            <span className="text-white/80">{user.updatedAt}</span>
                                            <span className="text-white/40 text-sm">{getRelativeTime(user.updatedAt)}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => { setSelectedUser(user); setModalType("view"); }} className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05]"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg></button>
                                            <button onClick={() => { setSelectedUser(user); setModalType("edit"); }} className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05]"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg></button>
                                            {/* <button onClick={() => { setSelectedUser(user); setModalType("delete"); }} className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05]"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /></svg></button> */}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Bottom Pagination Controls */}
            {totalItems > 0 && (
                <PaginationControls
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                    totalItems={totalItems}
                    totalPages={totalPages}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    getPageNumbers={getPageNumbers}
                />
            )}

            <Modal isOpen={modalType === "view"} onClose={() => { setSelectedUser(null); setModalType(null); }} title="User Details">
                {selectedUser && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border border-white/[0.12]"><span className="text-white font-bold text-xl">{selectedUser.avatar}</span></div>
                            <div><h4 className="text-white/90 font-semibold text-lg">{selectedUser.name}</h4><div className="flex gap-2 mt-1"><StatusBadge status={selectedUser.status} /><KycBadge status={selectedUser.kycStatus} /></div></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]"><p className="text-white/40 text-sm">Email</p><p className="text-white/80">{selectedUser.email}</p></div>
                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]"><p className="text-white/40 text-sm">Phone</p><p className="text-white/80">{selectedUser.phone}</p></div>
                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]"><p className="text-white/40 text-sm">Created</p><p className="text-white/80">{selectedUser.createdAt}</p></div>
                        </div>
                        <button onClick={() => { setSelectedUser(null); setModalType(null); }} className="w-full py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-white/70 font-medium">Close</button>
                    </div>
                )}
            </Modal>

            <Modal isOpen={modalType === "edit"} onClose={() => { setSelectedUser(null); setModalType(null); }} title="Edit User">
                {selectedUser && (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-white/50 text-sm mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-white/[0.08] text-white/90 focus:border-white/[0.2] focus:outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-white/50 text-sm mb-2">Email</label>
                                <input
                                    type="email"
                                    value={editEmail}
                                    onChange={(e) => setEditEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-white/[0.08] text-white/90 focus:border-white/[0.2] focus:outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-white/50 text-sm mb-2">Status</label>
                                <select
                                    value={editStatus}
                                    onChange={(e) => setEditStatus(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-white/[0.08] text-white/90 focus:outline-none"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setSelectedUser(null); setModalType(null); }}
                                className="flex-1 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-white/70 font-medium transition-colors"
                                disabled={saveLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveUser}
                                disabled={saveLoading}
                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-white/15 to-white/10 hover:from-white/20 hover:to-white/15 text-white font-medium border border-white/[0.1] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saveLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </span>
                                ) : "Save"}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal isOpen={modalType === "delete"} onClose={() => { setSelectedUser(null); setModalType(null); }} title="Delete User">
                {selectedUser && (
                    <div className="space-y-6">
                        <div className="p-4 rounded-xl bg-gradient-to-r from-white/[0.05] to-white/[0.02] border border-white/[0.08]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /></svg></div>
                                <div><p className="text-white/70 font-medium">Confirm Deletion</p><p className="text-white/40 text-sm">This action cannot be undone.</p></div>
                            </div>
                        </div>
                        <p className="text-white/60">Are you sure you want to delete <span className="text-white font-medium">{selectedUser.name}</span>?</p>
                        <div className="flex gap-3"><button onClick={() => { setSelectedUser(null); setModalType(null); }} className="flex-1 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-white/70 font-medium">Cancel</button><button className="flex-1 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white/80 font-medium border border-white/[0.08]">Delete</button></div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
