<template>
  <div class="d-flex flex-column mt-3">
    <div v-if="evtsQuery.isLoading" class="mt-5 pt-5 text-center">
      <v-progress-circular :size="128" :width="12" color="primary" indeterminate />
    </div>

    <ScheduleXCalendar :class="evtsQuery.isLoading ? 'hidden' : ''" :calendar-app="calendarApp" />
  </div>
</template>

<script lang="ts" setup>
import { timetableEventsRequest } from "@/api/api_requests";
import { useTimetable } from "@/hooks/useTimetable";
import { useAppStore, useTimetableViewStore } from "@/store";
import type { IJsonEvent } from "@/types/APIType";
import { getLanguage } from "@/utils/locale";
import { errorNoDataFetchNotif, genericError, infoNotif } from "@/utils/notification";
import { wrapFetch } from "@/utils/wrapFetch";
import { createCalendar, createViewDay, createViewMonthGrid, createViewWeek } from "@schedule-x/calendar";
import { createCalendarControlsPlugin } from "@schedule-x/calendar-controls";
import { createCurrentTimePlugin } from "@schedule-x/current-time";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-default/dist/index.css";
import { ScheduleXCalendar } from "@schedule-x/vue";
import { useQuery } from "@tanstack/vue-query";
import { onMounted, ref, shallowRef, watch, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useTheme } from "vuetify";
import { getCalendarsList, getColorByLessonTitle } from "./helper";

const appStore = useAppStore();
const theme = useTheme();
const timetableData = useTimetable();
const timetableViewStore = useTimetableViewStore();
const router = useRouter();

const eventsServicePlugin = createEventsServicePlugin();
const calendarControls = createCalendarControlsPlugin();
const calendarApp = shallowRef(
    createCalendar({
        selectedDate: getEventDate(timetableViewStore.calDate).split(" ")[0],
        views: [createViewDay(), createViewWeek(), createViewMonthGrid()],
        plugins: [createEventModalPlugin(), createCurrentTimePlugin(), calendarControls, eventsServicePlugin],
        calendars: getCalendarsList(),
        events: [],
        defaultView: timetableViewStore.viewMode,
        locale: getLanguage(true),
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

watchEffect(() => calendarApp.value.setTheme(theme.global.name.value === "dark" ? "dark" : "light"));
watchEffect(() => calendarControls.setDate(getEventDate(timetableViewStore.calDate).split(" ")[0]));
watchEffect(() => calendarControls.setView(timetableViewStore.viewMode));
watchEffect(() => calendarControls.setView(timetableViewStore.viewMode));
watchEffect(() => eventsServicePlugin.set(timetableViewStore.events));

const evtsQuery = ref(
    useQuery<IJsonEvent[]>({
        queryKey: ["timetableEvents", appStore.numUniv, appStore.adeResources],
        queryFn: ({ signal }) => wrapFetch({ ...timetableEventsRequest(appStore.numUniv ?? 0, appStore.adeResources ?? 0, "json"), signal }),
        enabled: false,
    }),
);

onMounted(() => {
    if (appStore.numUniv && appStore.adeResources) {
        evtsQuery.value.refetch();
    } else {
        router.push({ name: "Home" });
    }
});

watch(
    () => evtsQuery.value.isLoading,
    () => {
        if (evtsQuery.value.error) {
            console.error("Failed to get Timetable Events, got", evtsQuery.value.error);
            genericError(evtsQuery.value.error.message);
        }
        if (!evtsQuery.value.isSuccess) return;
        if (!evtsQuery.value.data) return errorNoDataFetchNotif();

        timetableViewStore.events.length = 0;
        timetableViewStore.events.push(
            ...evtsQuery.value.data.map((event, index) => ({
                ...event,
                id: index,
                start: getEventDate(new Date(event.start)),
                end: getEventDate(new Date(event.end)),
                people: event.teacher.split(","),
                calendarId: getColorByLessonTitle(event.title),
            })),
        );

        if (timetableData.lastUpdate.value) {
            const date = new Date(timetableData.lastUpdate.value);
            const datePart = new Intl.DateTimeFormat("fr", { year: "numeric", month: "numeric", day: "numeric" }).format(date);
            const timePart = new Intl.DateTimeFormat("fr", { hour: "numeric", minute: "numeric", hourCycle: "h23" }).format(date).replace(":", "h");

            infoNotif({ message: `Dernière mise à jour de l'emploi du temps le ${datePart} à ${timePart}` });
        }
    },
    { immediate: true },
);

function getEventDate(date: Date) {
    return new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(date).replace(",", "");
}
</script>

<style>
.hidden {
 visibility: hidden;
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
    padding: 8px; 
}

.sx__week-grid__date-number {
    height: 1.25em;
    width: 1.25em;
}

.sx__current-time-indicator {
    z-index: 10;
}
</style>