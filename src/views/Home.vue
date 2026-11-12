<template>
  <v-container fluid class="full-height">
    <v-row class="text-center">
      <v-col class="mx-auto" :cols="mdAndDown ? '12' : '6'">
        <component :is="currentComponent" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, watchEffect } from "vue";
import { useDisplay } from "vuetify";
import SelectCampus from "@/components/Home/selectors/SelectCampus.vue";
import SelectGroup from "@/components/Home/selectors/SelectGroup.vue";
import SelectRoom from "@/components/Home/selectors/SelectRoom.vue";
import SelectTimetable from "@/components/Home/selectors/SelectTimetable.vue";
import SelectUniv from "@/components/Home/selectors/SelectUniv.vue";
import FreeRooms from "@/components/Home/shared/FreeRooms.vue";
import { featuresForUniversity } from "@/config/features";
import { useAppStore } from "@/store";

const { mdAndDown } = useDisplay();
const appStore = useAppStore();

watchEffect(() => {
	if (
		!featuresForUniversity(appStore.numUniv).canFindFreeRooms &&
		(appStore.resourceType === "freerooms" ||
			appStore.resourceType === "campus")
	) {
		appStore.setSelectedResource("room");
	}
});

function getCurrentComponent() {
	if (appStore.numUniv === undefined) return SelectUniv;
	if (
		!featuresForUniversity(appStore.numUniv).canFindFreeRooms &&
		(appStore.resourceType === "freerooms" ||
			appStore.resourceType === "campus")
	)
		return SelectRoom;
	if (appStore.resourceType === "freerooms") return FreeRooms;
	if (appStore.resourceType === "campus") return SelectCampus;
	if (appStore.resourceType === "room") return SelectRoom;
	if (appStore.groupId === undefined) return SelectGroup;
	return SelectTimetable;
}

const currentComponent = computed(() => getCurrentComponent());
</script>
