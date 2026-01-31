"use client";

import React from "react";
import Link from "next/link";

// Stats Card Component
const StatsCard = ({
    title,
    value,
    change,
    changeType,
    icon,
}: {
    title: string;
    value: string;
    change: string;
    changeType: "up" | "down";
    icon: React.ReactNode;
}) => (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08] p-6 hover:border-white/[0.15] transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-white/10 to-transparent opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-500" />
        <div className="relative">
            <div className="flex items-center justify-between mb-4">
                <span className="text-white/50 text-sm font-medium">{title}</span>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/[0.08]">
                    {icon}
                </div>
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-4xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent mb-1">{value}</p>
                    <p className={`text-sm font-medium ${changeType === "up" ? "text-white/60" : "text-white/40"}`}>
                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full mr-1 ${changeType === "up" ? "bg-white/10" : "bg-white/5"}`}>
                            {changeType === "up" ? "↑" : "↓"}
                        </span>
                        {change} from last month
                    </p>
                </div>
            </div>
        </div>
    </div>
);

// Quick Action Card
const QuickAction = ({
    title,
    description,
    href,
    icon,
}: {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
}) => (
    <Link
        href={href}
        className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08] hover:border-white/[0.15] transition-all duration-300"
    >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/[0.08] group-hover:scale-110 group-hover:border-white/[0.15] transition-all duration-300">
            {icon}
        </div>
        <div className="flex-1">
            <h3 className="font-semibold text-white group-hover:text-white transition-colors">{title}</h3>
            <p className="text-white/40 text-sm">{description}</p>
        </div>
        <svg className="w-5 h-5 text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    </Link>
);

// Recent Activity Item
const ActivityItem = ({
    user,
    action,
    time,
    status,
}: {
    user: string;
    action: string;
    time: string;
    status: "approved" | "rejected" | "pending";
}) => {
    const statusConfig = {
        approved: {
            bg: "bg-gradient-to-r from-white/10 to-white/5",
            text: "text-white/70",
            border: "border-white/[0.15]",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            ),
        },
        rejected: {
            bg: "bg-gradient-to-r from-white/5 to-white/[0.02]",
            text: "text-white/50",
            border: "border-white/[0.08]",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" x2="6" y1="6" y2="18" />
                    <line x1="6" x2="18" y1="6" y2="18" />
                </svg>
            ),
        },
        pending: {
            bg: "bg-gradient-to-r from-white/[0.08] to-white/[0.03]",
            text: "text-white/60",
            border: "border-white/[0.1]",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
            ),
        },
    };

    const config = statusConfig[status];

    return (
        <div className="flex items-center gap-4 py-4 border-b border-white/[0.06] last:border-0 hover:bg-white/[0.02] px-3 -mx-3 rounded-lg transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/15 to-white/5 flex items-center justify-center flex-shrink-0 border border-white/[0.1]">
                <span className="text-white/80 font-semibold text-sm">
                    {user.split(" ").map(n => n[0]).join("")}
                </span>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-white/90 font-medium truncate">{user}</p>
                <p className="text-white/40 text-sm truncate">{action}</p>
            </div>
            <div className="text-right">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}>
                    {config.icon}
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
                <p className="text-white/30 text-xs mt-1">{time}</p>
            </div>
        </div>
    );
};

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent mb-2">Dashboard Overview</h1>
                <p className="text-white/40">Monitor your KYC verifications and user management.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Users"
                    value="2,847"
                    change="12.5%"
                    changeType="up"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    }
                />
                <StatsCard
                    title="Pending KYC"
                    value="156"
                    change="8.2%"
                    changeType="up"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                    }
                />
                <StatsCard
                    title="Approved"
                    value="2,458"
                    change="18.3%"
                    changeType="up"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    }
                />
                <StatsCard
                    title="Rejected"
                    value="233"
                    change="3.1%"
                    changeType="down"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" x2="9" y1="9" y2="15" />
                            <line x1="9" x2="15" y1="9" y2="15" />
                        </svg>
                    }
                />
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-lg font-semibold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Quick Actions</h2>
                    <div className="space-y-3">
                        <QuickAction
                            title="Review Pending KYC"
                            description="156 awaiting review"
                            href="/admin-login/kyc/pending"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                            }
                        />
                        <QuickAction
                            title="Add New User"
                            description="Create a new user account"
                            href="/admin-login/users/create"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <line x1="19" x2="19" y1="8" y2="14" />
                                    <line x1="22" x2="16" y1="11" y2="11" />
                                </svg>
                            }
                        />
                        <QuickAction
                            title="View All Users"
                            description="Manage user accounts"
                            href="/admin-login/users/list"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            }
                        />
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Recent Activity</h2>
                        <Link
                            href="/admin-login/kyc/pending"
                            className="text-sm text-white/50 hover:text-white/80 transition-colors flex items-center gap-1"
                        >
                            View all
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                    <div className="rounded-2xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08] p-6">
                        <ActivityItem
                            user="John Smith"
                            action="Submitted KYC documents for verification"
                            time="2 min ago"
                            status="pending"
                        />
                        <ActivityItem
                            user="Sarah Johnson"
                            action="KYC verification approved"
                            time="15 min ago"
                            status="approved"
                        />
                        <ActivityItem
                            user="Michael Brown"
                            action="KYC documents rejected - unclear photo"
                            time="1 hour ago"
                            status="rejected"
                        />
                        <ActivityItem
                            user="Emily Davis"
                            action="KYC verification approved"
                            time="2 hours ago"
                            status="approved"
                        />
                        <ActivityItem
                            user="Robert Wilson"
                            action="Submitted KYC documents for verification"
                            time="3 hours ago"
                            status="pending"
                        />
                    </div>
                </div>
            </div>

            {/* KYC Status Overview */}
            <div className="rounded-2xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08] p-6">
                <h2 className="text-lg font-semibold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent mb-6">KYC Status Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Pending */}
                    <Link href="/admin-login/kyc/pending" className="group">
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.1] p-6 hover:border-white/[0.2] transition-all duration-300 hover:shadow-lg hover:shadow-white/[0.03]">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-500" />
                            <div className="relative">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white/15 to-white/5 flex items-center justify-center border border-white/[0.1] group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-white/80 font-bold text-lg">Pending</p>
                                        <p className="text-white/40 text-sm">Awaiting review</p>
                                    </div>
                                </div>
                                <p className="text-5xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">156</p>
                            </div>
                        </div>
                    </Link>

                    {/* Approved */}
                    <Link href="/admin-login/kyc/approved" className="group">
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.03] border border-white/[0.12] p-6 hover:border-white/[0.25] transition-all duration-300 hover:shadow-lg hover:shadow-white/[0.05]">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/15 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-500" />
                            <div className="relative">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center border border-white/[0.15] group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                            <polyline points="22 4 12 14.01 9 11.01" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-white/90 font-bold text-lg">Approved</p>
                                        <p className="text-white/40 text-sm">Verified users</p>
                                    </div>
                                </div>
                                <p className="text-5xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">2,458</p>
                            </div>
                        </div>
                    </Link>

                    {/* Rejected */}
                    <Link href="/admin-login/kyc/rejected" className="group">
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] p-6 hover:border-white/[0.15] transition-all duration-300 hover:shadow-lg hover:shadow-white/[0.02]">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/[0.08] to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-500" />
                            <div className="relative">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white/10 to-white/[0.03] flex items-center justify-center border border-white/[0.08] group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="15" x2="9" y1="9" y2="15" />
                                            <line x1="9" x2="15" y1="9" y2="15" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-white/70 font-bold text-lg">Rejected</p>
                                        <p className="text-white/30 text-sm">Failed verification</p>
                                    </div>
                                </div>
                                <p className="text-5xl font-bold bg-gradient-to-r from-white/80 to-white/50 bg-clip-text text-transparent">233</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
