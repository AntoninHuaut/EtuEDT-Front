<template>
  <v-app-bar class="bg-primary" :height="smAndDown ? '52' : '64'">
    <v-app-bar-title>
      <v-row gap="0" align="center">
        <v-col cols="auto">
			<router-link class="router_link" to="/">
			  <v-img src="@/assets/logo.png" :width="smAndDown ? '32' : '42'" :class="{'mt-1': smAndDown}" />
			</router-link>
		</v-col>
			<v-col cols="auto" :class="smAndUp && 'ml-2'">
			  <AppBarButton :on-click="goToHome" text="EtuEDT" tooltip="Page d'accueil" />
			</v-col>
		  </v-row>
    </v-app-bar-title>

	<template #append>
		<AppBarButton
			v-if="isTimetableRoute"
			icon="mdi-link"
			:on-click="copyTimetableLink"
			tooltip="Obtenir le lien de l'emploi du temps" />
      <AppBarButton to="/sync" icon="mdi-sync" tooltip="Synchroniser (ICS)" />
      <AppThemeButton />
      <AppBarButton :to="`${BASE_API_URL}/docs`" icon="mdi-book-open-variant" tooltip="Documentation API" />
      <AppBarButton to="/about" icon="mdi-github" tooltip="À propos" />
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useDisplay } from "vuetify";

import { BASE_API_URL } from "@/api/api_requests";
import AppBarButton from "@/components/layout/app-bar/AppBarButton.vue";
import AppThemeButton from "@/components/layout/app-bar/AppThemeButton.vue";
import { useAppStore } from "@/store";
import { useTimetable } from "@/hooks/useTimetable";
import { ROUTE_NAME } from "@/router/routeNames";
import { errorNotif, successNotif } from "@/utils/notification";

const { smAndDown, smAndUp } = useDisplay();
const appStore = useAppStore();
const route = useRoute();
const router = useRouter();

const isTimetableRoute = computed(
	() =>
		route.name === ROUTE_NAME.TIMETABLE_GROUP ||
		route.name === ROUTE_NAME.TIMETABLE_ROOM,
);
const timetableData = useTimetable({ enabled: isTimetableRoute });

const goToHome = async () => await router.push({ name: ROUTE_NAME.HOME });

const copyTimetableLink = async () => {
	if (!appStore.hasSelectedResource || !appStore.canLoadSelectedResource) {
		if (appStore.isGroupMissingForTimetable) {
			errorNotif({
				message: "Aucun groupe n'est actuellement sélectionné.",
			});
			return;
		}

		errorNotif({
			message: "Aucun emploi du temps n'est actuellement sélectionné.",
		});
		return;
	}

	if (!timetableData.adeUrl.value) {
		if (timetableData.isLoading.value) {
			errorNotif({
				message: "L'emploi du temps est encore en cours de chargement.",
			});
		} else if (timetableData.error.value) {
			errorNotif({
				message: "Impossible de récupérer le lien ADE suite à une erreur.",
			});
		} else {
			errorNotif({
				message: "Lien ADE indisponible pour cet emploi du temps.",
			});
		}
		return;
	}

	if (!navigator.clipboard?.writeText) {
		errorNotif({
			message: "Le presse-papier n'est pas disponible dans ce navigateur.",
		});
		return;
	}

	try {
		await navigator.clipboard.writeText(timetableData.adeUrl.value);
		successNotif({
			message:
				"Le lien direct de l'emploi du temps a été copié dans le presse-papier.",
		});
	} catch {
		errorNotif({
			message:
				"Impossible de copier le lien. Vérifiez les permissions du presse-papier.",
		});
	}
};
</script>
