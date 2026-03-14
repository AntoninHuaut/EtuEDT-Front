import { roomDetailsRequest, timetableDetailsRequest } from "@/api/api_requests";
import { useAppStore } from "@/store/";
import { computed, ref, watch, watchEffect } from "vue";

import type { IRoom, ITimetable } from "@/types/APIType";
import { wrapFetch } from "@/utils/wrapFetch";
import { useQuery } from "@tanstack/vue-query";

export const useTimetable = () => {
    const appStore = useAppStore();

    const timetable = ref<ITimetable | IRoom | undefined>();

    const ttQuery = ref(
        useQuery<ITimetable | IRoom>({
            queryKey: ["fetchTimetable", appStore.numUniv, appStore.groupId, appStore.adeResources, appStore.resourceType],
            queryFn: ({ signal }) =>
                wrapFetch({
                    ...(appStore.resourceType === "room"
                        ? roomDetailsRequest(appStore.numUniv ?? 0, appStore.adeResources ?? 0)
                        : timetableDetailsRequest(appStore.numUniv ?? 0, appStore.groupId ?? 0, appStore.adeResources ?? 0)),
                    signal,
                }),
            enabled: false,
        }),
    );

    watch(
        () => ttQuery.value.isLoading,
        () => {
            if (ttQuery.value.error) {
                console.error(ttQuery.value.error);

                timetable.value = undefined;
                appStore.adeUrl = undefined;
            }
            if (ttQuery.value.data) {
                timetable.value = ttQuery.value.data;
                appStore.adeUrl = ttQuery.value.data.adeUrl;
            }
        },
        { immediate: true },
    );

    watchEffect(() => {
        if (appStore.numUniv !== undefined && appStore.adeResources && (appStore.resourceType === "room" || appStore.groupId !== undefined)) {
            ttQuery.value.refetch();
        }
    });

    const nameTT = computed(() => {
        if (!timetable.value) {
            return "?";
        }

        if (appStore.resourceType === "room") {
            return timetable.value.label ?? "?";
        }

        const currentTimetable = timetable.value as ITimetable;
        if (currentTimetable.year < 0) {
            return currentTimetable.label ?? "?";
        }

        return `${currentTimetable.year}A ${currentTimetable.label}`;
    });
    const lastUpdate = computed(() => timetable.value?.lastUpdate ?? "");

    return { nameTT, lastUpdate };
};