<template>
  <!-- :size='undefined' is the default size -->
  <v-btn @click="navigateToTimetable(timetable)" :size="smAndDown ? 'small' : 'x-large'"
    :style="smAndDown ? { minHeight: '36px', paddingTop: '6px', paddingBottom: '6px' } : undefined"
  class="text-white w-100 h-100 timetable-btn"
    :class="{ 'text-body-2': smAndDown, 'text-body-large': !smAndDown }" :color="colorHex"
    :loading="isLoading" block>
    <span class="timetable-btn__label">{{ timetable.label }}</span>
  </v-btn>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useDisplay } from "vuetify";
import { useSelectResourceAction } from "@/hooks/useSelectResourceAction";
import type { ITimetable } from "@/types/APIType";

const props = defineProps<{
	timetable: ITimetable;
	colorHex: string;
}>();

const { smAndDown } = useDisplay();
const { select, loadingResourceId } = useSelectResourceAction();
const isLoading = computed(
	() => loadingResourceId.value === props.timetable.adeResources,
);

const navigateToTimetable = async (timetable: ITimetable) => {
	await select("timetable", timetable.adeResources);
};
</script>

<style scoped>
.timetable-btn {
  display: flex;
  flex: 1 1 auto;
  height: 100%;
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

</style>
