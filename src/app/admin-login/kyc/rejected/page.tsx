"use client";

import React, { useState } from "react";

const mockRejectedData = [
    { id: "KYC101", name: "George Green", email: "george.g@email.com", phone: "+1 234 567 8901", documentType: "Passport", rejectedAt: "2024-01-27 15:30", rejectedBy: "Admin User", reason: "Document image is blurry and unreadable", avatar: "GG" },
    { id: "KYC102", name: "Hannah Hill", email: "hannah.h@email.com", phone: "+1 345 678 9012", documentType: "Driver's License", rejectedAt: "2024-01-27 13:20", rejectedBy: "Admin User", reason: "Document has expired", avatar: "HH" },
    { id: "KYC103", name: "Ivan Ivanov", email: "ivan.i@email.com", phone: "+1 456 789 0123", documentType: "National ID", rejectedAt: "2024-01-26 17:45", rejectedBy: "Admin User", reason: "Name on document does not match account name", avatar: "II" },
    { id: "KYC104", name: "Julia Jones", email: "julia.j@email.com", phone: "+1 567 890 1234", documentType: "Passport", rejectedAt: "2024-01-26 11:10", rejectedBy: "Admin User", reason: "Suspected fraudulent document", avatar: "JJ" },
];

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

export default function RejectedKYC() {
    const [selectedKyc, setSelectedKyc] = useState<typeof mockRejectedData[0] | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredData = mockRejectedData.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.email.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent mb-2">Rejected KYC</h1>
                    <p className="text-white/40">View all rejected KYC verification requests.</p>
                </div>
                <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-white/[0.05] to-white/[0.02] border border-white/[0.08] text-white/60 text-sm font-medium flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" x2="9" y1="9" y2="15" /><line x1="9" x2="15" y1="9" y2="15" /></svg>
                    {filteredData.length} Rejected
                </span>
            </div>

            <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                <input type="text" placeholder="Search by name, email, or ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08] text-white/90 placeholder-white/30 focus:outline-none focus:border-white/[0.2]" />
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/[0.08] overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/[0.08]">
                            <th className="text-left py-4 px-6 text-white/50 text-sm font-medium">User</th>
                            <th className="text-left py-4 px-6 text-white/50 text-sm font-medium hidden md:table-cell">Contact</th>
                            <th className="text-left py-4 px-6 text-white/50 text-sm font-medium hidden lg:table-cell">Reason</th>
                            <th className="text-left py-4 px-6 text-white/50 text-sm font-medium">Status</th>
                            <th className="text-right py-4 px-6 text-white/50 text-sm font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((kyc) => (
                            <tr key={kyc.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/[0.03] flex items-center justify-center border border-white/[0.08]">
                                            <span className="text-white/70 font-semibold text-sm">{kyc.avatar}</span>
                                        </div>
                                        <div><p className="text-white/90 font-medium">{kyc.name}</p><p className="text-white/40 text-sm">{kyc.id}</p></div>
                                    </div>
                                </td>
                                <td className="py-4 px-6 hidden md:table-cell"><p className="text-white/70">{kyc.email}</p></td>
                                <td className="py-4 px-6 hidden lg:table-cell"><p className="text-white/50 text-sm truncate max-w-xs">{kyc.reason}</p></td>
                                <td className="py-4 px-6">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-white/[0.05] to-white/[0.02] text-white/50 text-sm font-medium border border-white/[0.08]">✕ Rejected</span>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => { setSelectedKyc(kyc); setIsViewModalOpen(true); }} className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05] transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                        </button>
                                        <button className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05] transition-colors" title="Request Re-verification">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isViewModalOpen} onClose={() => { setSelectedKyc(null); setIsViewModalOpen(false); }} title="Rejected KYC Details">
                {selectedKyc && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/10 to-white/[0.03] flex items-center justify-center border border-white/[0.08]">
                                <span className="text-white/70 font-bold text-xl">{selectedKyc.avatar}</span>
                            </div>
                            <div>
                                <h4 className="text-white/90 font-semibold text-lg">{selectedKyc.name}</h4>
                                <p className="text-white/50">{selectedKyc.id}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]"><p className="text-white/40 text-sm">Email</p><p className="text-white/80">{selectedKyc.email}</p></div>
                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]"><p className="text-white/40 text-sm">Phone</p><p className="text-white/80">{selectedKyc.phone}</p></div>
                        </div>
                        <div className="p-4 rounded-xl bg-gradient-to-r from-white/[0.05] to-white/[0.02] border border-white/[0.08]">
                            <p className="text-white/40 text-sm mb-2">Rejection Reason</p>
                            <p className="text-white/70">{selectedKyc.reason}</p>
                            <p className="text-white/30 text-xs mt-2">Rejected by {selectedKyc.rejectedBy} on {selectedKyc.rejectedAt}</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => { setSelectedKyc(null); setIsViewModalOpen(false); }} className="flex-1 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-white/70 font-medium transition-colors">Close</button>
                            <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-white/[0.1] to-white/[0.05] hover:from-white/[0.15] hover:to-white/[0.08] text-white/80 font-medium transition-all border border-white/[0.1]">Request Re-verification</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
