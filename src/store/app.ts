import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed } from "vue";
import type {
	IResourceSelection,
	IResourceSelectionWithNames,
	ResourceType,
} from "@/types/AppType";

export const useAppStore = defineStore("app", () => {
	const adeResources = useLocalStorage<number | undefined>(
		"adeResources",
		undefined,
	);
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

	const selectedResource = computed<IResourceSelection | undefined>(() => {
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
	});

	const selectedResourceWithNames = computed<
		IResourceSelectionWithNames | undefined
	>(() => {
		const resourceSelection = selectedResource.value;
		if (!resourceSelection) {
			return undefined;
		}

		if (resourceSelection.resourceType === "room") {
			return {
				...resourceSelection,
				universityName: univName.value ?? "",
			};
		}

		return {
			...resourceSelection,
			universityName: univName.value ?? "",
			groupName: groupName.value ?? "",
		};
	});

	const canLoadSelectedResource = computed(
		() => selectedResource.value !== undefined,
	);

	const isGroupMissingForTimetable = computed(
		() =>
			resourceType.value === "timetable" &&
			hasSelectedResource.value &&
			groupId.value === undefined,
	);

	function resetTimetableResource() {
		adeResources.value = undefined;
	}

	function clearUniversitySelection() {
		resetTimetableResource();
		numUniv.value = undefined;
		univName.value = undefined;
		groupId.value = undefined;
		groupName.value = undefined;
		resourceType.value = "timetable";
	}

	function selectUniversity(universityId: number, universityName?: string) {
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

	function setSelectedResource(
		nextResourceType: ResourceType,
		nextAdeResources?: number,
	) {
		resetTimetableResource();
		resourceType.value = nextResourceType;
		adeResources.value = nextAdeResources;
	}

	function applyRouteSelection(
		routeSelection: IResourceSelectionWithNames,
	): void {
		resetTimetableResource();
		numUniv.value = routeSelection.numUniv;
		univName.value = routeSelection.universityName;
		resourceType.value = routeSelection.resourceType;
		adeResources.value = routeSelection.adeResources;

		if (routeSelection.resourceType === "room") {
			groupId.value = undefined;
			groupName.value = undefined;
		} else {
			groupId.value = routeSelection.groupId;
			groupName.value = routeSelection.groupName;
		}
	}

	return {
		adeResources,
		numUniv,
		univName,
		groupId,
		groupName,
		resourceType,
		hasSelectedResource,
		selectedResource,
		selectedResourceWithNames,
		canLoadSelectedResource,
		isGroupMissingForTimetable,
		clearUniversitySelection,
		selectUniversity,
		selectGroup,
		setSelectedResource,
		applyRouteSelection,
	};
});
