<template>
  <div class="d-flex justify-center align-center">
    <BackSelectUniv :size="mobile ? 24 : 32" />
    <p :class="`text-h${mobile ? '5' : '4'}` + ' mt-3'">Choix de la salle</p>
    <v-spacer v-if="!mobile"></v-spacer>
    <v-btn class="mt-3 ml-3" prepend-icon="mdi-account-group" variant="tonal" color="primary" @click="goToGroups">
      Groupes
    </v-btn>
    <v-btn v-if="appStore.groupId !== undefined" class="mt-3 ml-3" prepend-icon="mdi-calendar" variant="tonal" color="primary" @click="goToTimetables">
      EDT
    </v-btn>
  </div>

  <v-divider class="mt-3 mb-3"></v-divider>

  <v-text-field
    v-model="searchQuery"
    label="Rechercher une salle..."
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
    density="compact"
    class="mb-3 mx-2"
    clearable
    hide-details
  ></v-text-field>

  <div class="d-flex flex-column">
    <div v-if="isFetching" class="mt-5">
      <v-progress-circular color="primary" indeterminate :size="128" :width="12" />
    </div>

    <div v-else>
      <h4 v-if="mobile" class="mb-1">{{ appStore.univName ?? "" }}</h4>
      <h2 v-else class="mb-1">{{ appStore.univName ?? "" }}</h2>

      <v-row justify="center" class="pa-2 px-4 px-sm-6 align-stretch room-grid-row">
        <v-col v-for="(room, i) in filteredRooms" :key="room.adeResources" cols="6" sm="4" md="3" lg="2" class="pa-1 d-flex room-grid-col">
          <RoomGridButton :room="room" :colorHex="colorList[i % colorList.length]" />
        </v-col>
        <v-col v-if="filteredRooms.length === 0" class="text-center mt-2">
          <p class="text-grey">Aucune salle trouvée</p>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { roomListRequest } from "@/api/api_requests";
import { useQueryNotifications } from "@/hooks/useQueryNotifications";
import { useResourceSelection } from "@/hooks/useResourceSelection";
import { useAppStore } from "@/store/";
import type { IRoom } from "@/types/APIType";
import { wrapFetch } from "@/utils/wrapFetch";
import { useQuery } from "@tanstack/vue-query";
import { computed, ref, watchEffect } from "vue";
import { useDisplay, useTheme } from "vuetify";
import { selectColorsList } from "../Timetable/helper";
import BackSelectUniv from "./BackSelectUniv.vue";
import RoomGridButton from "./RoomGridButton.vue";

const { mobile } = useDisplay();
const appStore = useAppStore();
const theme = useTheme();
const { goToGroups, goToTimetables} = useResourceSelection();
const searchQuery = ref("");
const colorList = ref(selectColorsList);


const roomsQuery = useQuery<IRoom[]>({
  queryKey: ["roomList", appStore.numUniv],
  queryFn: ({ signal }) =>
    wrapFetch({
      ...roomListRequest(appStore.numUniv ?? 0),
      signal,
    }),
  enabled: computed(() => appStore.numUniv !== undefined),
});

const filteredRooms = computed(() => {
  const list = roomsQuery.data.value ?? [];
  if (!searchQuery.value) return list;
  return list.filter((room) => room.label.toLowerCase().includes(searchQuery.value.toLowerCase()));
});



watchEffect(() => {
  if (theme.global.name.value === "dark") {
    colorList.value = selectColorsList.map((color) => `${color}AA`);
  } else {
    colorList.value = selectColorsList;
  }
});

useQueryNotifications<IRoom[]>({
  contextName: "Room List",
  getError: () => roomsQuery.error.value,
  getIsSuccess: () => roomsQuery.isSuccess.value,
  getData: () => roomsQuery.data.value,
});

const isFetching = computed(() => roomsQuery.isFetching.value || roomsQuery.isLoading.value);
</script>

<style scoped>
.room-grid-row {
  align-items: stretch;
}

.room-grid-col {
  align-self: stretch;
}
</style>
