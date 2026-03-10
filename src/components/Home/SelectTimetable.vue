<template>
    <div class="d-flex justify-center align-center">
        <BackSelectUniv :size="mobile ? 24 : 32" />
        <p :class="`text-h${mobile ? '5' : '4'}` + ' mt-3'">Choix de l'emploi du temps</p>
        <v-spacer v-if="!mobile"></v-spacer>
        <v-btn v-if="appStore.numUniv !== -1" class="mt-3 ml-3" prepend-icon="mdi-door-open" variant="tonal" color="primary"
            @click="switchToRooms">
            Salles
        </v-btn>
    </div>

    <v-divider class="mt-3 mb-3"></v-divider>

    <v-text-field v-if="appStore.numUniv === -1" v-model="searchQuery" label="Rechercher une salle..."
        prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" class="mb-3 mx-2" clearable
        hide-details></v-text-field>

    <div class="d-flex flex-column">
        <div v-if="isFetching" class="mt-5">
            <v-progress-circular color="primary" indeterminate :size="128" :width="12" />
        </div>

        <div v-else>
            <h4 v-if="mobile" class="mb-1">{{ nameUniv }}</h4>
            <h2 v-else class="mb-1">{{ nameUniv }}</h2>

            <v-row v-if="appStore.numUniv === -1" justify="center" class="pa-2 px-4 px-sm-6">
                <v-col v-for="(room, i) in filteredTimetables" :key="room.adeResources" cols="6" sm="4" md="3" lg="2" class="pa-1">
                    <RoomGridButton :room="room" :colorHex="colorList[i % colorList.length]" />
                </v-col>
                <v-col v-if="filteredTimetables.length === 0" class="text-center mt-5">
                    <p class="text-grey">Aucune salle trouvée</p>
                </v-col>
            </v-row>

            <v-row v-else justify="center">
                <v-col cols="12" sm="6" md="4" lg="3" class="px-1" v-for="year in yearList" :key="year">
                    <div v-if="getFilteredTtsByYear(Number.parseInt(year)).length > 0">
                        <p class="text-h6 mt-3 mb-1">{{ getTitle(year) }}</p>

                        <v-col v-if="Number.parseInt(year) < 0" class="px-0">
                            <v-select v-model="selectedExtra" :items="getFilteredTtsByYear(Number.parseInt(year))"
                                item-title="descTT" item-value="adeResources"
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
import RoomGridButton from "./RoomGridButton.vue";
import TimetableButton from "./TimetableButton.vue";

const { mobile } = useDisplay();
const appStore = useAppStore();

const colorList = ref(selectColorsList);
const theme = useTheme();
const router = useRouter();

const searchQuery = ref("");

const { data, isFetching, isSuccess, error } = useQuery<ITimetable[]>({
    queryKey: ["timetableList", computed(() => appStore.numUniv)],
    queryFn: ({ signal }) =>
        wrapFetch({
            ...timetableListRequest(appStore.numUniv ?? 0),
            signal,
        }),
});

const nameUniv = computed(() => {
    if (appStore.numUniv === -1) return "Salles de cours";
    return data.value?.[0]?.nameUniv ?? "";
});

const filteredTimetables = computed(() => {
    if (isFetching.value && data.value && data.value[0]?.numUniv !== appStore.numUniv) {
        return [];
    }

    const list = data.value ?? [];
    if (!searchQuery.value) return list;
    const query = searchQuery.value.toLowerCase();
    return list.filter(tt =>
        tt.descTT.toLowerCase().includes(query) ||
        tt.nameUniv?.toLowerCase().includes(query)
    );
});

const yearList = computed(() => {
    const tts = filteredTimetables.value;
    const years = [...new Set(tts.map(tt => tt.numYearTT))].sort((a, b) => a - b);
    return years.map(y => y.toString());
});

function getFilteredTtsByYear(year: number) {
    return filteredTimetables.value.filter(tt => tt.numYearTT === year);
}

function switchToRooms() {
    searchQuery.value = "";
    appStore.$patch({ lastUniv: appStore.numUniv, numUniv: -1, adeResources: undefined });
}

const selectedExtra = ref<string>();
function setSelectedExtra(adeResources: string) {
    if (+adeResources) {
        appStore.$patch({ adeResources: +adeResources })
        router.push(`/edt/${appStore.numUniv}/${adeResources}`);
    }
}

function getTitle(yearId: string) {
    return "Année " + yearId + "A";
};

watchEffect(() => {
    if (theme.global.name.value === "dark") {
        colorList.value = selectColorsList.map((color) => `${color}AA`);
    } else {
        colorList.value = selectColorsList;
    }
});

watch(error, (err) => {
    if (err) {
        console.error("Failed to get Timetable List, got", err);
        genericError(err.message);
        if (err.message === "Not Found") {
            appStore.$patch({ numUniv: undefined, adeResources: undefined });
        }
    }
});

watch(isSuccess, (success) => {
    if (success && !data.value) {
        errorNoDataFetchNotif();
    }
});

watch(() => appStore.numUniv, () => {
    searchQuery.value = "";
});
</script>
