import type { CalendarEvent } from "@schedule-x/calendar";
import { getColorByLessonTitle } from "@/components/Timetable/helper";
import type { IJsonEvent } from "@/types/APIType";
import { errorNotif } from "@/utils/notification";

export function mapTimetableEvents(
	events: IJsonEvent[],
	browserTimeZone: string,
): CalendarEvent[] {
	let hasInvalidEventDate = false;
	const mappedEvents: CalendarEvent[] = [];

	for (const [index, event] of events.entries()) {
		const start = tryToCalendarDateTime(event.start, browserTimeZone);
		const end = tryToCalendarDateTime(event.end, browserTimeZone);

		if (!start || !end) {
			hasInvalidEventDate = true;
			console.error("Skipping event with invalid start/end datetime", event);
			continue;
		}

		mappedEvents.push({
			...event,
			id: index,
			start,
			end,
			people: event.teacher.split(","),
			calendarId: getColorByLessonTitle(event.title),
		});
	}

	if (hasInvalidEventDate) {
		errorNotif({
			message: "Certaines seances n'ont pas pu etre affichees.",
		});
	}

	return mappedEvents;
}

function tryToCalendarDateTime(
	value: string,
	browserTimeZone: string,
): Temporal.ZonedDateTime | undefined {
	try {
		return Temporal.Instant.from(value).toZonedDateTimeISO(browserTimeZone);
	} catch {
		return undefined;
	}
}
