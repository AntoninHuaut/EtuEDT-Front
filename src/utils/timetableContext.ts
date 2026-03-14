export type TResourceType = "timetable" | "room";

export interface ITimetableContext {
    numUniv: number;
    adeResources: number;
    resourceType: TResourceType;
    groupId?: number;
}

export function isResourceType(value: unknown): value is TResourceType {
    return value === "timetable" || value === "room";
}

function toNumber(value: unknown): number | undefined {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : undefined;
    }

    if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : undefined;
    }

    return undefined;
}

export function createTimetableContext(params: Record<string, unknown>): ITimetableContext | undefined {
    const numUniv = toNumber(params.numUniv);
    const adeResources = toNumber(params.adeResources);

    if (numUniv === undefined || adeResources === undefined || !isResourceType(params.resourceType)) {
        return undefined;
    }

    if (params.resourceType === "room") {
        return {
            numUniv,
            adeResources,
            resourceType: "room",
        };
    }

    const groupId = toNumber(params.groupId);
    if (groupId === undefined) {
        return undefined;
    }

    return {
        numUniv,
        groupId,
        adeResources,
        resourceType: "timetable",
    };
}

export function buildTimetableRouteParams(context: ITimetableContext) {
    if (context.resourceType === "room") {
        return {
            numUniv: context.numUniv,
            resourceType: "room" as const,
            adeResources: context.adeResources,
        };
    }

    return {
        numUniv: context.numUniv,
        groupId: context.groupId,
        resourceType: "timetable" as const,
        adeResources: context.adeResources,
    };
}

export function isGroupMissingForTimetable(params: {
    resourceType: unknown;
    groupId?: unknown;
}) {
    return params.resourceType === "timetable" && toNumber(params.groupId) === undefined;
}