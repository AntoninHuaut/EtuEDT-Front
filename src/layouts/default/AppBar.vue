<template>
  <v-app-bar class="bg-primary" :height="mobile ? '52' : '64'">
    <v-app-bar-title>
      <v-row no-gutters>
        <v-col cols="auto">
          <router-link class="router_link" to="/">
            <v-img src="@/assets/logo.png" :width="mobile ? '32' : '42'" :class="{'mt-1': mobile}" />
          </router-link>
        </v-col>
        <v-col cols="auto" :class="smAndUp && 'ml-2'">
          <AppBarButton to="/" text="EtuEDT" :class="mobile ? 'text-body-1':'text-h6'" tooltip="Page d'accueil" />
        </v-col>
        <v-col v-if="appStore.numUniv !== undefined && appStore.adeResources && !mobile" cols="auto">
          <AppBarButton :on-click="goToLastTimetable" text="Emploi du temps" class="text-h6"
            tooltip="Afficher le dernier emploi du temps consulté" />
        </v-col>
      </v-row>
    </v-app-bar-title>

    <template v-slot:append>
      <AppBarButton v-if="route.name === 'Timetable'" icon="mdi-link" :on-click="copyTimetableLink"
        tooltip="Obtenir le lien de l'emploi du temps" />
      <AppBarButton to="/sync" icon="mdi-sync" tooltip="Synchroniser (ICS)" />
      <AppThemeButton />
      <AppBarButton :href="`${BASE_API_URL}/docs`" icon="mdi-book-open-variant" tooltip="Documentation API" />
      <AppBarButton to="/contributors" icon="mdi-github" tooltip="À propos" />
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import { BASE_API_URL } from "@/api/api_requests";
import AppBarButton from "@/components/layout/AppBarButton.vue";
import AppThemeButton from "@/components/layout/AppThemeButton.vue";
import { useAppStore } from "@/store/";
import { errorNotif, successNotif } from "@/utils/notification";
import {
	buildTimetableRouteParams,
	createTimetableContext,
	isGroupMissingForTimetable,
} from "@/utils/timetableContext";

const { smAndUp, mobile } = useDisplay();
const appStore = useAppStore();
const route = useRoute();
const router = useRouter();

const goToLastTimetable = async () => {
	const context = createTimetableContext({
		numUniv: appStore.numUniv,
		groupId: appStore.groupId,
		adeResources: appStore.adeResources,
		resourceType: appStore.resourceType,
	});

	if (!context) {
		if (
			isGroupMissingForTimetable({
				resourceType: appStore.resourceType,
				groupId: appStore.groupId,
			})
		) {
			errorNotif({
				message: "Aucun groupe n'est actuellement sélectionné.",
			});
		}
		return;
	}

	await router.push({
		name: "Timetable",
		params: buildTimetableRouteParams(context),
	});
};

const copyTimetableLink = async () => {
	const context = createTimetableContext({
		numUniv: appStore.numUniv,
		groupId: appStore.groupId,
		adeResources: appStore.adeResources,
		resourceType: appStore.resourceType,
	});

	if (!context) {
		if (
			isGroupMissingForTimetable({
				resourceType: appStore.resourceType,
				groupId: appStore.groupId,
			})
		) {
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
