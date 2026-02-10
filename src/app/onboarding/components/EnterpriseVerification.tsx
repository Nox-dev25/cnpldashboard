"use client";

import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/ui/select";
import { CheckCircle2, AlertCircle } from "lucide-react";

export type BusinessType =
    | "sole_proprietorship"
    | "private_limited"
    | "public_limited"
    | "llp"
    | "opc"
    | "partnership"
    | null;

interface VerificationStatus {
    gst: boolean;
    aadhar: boolean;
    cin: boolean;
    // pan: boolean;
}

interface EnterpriseVerificationProps {
    companyName: string;
    businessType: BusinessType;
    gstNumber: string;
    aadharNumber: string;
    cinNumber: string;
    // panNumber: string;
    verification: VerificationStatus;
    isIndian: boolean;
    requiresGST: boolean;
    onCompanyNameChange: (value: string) => void;
    onBusinessTypeChange: (value: BusinessType) => void;
    onGstNumberChange: (value: string) => void;
    onAadharNumberChange: (value: string) => void;
    onCinNumberChange: (value: string) => void;
    // onPanNumberChange: (value: string) => void;
    onVerifyGST: () => void;
    onVerifyAadhar: () => void;
    onVerifyCIN: () => void;
    // onVerifyPAN: () => void;
}

const businessTypeOptions = [
    { value: "sole_proprietorship", label: "Sole Proprietorship" },
    { value: "private_limited", label: "Private Limited Company (Pvt. Ltd)" },
    { value: "public_limited", label: "Public Limited Company (Ltd)" },
    { value: "llp", label: "Limited Liability Partnership (LLP)" },
    { value: "opc", label: "One Person Private Limited Company (OPC Pvt Ltd)" },
    { value: "partnership", label: "Partnership Firm" },
];

export const EnterpriseVerification = ({
    companyName,
    businessType,
    gstNumber,
    aadharNumber,
    cinNumber,
    // panNumber,
    verification,
    isIndian,
    requiresGST,
    onCompanyNameChange,
    onBusinessTypeChange,
    onGstNumberChange,
    onAadharNumberChange,
    onCinNumberChange,
    // onPanNumberChange,
    onVerifyGST,
    onVerifyAadhar,
    onVerifyCIN,
    // onVerifyPAN,companyName
}: EnterpriseVerificationProps) => {
    const requiresCIN = businessType && [
        "private_limited",
        "public_limited",
        "llp",
        "opc",
    ].includes(businessType);

    const requiresPAN = businessType && [
        "sole_proprietorship",
        "partnership",
    ].includes(businessType);

    return (
        <div className="space-y-4 pt-2">
            {/* Company Name and Business Type */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>
                        Company Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        value={companyName}
                        onChange={(e) => onCompanyNameChange(e.target.value)}
                        placeholder="Enter company name"
                    />
                </div>

                <div className="space-y-2">
                    <Label>
                        Business Type <span className="text-destructive">*</span>
                    </Label>
                    <Select value={businessType || ""} onValueChange={(value) => onBusinessTypeChange(value as BusinessType)}>
                        <SelectTrigger className="bg-background border-border">
                            <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent className="max-h-64">
                            {businessTypeOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {isIndian && (
                <>
                    {/* CIN Verification - Only for certain business types */}
                    {requiresCIN && (
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                CIN Number <span className="text-destructive">*</span>
                                {verification.cin && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                            </Label>
                            <div className="relative">
                                <Input
                                    value={cinNumber}
                                    onChange={(e) => onCinNumberChange(e.target.value)}
                                    placeholder="Enter CIN Number"
                                    className="pr-24"
                                    disabled={verification.cin}
                                />
                                {!verification.cin && (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7"
                                        onClick={onVerifyCIN}
                                    >
                                        Verify CIN
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* PAN Card Verification - For Sole Proprietorship and Partnership */}
                    {requiresPAN && (
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                PAN Card Number <span className="text-destructive">*</span>
                                {/* {verification.pan && <CheckCircle2 className="h-4 w-4 text-green-500" />} */}
                            </Label>
                            <div className="relative">
                                <Input
                                    // value={panNumber}
                                    // onChange={(e) => onPanNumberChange(e.target.value)}
                                    placeholder="Enter PAN Number"
                                    className="pr-24"
                                // disabled={verification.pan}
                                />
                                {/* {!verification.pan && (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7"
                                        onClick={onVerifyPAN}
                                    >
                                        Verify PAN
                                    </Button>
                                )} */}
                            </div>
                        </div>
                    )}

                    {/* GST Number - Optional or Required based on billing address */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            GST Number {requiresGST && <span className="text-destructive">*</span>}
                            {!requiresGST && <span className="text-muted-foreground text-xs">(Optional)</span>}
                            {verification.gst && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                        </Label>
                        <div className="relative">
                            <Input
                                value={gstNumber}
                                onChange={(e) => onGstNumberChange(e.target.value)}
                                placeholder="Enter GST Number"
                                className="pr-24"
                                disabled={verification.gst}
                            />
                            {!verification.gst && gstNumber && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7"
                                    onClick={onVerifyGST}
                                >
                                    Verify GST
                                </Button>
                            )}
                        </div>
                        {requiresGST && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                GST verification required for Office/Work billing address
                            </p>
                        )}
                    </div>

                    {/* Aadhar Verification for Enterprise */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            Aadhar Number <span className="text-destructive">*</span>
                            {verification.aadhar && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                        </Label>
                        <div className="relative">
                            <Input
                                value={aadharNumber}
                                onChange={(e) => onAadharNumberChange(e.target.value)}
                                placeholder="XXXX XXXX XXXX"
                                className="pr-24"
                                disabled={verification.aadhar}
                            />
                            {!verification.aadhar && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7"
                                    onClick={onVerifyAadhar}
                                >
                                    Verify Aadhar
                                </Button>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Aadhar verification required for Enterprise accounts
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};
