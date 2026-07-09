import type { IResourceSelection, ResourceType } from "@/types/AppType";

interface StoreResourceContext {
	numUniv: number | undefined;
	groupId: number | undefined;
	selectedResourceId: number | undefined;
	resourceType: ResourceType;
}

export function getStoreFallbackSelection(
	store: StoreResourceContext,
	resourceType: ResourceType,
): IResourceSelection | undefined {
	if (
		store.numUniv === undefined ||
		store.selectedResourceId === undefined ||
		store.resourceType !== resourceType
	) {
		return undefined;
	}

	if (resourceType === "room") {
		return {
			numUniv: store.numUniv,
			adeResources: store.selectedResourceId,
			resourceType: "room",
		};
	}

	if (store.groupId === undefined) {
		return undefined;
	}

	return {
		numUniv: store.numUniv,
		groupId: store.groupId,
		adeResources: store.selectedResourceId,
		resourceType: "timetable",
	};
}
