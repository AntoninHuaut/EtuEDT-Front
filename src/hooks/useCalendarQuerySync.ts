import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDateHelper } from "@/hooks/useDateHelper";
import {
	buildCalendarRouteQuery,
	parseCalDateQuery,
	parseViewModeQuery,
} from "@/router/calendarRoute";
import { useTimetableViewStore } from "@/store";

export function useCalendarQuerySync() {
	const route = useRoute();
	const router = useRouter();
	const dateHelper = useDateHelper();
	const timetableViewStore = useTimetableViewStore();

	function initCalendarFromQuery() {
		const parsedDate = parseCalDateQuery(route.query);
		const parsedView = parseViewModeQuery(route.query);

		// Always assign a fresh value (even when falling back to "today") so the
		// store actually emits a change, which in turn pushes date/view into the
		// URL on first load too, not just on explicit query params.
		timetableViewStore.setCalDate(parsedDate ?? dateHelper.getCurrentWeekday());
		timetableViewStore.setViewMode(parsedView ?? timetableViewStore.viewMode);
	}

	// Route -> store: handles browser back/forward and links pasted while mounted.
	watch(
		() => [route.query.date, route.query.view],
		() => {
			const parsedDate = parseCalDateQuery(route.query);
			const parsedView = parseViewModeQuery(route.query);

			if (parsedDate && !parsedDate.equals(timetableViewStore.calDate)) {
				timetableViewStore.setCalDate(parsedDate);
			}

			if (parsedView && parsedView !== timetableViewStore.viewMode) {
				timetableViewStore.setViewMode(parsedView);
			}
		},
	);

	// Store -> route: keeps the URL shareable/in sync with every navigation action.
	watch(
		() => [timetableViewStore.calDate, timetableViewStore.viewMode] as const,
		([calDate, viewMode]) => {
			const nextCalendarQuery = buildCalendarRouteQuery(calDate, viewMode);

			if (
				route.query.date === nextCalendarQuery.date &&
				route.query.view === nextCalendarQuery.view
			) {
				return;
			}

			router.replace({
				query: {
					...route.query,
					...nextCalendarQuery,
				},
			});
		},
	);

	return { initCalendarFromQuery };
}
