import crypto from 'crypto';

const CASHFREE_BASE_URL = 'https://sandbox.cashfree.com';
const CLIENT_ID = process.env.CASHFREE_CLIENT_ID!;
const CLIENT_SECRET = process.env.CASHFREE_CLIENT_SECRET!;

interface CashfreeHeaders {
    'Content-Type': string;
    'x-client-id': string;
    'x-client-secret': string;
    'x-api-version': string;
    [key: string]: string;
}

export class CashfreeVerificationClient {
    private headers: CashfreeHeaders;

    constructor() {
        this.headers = {
            'Content-Type': 'application/json',
            'x-client-id': CLIENT_ID,
            'x-client-secret': CLIENT_SECRET,
            'x-api-version': '2022-09-01',
        };
    }

    /**
     * DigiLocker Verification
     * https://docs.cashfree.com/reference/pgverifydigilocker
     */
    async verifyDigiLocker(params?: {
        document_requested?: ("AADHAAR" | "PAN" | "DRIVING_LICENSE")[];
    }) {
        try {
            console.log("APP URL:", process.env.NEXT_PUBLIC_APP_URL);
            const response = await fetch(`${CASHFREE_BASE_URL}/verification/digilocker`, {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify({

                    verification_id: this.generateVerificationId(),

                    // REQUIRED
                    document_requested: params?.document_requested ?? ["AADHAAR"],

                    // IMPORTANT (avoid bad request in sandbox)
                    redirect_url: "https://undemonstratively-ascensive-nikki.ngrok-free.dev/kyc/digilocker/callback",


                    user_flow: "signup",
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Cashfree DigiLocker error:", data);
                throw new Error(data.message || "DigiLocker verification failed");
            }

            return data;
        } catch (error) {
            console.error("DigiLocker verification error:", error);
            throw error;
        }
    }

    async getDigiLockerStatus(verificationId: string) {
        try {
            const response = await fetch(
                `${CASHFREE_BASE_URL}/verification/digilocker/${verificationId}`,
                {
                    method: "GET",
                    headers: this.headers,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error("Cashfree status error:", data);
                throw new Error(data.message || "Failed to fetch DigiLocker status");
            }

            return data;
        } catch (error) {
            console.error("DigiLocker status fetch error:", error);
            throw error;
        }
    }

    async getDigiLockerDocument(verificationId: string) {
        try {
            const response = await fetch(
                `${CASHFREE_BASE_URL}/verification/digilocker/document/AADHAAR?verification_id=${verificationId}`,
                {
                    method: "GET",
                    headers: this.headers,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error("Cashfree document error:", data);
                throw new Error(data.message || "Failed to fetch DigiLocker document");
            }

            return data;
        } catch (error) {
            console.error("DigiLocker document fetch error:", error);
            throw error;
        }
    }

    /**
     * Aadhaar Verification
     * https://docs.cashfree.com/reference/pgverifyaadhaar
     */
    async verifyAadhaar(aadhaarNumber: string) {
        try {
            const response = await fetch(`${CASHFREE_BASE_URL}/verification/aadhaar`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({
                    verification_id: this.generateVerificationId(),
                    aadhaar_number: aadhaarNumber,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Aadhaar verification failed');
            }

            return data;
        } catch (error) {
            console.error('Aadhaar verification error:', error);
            throw error;
        }
    }

    /**
     * GST Verification
     * https://docs.cashfree.com/reference/pgverifygst
     */
    async verifyGST(gstNumber: string) {
        try {
            const response = await fetch(`${CASHFREE_BASE_URL}/verification/gst`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({
                    verification_id: this.generateVerificationId(),
                    gstin: gstNumber,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'GST verification failed');
            }

            return data;
        } catch (error) {
            console.error('GST verification error:', error);
            throw error;
        }
    }

    /**
     * CIN Verification
     * https://docs.cashfree.com/reference/pgverifycin
     */
    async verifyCIN(cinNumber: string) {
        try {
            const response = await fetch(`${CASHFREE_BASE_URL}/verification/cin`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({
                    verification_id: this.generateVerificationId(),
                    cin: cinNumber,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'CIN verification failed');
            }

            return data;
        } catch (error) {
            console.error('CIN verification error:', error);
            throw error;
        }
    }

    /**
     * Get Verification Status
     * https://docs.cashfree.com/reference/pgverificationstatus
     */
    async getVerificationStatus(verificationId: string) {
        try {
            const response = await fetch(
                `${CASHFREE_BASE_URL}/verification/status/${verificationId}`,
                {
                    method: 'GET',
                    headers: this.headers,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to get verification status');
            }

            return data;
        } catch (error) {
            console.error('Get verification status error:', error);
            throw error;
        }
    }

    /**
     * Generate unique verification ID
     */
    private generateVerificationId(): string {
        return `VER_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
    }
}

// Singleton instance
export const cashfreeClient = new CashfreeVerificationClient();