import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed } from "vue";
import type { IResourceSelection, ResourceType } from "@/types/AppType";

export const useAppStore = defineStore("app", () => {
	const numUniv = useLocalStorage<number | undefined>("numUniv", undefined);
	const univName = useLocalStorage<string | undefined>("univName", undefined);
	const groupId = useLocalStorage<number | undefined>("groupId", undefined);
	const groupName = useLocalStorage<string | undefined>("groupName", undefined);
	const selectedResourceId = useLocalStorage<number | undefined>(
		"adeResources",
		undefined,
	);
	const resourceType = useLocalStorage<ResourceType>(
		"resourceType",
		"timetable",
	);

	const selectedResource = computed<IResourceSelection | undefined>(() => {
		if (numUniv.value === undefined || selectedResourceId.value === undefined) {
			return undefined;
		}

		if (resourceType.value === "room") {
			return {
				numUniv: numUniv.value,
				adeResources: selectedResourceId.value,
				resourceType: "room",
			};
		}

		if (groupId.value === undefined) {
			return undefined;
		}

		return {
			numUniv: numUniv.value,
			groupId: groupId.value,
			adeResources: selectedResourceId.value,
			resourceType: "timetable",
		};
	});

	function clearUniversitySelection() {
		numUniv.value = undefined;
		univName.value = undefined;
		groupId.value = undefined;
		groupName.value = undefined;
		selectedResourceId.value = undefined;
		resourceType.value = "timetable";
	}

	function selectUniversity(universityId: number, universityName?: string) {
		numUniv.value = universityId;
		univName.value = universityName;
		groupId.value = undefined;
		groupName.value = undefined;
		selectedResourceId.value = undefined;
		resourceType.value = "timetable";
	}

	function selectGroup(
		nextGroupId: number | undefined,
		nextGroupName?: string,
	) {
		groupId.value = nextGroupId;
		groupName.value = nextGroupName;
		selectedResourceId.value = undefined;
		resourceType.value = "timetable";
	}

	function setSelectedResource(
		nextResourceType: ResourceType,
		nextSelectedResourceId?: number,
	) {
		resourceType.value = nextResourceType;
		selectedResourceId.value = nextSelectedResourceId;
	}

	return {
		numUniv,
		univName,
		groupId,
		groupName,
		selectedResourceId,
		resourceType,
		selectedResource,
		clearUniversitySelection,
		selectUniversity,
		selectGroup,
		setSelectedResource,
	};
});
