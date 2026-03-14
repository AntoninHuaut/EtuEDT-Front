<template>
  <p :class="`text-h${mobile ? '5' : '4'}` + ' mt-3'">Choix de l'établissement</p>

  <v-divider class="mt-3 mb-3"></v-divider>

  <v-progress-circular v-if="univQuery.isLoading" class="mt-5" color="primary" indeterminate :size="128" :width="12"></v-progress-circular>

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
import { wrapFetch } from "@/utils/wrapFetch";
import { useQuery } from "@tanstack/vue-query";
import { onMounted, ref, watch } from "vue";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const appStore = useAppStore();
const univList = ref<IUniv[]>([]);
const selectingUniv = ref<number | undefined>();

const univQuery = ref(
    useQuery<IUniv[]>({
        queryKey: ["univList"],
        queryFn: ({ signal }) => wrapFetch({ ...univListRequest(), signal }),
        enabled: false,
    }),
);

onMounted(() => univQuery.value.refetch());

useQueryNotifications<IUniv[]>({
  contextName: "Univ List",
  getError: () => univQuery.value.error,
  getIsSuccess: () => univQuery.value.isSuccess,
  getData: () => univQuery.value.data,
});

watch(
    () => univQuery.value.isLoading,
    () => {
        if (!univQuery.value.isSuccess) return;
    if (!univQuery.value.data) return;

        univList.value.length = 0;
        univList.value.push(...univQuery.value.data);
    },
    { immediate: true },
);

function selectUniv(univ: IUniv) {
    selectingUniv.value = univ.id;
  appStore.$patch({
    numUniv: univ.id,
    univName: univ.name,
    groupId: undefined,
    adeResources: undefined,
    adeUrl: undefined,
    resourceType: "timetable",
  });

}
</script>
