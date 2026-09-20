<template>
  <SelectHeader
    title="Choix de la salle"
    :show-back="true"
    :action="[{
      prependIcon: 'mdi-google-classroom',
      variant: 'tonal',
      color: 'primary',
      onClick: goToCampuses,
      text: 'Trouver une salle libre',
    },{
      prependIcon: 'mdi-account-group',
      variant: 'tonal',
      color: 'primary',
      onClick: goToGroups,
      text: 'Groupes',
    }]"
  />

  <v-divider class="mt-3 mb-3"></v-divider>

  <div class="d-flex w-100">
    <SearchBarWithDebounce
        v-model="searchQuery"
        label="Rechercher une salle..."
        :is-debouncing="isDebouncing"
        class="w-75"
    />

    <div class="px-3 px-sm-5 px-md-6 w-25">
      <v-select
          v-if="campusesQuery.isSuccess.value && campusesQuery.data.value && campusesQuery.data.value.length > 0"
          v-model="appStore.selectedCampusId"
          :items="campusOptions"
          item-title="name"
          item-value="id"
          label="Filtrer par campus"
          variant="outlined"
          density="compact"
          class="mb-3"
          hide-details
      ></v-select>
    </div>
  </div>

  <div class="d-flex flex-column">
    <SelectionLoadingBlock v-if="isInitialLoading" />

    <div v-else>
	  <UniversityTitle :title="appStore.univName ?? ''" />

      <v-row class="justify-center pa-2 px-3 px-sm-5 px-md-6 align-stretch room-grid-row">
        <v-col
          v-for="(room, i) in filteredRooms"
          :key="room.adeResources"
          cols="6"
          sm="4"
          md="4"
          lg="3"
          xl="3"
          class="pa-1 d-flex room-grid-col"
        >
          <RoomGridButton :room="room" :colorHex="colorList[i % colorList.length]" />
        </v-col>
        <v-col v-if="!(debouncedQuery.trim().length >= 3) && (appStore.selectedCampusId === -1)" class="text-center mt-2">
          <p class="text-grey">Tapez au moins 3 caractères</p>
        </v-col>
        <v-col v-else-if="filteredRooms.length === 0" class="text-center mt-2">
          <p class="text-grey">Aucune salle trouvée</p>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";
import {campusesListRequest, roomListRequest} from "@/api/api_requests";
import { useQueryNotifications } from "@/hooks/useQueryNotifications";
import { useResourceSelection } from "@/hooks/useResourceSelection";
import { matchesSearchQuery, useSearch } from "@/hooks/useSearch";
import { useSelectionColors } from "@/hooks/useSelectionColors";
import { useAppStore } from "@/store/";
import {ICampus, IRoom} from "@/types/APIType";
import { wrapFetch } from "@/utils/wrapFetch";
import RoomGridButton from "../buttons/RoomGridButton.vue";
import SearchBarWithDebounce from "../shared/SearchBarWithDebounce.vue";
import SelectHeader from "../shared/SelectHeader.vue";
import SelectionLoadingBlock from "../shared/SelectionLoadingBlock.vue";
import UniversityTitle from "../shared/UniversityTitle.vue";

const appStore = useAppStore();
const { goToGroups, goToCampuses } = useResourceSelection();
const { searchQuery, debouncedQuery, isDebouncing } = useSearch();
const { colors: colorList } = useSelectionColors();

const roomsQuery = useQuery<IRoom[]>({
	queryKey: ["roomList", appStore.numUniv],
	queryFn: ({ signal }) =>
		wrapFetch({
			...roomListRequest(appStore.numUniv ?? 0),
			signal,
		}),
	enabled: computed(() => appStore.numUniv !== undefined),
});

const campusesQuery = useQuery<ICampus[]>({
  queryKey: ["campusList", appStore.numUniv],
  queryFn: ({ signal }) =>
      wrapFetch({
        ...campusesListRequest(appStore.numUniv ?? 0),
        signal,
      }),
  enabled: computed(() => appStore.numUniv !== undefined),
});

const campusOptions = computed(() => {
  const options = [{ id: -1, name: 'Tous les campus' }];
  if (campusesQuery.data.value) {
    return [...options, ...campusesQuery.data.value];
  }
  return options;
});

const filteredRooms = computed(() => {
	if (!(debouncedQuery.value.trim().length >= 3) && (appStore.selectedCampusId === -1)) {
		return [];
	}

  let rooms = roomsQuery.data.value ?? [];

  if (appStore.selectedCampusId !== -1) {
    rooms = rooms.filter(room => room.campusId === appStore.selectedCampusId);
  }

  return rooms.filter((room) =>
      matchesSearchQuery(room.label, debouncedQuery.value),
  );
});

useQueryNotifications<IRoom[]>({
	contextName: "Room List",
	getError: () => roomsQuery.error.value,
	getIsSuccess: () => roomsQuery.isSuccess.value,
	getData: () => roomsQuery.data.value,
});

const isInitialLoading = computed(() => roomsQuery.isLoading.value);
</script>

<style scoped>
.room-grid-row {
  align-items: stretch;
}

.room-grid-col {
  align-self: stretch;
}
</style>
