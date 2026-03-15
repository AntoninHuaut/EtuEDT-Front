<template>
  <v-container fluid>
    <TimetableNavigator />
    <TimetableViewer />
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted, watchEffect } from "vue";
import { useRoute } from "vue-router";
import TimetableNavigator from "@/components/Timetable/TimetableNavigator.vue";
import TimetableViewer from "@/components/Timetable/TimetableViewer.vue";
import { useDateHelper } from "@/hooks/useDateHelper";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useTimetable } from "@/hooks/useTimetable";
import { useAppStore, useTimetableViewStore } from "@/store/";
import { createTimetableContext } from "@/utils/timetableContext";

const appStore = useAppStore();
const dateHelper = useDateHelper();
const timetableViewStore = useTimetableViewStore();
const route = useRoute();
const timetableContext = createTimetableContext(route.params);

if (timetableContext) {
	appStore.$patch({
		adeResources: timetableContext.adeResources,
		numUniv: timetableContext.numUniv,
		groupId: timetableContext.groupId,
		resourceType: timetableContext.resourceType,
	});
}

const timetableData = useTimetable();
const { setPageTitle } = usePageTitle();
watchEffect(() =>
	setPageTitle(
		timetableData.nameTT.value === "?"
			? "Emploi du temps"
			: timetableData.nameTT.value,
	),
);

onMounted(() => {
	timetableViewStore.$patch({
		calDate: dateHelper.skipWeekend(new Date(), "next"),
	});
});
</script>
