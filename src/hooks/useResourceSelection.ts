import { useRouter } from "vue-router";
import { getResourceRouteLocation } from "@/router/resourceRoute";
import { ROUTE_NAME } from "@/router/routeNames";
import { useAppStore } from "@/store";
import type { IResourceSelection, ResourceType } from "@/types/AppType";

export const useResourceSelection = () => {
	const appStore = useAppStore();
	const router = useRouter();

	function getSelectedResource(): IResourceSelection | undefined {
		if (
			appStore.numUniv === undefined ||
			appStore.selectedResourceId === undefined
		) {
			return undefined;
		}

		if (appStore.resourceType === "room") {
			return {
				numUniv: appStore.numUniv,
				adeResources: appStore.selectedResourceId,
				resourceType: "room",
			};
		}

		if (appStore.groupId === undefined) {
			return undefined;
		}

		return {
			numUniv: appStore.numUniv,
			groupId: appStore.groupId,
			adeResources: appStore.selectedResourceId,
			resourceType: "timetable",
		};
	}

	async function navigateToResource() {
		await router.push(getResourceRouteLocation(getSelectedResource()));
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
