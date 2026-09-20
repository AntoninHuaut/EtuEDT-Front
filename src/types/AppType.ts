export enum ETheme {
	LIGHT = "light",
	DARK = "dark",
	SYSTEM = "system",
}

export type TViewMode = "day" | "week" | "month-grid";

export type ResourceType = "timetable" | "room" | "campus" | 'freerooms';

export interface IResourceSelection {
	numUniv: number;
	adeResources: number;
	resourceType: ResourceType;
	groupId?: number;
	campusId?: number;
}
