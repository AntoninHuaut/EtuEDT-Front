<template>
    <div class="d-flex justify-center align-center">
        <BackSelectUniv :size="mobile ? 24 : 32" />
        <p :class="`text-h${mobile ? '5' : '4'}` + ' mt-3'">Choix de l'emploi du temps</p>
        <v-spacer v-if="!mobile"></v-spacer>
        <v-btn class="mt-3 ml-3" prepend-icon="mdi-door-open" variant="tonal" color="primary" @click="goToRooms">
            Salles
        </v-btn>
    </div>

    <v-divider class="mt-3 mb-3"></v-divider>

    <div class="d-flex align-center mb-3 mx-2">
        <v-text-field v-model="searchQuery" label="Rechercher un emploi du temps..."
            prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" class="flex-grow-1" clearable
            hide-details></v-text-field>
        <v-progress-circular v-if="isDebouncing" class="ml-3" :size="20" :width="2" color="primary" indeterminate />
    </div>

    <div class="d-flex flex-column">
        <div v-if="isFetchingTimetables" class="mt-5">
            <v-progress-circular color="primary" indeterminate :size="128" :width="12" />
        </div>

        <div v-else>
            <h4 v-if="mobile" class="mb-1">{{ nameUniv }}</h4>
            <h2 v-else class="mb-1">{{ nameUniv }}</h2>

            <v-row justify="center">
                <v-col cols="12" sm="6" md="4" lg="3" class="px-5" v-for="year in yearList" :key="year">
                    <div v-if="getFilteredTtsByYear(Number.parseInt(year)).length > 0">

                        <p class="text-h6 mt-3 mb-1">{{ getYearTitle(Number.parseInt(year)) }}</p>
                        <v-col v-if="Number.parseInt(year) < 0" class="px-0">
                            <v-select v-model="selectedExtra" @update:model-value="onSelectExtra" :items="getFilteredTtsByYear(Number.parseInt(year))"
                                item-title="label" item-value="adeResources"
                                :label="`${getFilteredTtsByYear(Number.parseInt(year)).length} entrée(s)`" variant="outlined"
                                density="compact"></v-select>
                        </v-col>

                        <v-row v-else class="pt-2 pb-1 align-stretch timetable-grid-row" dense>
                            <v-col :cols="mobile ? 6 : 12" class="px-1 d-flex timetable-grid-col" v-for="(timetable, i) in getFilteredTtsByYear(Number.parseInt(year))"
                                :key="timetable.adeResources">
                                <TimetableButton :timetable="timetable" :colorHex="colorList[i % colorList.length]" />
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
                <v-col v-if="filteredTimetables.length === 0" class="text-center mt-5">
                    <p class="text-grey">Aucun emploi du temps trouvé</p>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { timetableListRequest } from "@/api/api_requests";
import { useQueryNotifications } from "@/hooks/useQueryNotifications";
import { useResourceSelection } from "@/hooks/useResourceSelection";
import { useAppStore } from "@/store/";
import type { ITimetable } from "@/types/APIType";
import { wrapFetch } from "@/utils/wrapFetch";
import { useQuery } from "@tanstack/vue-query";
import { computed, ref, watch, watchEffect } from "vue";
import { useDebounce } from "@/hooks/useDebounce";
import { useDisplay, useTheme } from "vuetify";
import { selectColorsList } from "../Timetable/helper";
import { getYearTitle } from "@/utils/timetable";
import BackSelectUniv from "./BackSelectUniv.vue";
import TimetableButton from "./TimetableButton.vue";

const { mobile } = useDisplay();
const appStore = useAppStore();
const { goToRooms, selectTimetable } = useResourceSelection();

const colorList = ref(selectColorsList);
const theme = useTheme();

const searchQuery = ref("");
const selectedExtra = ref<number | undefined>();
const { debounced: debouncedQuery, isDebouncing } = useDebounce(searchQuery, 250);

const onSelectExtra = async (val: number | undefined) => {
    if (val !== undefined) {
        const navigated = await selectTimetable(val);
        if (navigated) selectedExtra.value = undefined;
    }
};


const timetableQuery = useQuery<ITimetable[]>({
    queryKey: ["timetableList", appStore.numUniv, appStore.groupId],
    queryFn: ({ signal }) =>
        wrapFetch({
            ...timetableListRequest(appStore.numUniv ?? 0, appStore.groupId ?? 0),
            signal,
        }),
    enabled: computed(() => appStore.numUniv !== undefined && appStore.groupId !== undefined),
});

const nameUniv = computed(() => appStore.univName ?? "");

const filteredTimetables = computed(() => {
    const list = timetableQuery.data.value ?? [];
    if (!debouncedQuery.value) return list;
    const query = debouncedQuery.value.toLowerCase();
    return list.filter(tt => {
        const label = tt.label.toLowerCase();
        return label.includes(query);
    });
});

const yearList = computed(() => {
    const tts = filteredTimetables.value;
    const years = [...new Set(tts.map(tt => tt.year))].sort((a, b) => a - b);
    return years.map(y => y.toString());
});

function getFilteredTtsByYear(year: number) {
    return filteredTimetables.value.filter(tt => tt.year === year);
}

watchEffect(() => {
    if (theme.global.name.value === "dark") {
        colorList.value = selectColorsList.map((color) => `${color}AA`);
    } else {
        colorList.value = selectColorsList;
    }
});

useQueryNotifications<ITimetable[]>({
    contextName: "Timetable List",
    getError: () => timetableQuery.error.value,
    getIsSuccess: () => timetableQuery.isSuccess.value,
    getData: () => timetableQuery.data.value,
});

watch(() => [appStore.numUniv, appStore.groupId], () => {
    searchQuery.value = "";
});

const isFetchingTimetables = computed(() => timetableQuery.isFetching.value || timetableQuery.isLoading.value);
</script>

<style scoped>
.timetable-grid-row {
    align-items: stretch;
}

.timetable-grid-col {
    align-self: stretch;
}
</style>
