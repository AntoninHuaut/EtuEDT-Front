import { useRouter } from "vue-router";
import { useAppStore } from "@/store";
import type { ResourceType } from "@/types/AppType";

export const useResourceSelection = () => {
	const appStore = useAppStore();
	const router = useRouter();

	async function navigateToResource() {
		if (!appStore.canLoadSelectedResource) {
			await router.push({ name: "Home" });
			return;
		}

		await router.push({
			name: "Timetable",
		});
	}

	function selectGroup(groupId: number, groupName: string) {
		appStore.selectGroup(groupId, groupName);
	}

	async function selectResource(
		resourceType: ResourceType,
		adeResources: number,
	) {
		appStore.setResourceSelection(resourceType, adeResources);
		await navigateToResource();
	}

	async function goToRooms() {
		appStore.setResourceSelection("room");
		await router.push({ name: "Home" });
	}

	async function goToGroups() {
		appStore.selectGroup(undefined);
		await router.push({ name: "Home" });
	}

	return {
		selectGroup,
		selectResource,
		goToGroups,
		goToRooms,
	};
};
