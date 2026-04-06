import type { CalendarEvent } from "@schedule-x/calendar";
import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useDisplay } from "vuetify";
import { useDateHelper } from "@/hooks/useDateHelper";
import {
	ETheme,
	type IResourceSelection,
	type ResourceType,
	type TViewMode,
} from "@/types/AppType";

export const useAppStore = defineStore("app", () => {
	const adeResources = useLocalStorage<number | undefined>(
		"adeResources",
		undefined,
	);
	const adeUrl = useLocalStorage<string | undefined>("adeUrl", undefined);
	const isTimetableLoading = ref(false);
	const isTimetableError = ref(false);
	const numUniv = useLocalStorage<number | undefined>("numUniv", undefined);
	const univName = useLocalStorage<string | undefined>("univName", undefined);
	const groupId = useLocalStorage<number | undefined>("groupId", undefined);
	const groupName = useLocalStorage<string | undefined>("groupName", undefined);
	const resourceType = useLocalStorage<ResourceType>(
		"resourceType",
		"timetable",
	);

	const hasSelectedResource = computed(
		() => numUniv.value !== undefined && adeResources.value !== undefined,
	);

	const canLoadSelectedResource = computed(
		() =>
			hasSelectedResource.value &&
			(resourceType.value === "room" || groupId.value !== undefined),
	);

	const isGroupMissingForTimetable = computed(
		() => resourceType.value === "timetable" && groupId.value === undefined,
	);

	function getSelectedResourceContext(): IResourceSelection | undefined {
		if (!canLoadSelectedResource.value) {
			return undefined;
		}

		if (numUniv.value === undefined || adeResources.value === undefined) {
			return undefined;
		}

		if (resourceType.value === "room") {
			return {
				numUniv: numUniv.value,
				adeResources: adeResources.value,
				resourceType: "room",
			};
		}

		if (groupId.value === undefined) {
			return undefined;
		}

		return {
			numUniv: numUniv.value,
			groupId: groupId.value,
			adeResources: adeResources.value,
			resourceType: "timetable",
		};
	}

	function resetTimetableResource() {
		adeResources.value = undefined;
		adeUrl.value = undefined;
		isTimetableLoading.value = false;
		isTimetableError.value = false;
	}

	function clearUniversitySelection() {
		resetTimetableResource();
		numUniv.value = undefined;
		univName.value = undefined;
		groupId.value = undefined;
		groupName.value = undefined;
		resourceType.value = "timetable";
	}

	function selectUniversity(universityId: number, universityName: string) {
		resetTimetableResource();
		numUniv.value = universityId;
		univName.value = universityName;
		groupId.value = undefined;
		groupName.value = undefined;
		resourceType.value = "timetable";
	}

	function selectGroup(
		nextGroupId: number | undefined,
		nextGroupName?: string,
	) {
		resetTimetableResource();
		groupId.value = nextGroupId;
		groupName.value = nextGroupName;
		resourceType.value = "timetable";
	}

	function setResourceSelection(
		nextResourceType: ResourceType,
		nextAdeResources?: number,
	) {
		resetTimetableResource();
		resourceType.value = nextResourceType;
		adeResources.value = nextAdeResources;
	}

	function setTimetableStatus(params: {
		adeUrl?: string;
		isLoading: boolean;
		isError: boolean;
	}) {
		adeUrl.value = params.adeUrl;
		isTimetableLoading.value = params.isLoading;
		isTimetableError.value = params.isError;
	}

	return {
		adeResources,
		adeUrl,
		isTimetableLoading,
		isTimetableError,
		numUniv,
		univName,
		groupId,
		groupName,
		resourceType,
		hasSelectedResource,
		canLoadSelectedResource,
		isGroupMissingForTimetable,
		getSelectedResourceContext,
		clearUniversitySelection,
		selectUniversity,
		selectGroup,
		setResourceSelection,
		setTimetableStatus,
	};
});

export const useThemeStore = defineStore("theme", () => {
	const theme = useLocalStorage<string | undefined>("theme", ETheme.SYSTEM);

	function setTheme(value: ETheme | undefined) {
		theme.value = value;
	}

	return { theme, setTheme };
});

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
