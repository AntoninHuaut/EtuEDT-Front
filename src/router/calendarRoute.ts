import type { LocationQuery, LocationQueryRaw } from "vue-router";
import type { TViewMode } from "@/types/AppType";
import { getQueryStringValue } from "./resourceRoute";

const CAL_DATE_QUERY_KEY = "date";
const CAL_VIEW_QUERY_KEY = "view";
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const VIEW_MODE_SET = new Set<TViewMode>(["day", "week", "month-grid"]);

export function parseCalDateQuery(
	query: LocationQuery,
): Temporal.PlainDate | undefined {
	const raw = getQueryStringValue(query[CAL_DATE_QUERY_KEY]);

	if (!raw || !ISO_DATE_REGEX.test(raw)) {
		return undefined;
	}

	try {
		return Temporal.PlainDate.from(raw);
	} catch {
		return undefined;
	}
}

export function parseViewModeQuery(
	query: LocationQuery,
): TViewMode | undefined {
	const raw = getQueryStringValue(query[CAL_VIEW_QUERY_KEY]);

	if (!raw || !VIEW_MODE_SET.has(raw as TViewMode)) {
		return undefined;
	}

	return raw as TViewMode;
}

export function buildCalendarRouteQuery(
	date: Temporal.PlainDate,
	view: TViewMode,
): LocationQueryRaw {
	return {
		[CAL_DATE_QUERY_KEY]: date.toString(),
		[CAL_VIEW_QUERY_KEY]: view,
	};
}
