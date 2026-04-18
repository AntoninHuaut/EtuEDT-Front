import type {
	LocationQuery,
	NavigationGuardReturn,
	NavigationGuardWithThis,
} from "vue-router";
import { useAppStore } from "@/store";
import type { ResourceType } from "@/types/AppType";
import {
	getResourceRouteLocation,
	getResourceRouteSelectionFromQuery,
	resolveResourceRouteSelection,
} from "./resourceRoute";
import { ROUTE_NAME } from "./routeNames";
import { getStoreFallbackSelection } from "./storeFallbackSelection";

export function resolveResourceGuard(
	query: LocationQuery,
	resourceType: ResourceType,
): NavigationGuardReturn {
	const appStore = useAppStore();
	const fallbackSelection = getStoreFallbackSelection(appStore, resourceType);
	const selectionFromQuery = getResourceRouteSelectionFromQuery(
		query,
		resourceType,
	);
	const selection = resolveResourceRouteSelection(
		query,
		resourceType,
		fallbackSelection,
	);

	if (selectionFromQuery) {
		return true;
	}

	if (selection) {
		return getResourceRouteLocation(selection);
	}

	if (fallbackSelection) {
		return getResourceRouteLocation(fallbackSelection);
	}

	return { name: ROUTE_NAME.HOME };
}

function createResourceGuard(resourceType: ResourceType) {
	const guard: NavigationGuardWithThis<undefined> = (to) =>
		resolveResourceGuard(to.query, resourceType);

	return guard;
}

export const guards = {
	timetable: createResourceGuard("timetable"),
	room: createResourceGuard("room"),
};
