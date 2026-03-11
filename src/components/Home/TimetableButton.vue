<template>
  <!-- :size='undefined' is the default size -->
  <v-btn @click="selectTimetable(timetable)" :size="mobile ? undefined : 'x-large'"
    :class="(mobile ? 'text-subtitle-2 px-10' : 'text-subtitle-1 px-12') + ' text-white'" :color="colorHex"
    :loading="isLoading">
    {{ timetable.descTT }}
  </v-btn>
</template>

<script lang="ts" setup>
import { useAppStore } from "@/store/";
import type { ITimetable } from "@/types/APIType";
import { ref } from "vue";
import { useDisplay } from "vuetify";
import { useRouter } from "vue-router";

defineProps<{
  timetable: ITimetable;
  colorHex: string;
}>();

const appStore = useAppStore();
const { mobile } = useDisplay();
const router = useRouter();
const isLoading = ref(false);

const selectTimetable = async (timetable: ITimetable) => {
  isLoading.value = true;
  try {
    appStore.$patch({ adeResources: timetable.adeResources });
    await router.push(`/edt/${timetable.numUniv}/${timetable.adeResources}`);
  } finally {
    isLoading.value = false;
  }
};
</script>
