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
      {{ room.descTT }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { useAppStore } from "@/store/";
import type { ITimetable } from "@/types/APIType";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useTheme } from "vuetify";

const props = defineProps<{
  room: ITimetable;
  colorHex: string;
}>();

const appStore = useAppStore();
const theme = useTheme();
const router = useRouter();
const isLoading = ref(false);

const selectRoom = () => {
  isLoading.value = true;
  appStore.$patch({ adeResources: props.room.adeResources });
  router.push(`/edt/${props.room.numUniv}/${props.room.adeResources}`);
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
