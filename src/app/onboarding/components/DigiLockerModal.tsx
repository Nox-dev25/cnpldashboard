"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

interface DigiLockerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerify: (data: { name: string; dob: string; phone: string }) => void;
    defaultName?: string;
    defaultPhone?: string;
}

export function DigiLockerModal({
    isOpen,
    onClose,
    onVerify,
    defaultName = "",
    defaultPhone = "",
}: DigiLockerModalProps) {
    const [name, setName] = useState(defaultName);
    const [dob, setDob] = useState("");
    const [phone, setPhone] = useState(defaultPhone);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onVerify({ name, dob, phone });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>DigiLocker Verification</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input
                            id="dob"
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="10-digit phone number"
                            pattern="[0-9]{10}"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Verify with DigiLocker
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}