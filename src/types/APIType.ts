export interface ITimetable {
    numUniv: number;
    nameUniv: string;
    descTT: string;
    numYearTT: number;
    adeResources: number;
    adeProjectId: number;
    lastUpdate: string;
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
    numUniv: number;
    nameUniv: string;
    adeUniv: string;
}
