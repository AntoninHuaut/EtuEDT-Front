import {
	roomDetailsRequest,
	roomEventsRequest,
	timetableDetailsRequest,
	timetableEventsRequest,
} from "@/api/api_requests";
import type { IResourceSelection } from "@/types/AppType";

export function buildResourceDetailsRequest(selection: IResourceSelection) {
	if (selection.resourceType === "room") {
		return roomDetailsRequest(selection.numUniv, selection.adeResources);
	}

	return timetableDetailsRequest(
		selection.numUniv,
		selection.groupId,
		selection.adeResources,
	);
}

export function buildResourceEventsRequest(selection: IResourceSelection) {
	if (selection.resourceType === "room") {
		return roomEventsRequest(selection.numUniv, selection.adeResources);
	}

	return timetableEventsRequest(
		selection.numUniv,
		selection.groupId,
		selection.adeResources,
	);
}
