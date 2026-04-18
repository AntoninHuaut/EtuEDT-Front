<template>
  <v-container class="pa-2" fluid>
    <TimetableNavigator :selected-resource="selectedResource" />
    <TimetableViewer :selected-resource="selectedResource" />
  </v-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, watchEffect } from "vue";
import TimetableNavigator from "@/components/Timetable/TimetableNavigator.vue";
import TimetableViewer from "@/components/Timetable/TimetableViewer.vue";
import { useDateHelper } from "@/hooks/useDateHelper";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useTimetable } from "@/hooks/useTimetable";
import { useTimetableViewStore } from "@/store";
import type { IResourceSelection } from "@/types/AppType";

const props = defineProps<{
	selectedResource: IResourceSelection;
}>();

const dateHelper = useDateHelper();
const timetableViewStore = useTimetableViewStore();

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

onMounted(() => {
	timetableViewStore.setCalDate(dateHelper.getCurrentWeekday());
});
</script>
