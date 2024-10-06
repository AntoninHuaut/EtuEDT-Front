<template>
  <v-container fluid>
    <TimetableNavigator />
    <TimetableViewer />
  </v-container>
</template>

<script lang="ts" setup>
import TimetableNavigator from "@/components/Timetable/TimetableNavigator.vue";
import TimetableViewer from "@/components/Timetable/TimetableViewer.vue";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useTimetable } from "@/hooks/useTimetable";
import { useAppStore } from "@/store/";
import { watchEffect } from "vue";
import { useRoute } from "vue-router";

const appStore = useAppStore();
const route = useRoute();
const { adeResources, numUniv } = route.params;
if (adeResources && numUniv && !Number.isNaN(+adeResources) && !Number.isNaN(+numUniv)) {
    appStore.$patch({
        adeResources: +adeResources,
        numUniv: +numUniv,
    });
}

const timetableData = useTimetable();
const { setPageTitle } = usePageTitle();
watchEffect(() => setPageTitle(timetableData.nameTT.value === "?" ? "Emploi du temps" : timetableData.nameTT.value));
</script>
