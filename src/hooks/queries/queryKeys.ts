import type { IResourceSelection } from "@/types/AppType";

export type SelectedResourceIdentity =
	| readonly ["none"]
	| readonly ["room", number, number]
	| readonly ["timetable", number, number, number];

export function getSelectedResourceIdentity(
	selection: IResourceSelection | undefined,
): SelectedResourceIdentity {
	if (!selection) {
		return ["none"];
	}

	if (selection.resourceType === "room") {
		return ["room", selection.numUniv, selection.adeResources];
	}

	return [
		"timetable",
		selection.numUniv,
		selection.groupId,
		selection.adeResources,
	];
}

export function getSelectedResourceFromIdentity(
	identity: SelectedResourceIdentity,
): IResourceSelection | undefined {
	if (identity[0] === "none") {
		return undefined;
	}

	if (identity[0] === "room") {
		return {
			resourceType: "room",
			numUniv: identity[1],
			adeResources: identity[2],
		};
	}

	return {
		resourceType: "timetable",
		numUniv: identity[1],
		groupId: identity[2],
		adeResources: identity[3],
	};
}

export const queryKeys = {
	univList: () => ["univList"] as const,
	groupList: (universityId: number | undefined) =>
		["groupList", universityId] as const,
	roomList: (universityId: number | undefined) =>
		["roomList", universityId] as const,
	timetableList: (
		universityId: number | undefined,
		groupId: number | undefined,
	) => ["timetableList", universityId, groupId] as const,
	timetable: (identity: SelectedResourceIdentity) =>
		["timetable", ...identity] as const,
	timetableEvents: (identity: SelectedResourceIdentity) =>
		["timetableEvents", ...identity] as const,
};
