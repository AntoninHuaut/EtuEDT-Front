<template>
  <div class="d-flex flex-column mt-3">
	<div v-if="isInitialLoadingEvents" class="mt-5 pt-5 text-center">
  	    <v-progress-circular :size="128" :width="12" color="primary" indeterminate />
    </div>

	<ScheduleXCalendar :class="{ hidden: isInitialLoadingEvents, 'calendar--xs': xs }" :calendar-app="calendarApp" />
  </div>
</template>

<script lang="ts" setup>
import {
	createCalendar,
	createViewDay,
	createViewMonthGrid,
	createViewWeek,
} from "@schedule-x/calendar";
import { createCalendarControlsPlugin } from "@schedule-x/calendar-controls";
import { createCurrentTimePlugin } from "@schedule-x/current-time";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-default/dist/index.css";
import { ScheduleXCalendar } from "@schedule-x/vue";
import { useQuery } from "@tanstack/vue-query";
import { computed, shallowRef, watch, watchEffect } from "vue";
import { useDisplay, useTheme } from "vuetify";

import { buildResourceEventsRequest } from "@/api/resourceRequestFactory";
import { useQueryNotifications } from "@/hooks/useQueryNotifications";
import { useTimetable } from "@/hooks/useTimetable";
import { useAppStore, useTimetableViewStore } from "@/store";
import type { IJsonEvent } from "@/types/APIType";
import { getLocale } from "@/utils/locale";
import { errorNoDataFetchNotif, infoNotif } from "@/utils/notification";
import { wrapFetch } from "@/utils/wrapFetch";

import { getCalendarsList, getColorByLessonTitle } from "./helper";

const appStore = useAppStore();
const theme = useTheme();
const { xs } = useDisplay();
const timetableData = useTimetable();
const timetableViewStore = useTimetableViewStore();
const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const browserLocale = getLocale();

const eventsServicePlugin = createEventsServicePlugin();
const calendarControls = createCalendarControlsPlugin();
const calendarApp = shallowRef(
	createCalendar({
		selectedDate: timetableViewStore.calDate,
		views: [createViewDay(), createViewWeek(), createViewMonthGrid()],
		plugins: [
			createEventModalPlugin(),
			createCurrentTimePlugin(),
			calendarControls,
			eventsServicePlugin,
		],
		calendars: getCalendarsList(),
		events: [],
		defaultView: timetableViewStore.viewMode,
		locale: browserLocale,
		timezone: browserTimeZone,
		dayBoundaries: {
			start: "08:00",
			end: "20:00",
		},
		monthGridOptions: {
			nEventsPerDay: 12,
		},
		weekOptions: {
			gridHeight: 1000,
			nDays: 5,
			eventWidth: 98,
		},
		isDark: theme.global.name.value === "dark",
		isResponsive: false,
	}),
);

watchEffect(() =>
	calendarApp.value.setTheme(
		theme.global.name.value === "dark" ? "dark" : "light",
	),
);
watchEffect(() => calendarControls.setDate(timetableViewStore.calDate));
watchEffect(() => calendarControls.setView(timetableViewStore.viewMode));
watchEffect(() => eventsServicePlugin.set(timetableViewStore.events));

const evtsQuery = useQuery<IJsonEvent[]>({
	queryKey: computed(() => [
		"timetableEvents",
		appStore.numUniv,
		appStore.groupId,
		appStore.adeResources,
		appStore.resourceType,
	]),
	queryFn: ({ signal }) => {
		const context = appStore.getSelectedResourceContext();

		if (!context) {
			throw new Error("Missing timetable context");
		}

		return wrapFetch({
			...buildResourceEventsRequest(context),
			signal,
		});
	},
	enabled: computed(() => appStore.canLoadSelectedResource),
});

const isInitialLoadingEvents = computed(() => evtsQuery.isLoading.value);

useQueryNotifications<IJsonEvent[]>({
	contextName: "Timetable Events",
	getError: () => evtsQuery.error.value,
	getIsSuccess: () => evtsQuery.isSuccess.value,
	getData: () => evtsQuery.data.value,
});

watch(
	() => [
		evtsQuery.error.value,
		evtsQuery.isSuccess.value,
		evtsQuery.data.value,
	],
	() => {
		if (evtsQuery.error.value) return;
		if (!evtsQuery.isSuccess.value) return;
		if (!evtsQuery.data.value) return errorNoDataFetchNotif();

		timetableViewStore.events.length = 0;
		timetableViewStore.events.push(
			...evtsQuery.data.value.map((event, index) => ({
				...event,
				id: index,
				start: toCalendarDateTime(event.start),
				end: toCalendarDateTime(event.end),
				people: event.teacher.split(","),
				calendarId: getColorByLessonTitle(event.title),
			})),
		);

		if (timetableData.lastUpdate.value) {
			const dateTime = toCalendarDateTime(timetableData.lastUpdate.value);
			const datePart = dateTime.toLocaleString(browserLocale, {
				year: "numeric",
				month: "numeric",
				day: "numeric",
			});
			const timePart = dateTime
				.toLocaleString(browserLocale, {
					hour: "numeric",
					minute: "numeric",
					hourCycle: "h23",
				})
				.replace(":", "h");

			infoNotif({
				message: `Dernière mise à jour de l'emploi du temps le ${datePart} à ${timePart}`,
			});
		}
	},
	{ immediate: true },
);

function toCalendarDateTime(value: string): Temporal.ZonedDateTime {
	return Temporal.Instant.from(value).toZonedDateTimeISO(browserTimeZone);
}
</script>

<style>
.hidden {
 visibility: hidden;
}

.sx__calendar {
  --sx-color-primary: rgb(var(--v-theme-primary));
}

.sx__calendar-header {
  display: none;
}

.sx__time-grid-event-title {
    overflow: hidden;
    text-overflow: ellipsis;
    text-wrap: nowrap;
}

.sx__week-grid__date {
    padding: 4px; 
}

.sx__week-grid__date-number {
    height: 1.2em;
    width: 1.2em;
}
</style>
