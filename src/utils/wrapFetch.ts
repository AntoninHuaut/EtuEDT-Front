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

export async function wrapFetch({
	url,
	options,
	signal,
}: IRequestParams & { signal?: AbortSignal }) {
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

	if (response.status !== 204) {
		return response.json();
	}

	return null;
}
