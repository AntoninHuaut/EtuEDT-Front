import { HttpMethod } from "./requests";

export const BASE_API_URL = "https://edtapi.antoninhuaut.fr";
export const API_URL_V2 = `${BASE_API_URL}/v2`;

export const univListRequest = () => {
    return {
        url: API_URL_V2,
        options: { method: HttpMethod.GET },
    };
};

export const timetableListRequest = (numUniv: number) => {
    return {
        url: `${API_URL_V2}/${numUniv}`,
        options: { method: HttpMethod.GET },
    };
};

export const timetableDetailsRequest = (numUniv: number, numTimetable: number) => {
    return {
        url: `${API_URL_V2}/${numUniv}/${numTimetable}`,
        options: { method: HttpMethod.GET },
    };
};

export const timetableEventsRequest = (numUniv: number, numTimetable: number, format: string) => {
    return {
        url: `${API_URL_V2}/${numUniv}/${numTimetable}/${format}`,
        options: { method: HttpMethod.GET },
    };
};
