import { HttpMethod } from "./requests";

export const BASE_API_URL = import.meta.env.VITE_API_BASE_URL ?? "https://edtapi.antoninhuaut.fr";
export const API_URL_V3 = `${BASE_API_URL}/v3`;

export const univListRequest = () => {
    return {
        url: `${API_URL_V3}/univs`,
        options: { method: HttpMethod.GET },
    };
};

export const groupListRequest = (univId: number) => {
    return {
        url: `${API_URL_V3}/univs/${univId}/groups`,
        options: { method: HttpMethod.GET },
    };
};

export const timetableListRequest = (univId: number, groupId: number) => {
    return {
        url: `${API_URL_V3}/univs/${univId}/groups/${groupId}`,
        options: { method: HttpMethod.GET },
    };
};

export const roomListRequest = (univId: number) => {
    return {
        url: `${API_URL_V3}/univs/${univId}/rooms`,
        options: { method: HttpMethod.GET },
    };
};

export const timetableDetailsRequest = (univId: number, groupId: number, adeResources: number) => {
    return {
        url: `${API_URL_V3}/univs/${univId}/groups/${groupId}/${adeResources}`,
        options: { method: HttpMethod.GET },
    };
};

export const roomDetailsRequest = (univId: number, adeResources: number) => {
    return {
        url: `${API_URL_V3}/univs/${univId}/rooms/${adeResources}`,
        options: { method: HttpMethod.GET },
    };
};

export const timetableEventsRequest = (univId: number, groupId: number, adeResources: number) => {
    return {
        url: `${API_URL_V3}/univs/${univId}/groups/${groupId}/${adeResources}/events`,
        options: { method: HttpMethod.GET },
    };
};

export const roomEventsRequest = (univId: number, adeResources: number) => {
    return {
        url: `${API_URL_V3}/univs/${univId}/rooms/${adeResources}/events`,
        options: { method: HttpMethod.GET },
    };
};
