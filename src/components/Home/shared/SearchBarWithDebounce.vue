<template>
	<div class="d-flex align-center mb-3 mx-2">
		<v-text-field
			:model-value="modelValue"
			:label="label"
			prepend-inner-icon="mdi-magnify"
			variant="outlined"
			density="compact"
			class="flex-grow-1"
			:class="{ 'search-field--xs': xs }"
			clearable
			hide-details
			@update:model-value="onUpdate"
		/>
		<v-progress-circular
			v-if="isDebouncing"
			class="ml-3"
			:size="20"
			:width="2"
			color="primary"
			indeterminate
		/>
	</div>
</template>

<script lang="ts" setup>
import { useDisplay } from "vuetify";

defineProps<{
	modelValue: string;
	label: string;
	isDebouncing: boolean;
}>();

const { xs } = useDisplay();

const emit = defineEmits<{
	"update:modelValue": [value: string];
}>();

function onUpdate(value: string | null) {
	emit("update:modelValue", value ?? "");
}
</script>

<style scoped>

.search-field--xs :deep(.v-field),
.search-field--xs :deep(.v-field__input) {
	min-height: 36px;
}
</style>
