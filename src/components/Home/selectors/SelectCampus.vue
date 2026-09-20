<template>
  <SelectHeader
      title="Choix du campus"
      :show-back="true"
      :action="[{
      prependIcon: 'mdi-door-open',
      variant: 'tonal',
      color: 'primary',
      onClick: goToRooms,
      text: 'Salles',
    }]"
  />

  <v-divider class="mt-3 mb-3"></v-divider>

  <SelectionLoadingBlock v-if="isInitialLoading"/>

  <div v-else>
    <UniversityTitle :title="selectedUnivName" class-name="mb-4"/>

    <v-row class="justify-center pa-2 px-3 px-sm-5 px-md-6 align-stretch room-grid-row">

      <v-col v-for="(campus, i) in campusesList" :key="campus.id"
             cols="6"
             sm="4"
             md="4"
             lg="3"
             xl="3"
             class="pa-1 d-flex room-grid-col">
        <CampusGridButton
            :size="smAndDown ? 'large' : 'x-large'"
            :class="`text-subtitle-${smAndDown ? '2' : '1'}` + ` ${smAndDown ? 'pl-8 pr-8' : 'pl-12 pr-12'} mb-5`"
            color="#1565C0"
            :loading="selectingGroupId === campus.id"
            :campus="campus"
            :color-hex="colorList[i % colorList.length]"
            @click="selectCampus(campus.id)"
        >
          {{ campus.name }}
        </CampusGridButton>
      </v-col>

      <v-col v-if="campusesList.length === 0" class="text-center mt-5">
        <p class="text-grey">Aucun campus trouvé</p>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import {useQuery} from "@tanstack/vue-query";
import {computed, ref} from "vue";
import {useDisplay} from "vuetify";
import {campusesListRequest, groupListRequest} from "@/api/api_requests";
import {useQueryNotifications} from "@/hooks/useQueryNotifications";
import {useResourceSelection} from "@/hooks/useResourceSelection";
import {useAppStore} from "@/store";
import {ICampus, IGroup} from "@/types/APIType";
import SelectHeader from "../shared/SelectHeader.vue";
import SelectionLoadingBlock from "../shared/SelectionLoadingBlock.vue";
import UniversityTitle from "../shared/UniversityTitle.vue";
import CampusGridButton from "@/components/Home/buttons/CampusGridButton.vue";
import {useSelectionColors} from "@/hooks/useSelectionColors";
import {wrapFetchTyped} from "@/utils/wrapFetch";

const {colors: colorList} = useSelectionColors();

const {smAndDown} = useDisplay();
const appStore = useAppStore();
const {goToFreeRooms, goToRooms, selectCampus: selectCampusInStore} = useResourceSelection();
const selectingGroupId = ref<number | undefined>();

const campusesQuery = useQuery<ICampus[]>({
  queryKey: ["campusList", appStore.numUniv],
  queryFn: ({signal}) =>
      wrapFetchTyped<ICampus[]>({
        ...campusesListRequest(appStore.numUniv ?? 0),
        signal,
      }).then((data) => data ?? []),
  enabled: computed(() => appStore.numUniv !== undefined),
});

const campusesList = computed(() => campusesQuery.data.value ?? []);

const selectedUnivName = computed(() => appStore.univName ?? "");

useQueryNotifications<IGroup[]>({
  contextName: "Campuses List",
  getError: () => campusesQuery.error.value,
  getIsSuccess: () => campusesQuery.isSuccess.value,
  getData: () => campusesQuery.data.value,
});

function selectCampus(id: number) {
  selectingGroupId.value = id;
  const selectedCampus = campusesList.value.find((group) => group.id === id);
  selectCampusInStore(id, selectedCampus?.name ?? "");
  goToFreeRooms();
}

const isInitialLoading = computed(() => campusesQuery.isLoading.value);
</script>
