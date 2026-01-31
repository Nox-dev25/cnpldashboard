"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Icons as SVG components
const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
);

const KycIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" x2="19" y1="8" y2="14" />
        <line x1="22" x2="16" y1="11" y2="11" />
    </svg>
);

const PendingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const ApproveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const RejectIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" x2="9" y1="9" y2="15" />
        <line x1="9" x2="15" y1="9" y2="15" />
    </svg>
);

const ListIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" x2="21" y1="6" y2="6" />
        <line x1="8" x2="21" y1="12" y2="12" />
        <line x1="8" x2="21" y1="18" y2="18" />
        <line x1="3" x2="3.01" y1="6" y2="6" />
        <line x1="3" x2="3.01" y1="12" y2="12" />
        <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
);

const CreateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="M12 5v14" />
    </svg>
);

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const RolesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const ChevronDown = ({ isOpen }: { isOpen: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
        <path d="m6 9 6 6 6-6" />
    </svg>
);

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" x2="20" y1="12" y2="12" />
        <line x1="4" x2="20" y1="6" y2="6" />
        <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
);

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
);

const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
);

interface NavItem {
    label: string;
    href?: string;
    icon: React.ReactNode;
    children?: { label: string; href: string; icon: React.ReactNode }[];
}

const navItems: NavItem[] = [
    { label: "Dashboard", href: "/admin-login", icon: <DashboardIcon /> },
    {
        label: "KYC Management", icon: <KycIcon />,
        children: [
            { label: "Pending", href: "/admin-login/kyc/pending", icon: <PendingIcon /> },
            { label: "Approved", href: "/admin-login/kyc/approved", icon: <ApproveIcon /> },
            { label: "Rejected", href: "/admin-login/kyc/rejected", icon: <RejectIcon /> },
        ],
    },
    {
        label: "User Management", icon: <UsersIcon />,
        children: [
            { label: "Users List", href: "/admin-login/users/list", icon: <ListIcon /> },
            // { label: "Create User", href: "/admin-login/users/create", icon: <CreateIcon /> },
        ],
    },
    {
        label: "Admin Management", icon: <ShieldIcon />,
        children: [
            { label: "Admins List", href: "/admin-login/admins/list", icon: <ListIcon /> },
            // { label: "Roles & Permissions", href: "/admin-login/admins/roles", icon: <RolesIcon /> },
        ],
    },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [openMenus, setOpenMenus] = useState<string[]>(["KYC Management", "User Management", "Admin Management"]);

    const toggleMenu = (label: string) => {
        setOpenMenus((prev) => prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]);
    };

    const isActive = (href: string) => pathname === href;
    const isParentActive = (item: NavItem) => item.children?.some((child) => pathname === child.href);

    return (
        <div className="dark min-h-screen bg-[#0a0a0a] flex">
            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? "w-72" : "w-0 lg:w-20"} bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] border-r border-white/[0.08]`}>
                {/* Logo Section */}
                <div className={`h-16 flex items-center ${sidebarOpen ? 'px-6' : 'px-4 justify-center'} border-b border-white/[0.08]`}>
                    {sidebarOpen ? (
                        <img
                            alt="Logo"
                            loading="lazy"
                            width="130"
                            height="55"
                            decoding="async"
                            style={{ color: 'transparent' }}
                            src="/logo/cantech-logo.svg"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border border-white/[0.1]">
                            <span className="text-white font-bold text-lg">C</span>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-3">
                    <div className="space-y-1">
                        {navItems.map((item) => (
                            <div key={item.label}>
                                {item.children ? (
                                    <>
                                        <button onClick={() => toggleMenu(item.label)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isParentActive(item) ? "bg-white/[0.08] border border-white/[0.1]" : "hover:bg-white/[0.04] border border-transparent"}`}>
                                            <span>{item.icon}</span>
                                            {sidebarOpen && (
                                                <>
                                                    <span className={`flex-1 text-left ${isParentActive(item) ? 'text-white' : 'text-white/60 group-hover:text-white/80'}`}>{item.label}</span>
                                                    <ChevronDown isOpen={openMenus.includes(item.label)} />
                                                </>
                                            )}
                                        </button>
                                        {sidebarOpen && openMenus.includes(item.label) && (
                                            <div className="mt-1 ml-4 pl-4 border-l border-white/[0.08] space-y-1">
                                                {item.children.map((child) => (
                                                    <Link key={child.href} href={child.href} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${isActive(child.href) ? "bg-gradient-to-r from-white/[0.1] to-white/[0.05] border border-white/[0.1] text-white font-medium" : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"}`}>
                                                        {child.icon}
                                                        <span>{child.label}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link href={item.href!} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive(item.href!) ? "bg-gradient-to-r from-white/[0.1] to-white/[0.05] border border-white/[0.1]" : "hover:bg-white/[0.04] border border-transparent"}`}>
                                        <span>{item.icon}</span>
                                        {sidebarOpen && <span className={`${isActive(item.href!) ? 'text-white' : 'text-white/60 group-hover:text-white/80'}`}>{item.label}</span>}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </nav>

                {/* Footer */}
                {sidebarOpen && (
                    <div className="p-4 border-t border-white/[0.08]">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-all duration-200 border border-transparent hover:border-white/[0.08]">
                            <LogoutIcon />
                            <span>Logout</span>
                        </button>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between px-6 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors border border-transparent hover:border-white/[0.08]">
                            <MenuIcon />
                        </button>
                        <div className="hidden md:block">
                            <h2 className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent font-semibold">Welcome back, Admin</h2>
                            <p className="text-white/40 text-sm">Manage KYC verifications and users</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 rounded-lg hover:bg-white/[0.05] transition-colors border border-transparent hover:border-white/[0.08]">
                            <BellIcon />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        </button>

                        <div className="flex items-center gap-3 pl-4 border-l border-white/[0.08]">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border border-white/[0.1]">
                                <span className="text-white font-semibold text-sm">AD</span>
                            </div>
                            <div className="hidden md:block">
                                <p className="text-white/90 text-sm font-medium">Admin User</p>
                                <p className="text-white/40 text-xs">Super Admin</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]">
                    {children}
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}
        </div>
    );
}
