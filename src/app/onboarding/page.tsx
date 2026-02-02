"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/app/components/dashboard/DashboardLayout";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Badge } from "@/app/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/ui/select";
import { ArrowLeft, User, Building2, Info, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

type AccountType = "individual" | "enterprise" | null;

interface VerificationStatus {
    email: boolean;
    phone: boolean;
    gst: boolean;
    aadhar: boolean;
}

const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
    "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
    "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
    "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
    "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
    "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
    "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
    "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
    "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos",
    "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi",
    "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova",
    "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands",
    "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau",
    "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
    "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal",
    "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea",
    "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan",
    "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
    "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela",
    "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const KYCValidation = () => {
    const router = useRouter();
    const [selectedCountry, setSelectedCountry] = useState<string>("India");
    const [accountType, setAccountType] = useState<AccountType>(null);
    const [email, setEmail] = useState("user@example.com");
    const [phone, setPhone] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [gstNumber, setGstNumber] = useState("");
    const [aadharNumber, setAadharNumber] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
    const [streetAddress2, setStreetAddress2] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [verification, setVerification] = useState<VerificationStatus>({
        email: false,
        phone: false,
        gst: false,
        aadhar: false,
    });

    useEffect(() => {
        const detectCountry = async () => {
            try {
                const res = await fetch("https://ipapi.co/json/");
                const data = await res.json();

                if (data?.country_name && countries.includes(data.country_name)) {
                    setSelectedCountry(data.country_name);
                }
            } catch (error) {
                console.error("IP detection failed", error);
            }
        };

        detectCountry();
    }, []);

    const billingCurrency = useMemo(() => {
        return selectedCountry === "India" ? "INR" : "USD";
    }, [selectedCountry]);

    const isIndian = selectedCountry === "India";

    const handleVerifyEmail = () => {
        toast.info("Verification email sent!");
        setTimeout(() => {
            setVerification(prev => ({ ...prev, email: true }));
            toast.success("Email verified successfully!");
        }, 2000);
    };

    const handleVerifyPhone = () => {
        if (!phone) {
            toast.error("Please enter phone number first");
            return;
        }
        toast.info("OTP sent to your phone!");
        setTimeout(() => {
            setVerification(prev => ({ ...prev, phone: true }));
            toast.success("Phone verified successfully!");
        }, 2000);
    };

    const handleVerifyGST = () => {
        if (!gstNumber) {
            toast.error("Please enter GST number first");
            return;
        }
        toast.info("Verifying GST...");
        setTimeout(() => {
            setVerification(prev => ({ ...prev, gst: true }));
            toast.success("GST verified successfully!");
        }, 2000);
    };

    const handleVerifyAadhar = () => {
        if (!aadharNumber) {
            toast.error("Please enter Aadhar number first");
            return;
        }
        toast.info("Verifying Aadhar with DigiLocker...");
        setTimeout(() => {
            setVerification(prev => ({ ...prev, aadhar: true }));
            toast.success("Aadhar verified successfully!");
        }, 2000);
    };

    const handleDigiLockerVerify = () => {
        toast.info("Redirecting to DigiLocker...");
        setTimeout(() => {
            setVerification(prev => ({ ...prev, aadhar: true }));
            toast.success("Identity verified with DigiLocker!");
        }, 2000);
    };

    const handleSubmit = async () => {
        if (!selectedCountry || !accountType || !streetAddress || !state || !city || !postalCode) {
            toast.error("Please fill all required fields");
            return;
        }

        if (!termsAccepted || !privacyAccepted) {
            toast.error("Please accept Terms & Conditions and Privacy Policy");
            return;
        }

        if (accountType === "enterprise" && !companyName) {
            toast.error("Please enter company name");
            return;
        }

        if (isIndian) {
            if (accountType === "enterprise" && (!verification.gst || !verification.aadhar)) {
                toast.error("Please verify GST and Aadhar for Enterprise account");
                return;
            }
            if (accountType === "individual" && !verification.aadhar) {
                toast.error("Please verify your identity with DigiLocker");
                return;
            }
        }

        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success("KYC submitted successfully!");
        setIsSubmitting(false);
        router.push("/dashboard");
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push("/dashboard")}
                        className="h-8 w-8"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-xl font-semibold text-foreground">Customer Details</h1>
                </div>

                <Card className="border-border">
                    <CardContent className="p-6 space-y-6">
                        {/* Billing Country & Currency */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-primary">
                                    Select Billing Country <span className="text-destructive">*</span>
                                </Label>
                                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                                    <SelectTrigger className="bg-background border-border">
                                        <SelectValue placeholder="Select country" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-64">
                                        {countries.map((country) => (
                                            <SelectItem key={country} value={country}>
                                                {country}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {selectedCountry && (
                                <div className="flex items-end">
                                    <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-4 py-2.5 w-full">
                                        <Info className="h-4 w-4 text-primary" />
                                        <span className="text-sm text-primary">
                                            Billing currency will be {billingCurrency}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Account Verification */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground">Account Verification</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>
                                        Email {verification.email ? "(Verified)" : "(Not Verified)"}{" "}
                                        <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pr-24"
                                        />
                                        {verification.email ? (
                                            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                                        ) : (
                                            <Button
                                                type="button"
                                                variant="link"
                                                size="sm"
                                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 text-primary"
                                                onClick={handleVerifyEmail}
                                            >
                                                Verify Email
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>
                                        Phone <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder={isIndian ? "+91 XXXXX XXXXX" : "+1 XXX XXX XXXX"}
                                            className="pr-10"
                                        />
                                        {verification.phone ? (
                                            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                                        ) : (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                                onClick={handleVerifyPhone}
                                            >
                                                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Identity Verification */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground">Identity Verification</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <Card
                                    className={`cursor-pointer transition-all hover:border-primary ${accountType === "individual" ? "border-primary bg-primary/5" : "border-border"
                                        }`}
                                    onClick={() => setAccountType("individual")}
                                >
                                    <CardContent className="p-6 text-center">
                                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                                            <User className="h-6 w-6 text-primary" />
                                        </div>
                                        <h4 className="font-semibold text-foreground">Individual</h4>
                                        <p className="text-sm text-muted-foreground">Personal account</p>
                                    </CardContent>
                                </Card>

                                <Card
                                    className={`cursor-pointer transition-all hover:border-primary ${accountType === "enterprise" ? "border-primary bg-primary/5" : "border-border"
                                        }`}
                                    onClick={() => setAccountType("enterprise")}
                                >
                                    <CardContent className="p-6 text-center">
                                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                                            <Building2 className="h-6 w-6 text-primary" />
                                        </div>
                                        <h4 className="font-semibold text-foreground">Enterprise</h4>
                                        <p className="text-sm text-muted-foreground">Business account</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Individual Verification - DigiLocker for India */}
                            {accountType === "individual" && isIndian && (
                                <div className="pt-2">
                                    <Button
                                        onClick={handleDigiLockerVerify}
                                        className="w-full md:w-auto"
                                        disabled={verification.aadhar}
                                    >
                                        {verification.aadhar ? (
                                            <>
                                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                                Verified with DigiLocker
                                            </>
                                        ) : (
                                            "VERIFY WITH DIGILOCKER"
                                        )}
                                    </Button>
                                </div>
                            )}

                            {/* Enterprise Verification */}
                            {accountType === "enterprise" && (
                                <div className="space-y-4 pt-2">
                                    {/* Company Name */}
                                    <div className="space-y-2">
                                        <Label>
                                            Company Name <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            placeholder="Enter company name"
                                        />
                                    </div>

                                    {isIndian && (
                                        <>
                                            {/* GST Verification Options */}
                                            <div className="flex flex-wrap gap-2">
                                                <Button
                                                    variant={verification.gst ? "default" : "default"}
                                                    onClick={handleVerifyGST}
                                                    disabled={verification.gst}
                                                >
                                                    {verification.gst ? (
                                                        <>
                                                            <CheckCircle2 className="h-4 w-4 mr-2" />
                                                            GST Verified
                                                        </>
                                                    ) : (
                                                        "Verify GST with OTP"
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => toast.info("Certificate upload coming soon")}
                                                    disabled={verification.gst}
                                                >
                                                    Verify GST with Certificate
                                                </Button>
                                            </div>

                                            {/* GST Number */}
                                            <div className="space-y-2">
                                                <Label className="flex items-center gap-2">
                                                    GST Number <span className="text-destructive">*</span>
                                                    {verification.gst && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                                                </Label>
                                                <div className="relative">
                                                    <Input
                                                        value={gstNumber}
                                                        onChange={(e) => setGstNumber(e.target.value)}
                                                        placeholder="Enter GST Number"
                                                        className="pr-24"
                                                        disabled={verification.gst}
                                                    />
                                                    {!verification.gst && (
                                                        <Button
                                                            type="button"
                                                            variant="secondary"
                                                            size="sm"
                                                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7"
                                                            onClick={handleVerifyGST}
                                                        >
                                                            Verify GST
                                                        </Button>
                                                    )}
                                                </div>
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
                                                        onChange={(e) => setAadharNumber(e.target.value)}
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
                                                            onClick={handleVerifyAadhar}
                                                        >
                                                            Verify Aadhar
                                                        </Button>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    Both GST and Aadhar verification required for Enterprise accounts
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Billing Address */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground">Billing Address</h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>
                                        Street Address <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        value={streetAddress}
                                        onChange={(e) => setStreetAddress(e.target.value)}
                                        placeholder="Enter street address"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Street Address 2</Label>
                                    <Input
                                        value={streetAddress2}
                                        onChange={(e) => setStreetAddress2(e.target.value)}
                                        placeholder="Enter street address 2"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>
                                        State <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                        placeholder="Enter state"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>
                                        City <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder="Enter city"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>
                                        Postal Code <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        value={postalCode}
                                        onChange={(e) => setPostalCode(e.target.value)}
                                        placeholder="Enter postal code"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Terms & Conditions */}
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="terms"
                                    checked={termsAccepted}
                                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                                />
                                <label
                                    htmlFor="terms"
                                    className="text-sm cursor-pointer"
                                >
                                    I agree to the{" "}
                                    <span className="text-primary hover:underline cursor-pointer">
                                        Terms & Conditions
                                    </span>{" "}
                                    <span className="text-destructive">*</span>
                                </label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="privacy"
                                    checked={privacyAccepted}
                                    onCheckedChange={(checked) => setPrivacyAccepted(checked as boolean)}
                                />
                                <label
                                    htmlFor="privacy"
                                    className="text-sm cursor-pointer"
                                >
                                    I agree to the{" "}
                                    <span className="text-primary hover:underline cursor-pointer">
                                        Privacy Policy
                                    </span>{" "}
                                    <span className="text-destructive">*</span>
                                </label>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-border">
                            <Button
                                variant="outline"
                                onClick={() => router.push("/dashboard")}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default KYCValidation;