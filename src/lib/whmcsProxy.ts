async function callWhmcs(action: string, params: Record<string, any> = {}) {
    const res = await fetch(process.env.PROXY_URL!, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-proxy-secret": process.env.PROXY_SECRET!,
        },
        body: JSON.stringify({ action, ...params }),
    });

    if (!res.ok) {
        throw new Error("Proxy request failed");
    }

    return res.json();
}

export { callWhmcs };