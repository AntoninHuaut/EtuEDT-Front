<template>
  <SelectHeader
    title="Choix du groupe"
    :show-back="true"
    :action="{
      prependIcon: 'mdi-door-open',
      variant: 'tonal',
      color: 'primary',
      onClick: goToRooms,
      text: 'Salles',
    }"
  />

  <v-divider class="mt-3 mb-3"></v-divider>

  <SelectionLoadingBlock v-if="isInitialLoading" />

  <div v-else>
    <UniversityTitle :title="selectedUnivName" class-name="mb-4" />

    <v-col class="mx-auto" v-for="group in groupList" :key="group.id">
		<v-row class="justify-center">
		  <v-btn
			:size="smAndDown ? 'large' : 'x-large'"
			:class="`text-subtitle-${smAndDown ? '2' : '1'}` + ` ${smAndDown ? 'pl-8 pr-8' : 'pl-12 pr-12'} mb-5`"
			color="#1565C0"
			:loading="selectingGroupId === group.id"
			@click="selectGroup(group.id)"
		  >
          {{ group.name }}
        </v-btn>
      </v-row>
    </v-col>

    <v-col v-if="groupList.length === 0" class="text-center mt-5">
      <p class="text-grey">Aucun groupe trouvé</p>
    </v-col>
  </div>
</template>

<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query";
import { computed, ref } from "vue";
import { useDisplay } from "vuetify";
import { groupListRequest } from "@/api/api_requests";
import { queryKeys } from "@/hooks/queries/queryKeys";
import { useQueryNotifications } from "@/hooks/useQueryNotifications";
import { useResourceSelection } from "@/hooks/useResourceSelection";
import { useAppStore } from "@/store";
import type { IGroup } from "@/types/APIType";
import { wrapFetch } from "@/utils/wrapFetch";
import SelectHeader from "../shared/SelectHeader.vue";
import SelectionLoadingBlock from "../shared/SelectionLoadingBlock.vue";
import UniversityTitle from "../shared/UniversityTitle.vue";

const { smAndDown } = useDisplay();
const appStore = useAppStore();
const { goToRooms, selectGroup: selectGroupInStore } = useResourceSelection();
const selectingGroupId = ref<number | undefined>();

const query = useQuery<IGroup[]>({
	queryKey: queryKeys.groupList(appStore.numUniv),
	queryFn: ({ signal }) =>
		wrapFetch({ ...groupListRequest(appStore.numUniv ?? 0), signal }),
	enabled: computed(() => appStore.numUniv !== undefined),
});

const groupList = computed(() => query.data.value ?? []);

const selectedUnivName = computed(() => appStore.univName ?? "");

useQueryNotifications<IGroup[]>({
	contextName: "Group List",
	getError: () => query.error.value,
	getIsSuccess: () => query.isSuccess.value,
	getData: () => query.data.value,
});

function selectGroup(id: number) {
	selectingGroupId.value = id;
	const selectedGroup = groupList.value.find((group) => group.id === id);
	selectGroupInStore(id, selectedGroup?.name ?? "");
}

const isInitialLoading = computed(() => query.isLoading.value);
</script>
