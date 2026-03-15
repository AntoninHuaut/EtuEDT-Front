import { buildResourceDetailsRequest } from "@/api/resourceRequestFactory";
import { useAppStore } from "@/store/";
import { computed, ref, watchEffect } from "vue";

import type { IRoom, ITimetable } from "@/types/APIType";
import { createTimetableContext } from "@/utils/timetableContext";
import { wrapFetch } from "@/utils/wrapFetch";
import { getTimetableName } from "@/utils/timetable";
import { useQuery } from "@tanstack/vue-query";

export const useTimetable = () => {
    const appStore = useAppStore();

    const timetable = ref<ITimetable | IRoom | undefined>();

    const ttQuery = useQuery<ITimetable | IRoom>({
        queryKey: [
            "fetchTimetable",
            appStore.numUniv,
            appStore.groupId,
            appStore.adeResources,
            appStore.resourceType,
        ],
        queryFn: ({ signal }) =>
            wrapFetch({
                ...buildResourceDetailsRequest({
                    numUniv: appStore.numUniv ?? 0,
                    groupId: appStore.groupId,
                    adeResources: appStore.adeResources ?? 0,
                    resourceType: appStore.resourceType,
                }),
                signal,
            }),
        enabled: false,
    });

    watchEffect(() => {
        appStore.isTimetableLoading = ttQuery.isLoading.value;

        const error = ttQuery.error.value;
        if (error) {
            console.error(error);

            timetable.value = undefined;
            appStore.adeUrl = undefined;
            appStore.isTimetableError = true;
            return;
        }

        appStore.isTimetableError = false;

        const data = ttQuery.data.value;
        if (data) {
            timetable.value = data;
            appStore.adeUrl = data.adeUrl;
        }
    });

    watchEffect(() => {
        const context = createTimetableContext({
            numUniv: appStore.numUniv,
            groupId: appStore.groupId,
            adeResources: appStore.adeResources,
            resourceType: appStore.resourceType,
        });

        if (context) {
            ttQuery.refetch();
        }
    });

    const nameTT = computed(() => getTimetableName(timetable.value, appStore.resourceType));
    const lastUpdate = computed(() => timetable.value?.lastUpdate ?? "");

    return { nameTT, lastUpdate };
};