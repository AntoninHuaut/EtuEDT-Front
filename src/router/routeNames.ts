export const ROUTE_NAME = {
	HOME: "Home",
	SYNC: "Sync",
	TIMETABLE_GROUP: "TimetableGroup",
	TIMETABLE_ROOM: "TimetableRoom",
	ABOUT: "About",
	NOT_FOUND: "NotFound",
} as const;

export type RouteName = (typeof ROUTE_NAME)[keyof typeof ROUTE_NAME];
