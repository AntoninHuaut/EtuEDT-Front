<template>
	<div class="d-flex justify-center align-center gap-3">
		<BackSelectUniv v-if="showBack" :size="xs ? 24 : 32" />
		<p class="pa-0 ma-0" :class="xs ? 'text-title-medium' : 'text-headline-large'">
			{{ title }}
		</p>
		<v-spacer v-if="!xs" />
		<v-btn
			v-if="action"
			class="ml-4"
			:prepend-icon="action.prependIcon"
			:variant="action.variant"
			:color="action.color"
			:size="xs ? 'small' : undefined"
			@click="action.onClick"
		>
			{{ action.text }}
		</v-btn>
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
	};
}>();

const { xs } = useDisplay();
</script>
