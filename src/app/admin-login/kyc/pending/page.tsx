"use client";

import React, { useState, useRef, useEffect } from "react";

// Document type options
const documentCategories = [
    {
        category: "Indian",
        options: [
            { value: "aadhaar", label: "Aadhaar Card" }
        ]
    },
    {
        category: "International",
        options: [
            { value: "passport-selfie", label: "Passport Verify" },
            { value: "driving-licence-selfie", label: "Driving Licence" }
        ]
    }
];

// Custom Dropdown Component
const DocumentTypeDropdown = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Get selected option label
    const getSelectedLabel = () => {
        if (!value) return "All Document Types";
        for (const cat of documentCategories) {
            const found = cat.options.find(opt => opt.value === value);
            if (found) return found.label;
        }
        return "All Document Types";
    };



    return (
        <div className="relative" ref={dropdownRef}>
            {/* Dropdown Trigger */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full md:w-64 px-4 py-3 rounded-xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08] text-left flex items-center justify-between gap-3 hover:border-white/[0.15] transition-all duration-200 group"
            >
                <span className={`${value ? 'text-white/90' : 'text-white/50'}`}>
                    {getSelectedLabel()}
                </span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeOpacity="0.5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-white/[0.1] shadow-2xl shadow-black/50 overflow-hidden">
                    {/* All Types Option */}
                    <button
                        type="button"
                        onClick={() => { onChange(""); setIsOpen(false); }}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-all duration-150 ${!value
                            ? 'bg-gradient-to-r from-white/[0.1] to-white/[0.05] text-white'
                            : 'text-white/60 hover:bg-white/[0.05] hover:text-white/90'
                            }`}>
                        <div>
                            <p className="font-medium">All Document Types</p>
                            <p className="text-xs text-white/40">Show all verification requests</p>
                        </div>
                        {!value && (
                            <svg className="ml-auto" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                        )}
                    </button>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent mx-3" />

                    {/* Categories */}
                    {documentCategories.map((category, catIndex) => (
                        <div key={category.category}>
                            {/* Category Header */}
                            <div className="px-4 py-2 bg-white/[0.02]">
                                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                                    {category.category}
                                </p>
                            </div>

                            {/* Category Options */}
                            {category.options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => { onChange(option.value); setIsOpen(false); }}
                                    className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-all duration-150 ${value === option.value
                                        ? 'bg-gradient-to-r from-white/[0.1] to-white/[0.05] text-white'
                                        : 'text-white/60 hover:bg-white/[0.05] hover:text-white/90'
                                        }`}
                                >

                                    <div className="flex-1">
                                        <p className="font-medium">{option.label}</p>
                                        <p className="text-xs text-white/40">
                                            {option.value === 'aadhaar' && 'Indian Government ID'}
                                            {option.value === 'passport-selfie' && 'International travel document with photo'}
                                            {option.value === 'driving-licence-selfie' && 'International driving permit with photo'}
                                        </p>
                                    </div>
                                    {value === option.value && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                                    )}
                                </button>
                            ))}

                            {/* Divider between categories */}
                            {catIndex < documentCategories.length - 1 && (
                                <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mx-3" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const mockPendingData = [
    { id: "KYC001", name: "John Smith", email: "john.smith@email.com", phone: "+1 234 567 8901", documentType: "passport-selfie", submittedAt: "2024-01-28 14:30", avatar: "JS" },
    { id: "KYC002", name: "Sarah Johnson", email: "sarah.j@email.com", phone: "+1 345 678 9012", documentType: "driving-licence-selfie", submittedAt: "2024-01-28 13:15", avatar: "SJ" },
    { id: "KYC003", name: "Rahul Kumar", email: "rahul.k@email.com", phone: "+91 98765 43210", documentType: "aadhaar", submittedAt: "2024-01-28 12:45", avatar: "RK" },
    { id: "KYC004", name: "Emily Davis", email: "emily.d@email.com", phone: "+1 567 890 1234", documentType: "passport-selfie", submittedAt: "2024-01-28 11:20", avatar: "ED" },
    { id: "KYC005", name: "Priya Sharma", email: "priya.s@email.com", phone: "+91 87654 32109", documentType: "aadhaar", submittedAt: "2024-01-28 10:55", avatar: "PS" },
];

// Get document label from value
const getDocumentLabel = (value: string) => {
    for (const cat of documentCategories) {
        const found = cat.options.find(opt => opt.value === value);
        if (found) return found.label;
    }
    return value;
};

const getDocumentCategory = (value: string) => {
    for (const cat of documentCategories) {
        const found = cat.options.find(opt => opt.value === value);
        if (found) return cat.category;
    }
    return "";
};

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-lg mx-4 bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-white/[0.1] rounded-2xl shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-white/[0.08]">
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

export default function PendingKYC() {
    const [selectedKyc, setSelectedKyc] = useState<typeof mockPendingData[0] | null>(null);
    const [modalType, setModalType] = useState<"view" | "approve" | "reject" | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [documentFilter, setDocumentFilter] = useState("");
    const [rejectReason, setRejectReason] = useState("");

    const filteredData = mockPendingData.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDocument = !documentFilter || item.documentType === documentFilter;
        return matchesSearch && matchesDocument;
    });

    const openModal = (kyc: typeof mockPendingData[0], type: "view" | "approve" | "reject") => { setSelectedKyc(kyc); setModalType(type); setRejectReason(""); };
    const closeModal = () => { setSelectedKyc(null); setModalType(null); setRejectReason(""); };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent mb-2">Pending KYC Requests</h1>
                    <p className="text-white/40">Review and process pending KYC verification requests.</p>
                </div>
                <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-white/[0.08] to-white/[0.04] border border-white/[0.1] text-white/70 text-sm font-medium flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    {filteredData.length} Pending
                </span>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    <input type="text" placeholder="Search by name, email, or ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08] text-white/90 placeholder-white/30 focus:outline-none focus:border-white/[0.2] transition-colors" />
                </div>

                {/* Custom Document Type Dropdown */}
                <DocumentTypeDropdown value={documentFilter} onChange={setDocumentFilter} />
            </div>

            {/* Table */}
            <div className="rounded-2xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08] overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/[0.08]">
                            <th className="text-left py-4 px-6 text-white/50 text-sm font-medium">User</th>
                            <th className="text-left py-4 px-6 text-white/50 text-sm font-medium hidden md:table-cell">Contact</th>
                            <th className="text-left py-4 px-6 text-white/50 text-sm font-medium hidden lg:table-cell">Document</th>
                            <th className="text-left py-4 px-6 text-white/50 text-sm font-medium hidden lg:table-cell">Submitted</th>
                            <th className="text-right py-4 px-6 text-white/50 text-sm font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((kyc) => (
                            <tr key={kyc.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/15 to-white/5 flex items-center justify-center border border-white/[0.1]">
                                            <span className="text-white/80 font-semibold text-sm">{kyc.avatar}</span>
                                        </div>
                                        <div><p className="text-white/90 font-medium">{kyc.name}</p><p className="text-white/40 text-sm">{kyc.id}</p></div>
                                    </div>
                                </td>
                                <td className="py-4 px-6 hidden md:table-cell"><p className="text-white/70">{kyc.email}</p><p className="text-white/40 text-sm">{kyc.phone}</p></td>
                                <td className="py-4 px-6 hidden lg:table-cell">
                                    <div className="flex flex-col gap-1">
                                        <span className="px-3 py-1 rounded-lg bg-white/[0.05] text-white/70 text-sm border border-white/[0.08] w-fit">
                                            {getDocumentLabel(kyc.documentType)}
                                        </span>
                                        <span className="text-white/30 text-xs">{getDocumentCategory(kyc.documentType)}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6 hidden lg:table-cell text-white/50 text-sm">{kyc.submittedAt}</td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => openModal(kyc, "view")} className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05] transition-colors" title="View">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                        </button>
                                        <button onClick={() => openModal(kyc, "approve")} className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05] transition-colors" title="Approve">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                                        </button>
                                        <button onClick={() => openModal(kyc, "reject")} className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05] transition-colors" title="Reject">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredData.length === 0 && <div className="py-12 text-center"><p className="text-white/40">No pending KYC requests found.</p></div>}
            </div>

            {/* View Modal */}
            <Modal isOpen={modalType === "view"} onClose={closeModal} title="KYC Details">
                {selectedKyc && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border border-white/[0.15]"><span className="text-white font-bold text-xl">{selectedKyc.avatar}</span></div>
                            <div><h4 className="text-white/90 font-semibold text-lg">{selectedKyc.name}</h4><p className="text-white/50">{selectedKyc.id}</p></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]"><p className="text-white/40 text-sm">Email</p><p className="text-white/80">{selectedKyc.email}</p></div>
                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]"><p className="text-white/40 text-sm">Phone</p><p className="text-white/80">{selectedKyc.phone}</p></div>
                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                                <p className="text-white/40 text-sm">Document Type</p>
                                <p className="text-white/80 mt-1">{getDocumentLabel(selectedKyc.documentType)}</p>
                                <p className="text-white/30 text-xs mt-1">{getDocumentCategory(selectedKyc.documentType)}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]"><p className="text-white/40 text-sm">Submitted</p><p className="text-white/80">{selectedKyc.submittedAt}</p></div>
                        </div>
                        <div className="p-8 rounded-xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08] text-center">
                            <svg className="w-12 h-12 mx-auto text-white/30 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            <p className="text-white/40 text-sm">Document preview would appear here</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => { closeModal(); openModal(selectedKyc, "approve"); }} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-white/15 to-white/10 hover:from-white/20 hover:to-white/15 text-white font-medium transition-all border border-white/[0.1]">Approve</button>
                            <button onClick={() => { closeModal(); openModal(selectedKyc, "reject"); }} className="flex-1 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-white/70 font-medium transition-all border border-white/[0.08]">Reject</button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Approve Modal */}
            <Modal isOpen={modalType === "approve"} onClose={closeModal} title="Approve KYC">
                {selectedKyc && (
                    <div className="space-y-6">
                        <div className="p-4 rounded-xl bg-gradient-to-r from-white/[0.08] to-white/[0.04] border border-white/[0.1]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg></div>
                                <div><p className="text-white/80 font-medium">Confirm Approval</p><p className="text-white/40 text-sm">This will verify the user&apos;s identity.</p></div>
                            </div>
                        </div>
                        <p className="text-white/60">Are you sure you want to approve KYC for <span className="text-white font-medium">{selectedKyc.name}</span>?</p>
                        <div className="flex gap-3">
                            <button onClick={closeModal} className="flex-1 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-white/70 font-medium transition-colors">Cancel</button>
                            <button onClick={closeModal} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-white/15 to-white/10 hover:from-white/20 hover:to-white/15 text-white font-medium transition-all border border-white/[0.1]">Approve</button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Reject Modal */}
            <Modal isOpen={modalType === "reject"} onClose={closeModal} title="Reject KYC">
                {selectedKyc && (
                    <div className="space-y-6">
                        <div className="p-4 rounded-xl bg-gradient-to-r from-white/[0.05] to-white/[0.02] border border-white/[0.08]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" x2="9" y1="9" y2="15" /><line x1="9" x2="15" y1="9" y2="15" /></svg></div>
                                <div><p className="text-white/70 font-medium">Confirm Rejection</p><p className="text-white/40 text-sm">Please provide a reason for rejection.</p></div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-white/50 text-sm mb-2">Rejection Reason</label>
                            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Enter the reason for rejection..." rows={4} className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-white/[0.08] text-white/90 placeholder-white/30 focus:outline-none focus:border-white/[0.2] transition-colors resize-none" />
                        </div>
                        <div className="flex gap-3">
                            <button onClick={closeModal} className="flex-1 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-white/70 font-medium transition-colors">Cancel</button>
                            <button onClick={closeModal} disabled={!rejectReason.trim()} className="flex-1 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white/80 font-medium transition-all border border-white/[0.08] disabled:opacity-50 disabled:cursor-not-allowed">Reject</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
