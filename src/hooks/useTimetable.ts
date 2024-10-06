import { timetableDetailsRequest } from "@/api/api_requests";
import { useAppStore } from "@/store/";
import { ref, watch, watchEffect } from "vue";

import type { ITimetable } from "@/types/APIType";
import { wrapFetch } from "@/utils/wrapFetch";
import { useQuery } from "@tanstack/vue-query";

export const useTimetable = () => {
    const appStore = useAppStore();

    const nameTT = ref<string>("?");
    const lastUpdate = ref<string>("");

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

                nameTT.value = "?";
                lastUpdate.value = "";
            }
            if (ttQuery.value.data) {
                nameTT.value = ttQuery.value.data.nameTT;
                lastUpdate.value = ttQuery.value.data.lastUpdate;
            }
        },
        { immediate: true },
    );

    watchEffect(() => {
        if (appStore.numUniv && appStore.adeResources) {
            ttQuery.value.refetch();
        }
    });

    return { nameTT, lastUpdate };
};
