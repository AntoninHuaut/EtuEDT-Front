import type { IRequestParams } from "@/api/requests";

export async function wrapFetch({ url, options, signal }: IRequestParams & { signal?: AbortSignal }) {
    const response = await fetch(url, {
        ...options,
        signal,
    });

    if (!response.ok) throw new Error(`${response.status}`);

    if (response.status !== 204) {
        return response.json();
    }

    return null;
}
