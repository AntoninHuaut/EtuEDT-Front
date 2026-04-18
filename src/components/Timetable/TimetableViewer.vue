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
import { computed, ref, shallowRef, watch, watchEffect } from "vue";
import { useDisplay, useTheme } from "vuetify";

import { getSelectedResourceIdentity } from "@/hooks/queries/queryKeys";
import { mapTimetableEvents } from "@/hooks/timetable/useMappedTimetableEvents";
import { useTimetableEventsQuery } from "@/hooks/timetable/useTimetableEventsQuery";
import { useQueryNotifications } from "@/hooks/useQueryNotifications";
import { useTimetable } from "@/hooks/useTimetable";
import { useTimetableViewStore } from "@/store";
import type { IJsonEvent } from "@/types/APIType";
import type { IResourceSelection } from "@/types/AppType";
import { getLocale } from "@/utils/locale";
import { errorNotif, infoNotif } from "@/utils/notification";

import { getCalendarsList } from "./helper";

const props = defineProps<{
	selectedResource: IResourceSelection;
}>();

const theme = useTheme();
const { xs } = useDisplay();
const timetableData = useTimetable({
	selectedResource: computed(() => props.selectedResource),
});
const timetableViewStore = useTimetableViewStore();
const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const browserLocale = getLocale();
const selectedResourceIdentity = computed(() =>
	getSelectedResourceIdentity(props.selectedResource),
);
const lastNotifiedUpdateKey = ref<string | undefined>(undefined);
const currentUpdateKey = computed(() => {
	if (!timetableData.lastUpdate.value) {
		return undefined;
	}

	return [
		...selectedResourceIdentity.value,
		timetableData.lastUpdate.value,
	].join("|");
});

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

const evtsQuery = useTimetableEventsQuery({
	selectedResource: computed(() => props.selectedResource),
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
		selectedResourceIdentity.value,
		currentUpdateKey.value,
		evtsQuery.error.value,
		evtsQuery.isSuccess.value,
		evtsQuery.data.value,
	],
	() => {
		if (evtsQuery.error.value) {
			timetableViewStore.replaceEvents([]);
			return;
		}
		if (!evtsQuery.isSuccess.value) return;
		if (!evtsQuery.data.value) {
			timetableViewStore.replaceEvents([]);
			return;
		}

		try {
			timetableViewStore.replaceEvents(
				mapTimetableEvents(evtsQuery.data.value, browserTimeZone),
			);
		} catch (error) {
			console.error("Failed to map timetable events", error);
			timetableViewStore.replaceEvents([]);
			errorNotif({
				message: "Impossible d'afficher les seances de cet emploi du temps.",
			});
			return;
		}

		if (timetableData.lastUpdate.value) {
			const updateKey = currentUpdateKey.value;
			if (!updateKey) {
				return;
			}
			if (lastNotifiedUpdateKey.value === updateKey) {
				return;
			}

			lastNotifiedUpdateKey.value = updateKey;
			const dateTime = toCalendarDateTime(timetableData.lastUpdate.value);
			if (!dateTime) {
				return;
			}
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

watch(selectedResourceIdentity, () => {
	timetableViewStore.replaceEvents([]);
	lastNotifiedUpdateKey.value = undefined;
});

function toCalendarDateTime(value: string): Temporal.ZonedDateTime | undefined {
	try {
		return Temporal.Instant.from(value).toZonedDateTimeISO(browserTimeZone);
	} catch {
		console.error("Invalid lastUpdate datetime", value);
		return undefined;
	}
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
.sx__current-time-indicator {
  z-index: 1;
  pointer-events: none;
}
</style>
