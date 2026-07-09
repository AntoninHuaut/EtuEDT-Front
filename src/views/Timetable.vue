<template>
  <v-container class="pa-2" fluid>
    <TimetableNavigator :selected-resource="selectedResource" />
    <TimetableViewer :selected-resource="selectedResource" />
  </v-container>
</template>

<script lang="ts" setup>
import { computed, watchEffect } from "vue";
import TimetableNavigator from "@/components/Timetable/TimetableNavigator.vue";
import TimetableViewer from "@/components/Timetable/TimetableViewer.vue";
import { useCalendarQuerySync } from "@/hooks/useCalendarQuerySync";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useTimetable } from "@/hooks/useTimetable";
import type { IResourceSelection } from "@/types/AppType";

const props = defineProps<{
	selectedResource: IResourceSelection;
}>();

const { initCalendarFromQuery } = useCalendarQuerySync();
initCalendarFromQuery();

const timetableData = useTimetable({
	selectedResource: computed(() => props.selectedResource),
});
const { setPageTitle } = usePageTitle();

watchEffect(() =>
	setPageTitle(
		timetableData.nameTT.value === "?"
			? "Emploi du temps"
			: timetableData.nameTT.value,
	),
);
</script>
