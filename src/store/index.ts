import { useDateHelper } from "@/hooks/useDateHelper";
import { ETheme, type TViewMode } from "@/types/AppType";
import type { CalendarEvent } from "@schedule-x/calendar";
import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useDisplay } from "vuetify";

export const useAppStore = defineStore("app", () => {
    const adeResources = useLocalStorage<number | undefined>("adeResources", undefined);
    const numUniv = useLocalStorage<number | undefined>("numUniv", undefined);
    return { adeResources, numUniv };
});

export const useThemeStore = defineStore("theme", () => {
    const theme = useLocalStorage<string | undefined>("theme", ETheme.SYSTEM);
    return { theme };
});

export const useTimetableViewStore = defineStore("timetableView", () => {
    const { mobile } = useDisplay();
    const dateHelper = useDateHelper();

    const calDate = ref(dateHelper.skipWeekend(new Date(), "next")); // If weekend, go to monday
    const events = ref<CalendarEvent[]>([]);
    const viewMode = ref<TViewMode>(mobile.value ? "day" : "week");
    const weekdays = ref([1, 2, 3, 4, 5]);
    return { calDate, events, viewMode, weekdays };
});
