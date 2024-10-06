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
        <v-col v-if="appStore.numUniv && appStore.adeResources && !mobile" cols="auto">
          <AppBarButton :to="`/edt/${appStore.numUniv}/${appStore.adeResources}`" text="Emploi du temps" class="text-h6"
            tooltip="Afficher le dernier emploi du temps consulté" />
        </v-col>
      </v-row>
    </v-app-bar-title>

    <template v-slot:append>
      <AppBarButton v-if="route.name === 'Timetable'" icon="mdi-link" :on-click="copyTimetableLink"
        tooltip="Obtenir le lien de l'emploi du temps" />
      <AppBarButton to="/sync" icon="mdi-sync" tooltip="Synchroniser avec un service externe" />
      <AppBarButton to="/swagger" icon="mdi-api" tooltip="Documentation API" />
      <AppThemeButton />
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { API_URL_V2 } from "@/api/api_requests";
import AppBarButton from "@/components/layout/AppBarButton.vue";
import AppThemeButton from "@/components/layout/AppThemeButton.vue";
import { useAppStore } from "@/store/";
import { errorNotif, successNotif } from "@/utils/notification";
import { useRoute } from "vue-router";
import { useDisplay } from "vuetify";

const { smAndUp, mobile } = useDisplay();
const appStore = useAppStore();
const route = useRoute();

const copyTimetableLink = async () => {
    if (!appStore.adeResources || !appStore.numUniv) {
        errorNotif({
            message: "Aucun emploi du temps n'est actuellement sélectionné.",
        });
        return;
    }

    const urlToCopy = `${API_URL_V2}/${appStore.numUniv}/${appStore.adeResources}/ics`;
    await navigator.clipboard.writeText(urlToCopy);
    successNotif({
        message: "Le lien direct de l'emploi du temps a été copié dans le presse-papier.",
    });
};
</script>
