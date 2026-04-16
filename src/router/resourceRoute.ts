import type {
	LocationQuery,
	LocationQueryRaw,
	LocationQueryValue,
	RouteLocationRaw,
} from "vue-router";
import type {
	IResourceSelectionWithNames,
	IRoomSelectionWithNames,
	ITimetableSelectionWithNames,
	ResourceType,
} from "@/types/AppType";
import { ROUTE_NAME } from "./routeNames";

function getQueryStringValue(
	value: LocationQueryValue | LocationQueryValue[] | undefined,
): string | undefined {
	if (Array.isArray(value)) {
		return getQueryStringValue(value[0]);
	}

	if (typeof value !== "string") {
		return undefined;
	}

	return value;
}

function parseRequiredStringQuery(
	query: LocationQuery,
	key: string,
): string | undefined {
	const raw = getQueryStringValue(query[key]);

	if (raw === undefined) {
		return undefined;
	}

	const trimmed = raw.trim();
	if (!trimmed) {
		return undefined;
	}

	return trimmed;
}

function parseStrictPositiveIntQuery(
	query: LocationQuery,
	key: string,
): number | undefined {
	const raw = getQueryStringValue(query[key]);

	if (!raw || !/^\d+$/.test(raw)) {
		return undefined;
	}

	const parsed = Number.parseInt(raw, 10);
	if (!Number.isSafeInteger(parsed) || parsed <= 0) {
		return undefined;
	}

	return parsed;
}

function setQueryValue(query: LocationQueryRaw, key: string, value: string) {
	query[key] = value;
}

function buildTimetableRouteLocation(
	selection: ITimetableSelectionWithNames,
): RouteLocationRaw {
	const query: LocationQueryRaw = {};
	setQueryValue(query, "universityId", String(selection.numUniv));
	setQueryValue(query, "groupId", String(selection.groupId));
	setQueryValue(query, "resourceId", String(selection.adeResources));
	setQueryValue(query, "universityName", selection.universityName);
	setQueryValue(query, "groupName", selection.groupName);

	return {
		name: ROUTE_NAME.TIMETABLE_GROUP,
		query,
	};
}

function buildRoomRouteLocation(
	selection: IRoomSelectionWithNames,
): RouteLocationRaw {
	const query: LocationQueryRaw = {};
	setQueryValue(query, "universityId", String(selection.numUniv));
	setQueryValue(query, "resourceId", String(selection.adeResources));
	setQueryValue(query, "universityName", selection.universityName);

	return {
		name: ROUTE_NAME.TIMETABLE_ROOM,
		query,
	};
}

export function getResourceRouteLocation(
	selection: IResourceSelectionWithNames | undefined,
): RouteLocationRaw {
	if (!selection) {
		return { name: ROUTE_NAME.HOME };
	}

	if (selection.resourceType === "room") {
		return buildRoomRouteLocation(selection);
	}

	return buildTimetableRouteLocation(selection);
}

function parseTimetableRouteSelection(
	query: LocationQuery,
	resourceType: "timetable",
): ITimetableSelectionWithNames | undefined {
	const universityId = parseStrictPositiveIntQuery(query, "universityId");
	const groupId = parseStrictPositiveIntQuery(query, "groupId");
	const resourceId = parseStrictPositiveIntQuery(query, "resourceId");
	const universityName = parseRequiredStringQuery(query, "universityName");
	const groupName = parseRequiredStringQuery(query, "groupName");

	if (
		universityId === undefined ||
		groupId === undefined ||
		resourceId === undefined ||
		universityName === undefined ||
		groupName === undefined
	) {
		return undefined;
	}

	return {
		numUniv: universityId,
		groupId,
		adeResources: resourceId,
		resourceType,
		universityName,
		groupName,
	};
}

function parseRoomRouteSelection(
	query: LocationQuery,
	resourceType: "room",
): IRoomSelectionWithNames | undefined {
	const universityId = parseStrictPositiveIntQuery(query, "universityId");
	const resourceId = parseStrictPositiveIntQuery(query, "resourceId");
	const universityName = parseRequiredStringQuery(query, "universityName");

	if (
		universityId === undefined ||
		resourceId === undefined ||
		universityName === undefined
	) {
		return undefined;
	}

	return {
		numUniv: universityId,
		adeResources: resourceId,
		resourceType,
		universityName,
	};
}

export function getResourceRouteSelectionFromQuery(
	query: LocationQuery,
	resourceType: ResourceType,
): IResourceSelectionWithNames | undefined {
	if (resourceType === "room") {
		return parseRoomRouteSelection(query, "room");
	}

	return parseTimetableRouteSelection(query, "timetable");
}
