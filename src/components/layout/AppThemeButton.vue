<template>
  <v-menu transition="slide-y-transition">
    <template v-slot:activator="{ props: propsMenu }">
      <AppBarButton v-bind="propsMenu" :icon="getIcon(themeStore.theme)" :tooltip="getTooltip(themeStore.theme)" />
    </template>

    <v-list>
      <v-list-item v-for="(availableTheme, index) in availableThemes" :key="index">
        <v-list-item-title>
          <AppBarButton :on-click="() => setTheme(availableTheme)" :icon="getIcon(availableTheme)" :tooltip="getTooltip(availableTheme)" />
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts" setup>
import { useThemeStore } from "@/store/";
import { ETheme } from "@/types/AppType";
import AppBarButton from "./AppBarButton.vue";

const themeStore = useThemeStore();
const availableThemes = [ETheme.LIGHT, ETheme.DARK, ETheme.SYSTEM];

const setTheme = (theme: ETheme | undefined) => {
    setTimeout(() => {
        themeStore.$patch({ theme: theme });
    }, 1);
};

const getTooltip = (theme: string | undefined) => {
    switch (theme) {
        case ETheme.LIGHT:
            return "Thème clair";
        case ETheme.DARK:
            return "Thème sombre";
        default:
            return "Thème du système";
    }
};

const getIcon = (theme: string | undefined) => {
    switch (theme) {
        case ETheme.LIGHT:
            return "mdi-white-balance-sunny";
        case ETheme.DARK:
            return "mdi-moon-waxing-crescent";
        default:
            return "mdi-laptop";
    }
};
</script>
