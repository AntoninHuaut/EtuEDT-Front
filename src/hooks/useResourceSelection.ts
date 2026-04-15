import { useRouter } from "vue-router";
import { getResourceRouteLocation } from "@/router/resourceRoute";
import { ROUTE_NAME } from "@/router/routeNames";
import { useAppStore } from "@/store";
import type { ResourceType } from "@/types/AppType";

export const useResourceSelection = () => {
	const appStore = useAppStore();
	const router = useRouter();

	async function navigateToResource() {
		await router.push(
			getResourceRouteLocation(appStore.selectedResourceWithNames),
		);
	}

	function selectGroup(groupId: number, groupName: string) {
		appStore.selectGroup(groupId, groupName);
	}

	async function selectResource(
		resourceType: ResourceType,
		adeResources: number,
	) {
		appStore.setSelectedResource(resourceType, adeResources);
		await navigateToResource();
	}

	async function goToRooms() {
		appStore.setSelectedResource("room");
		await router.push({ name: ROUTE_NAME.HOME });
	}

	async function goToGroups() {
		appStore.selectGroup(undefined);
		await router.push({ name: ROUTE_NAME.HOME });
	}

	return {
		selectGroup,
		selectResource,
		goToGroups,
		goToRooms,
	};
};
