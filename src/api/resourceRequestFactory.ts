import {
	roomDetailsRequest,
	roomEventsRequest,
	timetableDetailsRequest,
	timetableEventsRequest,
} from "@/api/api_requests";

type ResourceType = "timetable" | "room";

export interface IResourceRequestContext {
	numUniv: number;
	groupId?: number;
	adeResources: number;
	resourceType: ResourceType;
}

export function buildResourceDetailsRequest(context: IResourceRequestContext) {
	if (context.resourceType === "room") {
		return roomDetailsRequest(context.numUniv, context.adeResources);
	}

	return timetableDetailsRequest(
		context.numUniv,
		context.groupId ?? 0,
		context.adeResources,
	);
}

export function buildResourceEventsRequest(context: IResourceRequestContext) {
	if (context.resourceType === "room") {
		return roomEventsRequest(context.numUniv, context.adeResources);
	}

	return timetableEventsRequest(
		context.numUniv,
		context.groupId ?? 0,
		context.adeResources,
	);
}
