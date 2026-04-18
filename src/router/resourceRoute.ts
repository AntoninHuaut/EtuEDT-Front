import type {
	LocationQuery,
	LocationQueryRaw,
	LocationQueryValue,
	RouteLocationRaw,
} from "vue-router";
import type {
	IResourceSelection,
	IRoomSelection,
	ITimetableSelection,
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
	selection: ITimetableSelection,
): RouteLocationRaw {
	const query: LocationQueryRaw = {};
	setQueryValue(query, "universityId", String(selection.numUniv));
	setQueryValue(query, "groupId", String(selection.groupId));
	setQueryValue(query, "resourceId", String(selection.adeResources));

	return {
		name: ROUTE_NAME.TIMETABLE_GROUP,
		query,
	};
}

function buildRoomRouteLocation(selection: IRoomSelection): RouteLocationRaw {
	const query: LocationQueryRaw = {};
	setQueryValue(query, "universityId", String(selection.numUniv));
	setQueryValue(query, "resourceId", String(selection.adeResources));

	return {
		name: ROUTE_NAME.TIMETABLE_ROOM,
		query,
	};
}

export function getResourceRouteLocation(
	selection: IResourceSelection | undefined,
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
): ITimetableSelection | undefined {
	const universityId = parseStrictPositiveIntQuery(query, "universityId");
	const groupId = parseStrictPositiveIntQuery(query, "groupId");
	const resourceId = parseStrictPositiveIntQuery(query, "resourceId");

	if (
		universityId === undefined ||
		groupId === undefined ||
		resourceId === undefined
	) {
		return undefined;
	}

	return {
		numUniv: universityId,
		groupId,
		adeResources: resourceId,
		resourceType,
	};
}

function parseRoomRouteSelection(
	query: LocationQuery,
	resourceType: "room",
): IRoomSelection | undefined {
	const universityId = parseStrictPositiveIntQuery(query, "universityId");
	const resourceId = parseStrictPositiveIntQuery(query, "resourceId");

	if (universityId === undefined || resourceId === undefined) {
		return undefined;
	}

	return {
		numUniv: universityId,
		adeResources: resourceId,
		resourceType,
	};
}

export function getResourceRouteSelectionFromQuery(
	query: LocationQuery,
	resourceType: ResourceType,
): IResourceSelection | undefined {
	if (resourceType === "room") {
		return parseRoomRouteSelection(query, "room");
	}

	return parseTimetableRouteSelection(query, "timetable");
}

function hasRouteSelectionQueryKeys(
	query: LocationQuery,
	resourceType: ResourceType,
): boolean {
	if (resourceType === "room") {
		return query.universityId !== undefined || query.resourceId !== undefined;
	}

	return (
		query.universityId !== undefined ||
		query.groupId !== undefined ||
		query.resourceId !== undefined
	);
}

export function resolveResourceRouteSelection(
	query: LocationQuery,
	resourceType: ResourceType,
	fallbackSelection: IResourceSelection | undefined,
): IResourceSelection | undefined {
	const selectionFromQuery = getResourceRouteSelectionFromQuery(
		query,
		resourceType,
	);

	if (selectionFromQuery) {
		return selectionFromQuery;
	}

	if (hasRouteSelectionQueryKeys(query, resourceType)) {
		return undefined;
	}

	if (!fallbackSelection || fallbackSelection.resourceType !== resourceType) {
		return undefined;
	}

	return fallbackSelection;
}
