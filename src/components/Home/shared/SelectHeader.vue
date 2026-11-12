<template>
  <div class="d-flex justify-space-between align-center gap-3 flex-column flex-sm-row gap-2">
    <div class="d-flex">
      <BackSelectUniv v-if="showBack" :size="xs ? 24 : 32"/>
      <p class="pa-0 ma-0" :class="xs ? 'text-title-medium' : 'text-headline-large'">
        {{ title }}
      </p>
    </div>
    <div>
      <span v-for="act in action" :key="act.text" class="d-inline-flex" :title="act.disabled ? act.disabledReason : undefined">
      <v-btn
          class="ml-4"
          :prepend-icon="act.prependIcon"
          :variant="act.variant"
          :color="act.color"
          :size="xs ? 'small' : undefined"
          :disabled="act.disabled"
          :aria-label="act.disabled ? `${act.text} : ${act.disabledReason}` : act.text"
          @click="!act.disabled && act.onClick()"
      >
        {{ act.text }}
      </v-btn>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDisplay } from "vuetify";
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
		disabled?: boolean;
		disabledReason?: string;
	}[];
}>();

const { xs } = useDisplay();
</script>
<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
