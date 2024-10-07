<template>
	<div class="d-flex justify-center">
		<BackSelectUniv :size="mobile ? 24 : 32" />
		<p :class="`text-h${mobile ? '5' : '4'}` + ' mt-3'">Choix de l'emploi du temps</p>
	</div>

	<v-divider class="mt-3 mb-3"></v-divider>

	<div class="d-flex flex-column">
		<div v-if="ttQuery.isLoading" class="mt-5">
			<v-progress-circular color="primary" indeterminate :size="128" :width="12" />
		</div>

		<div v-else>
			<h4 v-if="mobile" class="mb-1">{{ nameUniv }}</h4>
			<h2 v-else class="mb-1">{{ nameUniv }}</h2>

			<v-row justify="center">
				<v-col cols="4" class="px-1" v-for="(year) in yearList" :key="year">
					<p class="text-h6 mt-3 mb-1">Année {{ year }}A</p>

					<v-col class="pt-2 pb-1 px-0" v-for="(timetable, i) in ttsByYear[Number.parseInt(year)]" :key="timetable.adeResources">
						<TimetableButton :timetable="timetable" :colorHex="colorList[i % colorList.length]" />
					</v-col>
				</v-col>
			</v-row>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { timetableListRequest } from "@/api/api_requests";
import { useAppStore } from "@/store/";
import type { ITimetable } from "@/types/APIType";
import { errorNoDataFetchNotif, genericError } from "@/utils/notification";
import { wrapFetch } from "@/utils/wrapFetch";
import { useQuery } from "@tanstack/vue-query";
import { onMounted, ref, watch, watchEffect } from "vue";
import { useDisplay, useTheme } from "vuetify";
import { selectColorsList } from "../Timetable/helper";
import BackSelectUniv from "./BackSelectUniv.vue";
import TimetableButton from "./TimetableButton.vue";

const { mobile } = useDisplay();
const appStore = useAppStore();

const nameUniv = ref<string>();
const timetableList = ref<ITimetable[]>([]);
const ttsByYear = ref<Record<number, ITimetable[]>>({});
const yearList = ref<string[]>([]);
const colorList = ref(selectColorsList);

const theme = useTheme();

watchEffect(() => {
    if (theme.global.name.value === "dark") {
        colorList.value = selectColorsList.map((color) => `${color}AA`);
    } else {
        colorList.value = selectColorsList;
    }
});

const ttQuery = ref(
    useQuery<ITimetable[]>({
        queryKey: ["timetableList", appStore.numUniv],
        queryFn: ({ signal }) =>
            wrapFetch({
                ...timetableListRequest(appStore.numUniv ?? 0),
                signal,
            }),
        enabled: false,
    }),
);

onMounted(() => ttQuery.value.refetch());

watch(
    () => ttQuery.value.isLoading,
    () => {
        if (ttQuery.value.error) {
            console.error("Failed to get Timetable List, got", ttQuery.value.error);
            genericError(ttQuery.value.error.message);
            if (ttQuery.value.error.message === "Not Found") {
                appStore.$patch({ numUniv: undefined, adeResources: undefined });
            }
            return;
        }
        if (!ttQuery.value.isSuccess) return;
        if (!ttQuery.value.data) return errorNoDataFetchNotif();

        if (ttQuery.value.data.length > 0) {
            nameUniv.value = ttQuery.value.data[0].nameUniv;
        }

        timetableList.value.length = 0;
        timetableList.value.push(...ttQuery.value.data);

        ttsByYear.value = timetableList.value.reduce(
            (r, a) => {
                r[a.numYearTT] = r[a.numYearTT] || [];
                r[a.numYearTT].push(a);
                return r;
            },
            {} as Record<number, ITimetable[]>,
        );

        yearList.value.length = 0;
        yearList.value.push(...Object.keys(ttsByYear.value));
    },
    { immediate: true },
);
</script>
