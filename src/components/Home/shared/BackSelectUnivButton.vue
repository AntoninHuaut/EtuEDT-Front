<template>
  <v-btn
    icon
    variant="plain"
    @click="backAction"
    :class="'pr-3 align-self-center ' + (theme.global.name.value === 'dark' ? 'text-white' : 'text-black')"
    aria-label="Back to university list"
    v-bind="$attrs"
  >
    <v-icon icon="mdi-arrow-left-circle" />
  </v-btn>
</template>

<script lang="ts" setup>
import { useTheme } from "vuetify";
import { useAppStore } from "@/store";

const appStore = useAppStore();
const theme = useTheme();

const backAction = async () => {
	if (appStore.resourceType === "room") {
		appStore.selectGroup(undefined);
		return;
	}

	if (appStore.groupId !== undefined) {
		appStore.selectGroup(undefined);
		return;
	}

	appStore.clearUniversitySelection();
};
</script>
