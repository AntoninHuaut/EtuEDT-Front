import { timetableDetailsRequest } from "@/api/api_requests";
import { useAppStore } from "@/store/";
import { computed, ref, watch, watchEffect } from "vue";

import type { ITimetable } from "@/types/APIType";
import { wrapFetch } from "@/utils/wrapFetch";
import { useQuery } from "@tanstack/vue-query";

export const useTimetable = () => {
    const appStore = useAppStore();

    const timetable = ref<ITimetable | undefined>();

    const ttQuery = ref(
        useQuery<ITimetable>({
            queryKey: ["fetchTimetable", appStore.numUniv, appStore.adeResources],
            queryFn: ({ signal }) =>
                wrapFetch({
                    ...timetableDetailsRequest(appStore.numUniv ?? 0, appStore.adeResources ?? 0),
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
            }
            if (ttQuery.value.data) {
                timetable.value = ttQuery.value.data;
            }
        },
        { immediate: true },
    );

    watchEffect(() => {
        if (appStore.numUniv && appStore.adeResources) {
            ttQuery.value.refetch();
        }
    });

    const nameTT = computed(() => {
        if (!timetable.value) {
            return "?";
        }

        if (timetable.value.numYearTT < 0) {
            return timetable.value.descTT ?? "?";
        }

        return `${timetable.value?.numYearTT}A ${timetable.value?.descTT}`;
    });
    const lastUpdate = computed(() => timetable.value?.lastUpdate ?? "");

    return { nameTT, lastUpdate };
};