import { isNavigationFailure, useRouter } from "vue-router";
import { useAppStore } from "@/store";
import {
	buildTimetableRouteParams,
	createTimetableContext,
} from "@/utils/timetableContext";

type ResourceType = "timetable" | "room";

export const useResourceSelection = () => {
	const appStore = useAppStore();
	const router = useRouter();

	async function navigateToResource(
		resourceType: ResourceType,
		adeResources: number,
	) {
		const context = createTimetableContext({
			numUniv: appStore.numUniv,
			groupId: appStore.groupId,
			adeResources,
			resourceType,
		});

		if (!context) {
			await router.push({ name: "Home" });
			return false;
		}

		const navigationResult = await router.push({
			name: "Timetable",
			params: buildTimetableRouteParams(context),
		});

		return !isNavigationFailure(navigationResult);
	}

	async function selectTimetable(adeResources: number) {
		appStore.$patch({ adeResources, resourceType: "timetable" });
		const didNavigate = await navigateToResource("timetable", adeResources);
		return didNavigate;
	}

	async function selectRoom(adeResources: number) {
		appStore.$patch({ adeResources, resourceType: "room" });
		const didNavigate = await navigateToResource("room", adeResources);
		return didNavigate;
	}

	function selectGroup(groupId: number) {
		appStore.$patch({
			groupId,
			adeResources: undefined,
			resourceType: "timetable",
		});
	}

	async function goToRooms() {
		appStore.$patch({ adeResources: undefined, resourceType: "room" });
		await router.push({ name: "Rooms" });
	}

	async function goToGroups() {
		appStore.$patch({
			groupId: undefined,
			adeResources: undefined,
			resourceType: "timetable",
		});
		await router.push({ name: "Home" });
	}

	async function goToTimetables() {
		appStore.$patch({ adeResources: undefined, resourceType: "timetable" });
		await router.push({ name: "Home" });
	}

	return {
		selectGroup,
		selectRoom,
		selectTimetable,
		goToGroups,
		goToRooms,
		goToTimetables,
	};
};
