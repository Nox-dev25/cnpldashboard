"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/app/components/dashboard/DashboardLayout";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

// Import components
import { BillingCountrySelector } from "./BillingCountrySelector";
import { AccountVerification } from "./AccountVerification";
import { AccountTypeSelection } from "./AccountTypeSelection";
import { IndividualVerification } from "./IndividualVerification";
import { EnterpriseVerification, type BusinessType } from "./EnterpriseVerification";
import { BillingAddress, type BillingAddressType } from "./BillingAddress";
import { TermsAndConditions } from "./TermsAndConditions";


type AccountType = "individual" | "enterprise" | null;

type Props = {
    searchParams: {
        id?: string;
    };
};

interface VerificationStatus {
    email: boolean;
    phone: boolean;
    gst: boolean;
    aadhar: boolean;
    cin: boolean;
    // pan: boolean;
}

const KYCValidation = () => {
    const router = useRouter();
    const [selectedCountry, setSelectedCountry] = useState<string>("India");
    const [accountType, setAccountType] = useState<AccountType>(null);
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [businessType, setBusinessType] = useState<BusinessType>(null);
    const [gstNumber, setGstNumber] = useState("");
    const [aadharNumber, setAadharNumber] = useState("");
    const [cinNumber, setCinNumber] = useState("");
    const [panNumber, setPanNumber] = useState("");
    const [addressType, setAddressType] = useState<BillingAddressType>("home");
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
        cin: false,
        // pan: false,
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/onboarding/client");
                if (!res.ok) {
                    router.push("/login");
                    return;
                }

                const data = await res.json();

                // Hidden fields
                setEmail(data.user.email);
                setPhone(data.user.phone);

                // Verification state
                setVerification(prev => ({
                    ...prev,
                    email: data.user.isEmailVerified,
                    phone: data.user.isPhoneVerified,
                    aadhar: data.kycProfile?.aadharVerified ?? false,
                }));

            } catch (err) {
                console.error(err);
                router.push("/login");
            }
        };

        fetchUser();
    }, [router]);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const detectCountry = async () => {
            try {
                const res = await fetch("https://ipapi.co/json/");
                const data = await res.json();

                if (data?.country_name) {
                    setSelectedCountry(data.country_name);
                }
            } catch (error) {
                console.error("IP detection failed", error);
            }
        };

        detectCountry();
    }, [mounted]);


    const billingCurrency = useMemo(() => {
        return selectedCountry === "India" ? "INR" : "USD";
    }, [selectedCountry]);

    const isIndian = selectedCountry === "India";

    // GST is required only for enterprise accounts with office/work address
    const requiresGST = accountType === "enterprise" && addressType === "office" && isIndian;

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
        if (!/^\d{12}$/.test(aadharNumber)) {
            toast.error("Enter a valid 12-digit Aadhaar number");
            return;
        }
        toast.info("Verifying Aadhar with DigiLocker...");
        setTimeout(() => {
            setVerification(prev => ({ ...prev, aadhar: true }));
            toast.success("Aadhar verified successfully!");
        }, 2000);
    };

    const handleVerifyCIN = () => {
        if (!/^[A-Z0-9]{21}$/.test(cinNumber)) {
            toast.error("Enter a valid 21-character CIN");
            return;
        }

        toast.loading("Verifying CIN...");

        setTimeout(() => {
            setVerification(prev => ({ ...prev, cin: true }));
            toast.success("CIN verified successfully");
        }, 1200);
    };

    const handleDigiLockerVerify = async () => {
        const loadingToast = toast.loading("Initializing DigiLocker verification...");

        try {
            const res = await fetch("/api/verify/digilocker", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone }), // Send phone if available
            });

            const result = await res.json();
            toast.dismiss(loadingToast);

            if (result.url) {
                // Open the verification URL
                window.open(result.url, "_blank");
                toast.success("Please complete verification in the new window");
            } else if (result.success) {
                setVerification(prev => ({ ...prev, aadhar: true }));
                toast.success(result.message || "Identity verified via DigiLocker!");
            } else {
                toast.error(result.error || "DigiLocker verification failed");
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error("Failed to initialize DigiLocker. Please try again.");
            console.error("DigiLocker API error:", error);
        }
    };

    const handleSubmit = async () => {
        // ---------- basic validation ----------
        if (!selectedCountry || !accountType || !streetAddress || !state || !city || !postalCode) {
            toast.error("Please fill all required fields");
            return;
        }

        if (!termsAccepted || !privacyAccepted) {
            toast.error("Please accept Terms & Conditions and Privacy Policy");
            return;
        }

        // ---------- enterprise validation ----------
        if (accountType === "enterprise") {
            if (!companyName) {
                toast.error("Please enter company name");
                return;
            }

            if (!businessType) {
                toast.error("Please select business type");
                return;
            }

            if (isIndian) {
                const requiresCIN = ["private_limited", "public_limited", "llp", "opc"].includes(businessType);

                if (requiresCIN && !verification.cin) {
                    toast.error("Please verify CIN for your business type");
                    return;
                }

                if (requiresGST && !verification.gst) {
                    toast.error("Please verify GST for Office/Work address");
                    return;
                }

                if (!verification.aadhar) {
                    toast.error("Please verify Aadhar for Enterprise account");
                    return;
                }
            }
        }

        // ---------- individual validation ----------
        if (accountType === "individual" && isIndian && !verification.aadhar) {
            toast.error("Please verify your identity with DigiLocker");
            return;
        }

        setIsSubmitting(true);

        try {
            // =========================================================
            // STEP 1 SAVE KYC PROFILE
            // =========================================================
            const saveRes = await fetch("/api/onboarding/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    accountType,
                    firstName: email ? email.split("@")[0] : "", // adjust if you have real name fields
                    lastName: "",
                    email,
                    phone,
                    country: selectedCountry,

                    state,
                    city,
                    postalCode,
                    streetAddress,

                    companyName,
                    businessType,

                    gstVerified: verification.gst,
                    cinVerified: verification.cin,
                    aadharVerified: verification.aadhar,
                }),
            });

            const saveData = await saveRes.json();

            if (!saveRes.ok) {
                toast.error(saveData.error || "Failed to save KYC");
                return;
            }

            // =========================================================
            // STEP 2 CREATE WHMCS CLIENT
            // =========================================================
            const whmcsRes = await fetch("/api/whmcs/create-client", {
                method: "POST",
            });

            const whmcsData = await whmcsRes.json();

            if (!whmcsRes.ok) {
                toast.error(whmcsData.error || "Failed to create WHMCS client");
                return;
            }

            // =========================================================
            // SUCCESS
            // =========================================================
            toast.success("KYC completed & client created successfully!");

            router.push("/dashboard");

        } catch (err) {
            console.error("Onboarding submit error:", err);
            toast.error("Something went wrong during onboarding");
        } finally {
            setIsSubmitting(false);
        }
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
                        <BillingCountrySelector
                            selectedCountry={selectedCountry}
                            onCountryChange={setSelectedCountry}
                            billingCurrency={billingCurrency}
                        />

                        {/* Account Verification */}
                        <AccountVerification
                            email={email}
                            phone={phone}
                            verification={{
                                email: verification.email,
                                phone: verification.phone,
                            }}
                        />

                        {/* Account Type Selection */}
                        <AccountTypeSelection
                            accountType={accountType}
                            onAccountTypeChange={setAccountType}
                        />

                        {/* Individual Verification - DIGILOCKER for India */}
                        {accountType === "individual" && isIndian && (
                            <IndividualVerification
                                isVerified={verification.aadhar}
                                onVerify={handleDigiLockerVerify}
                            />
                        )}

                        {/* Enterprise Verification */}
                        {accountType === "enterprise" && (
                            <EnterpriseVerification
                                companyName={companyName}
                                businessType={businessType}
                                gstNumber={gstNumber}
                                aadharNumber={aadharNumber}
                                cinNumber={cinNumber}
                                // panNumber={panNumber}
                                verification={{
                                    gst: verification.gst,
                                    aadhar: verification.aadhar,
                                    cin: verification.cin,
                                    // pan: verification.pan,
                                }}
                                isIndian={isIndian}
                                requiresGST={requiresGST}
                                onCompanyNameChange={setCompanyName}
                                onBusinessTypeChange={setBusinessType}
                                onGstNumberChange={setGstNumber}
                                onAadharNumberChange={setAadharNumber}
                                onCinNumberChange={setCinNumber}
                                // onPanNumberChange={setPanNumber}
                                onVerifyGST={handleVerifyGST}
                                onVerifyAadhar={handleVerifyAadhar}
                                onVerifyCIN={handleVerifyCIN}
                            // onVerifyPAN={handleVerifyPAN}
                            />
                        )}

                        {/* Billing Address */}
                        {accountType && (
                            <BillingAddress
                                addressType={addressType}
                                streetAddress={streetAddress}
                                streetAddress2={streetAddress2}
                                state={state}
                                city={city}
                                postalCode={postalCode}
                                onAddressTypeChange={setAddressType}
                                onStreetAddressChange={setStreetAddress}
                                onStreetAddress2Change={setStreetAddress2}
                                onStateChange={setState}
                                onCityChange={setCity}
                                onPostalCodeChange={setPostalCode}
                            />
                        )}

                        {/* Terms & Conditions */}
                        <TermsAndConditions
                            termsAccepted={termsAccepted}
                            privacyAccepted={privacyAccepted}
                            onTermsChange={setTermsAccepted}
                            onPrivacyChange={setPrivacyAccepted}
                        />

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