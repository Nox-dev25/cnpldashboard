import { callWhmcs } from "./whmcsProxy";

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
    const result = await callWhmcs("AddClient", {
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
        password2: data.password ?? crypto.randomUUID(),
    });

    if (result.result !== "success") {
        throw new Error(result.message || "WHMCS client creation failed");
    }

    return Number(result.clientid);
}

export async function validateWhmcsLogin(email: string, password: string) {
    try {
        const loginData = await callWhmcs("ValidateLogin", {
            email,
            password2: password,
        });

        if (loginData.result !== "success") {
            return null;
        }

        const detailData = await callWhmcs("GetClientsDetails", {
            clientid: loginData.userid,
            stats: false,
        });

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
    } catch {
        return null;
    }
}