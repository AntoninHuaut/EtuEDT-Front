<template>
  <v-container class="pa-2" fluid>
    <TimetableNavigator />
    <TimetableViewer />
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted, watchEffect } from "vue";
import TimetableNavigator from "@/components/Timetable/TimetableNavigator.vue";
import TimetableViewer from "@/components/Timetable/TimetableViewer.vue";
import { useDateHelper } from "@/hooks/useDateHelper";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useTimetable } from "@/hooks/useTimetable";
import { useTimetableViewStore } from "@/store";

const dateHelper = useDateHelper();
const timetableViewStore = useTimetableViewStore();

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
	timetableViewStore.setCalDate(dateHelper.getCurrentWeekday());
});
</script>
