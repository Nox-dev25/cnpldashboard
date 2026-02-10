type WhmcsClientInput = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    state?: string;
    city?: string;
    postcode?: string;
    address1?: string;
    companyName?: string;
    password?: string;
};

export async function createWhmcsClient(data: WhmcsClientInput) {
    const params = new URLSearchParams({
        action: "AddClient",
        firstname: data.firstName,
        lastname: data.lastName,
        email: data.email,
        phonenumber: data.phone,
        country: data.country,
        state: data.state ?? "",
        city: data.city ?? "",
        postcode: data.postcode ?? "",
        address1: data.address1 ?? "",
        companyname: data.companyName ?? "",
        password2: data.password ?? crypto.randomUUID(), // auto-generate if not provided
        responsetype: "json",
        identifier: process.env.WHMCS_API_IDENTIFIER!,
        secret: process.env.WHMCS_API_SECRET!,
    });

    const response = await fetch(process.env.WHMCS_API_URL!, {
        method: "POST",
        body: params,
    });

    const result = await response.json();

    if (result.result !== "success") {
        const errorMessage = result.message || "WHMCS client creation failed";

        const error = new Error(errorMessage);
        (error as any).code = "WHMCS_ERROR";

        throw error;
    }

    return Number(result.clientid);
}

export async function validateWhmcsLogin(email: string, password: string) {
    try {
        // Validate login
        const loginParams = new URLSearchParams({
            action: "ValidateLogin",
            username: process.env.WHMCS_API_IDENTIFIER!,
            password: process.env.WHMCS_API_SECRET!,
            email: email,
            password2: password,
            responsetype: "json",
        });

        const loginRes = await fetch(process.env.WHMCS_API_URL!, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: loginParams,
        });

        const loginData = await loginRes.json();

        if (loginData.result !== "success") {
            return null;
        }

        // Fetch full client details
        const detailParams = new URLSearchParams({
            action: "GetClientsDetails",
            username: process.env.WHMCS_API_IDENTIFIER!,
            password: process.env.WHMCS_API_SECRET!,
            clientid: loginData.userid,
            stats: "false",
            responsetype: "json",
        });

        const detailRes = await fetch(process.env.WHMCS_API_URL!, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: detailParams,
        });

        const detailData = await detailRes.json();

        if (detailData.result !== "success") {
            return null;
        }

        return {
            clientId: Number(detailData.client_id),
            email: detailData.email,
            firstName: detailData.firstname,
            lastName: detailData.lastname,
            phone: detailData.phonenumber,
            country: detailData.country,
        };
    } catch (error) {
        return null;
    }
}