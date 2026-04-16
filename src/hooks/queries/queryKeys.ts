import type { ResourceType } from "@/types/AppType";

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
	timetable: (
		universityId: number | undefined,
		groupId: number | undefined,
		resourceId: number | undefined,
		resourceType: ResourceType,
	) => ["timetable", universityId, groupId, resourceId, resourceType] as const,
	timetableEvents: (
		universityId: number | undefined,
		groupId: number | undefined,
		resourceId: number | undefined,
		resourceType: ResourceType,
	) =>
		[
			"timetableEvents",
			universityId,
			groupId,
			resourceId,
			resourceType,
		] as const,
};
