import { HttpMethod } from "./requests";

export const BASE_API_URL = "http://localhost:4000";
export const API_URL_V2 = `${BASE_API_URL}/v2`;

export const univListRequest = () => {
    return {
        url: `${API_URL_V2}/univ`,
        options: { method: HttpMethod.GET },
    };
};

export const roomListRequest = () => {
    return {
        url: `${API_URL_V2}/rooms`,
        options: { method: HttpMethod.GET },
    };
};

export const timetableListRequest = (numUniv: number) => {
    return {
        url: numUniv === -1 ? `${API_URL_V2}/rooms` : `${API_URL_V2}/univ/${numUniv}`,
        options: { method: HttpMethod.GET },
    };
};

export const timetableDetailsRequest = (numTimetable: number, isRoom: boolean = false) => {
    return {
        url: `${API_URL_V2}${isRoom ? "/rooms" : ""}/${numTimetable}`,
        options: { method: HttpMethod.GET },
    };
};

export const timetableEventsRequest = (numTimetable: number, format: string, isRoom: boolean = false) => {
    return {
        url: `${API_URL_V2}${isRoom ? "/rooms" : ""}/${numTimetable}/${format}`,
        options: { method: HttpMethod.GET },
    };
};
