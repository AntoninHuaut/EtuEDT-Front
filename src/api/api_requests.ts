import { HttpMethod } from "./requests";

export const BASE_API_URL = "https://edtapi.antoninhuaut.fr";
export const API_URL_V2 = `${BASE_API_URL}/v2`;

export const univListRequest = () => {
    return {
        url: `${API_URL_V2}/univ`,
        options: { method: HttpMethod.GET },
    };
};

export const roomListRequest = () => {
    return {
        url: `${API_URL_V2}/room`,
        options: { method: HttpMethod.GET },
    };
};

export const timetableListRequest = (numUniv: number) => {
    return {
        url: numUniv === -1 ? `${API_URL_V2}/room` : `${API_URL_V2}/univ/${numUniv}`,
        options: { method: HttpMethod.GET },
    };
};

export const timetableDetailsRequest = (numTimetable: number, isRoom: boolean = false) => {
    return {
        url: `${API_URL_V2}${isRoom ? "/room" : ""}/${numTimetable}`,
        options: { method: HttpMethod.GET },
    };
};

export const timetableEventsRequest = (numTimetable: number, format: string, isRoom: boolean = false) => {
    return {
        url: `${API_URL_V2}${isRoom ? "/room" : ""}/${numTimetable}/${format}`,
        options: { method: HttpMethod.GET },
    };
};
