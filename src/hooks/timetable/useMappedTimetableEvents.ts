import type { CalendarEvent } from "@schedule-x/calendar";
import type { IJsonEvent } from "@/types/APIType";
import { getColorByLessonTitle } from "@/components/Timetable/helper";

export function mapTimetableEvents(
	events: IJsonEvent[],
	browserTimeZone: string,
): CalendarEvent[] {
	return events.map((event, index) => ({
		...event,
		id: index,
		start: toCalendarDateTime(event.start, browserTimeZone),
		end: toCalendarDateTime(event.end, browserTimeZone),
		people: event.teacher.split(","),
		calendarId: getColorByLessonTitle(event.title),
	}));
}

function toCalendarDateTime(
	value: string,
	browserTimeZone: string,
): Temporal.ZonedDateTime {
	return Temporal.Instant.from(value).toZonedDateTimeISO(browserTimeZone);
}
