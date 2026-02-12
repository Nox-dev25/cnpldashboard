"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

    const searchParams = useSearchParams();

    useEffect(() => {
        const id = searchParams.get("verification_id");
        if (!id) return;

        const fetchStatus = async () => {
            const res = await fetch(`/api/verify/digilocker/status?id=${id}`);
            const data = await res.json();

            if (data.status === "SUCCESS") {
                setVerification(v => ({ ...v, aadhar: true }));

                if (data.address) {
                    setStreetAddress(data.address.house || "");
                    setCity(data.address.vtc || "");
                    setState(data.address.state || "");
                    setPostalCode(data.address.pincode || "");
                }

                toast.success("Aadhaar verified successfully");
            }
        };

        fetchStatus();
    }, [searchParams]);

    useEffect(() => {
        const handler = async (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;

            if (event.data?.type === "DIGILOCKER_SUCCESS") {
                const verificationId = event.data.verificationId;

                const res = await fetch(`/api/verify/digilocker/status?id=${verificationId}`);
                const data = await res.json();

                if (data.status === "SUCCESS") {
                    setVerification(v => ({ ...v, aadhar: true }));

                    if (data.address) {
                        setStreetAddress(data.address.house || "");
                        setCity(data.address.vtc || "");
                        setState(data.address.state || "");
                        setPostalCode(data.address.pincode || "");
                    }

                    toast.success("Aadhaar verified successfully");
                }
            }
        };

        window.addEventListener("message", handler);
        return () => window.removeEventListener("message", handler);
    }, []);


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
            const res = await fetch("/api/verify/digilocker", { method: "POST" });
            const result = await res.json();
            toast.dismiss(loadingToast);

            if (result.url) {
                // open centered popup
                const width = 500;
                const height = 650;
                const left = window.screenX + (window.outerWidth - width) / 2;
                const top = window.screenY + (window.outerHeight - height) / 2;

                window.open(
                    result.url,
                    "digilocker",
                    `width=${width},height=${height},left=${left},top=${top}`
                );

                toast.success("Complete verification in popup window");
            } else {
                toast.error(result.error || "DigiLocker verification failed");
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error("Failed to initialize DigiLocker.");
        }
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

        if (accountType === "enterprise" && isIndian && !verification.aadhar) {
            toast.error("Please verify Aadhaar for Enterprise account");
            return;
        }

        if (accountType === "individual" && isIndian && !verification.aadhar) {
            toast.error("Please verify your identity with DigiLocker");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/onboarding/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    accountType,
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

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Failed to submit KYC");
                return;
            }

            toast.success("KYC submitted successfully. It will be reviewed in 2–3 business days.");

            router.push("/dashboard");

        } catch (err) {
            console.error("Submit error:", err);
            toast.error("Something went wrong");
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