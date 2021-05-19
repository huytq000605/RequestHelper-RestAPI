import UrlPattern from "url-pattern"

function makeQuery(data: Record<string, any>): string {
    let queryArray = []
    for (let [key, value] of Object.entries(data)) {
        if (Array.isArray(value)) {
            for(let ele of value) {
                if(typeof ele === "object") {
                    ele = JSON.stringify(ele)
                }
                queryArray.push(`${key}[]=${ele}`);
            }
            continue;
        }
        if (typeof value === "object") {
                value = JSON.stringify(value);
                queryArray.push(`${key}=${value}`);
            continue;
        }
        queryArray.push(`${key}=${value}`);
    }
    return queryArray.join("&");
}

export default async function makeRequest(
    method: "get" | "post" | "put" | "delete",
    url: string,
    data: Record<string, any>,
    options?: Record<string, any>
) {
    const pattern = new UrlPattern(url);
    let finalUrl = pattern.stringify(data);
    if (method == "get" || method == "delete") {
        const query = makeQuery(data);
        finalUrl += "?" + query;
    } else {
        options = {
            ...options,
            body: JSON.stringify(data)
        }
    }
    const requestOptions = {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        ...options,
    };
    // Auth headers need to set here
    const result = await fetch(finalUrl, requestOptions)
}