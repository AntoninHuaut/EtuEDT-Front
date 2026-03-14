<template>
  <!-- :size='undefined' is the default size -->
  <v-btn @click="navigateToTimetable(timetable)" :size="mobile ? undefined : 'x-large'"
    :class="(mobile ? 'text-subtitle-2 px-10' : 'text-subtitle-1 px-12') + ' text-white'" :color="colorHex"
    :loading="isLoading">
    {{ timetable.label }}
  </v-btn>
</template>

<script lang="ts" setup>
import { useResourceSelection } from "@/hooks/useResourceSelection";
import type { ITimetable } from "@/types/APIType";
import { ref } from "vue";
import { useDisplay } from "vuetify";

defineProps<{
  timetable: ITimetable;
  colorHex: string;
}>();

const { mobile } = useDisplay();
const { selectTimetable } = useResourceSelection();
const isLoading = ref(false);

const navigateToTimetable = async (timetable: ITimetable) => {
  isLoading.value = true;
  try {
    await selectTimetable(timetable.adeResources);
  } finally {
    isLoading.value = false;
  }
};
</script>
