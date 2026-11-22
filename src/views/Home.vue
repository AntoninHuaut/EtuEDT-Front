<template>
  <aside class="maintenance-notice px-4 py-2 text-center text-body-2">
    <strong>EtuEDT est très peu maintenu.</strong>
    D’autres étudiants ont créé
    <a
      href="https://leqgetudiant.fr/"
      target="_blank"
      rel="noopener"
      data-umami-event="home-le-qg-etudiant-click"
    >Le QG Étudiant</a>
    pour consulter votre emploi du temps avec plus de fonctionnalités.
  </aside>
  <v-container fluid>
    <v-row class="text-center">
      <v-col class="mx-auto" :cols="mdAndDown ? '12' : '6'">
        <component :is="currentComponent" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useDisplay } from "vuetify";
import SelectCampus from "@/components/Home/selectors/SelectCampus.vue";
import SelectGroup from "@/components/Home/selectors/SelectGroup.vue";
import SelectRoom from "@/components/Home/selectors/SelectRoom.vue";
import SelectTimetable from "@/components/Home/selectors/SelectTimetable.vue";
import SelectUniv from "@/components/Home/selectors/SelectUniv.vue";
import FreeRooms from "@/components/Home/shared/FreeRooms.vue";
import { useAppStore } from "@/store";

const { mdAndDown } = useDisplay();
const appStore = useAppStore();

function getCurrentComponent() {
	if (appStore.numUniv === undefined) return SelectUniv;
	if (appStore.resourceType === "freerooms") return FreeRooms;
	if (appStore.resourceType === "campus") return SelectCampus;
	if (appStore.resourceType === "room") return SelectRoom;
	if (appStore.groupId === undefined) return SelectGroup;
	return SelectTimetable;
}

const currentComponent = computed(() => getCurrentComponent());
</script>

<style scoped>
.maintenance-notice {
  background-color: rgba(var(--v-theme-primary), 0.1);
}

.maintenance-notice a {
  color: inherit;
  font-weight: 600;
}
</style>
