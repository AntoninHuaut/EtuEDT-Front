interface ApiErrorParams {
	message: string;
	status: number;
	statusText: string;
	url: string;
	payload?: unknown;
}

export class ApiError extends Error {
	readonly status: number;
	readonly statusText: string;
	readonly url: string;
	readonly payload?: unknown;

	constructor(params: ApiErrorParams) {
		super(params.message);
		this.name = "ApiError";
		this.status = params.status;
		this.statusText = params.statusText;
		this.url = params.url;
		this.payload = params.payload;
	}
}

export function isApiError(error: unknown): error is ApiError {
	return error instanceof ApiError;
}

function extractPayloadMessage(payload: unknown): string | undefined {
	if (typeof payload === "string") {
		const message = payload.trim();
		return message || undefined;
	}

	if (typeof payload !== "object" || payload === null) {
		return undefined;
	}

	if ("message" in payload && typeof payload.message === "string") {
		const message = payload.message.trim();
		if (message) {
			return message;
		}
	}

	return undefined;
}

export function buildApiErrorMessage(params: {
	status: number;
	statusText: string;
	payload?: unknown;
}): string {
	const payloadMessage = extractPayloadMessage(params.payload);
	if (payloadMessage) {
		return payloadMessage;
	}

	if (params.statusText) {
		return `HTTP ${params.status}: ${params.statusText}`;
	}

	return `HTTP ${params.status}`;
}
