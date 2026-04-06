<template>
  <v-card
    class="room-card ma-1 d-flex flex-column align-center justify-center text-center text-white"
    :style="smAndDown ? { minHeight: '38px' } : undefined"
    :color="colorHex"
    :loading="isLoading"
    @click="navigateToRoom"
    hover
    ripple
  >
    <v-card-text class="font-weight-bold room-label w-100" :class="smAndDown ? 'pa-1 text-caption' : 'pa-2'">
      {{ room.label }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useDisplay } from "vuetify";
import { useSelectResourceAction } from "@/hooks/useSelectResourceAction";
import type { IRoom } from "@/types/APIType";

const props = defineProps<{
	room: IRoom;
	colorHex: string;
}>();

const { select, loadingResourceId } = useSelectResourceAction();
const { smAndDown } = useDisplay();
const isLoading = computed(
	() => loadingResourceId.value === props.room.adeResources,
);

const navigateToRoom = async () => {
	await select("room", props.room.adeResources);
};
</script>

<style scoped>
.room-card {
  flex: 1 1 auto;
  height: 100%;
  min-height: 44px;
  width: 100%;
  transition: transform 0.2s ease-in-out;
}

.room-card:hover {
  transform: translateY(-2px);
}

.room-label {
  word-break: normal;
  overflow-wrap: anywhere;
  line-height: 1.1;
}
</style>
