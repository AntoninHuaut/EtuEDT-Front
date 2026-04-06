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
		<AppBarButton v-if="route.name === 'Timetable'" icon="mdi-link" :on-click="copyTimetableLink"
			tooltip="Obtenir le lien de l'emploi du temps" />
      <AppBarButton to="/sync" icon="mdi-sync" tooltip="Synchroniser (ICS)" />
      <AppThemeButton />
      <AppBarButton :to="`${BASE_API_URL}/docs`" icon="mdi-book-open-variant" tooltip="Documentation API" />
      <AppBarButton to="/about" icon="mdi-github" tooltip="À propos" />
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { useDisplay } from "vuetify";

import { BASE_API_URL } from "@/api/api_requests";
import AppBarButton from "@/components/layout/app-bar/AppBarButton.vue";
import AppThemeButton from "@/components/layout/app-bar/AppThemeButton.vue";
import { useAppStore } from "@/store/";
import { errorNotif, successNotif } from "@/utils/notification";

const { smAndDown, smAndUp } = useDisplay();
const appStore = useAppStore();
const route = useRoute();
const router = useRouter();

const goToHome = async () => await router.push({ name: "Home" });

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

	if (!appStore.adeUrl) {
		if (appStore.isTimetableLoading) {
			errorNotif({
				message: "L'emploi du temps est encore en cours de chargement.",
			});
		} else if (appStore.isTimetableError) {
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

	await navigator.clipboard.writeText(appStore.adeUrl);
	successNotif({
		message:
			"Le lien direct de l'emploi du temps a été copié dans le presse-papier.",
	});
};
</script>
