export interface ITimetable {
	adeResources: number;
	adeProjectId: number;
	year: number;
	label: string;
	adeUrl?: string;
	lastUpdate: string;
}

export interface IRoom {
	adeResources: number;
	adeProjectId: number;
	label: string;
	adeUrl?: string;
	lastUpdate: string;
}

export interface IGroup {
	id: number;
	name: string;
}

export interface IJsonEvent {
	title: string;
	teacher: string;
	description: string;
	location: string;
	start: string;
	end: string;
}

export interface IUniv {
	id: number;
	name: string;
}
