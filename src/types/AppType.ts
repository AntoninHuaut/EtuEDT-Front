export enum ETheme {
	LIGHT = "light",
	DARK = "dark",
	SYSTEM = "system",
}

export type TViewMode = "day" | "week" | "month-grid";

export type ResourceType = "timetable" | "room" | "campus" | 'freerooms';

export interface IRoomSelection {
	numUniv: number;
	adeResources: number;
	resourceType: "room";
}

export interface ITimetableSelection {
	numUniv: number;
	adeResources: number;
	groupId: number;
	resourceType: "timetable";
}

export interface ICampusSelection {
    numUniv: number;
    adeResources: number;
    resourceType: "campus";
    campusId: number;
}

export type IResourceSelection = IRoomSelection | ITimetableSelection;
