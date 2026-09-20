<template>
  <div class="d-flex justify-space-between align-center gap-3 flex-column flex-sm-row gap-2">
    <div class="d-flex">
      <BackSelectUniv v-if="showBack" :size="xs ? 24 : 32"/>
      <p class="pa-0 ma-0" :class="xs ? 'text-title-medium' : 'text-headline-large'">
        {{ title }}
      </p>
    </div>
    <div>
      <v-btn
          v-for="act in action"
          v-if="action"
          class="ml-4"
          :prepend-icon="act.prependIcon"
          :variant="act.variant"
          :color="act.color"
          :size="xs ? 'small' : undefined"
          @click="act.onClick"
      >
        {{ act.text }}
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useDisplay} from "vuetify";
import BackSelectUniv from "./BackSelectUnivButton.vue";

defineProps<{
  title: string;
  showBack: boolean;
  action?: {
    prependIcon: string;
    variant?: "text" | "flat" | "elevated" | "outlined" | "plain" | "tonal";
    color: string;
    onClick: () => void | Promise<void>;
    text: string;
  }[];
}>();

const {xs} = useDisplay();
</script>
<style scoped>
.gap-2 {
  gap: 8px;
}
</style>