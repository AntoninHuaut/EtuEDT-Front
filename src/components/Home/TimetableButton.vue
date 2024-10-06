<template>
  <!-- :size='undefined' is the default size -->
  <v-btn @click="selectTimetable(timetable)" :size="mobile ? undefined: 'x-large' "
    :class="(mobile ?'text-subtitle-2 px-10': 'text-subtitle-1 px-12' ) + ' text-white'" :color="colorHex"
    :to="`/edt/${timetable.numUniv}/${timetable.adeResources}`">
    {{ timetable.nameTT }}
  </v-btn>
</template>

<script lang="ts" setup>
import { useAppStore } from "@/store/";
import type { ITimetable } from "@/types/APIType";
import { useDisplay } from "vuetify";

defineProps<{
    timetable: ITimetable;
    colorHex: string;
}>();

const appStore = useAppStore();
const { mobile } = useDisplay();

const selectTimetable = (timetable: ITimetable) => appStore.$patch({ adeResources: timetable.adeResources });
</script>
