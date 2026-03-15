<template>
  <div class="d-flex justify-center align-center">
    <BackSelectUniv :size="mobile ? 24 : 32" />
    <p :class="`text-h${mobile ? '5' : '4'}` + ' mt-3'">Choix du groupe</p>
    <v-spacer v-if="!mobile"></v-spacer>
    <v-btn class="mt-3 ml-3" prepend-icon="mdi-door-open" variant="tonal" color="primary" @click="goToRooms">
      Salles
    </v-btn>
  </div>

  <v-divider class="mt-3 mb-3"></v-divider>

  <div v-if="isFetching" class="mt-5">
    <v-progress-circular color="primary" indeterminate :size="128" :width="12" />
  </div>

  <div v-else>
    <h4 v-if="mobile" class="mb-4">{{ selectedUnivName }}</h4>
    <h2 v-else class="mb-4">{{ selectedUnivName }}</h2>

    <v-col class="mx-auto" v-for="group in groupList" :key="group.id">
      <v-row justify="center">
        <v-btn
          size="x-large"
          :class="`text-subtitle-${mobile ? '2' : '1'}` + ' pl-12 pr-12 mb-5'"
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
import { useQueryNotifications } from "@/hooks/useQueryNotifications";
import { useResourceSelection } from "@/hooks/useResourceSelection";
import { useAppStore } from "@/store";
import type { IGroup } from "@/types/APIType";
import { wrapFetch } from "@/utils/wrapFetch";
import BackSelectUniv from "./BackSelectUniv.vue";

const { mobile } = useDisplay();
const appStore = useAppStore();
const { goToRooms, selectGroup: selectGroupInStore } = useResourceSelection();
const selectingGroupId = ref<number | undefined>();

const query = useQuery<IGroup[]>({
	queryKey: ["groupList", appStore.numUniv],
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
	selectGroupInStore(id);
}

const isFetching = computed(
	() => query.isFetching.value || query.isLoading.value,
);
</script>
