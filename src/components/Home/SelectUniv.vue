<template>
  <p :class="`text-h${mobile ? '5' : '4'}` + ' mt-3'">Choix de l'établissement</p>

  <v-divider class="mt-3 mb-3"></v-divider>

  <v-progress-circular v-if="isFetchingUnivs" class="mt-5" color="primary" indeterminate :size="128" :width="12"></v-progress-circular>

  <div v-else>
    <v-col class="mx-auto" v-for="(univ) in univList" :key="univ.id">
      <v-row justify="center">
        <v-btn size='x-large' :class="`text-subtitle-${mobile ? '2' : '1'}` + ' pl-12 pr-12 mb-5'" color="#1565C0"
          :loading="selectingUniv === univ.id" @click="selectUniv(univ)">
          {{ univ.name }}
        </v-btn>
      </v-row>
    </v-col>
  </div>
</template>

<script lang="ts" setup>
import { univListRequest } from "@/api/api_requests";
import { useQueryNotifications } from "@/hooks/useQueryNotifications";
import { useAppStore } from "@/store/";
import type { IUniv } from "@/types/APIType";
import { genericError } from "@/utils/notification";
import { wrapFetch } from "@/utils/wrapFetch";
import { useQuery } from "@tanstack/vue-query";
import { computed, onMounted, ref } from "vue";
import { isNavigationFailure, NavigationFailureType, useRouter } from "vue-router";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const appStore = useAppStore();
const selectingUniv = ref<number | undefined>();
const router = useRouter();

const univQuery = useQuery<IUniv[]>({
  queryKey: ["univList"],
  queryFn: ({ signal }) => wrapFetch({ ...univListRequest(), signal }),
  enabled: false,
});

const isFetchingUnivs = computed(() => univQuery.isFetching.value || univQuery.isLoading.value);

onMounted(() => univQuery.refetch());

useQueryNotifications<IUniv[]>({
  contextName: "Univ List",
  getError: () => univQuery.error.value,
  getIsSuccess: () => univQuery.isSuccess.value,
  getData: () => univQuery.data.value,
});

const univList = computed(() => univQuery.data.value ?? []);

async function selectUniv(univ: IUniv) {
  selectingUniv.value = univ.id;
  appStore.$patch({
    numUniv: univ.id,
    univName: univ.name,
    groupId: undefined,
    adeResources: undefined,
    adeUrl: undefined,
    resourceType: "timetable",
  });
  try {
    const navRes = await router.push({ name: "Home" });
    if (isNavigationFailure(navRes, NavigationFailureType.duplicated)) {
      // Do nothing if it's a duplicated navigation
    } else if (isNavigationFailure(navRes)) {
      genericError(`Échec de la navigation vers l'accueil.`);
    }
  } catch (err: any) {
    genericError(err?.message ?? String(err));
  } finally {
    selectingUniv.value = undefined;
  }
}
</script>
