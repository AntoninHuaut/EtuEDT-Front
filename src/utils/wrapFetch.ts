import type { IRequestParams } from "@/api/requests";
import { ApiError, buildApiErrorMessage } from "@/utils/apiError";

async function parseErrorPayload(response: Response): Promise<unknown> {
	const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";

	if (contentType.includes("application/json")) {
		try {
			return await response.json();
		} catch {
			return undefined;
		}
	}

	try {
		const text = await response.text();
		return text || undefined;
	} catch {
		return undefined;
	}
}

async function parseSuccessPayload(
	response: Response,
	parseTextWhenNonJson: boolean,
): Promise<unknown> {
	if (response.status === 204) {
		return null;
	}

	const contentLength = response.headers.get("content-length");
	if (contentLength === "0") {
		return null;
	}

	const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";

	if (contentType.includes("application/json")) {
		try {
			return await response.json();
		} catch {
			return null;
		}
	}

	if (!parseTextWhenNonJson) {
		return null;
	}

	try {
		const text = await response.text();
		return text || null;
	} catch {
		return null;
	}
}

export async function wrapFetch({
	url,
	options,
	signal,
}: IRequestParams & { signal?: AbortSignal }): Promise<unknown> {
	const response = await fetch(url, {
		...options,
		signal,
	});

	if (!response.ok) {
		const payload = await parseErrorPayload(response);
		throw new ApiError({
			message: buildApiErrorMessage({
				status: response.status,
				statusText: response.statusText,
				payload,
			}),
			status: response.status,
			statusText: response.statusText,
			url,
			payload,
		});
	}

	return parseSuccessPayload(response, true);
}

export async function wrapFetchTyped<T>({
	url,
	options,
	signal,
}: IRequestParams & { signal?: AbortSignal }): Promise<T | null> {
	const response = await fetch(url, {
		...options,
		signal,
	});

	if (!response.ok) {
		const payload = await parseErrorPayload(response);
		throw new ApiError({
			message: buildApiErrorMessage({
				status: response.status,
				statusText: response.statusText,
				payload,
			}),
			status: response.status,
			statusText: response.statusText,
			url,
			payload,
		});
	}

	return (await parseSuccessPayload(response, false)) as T | null;
}
