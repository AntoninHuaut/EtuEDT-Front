<template>
	<h4 v-if="smAndDown" :class="className">{{ title }}</h4>
	<h2 v-else :class="className">{{ title }}</h2>
</template>

<script lang="ts" setup>
import { useDisplay } from "vuetify";

withDefaults(
	defineProps<{
		title: string;
		className?: string;
	}>(),
	{
		className: "mb-1",
	},
);

const { smAndDown } = useDisplay();
</script>
