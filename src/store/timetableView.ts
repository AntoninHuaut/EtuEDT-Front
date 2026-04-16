import type { CalendarEvent } from "@schedule-x/calendar";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useDisplay } from "vuetify";
import { useDateHelper } from "@/hooks/useDateHelper";
import type { TViewMode } from "@/types/AppType";

export const useTimetableViewStore = defineStore("timetableView", () => {
	const { mobile } = useDisplay();
	const dateHelper = useDateHelper();

	const calDate = ref(dateHelper.getCurrentWeekday());
	const events = ref<CalendarEvent[]>([]);
	const viewMode = ref<TViewMode>(mobile.value ? "day" : "week");
	const weekdays = ref([1, 2, 3, 4, 5]);

	function setCalDate(date: Temporal.PlainDate) {
		calDate.value = date;
	}

	function setViewMode(mode: TViewMode) {
		viewMode.value = mode;
	}

	function replaceEvents(nextEvents: CalendarEvent[]) {
		events.value = nextEvents;
	}

	return {
		calDate,
		events,
		viewMode,
		weekdays,
		setCalDate,
		setViewMode,
		replaceEvents,
	};
});
