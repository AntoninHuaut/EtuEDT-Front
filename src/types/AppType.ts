export enum ETheme {
	LIGHT = "light",
	DARK = "dark",
	SYSTEM = "system",
}

export type TViewMode = "day" | "week" | "month-grid";

export type ResourceType = "timetable" | "room";

export interface IRoomSelection {
	numUniv: number;
	adeResources: number;
	resourceType: "room";
}

export interface ITimetableSelection {
	numUniv: number;
	groupId: number;
	adeResources: number;
	resourceType: "timetable";
}

export type IResourceSelection = IRoomSelection | ITimetableSelection;

export interface IRoomSelectionWithNames extends IRoomSelection {
	universityName: string;
}

export interface ITimetableSelectionWithNames extends ITimetableSelection {
	universityName: string;
	groupName: string;
}

export type IResourceSelectionWithNames =
	| IRoomSelectionWithNames
	| ITimetableSelectionWithNames;
