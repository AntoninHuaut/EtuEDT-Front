<template>
  <v-card
    class="room-card ma-1 d-flex flex-column align-center justify-center text-center text-white"
    :color="colorHex"
    :loading="isLoading"
    @click="selectRoom"
    hover
    ripple
  >
    <v-card-text class="pa-2 font-weight-bold text-truncate w-100">
      {{ room.label }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { useAppStore } from "@/store/";
import type { IRoom } from "@/types/APIType";
import { ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{
  room: IRoom;
  colorHex: string;
}>();

const appStore = useAppStore();
const router = useRouter();
const isLoading = ref(false);

const selectRoom = async () => {
  isLoading.value = true;
  try {
    appStore.$patch({ adeResources: props.room.adeResources, resourceType: "room", homeSelectionView: "room" });
    await router.push(`/edt/${appStore.numUniv}/${appStore.groupId}/room/${props.room.adeResources}`);
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
