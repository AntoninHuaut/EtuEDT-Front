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

    <v-text-field v-model="searchQuery" label="Rechercher un emploi du temps..."
        prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" class="mb-3 mx-2" clearable
        hide-details></v-text-field>

    <div class="d-flex flex-column">
        <div v-if="isFetchingTimetables" class="mt-5">
            <v-progress-circular color="primary" indeterminate :size="128" :width="12" />
        </div>

        <div v-else>
            <h4 v-if="mobile" class="mb-1">{{ nameUniv }}</h4>
            <h2 v-else class="mb-1">{{ nameUniv }}</h2>

            <v-row justify="center">
                <v-col cols="12" sm="6" md="4" lg="3" class="px-1" v-for="year in yearList" :key="year">
                    <div v-if="getFilteredTtsByYear(Number.parseInt(year)).length > 0">
                        <p class="text-h6 mt-3 mb-1">{{ getTitle(Number.parseInt(year)) }}</p>

                        <v-col v-if="Number.parseInt(year) < 0" class="px-0">
                            <v-select v-model="selectedExtra" :items="getFilteredTtsByYear(Number.parseInt(year))"
                                item-title="label" item-value="adeResources"
                                :label="`${getFilteredTtsByYear(Number.parseInt(year)).length} entrée(s)`" variant="outlined"
                                density="compact" @update:model-value="setSelectedExtra"></v-select>
                        </v-col>

                        <v-col v-else class="pt-2 pb-1 px-0" v-for="(timetable, i) in getFilteredTtsByYear(Number.parseInt(year))"
                            :key="timetable.adeResources">
                            <TimetableButton :timetable="timetable" :colorHex="colorList[i % colorList.length]" />
                        </v-col>
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
import { useAppStore } from "@/store/";
import type { ITimetable } from "@/types/APIType";
import { errorNoDataFetchNotif, genericError } from "@/utils/notification";
import { wrapFetch } from "@/utils/wrapFetch";
import { useQuery } from "@tanstack/vue-query";
import { computed, ref, watch, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useDisplay, useTheme } from "vuetify";
import { selectColorsList } from "../Timetable/helper";
import BackSelectUniv from "./BackSelectUniv.vue";
import TimetableButton from "./TimetableButton.vue";

const { mobile } = useDisplay();
const appStore = useAppStore();

const colorList = ref(selectColorsList);
const theme = useTheme();
const router = useRouter();

const searchQuery = ref("");

const timetableQuery = useQuery<ITimetable[]>({
    queryKey: ["timetableList", computed(() => appStore.numUniv), computed(() => appStore.groupId)],
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
    if (!searchQuery.value) return list;
    const query = searchQuery.value.toLowerCase();
    return list.filter(tt =>
        tt.label.toLowerCase().includes(query)
    );
});

const yearList = computed(() => {
    const tts = filteredTimetables.value;
    const years = [...new Set(tts.map(tt => tt.year))].sort((a, b) => a - b);
    return years.map(y => y.toString());
});

function getFilteredTtsByYear(year: number) {
    return filteredTimetables.value.filter(tt => tt.year === year);
}

const selectedExtra = ref<string>();
function setSelectedExtra(adeResources: string) {
    if (+adeResources) {
        appStore.$patch({ adeResources: +adeResources, resourceType: "timetable", homeSelectionView: "timetable" });
        router.push(`/edt/${appStore.numUniv}/${appStore.groupId}/timetable/${adeResources}`);
    }
}

function goToRooms() {
    appStore.$patch({ adeResources: undefined, resourceType: "room" });
    router.push({ name: "Rooms" });
}

function getTitle(yearId: number) {
    if (yearId <= 0) return "Autres";
    return "Année " + yearId + "A";
};

watchEffect(() => {
    if (theme.global.name.value === "dark") {
        colorList.value = selectColorsList.map((color) => `${color}AA`);
    } else {
        colorList.value = selectColorsList;
    }
});

watch(timetableQuery.error, (err) => {
    if (err) {
        console.error("Failed to get Timetable List, got", err);
        genericError(err.message);
    }
});

watch(timetableQuery.isSuccess, (success) => {
    if (success && !timetableQuery.data.value) {
        errorNoDataFetchNotif();
    }
});

watch(() => [appStore.numUniv, appStore.groupId], () => {
    searchQuery.value = "";
});

const isFetchingTimetables = computed(() => timetableQuery.isFetching.value || timetableQuery.isLoading.value);
</script>
