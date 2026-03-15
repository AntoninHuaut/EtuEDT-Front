<template>
  <!-- :size='undefined' is the default size -->
  <v-btn @click="navigateToTimetable(timetable)" :size="mobile ? undefined : 'x-large'"
    :class="(mobile ? 'text-subtitle-2' : 'text-subtitle-1') + ' text-white w-100 h-100 timetable-btn'" :color="colorHex"
    :loading="isLoading" block>
    <span class="timetable-btn__label">{{ timetable.label }}</span>
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

<style scoped>
.timetable-btn {
  display: flex;
  flex: 1 1 auto;
  height: 100% !important;
  min-height: 48px;
  padding-top: 10px;
  padding-bottom: 10px;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.timetable-btn__label {
  white-space: normal;
  line-height: 1.2;
  width: 100%;
}

@media (max-width: 600px) {
  .timetable-btn {
    min-height: 36px;
    padding-top: 8px;
    padding-bottom: 8px;
  }
}
</style>
