import type { LocationQuery, NavigationGuardReturn } from "vue-router";
import { useAppStore } from "@/store";
import type { ResourceType } from "@/types/AppType";
import {
	getResourceRouteLocation,
	getResourceRouteSelectionFromQuery,
	hasRouteSelectionQueryKeys,
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

	if (hasRouteSelectionQueryKeys(query, resourceType)) {
		return { name: ROUTE_NAME.NOT_FOUND };
	}

	if (fallbackSelection) {
		return getResourceRouteLocation(fallbackSelection);
	}

	return { name: ROUTE_NAME.HOME };
}
