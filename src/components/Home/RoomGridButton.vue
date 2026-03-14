<template>
  <v-card
    class="room-card ma-1 d-flex flex-column align-center justify-center text-center text-white"
    :color="colorHex"
    :loading="isLoading"
    @click="navigateToRoom"
    hover
    ripple
  >
    <v-card-text class="pa-2 font-weight-bold text-truncate w-100">
      {{ room.label }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { useResourceSelection } from "@/hooks/useResourceSelection";
import type { IRoom } from "@/types/APIType";
import { ref } from "vue";

const props = defineProps<{
  room: IRoom;
  colorHex: string;
}>();

const { selectRoom } = useResourceSelection();
const isLoading = ref(false);

const navigateToRoom = async () => {
  isLoading.value = true;
  try {
    await selectRoom(props.room.adeResources);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.room-card {
  height: 60px;
  min-width: 100px;
  transition: transform 0.2s ease-in-out;
}

.room-card:hover {
  transform: translateY(-2px);
}
</style>
