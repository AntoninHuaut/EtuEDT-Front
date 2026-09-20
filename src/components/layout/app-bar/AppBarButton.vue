<template>
	<v-tooltip :text="tooltip">
		<template #activator="{ props: tooltipProps }">
			<v-btn
				v-bind="{ ...buttonAttrs, ...tooltipProps }"
				:class="{ 'app-bar-button--sm': smAndDown }"
				:active="false"
				:size="smAndDown ? 'small' : undefined"
				@click="onClick"
				elevation="0"
				variant="text"
				color="inherit"
				:text="props.text"
			/>
		</template>
	</v-tooltip>
</template>

<style scoped>
.v-btn {
	font-weight: 500;
	font-size: 1.25rem;
}

.v-btn.app-bar-button--sm {
	font-size: 1rem;
}
</style>

<script lang="ts" setup>
import { computed, type PropType, useAttrs } from "vue";
import { useDisplay } from "vuetify";

const { smAndDown } = useDisplay();

const props = defineProps({
	text: String,
	onClick: {
		type: Function as PropType<
			(() => unknown) | ((event: MouseEvent) => unknown)
		>,
		required: false,
	},
	tooltip: {
		type: String,
		required: true,
	},
});

const attrs = useAttrs();
const EXTERNAL_URL_REGEX = /^(https?:)?\/\//i;

const isExternal = computed(() => {
	const url = attrs.to;
	return typeof url === "string" && EXTERNAL_URL_REGEX.test(url.trim());
});

const buttonAttrs = computed(() => {
	const base = { ...attrs };
	if (isExternal.value) {
		base.href = base.to ?? base.href;
		base.target = "_blank";
		base.rel = "noopener noreferrer";
		delete base.to;
	}
	return base;
});
</script>
