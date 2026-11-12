<template>
	<v-tooltip :text="tooltip">
		<template #activator="{ props: tooltipProps }">
			<span v-bind="tooltipProps" :tabindex="disabled ? 0 : undefined" class="d-inline-flex">
			<v-btn
				v-bind="buttonAttrs"
				:disabled="disabled"
				:aria-label="tooltip"
				:class="{ 'app-bar-button--sm': smAndDown }"
				:active="false"
				:size="smAndDown ? 'small' : undefined"
				@click="handleClick"
				elevation="0"
				variant="text"
				color="inherit"
				:text="props.text"
			/>
			</span>
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

defineOptions({ inheritAttrs: false });

const { smAndDown } = useDisplay();

const props = defineProps({
	disabled: Boolean,
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
	if (props.disabled) {
		delete base.to;
		delete base.href;
		delete base.target;
		return base;
	}
	if (isExternal.value) {
		base.href = base.to ?? base.href;
		base.target = "_blank";
		base.rel = "noopener noreferrer";
		delete base.to;
	}
	return base;
});

function handleClick(event: MouseEvent) {
	if (props.disabled) {
		event.preventDefault();
		return;
	}
	props.onClick?.(event);
}
</script>
