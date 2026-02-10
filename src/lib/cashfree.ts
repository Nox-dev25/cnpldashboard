export const cashfreeHeaders = () => ({
    "Content-Type": "application/json",
    "x-client-id": process.env.CASHFREE_CLIENT_ID!,
    "x-client-secret": process.env.CASHFREE_CLIENT_SECRET!,
    "x-api-version": "2022-09-01", // REQUIRED
});