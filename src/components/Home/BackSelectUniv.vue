<template>
  <v-icon @click="backToUnivList" :class="'mt-3 mr-3 align-self-center ' + (theme.global.name.value === 'dark' ? 'text-white' : 'text-black')" icon="mdi-arrow-left-circle"
    v-bind="$attrs" />
</template>

<script lang="ts" setup>
import { useAppStore } from "@/store/";
import { useTheme } from "vuetify";

const appStore = useAppStore();
const theme = useTheme();
const backToUnivList = () => {
    appStore.$patch({ numUniv: undefined, adeResources: undefined });
};
</script>
