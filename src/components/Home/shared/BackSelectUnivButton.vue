<template>
  <v-icon @click="backToUnivList" :class="'pr-3 align-self-center ' + (theme.global.name.value === 'dark' ? 'text-white' : 'text-black')" icon="mdi-arrow-left-circle"
    v-bind="$attrs" />
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { useTheme } from "vuetify";
import { useAppStore } from "@/store/";

const appStore = useAppStore();
const theme = useTheme();
const route = useRoute();
const router = useRouter();

const backToUnivList = async () => {
	if (route.name === "Rooms") {
		appStore.selectGroup(undefined);
		await router.push({ name: "Home" });
		return;
	}

	if (appStore.groupId !== undefined) {
		appStore.selectGroup(undefined);
		return;
	}

	appStore.clearUniversitySelection();
};
</script>
