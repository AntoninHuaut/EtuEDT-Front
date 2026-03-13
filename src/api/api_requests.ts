import { HttpMethod } from "./requests";

export const BASE_API_URL = "http://localhost:4000";
export const API_URL_V2 = `${BASE_API_URL}/v2`;

export const univListRequest = () => {
    return {
        url: `${API_URL_V2}/univ`,
        options: { method: HttpMethod.GET },
    };
};

export const groupListRequest = (univId: number) => {
    return {
        url: `${API_URL_V2}/univ/${univId}/groups`,
        options: { method: HttpMethod.GET },
    };
};

export const timetableListRequest = (univId: number, groupId: number) => {
    return {
        url: `${API_URL_V2}/univ/${univId}/groups/${groupId}`,
        options: { method: HttpMethod.GET },
    };
};

export const roomListRequest = (univId: number) => {
    return {
        url: `${API_URL_V2}/univ/${univId}/rooms`,
        options: { method: HttpMethod.GET },
    };
};

export const timetableDetailsRequest = (univId: number, groupId: number, adeResources: number) => {
    return {
        url: `${API_URL_V2}/univ/${univId}/groups/${groupId}/${adeResources}`,
        options: { method: HttpMethod.GET },
    };
};

export const roomDetailsRequest = (univId: number, adeResources: number) => {
    return {
        url: `${API_URL_V2}/univ/${univId}/rooms/${adeResources}`,
        options: { method: HttpMethod.GET },
    };
};

export const timetableEventsRequest = (univId: number, groupId: number, adeResources: number) => {
    return {
        url: `${API_URL_V2}/univ/${univId}/groups/${groupId}/${adeResources}/events`,
        options: {
            method: HttpMethod.GET,
            headers: {
                Accept: "application/json",
            },
        },
    };
};

export const roomEventsRequest = (univId: number, adeResources: number) => {
    return {
        url: `${API_URL_V2}/univ/${univId}/rooms/${adeResources}/events`,
        options: {
            method: HttpMethod.GET,
            headers: {
                Accept: "application/json",
            },
        },
    };
};
