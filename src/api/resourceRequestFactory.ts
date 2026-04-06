import {
	roomDetailsRequest,
	roomEventsRequest,
	timetableDetailsRequest,
	timetableEventsRequest,
} from "@/api/api_requests";
import type { IResourceSelection } from "@/types/AppType";

export function buildResourceDetailsRequest(context: IResourceSelection) {
	if (context.resourceType === "room") {
		return roomDetailsRequest(context.numUniv, context.adeResources);
	}

	return timetableDetailsRequest(
		context.numUniv,
		context.groupId ?? 0,
		context.adeResources,
	);
}

export function buildResourceEventsRequest(context: IResourceSelection) {
	if (context.resourceType === "room") {
		return roomEventsRequest(context.numUniv, context.adeResources);
	}

	return timetableEventsRequest(
		context.numUniv,
		context.groupId ?? 0,
		context.adeResources,
	);
}
