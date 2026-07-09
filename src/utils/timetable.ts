import type { IRoom, ITimetable } from "@/types/APIType";

/**
 * Returns the title for a given year ID.
 * @param yearId The year ID (e.g., 1, 2, 3)
 * @returns A string like "Année 1A" or "Autres" if yearId <= 0
 */
export function getYearTitle(yearId: number): string {
	if (yearId <= 0) return "Autres";
	return `Année ${yearId}A`;
}

/**
 * Returns the name for a given timetable or room.
 * @param item The ITimetable or IRoom object
 * @param resourceType The type of resource ("timetable" | "room")
 * @returns A formatted string or "?" if not available
 */
export function getTimetableName(
	item: ITimetable | IRoom | undefined,
	resourceType: "timetable" | "room",
): string {
	if (!item) {
		return "?";
	}

	if (resourceType === "room") {
		return item.label ?? "?";
	}

	if (!isTimetable(item)) {
		return item.label ?? "?";
	}

	if (item.year < 0) {
		return item.label ?? "?";
	}

	return `${item.year}A ${item.label}`;
}

function isTimetable(item: ITimetable | IRoom): item is ITimetable {
	return "year" in item;
}
