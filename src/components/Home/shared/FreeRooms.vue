<template>
  <SelectHeader
      title="Salles libres"
      :show-back="true"
      :action="[{
      prependIcon: 'mdi-account-group',
      variant: 'tonal',
      color: 'primary',
      onClick: goToGroups,
      text: 'Groupes',
    }]"
  />

  <v-divider class="mt-3 mb-3"></v-divider>

  <SearchBarWithDebounce
      v-model="searchQuery"
      label="Rechercher une salle..."
      :is-debouncing="isDebouncing"
      class="w-100"
  />

  <SelectionLoadingBlock v-if="isInitialLoading"/>

  <div v-else>
    <UniversityTitle :title="selectedUnivName" class-name="mb-4"/>
    <p>Salles libres :</p>
    <v-row class="justify-center pa-2 px-3 px-sm-5 px-md-6 align-stretch room-grid-row">

      <v-col v-for="(campus,i) in filteredFreeRooms" :key="campus.adeResources" cols="6"
             sm="4"
             md="4"
             lg="3"
             xl="3"
             class="pa-1 d-flex room-grid-col">
        <RoomGridButton :room="campus"
                        :colorHex="colorList[i % colorList.length]"
                        :class="{ 'best-room': [5429, 5446].includes(campus.adeResources) }"/>
      </v-col>

      <v-col v-if="filteredFreeRooms.length === 0" class="text-center mt-5">
        <p class="text-grey">Aucune salle libre trouvé</p>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import {useQuery} from "@tanstack/vue-query";
import {computed, ref} from "vue";
import {useDisplay} from "vuetify";
import {campusesListRequest, freeRoomsRequest, groupListRequest} from "@/api/api_requests";
import {useQueryNotifications} from "@/hooks/useQueryNotifications";
import {useResourceSelection} from "@/hooks/useResourceSelection";
import {useAppStore} from "@/store";
import {ICampus, IGroup, IRoom} from "@/types/APIType";
import {wrapFetch} from "@/utils/wrapFetch";
import SelectHeader from "../shared/SelectHeader.vue";
import SelectionLoadingBlock from "../shared/SelectionLoadingBlock.vue";
import UniversityTitle from "../shared/UniversityTitle.vue";
import RoomGridButton from "@/components/Home/buttons/RoomGridButton.vue";
import {useSelectionColors} from "@/hooks/useSelectionColors";
import SearchBarWithDebounce from "@/components/Home/shared/SearchBarWithDebounce.vue";
import {matchesSearchQuery, useSearch} from "@/hooks/useSearch";

const appStore = useAppStore();
const {goToGroups} = useResourceSelection();
const {colors: colorList} = useSelectionColors();
const {searchQuery, debouncedQuery, isDebouncing} = useSearch();

const campusFreeRoomsQuery = useQuery<IRoom[]>({
  queryKey: ["campusFreeRoomsList", appStore.numUniv],
  queryFn: ({signal}) =>
      wrapFetch({
        ...freeRoomsRequest(appStore.numUniv ?? 0, appStore.selectedCampusId ?? 0),
        signal,
      }),
  enabled: computed(() => appStore.numUniv !== undefined),
});
const filteredFreeRooms = computed(() => {
  if (!(debouncedQuery.value.trim().length >= 3) && (appStore.selectedCampusId === -1)) {
    return [];
  }

  let rooms = campusFreeRoomsQuery.data.value ?? [];

  if (appStore.selectedCampusId !== -1) {
    rooms = rooms.filter(room => room.campusId === appStore.selectedCampusId);
  }

  return rooms.filter((room) =>
      matchesSearchQuery(room.label, debouncedQuery.value),
  );
});
const selectedUnivName = computed(() => appStore.univName ?? "");

useQueryNotifications<IRoom[]>({
  contextName: "Campus free room List",
  getError: () => campusFreeRoomsQuery.error.value,
  getIsSuccess: () => campusFreeRoomsQuery.isSuccess.value,
  getData: () => campusFreeRoomsQuery.data.value,
});

const isInitialLoading = computed(() => campusFreeRoomsQuery.isLoading.value);
</script>
<style scoped>
/* The objectively best room of C3 */
.best-room {
  border: 2px solid #cab358;
}
</style>