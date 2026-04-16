<template>
  <SelectHeader
    title="Choix de l'établissement"
    :show-back="false"
  />

  <v-divider class="mt-3 mb-3"></v-divider>

  <v-progress-circular v-if="isFetchingUnivs" class="mt-5" color="primary" indeterminate :size="128" :width="12"></v-progress-circular>

  <div v-else>
    <v-col class="mx-auto" v-for="(univ) in univList" :key="univ.id">
		<v-row class="justify-center">
		  <v-btn :size="smAndDown ? 'large' : 'x-large'" :class="`text-subtitle-${smAndDown ? '2' : '1'}` + ` ${smAndDown ? 'pl-8 pr-8' : 'pl-12 pr-12'} mb-5`" color="#1565C0"
			:loading="selectingUniv === univ.id" @click="selectUniv(univ)">
			{{ univ.name }}
		  </v-btn>
		</v-row>
    </v-col>
  </div>
</template>

<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query";
import { computed, ref } from "vue";
import {
	isNavigationFailure,
	NavigationFailureType,
	useRouter,
} from "vue-router";
import { useDisplay } from "vuetify";
import { univListRequest } from "@/api/api_requests";
import { queryKeys } from "@/hooks/queries/queryKeys";
import { useQueryNotifications } from "@/hooks/useQueryNotifications";
import { ROUTE_NAME } from "@/router/routeNames";
import { useAppStore } from "@/store";
import type { IUniv } from "@/types/APIType";
import { genericError } from "@/utils/notification";
import { wrapFetch } from "@/utils/wrapFetch";
import SelectHeader from "../shared/SelectHeader.vue";

const { smAndDown } = useDisplay();
const appStore = useAppStore();
const selectingUniv = ref<number | undefined>();
const router = useRouter();

const univQuery = useQuery<IUniv[]>({
	queryKey: queryKeys.univList(),
	queryFn: ({ signal }) => wrapFetch({ ...univListRequest(), signal }),
});

const isFetchingUnivs = computed(
	() => univQuery.isFetching.value || univQuery.isLoading.value,
);

useQueryNotifications<IUniv[]>({
	contextName: "Univ List",
	getError: () => univQuery.error.value,
	getIsSuccess: () => univQuery.isSuccess.value,
	getData: () => univQuery.data.value,
});

const univList = computed(() => univQuery.data.value ?? []);

async function selectUniv(univ: IUniv) {
	selectingUniv.value = univ.id;
	appStore.selectUniversity(univ.id, univ.name);
	try {
		const navRes = await router.push({ name: ROUTE_NAME.HOME });
		if (isNavigationFailure(navRes, NavigationFailureType.duplicated)) {
			// Do nothing if it's a duplicated navigation
		} else if (isNavigationFailure(navRes)) {
			genericError(`Échec de la navigation vers l'accueil.`);
		}
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : String(err);
		genericError(errorMessage);
	} finally {
		selectingUniv.value = undefined;
	}
}
</script>
