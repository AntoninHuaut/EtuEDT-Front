<template>
  <router-view />
</template>

<script lang="ts" setup>
import "@fontsource/roboto/100.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/roboto/900.css";

import { useThemeStore } from "@/store/";
import { ETheme } from "@/types/AppType";
import { usePreferredDark } from "@vueuse/core";
import { watchEffect } from "vue";
import { useTheme } from "vuetify";

const themeStore = useThemeStore();
const vuetifyTheme = useTheme();
const preferredDark = usePreferredDark();
watchEffect(() => setTheme(themeStore.theme));

function setTheme(currentTheme: string | undefined) {
    if (currentTheme === ETheme.DARK || (preferredDark.value && currentTheme === ETheme.SYSTEM)) {
        vuetifyTheme.global.name.value = "dark";
    } else {
        vuetifyTheme.global.name.value = "light";
    }
}
</script>
