import type { NavigationGuardWithThis } from "vue-router";
import { useAppStore } from "@/store";
import { getResourceRouteSelectionFromQuery } from "./resourceRoute";
import { ROUTE_NAME } from "./routeNames";

function createResourceGuard(resourceType: "timetable" | "room") {
	const guard: NavigationGuardWithThis<undefined> = (to) => {
		const appStore = useAppStore();
		const selection = getResourceRouteSelectionFromQuery(
			to.query,
			resourceType,
		);

		if (!selection) {
			return { name: ROUTE_NAME.NOT_FOUND };
		}

		appStore.applyRouteSelection(selection);
		return true;
	};

	return guard;
}

export const guards = {
	timetable: createResourceGuard("timetable"),
	room: createResourceGuard("room"),
};
