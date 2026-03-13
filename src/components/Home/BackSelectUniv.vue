<template>
  <v-icon @click="backToUnivList" :class="'mt-3 mr-3 align-self-center ' + (theme.global.name.value === 'dark' ? 'text-white' : 'text-black')" icon="mdi-arrow-left-circle"
    v-bind="$attrs" />
</template>

<script lang="ts" setup>
import { useAppStore } from "@/store/";
import { useRoute, useRouter } from "vue-router";
import { useTheme } from "vuetify";

const appStore = useAppStore();
const theme = useTheme();
const route = useRoute();
const router = useRouter();
const backToUnivList = () => {
    if (route.name === "Rooms") {
        appStore.$patch({ adeResources: undefined, resourceType: "timetable", homeSelectionView: "timetable" });
        router.push({ name: "Home" });
        return;
    }

    if (appStore.groupId !== undefined) {
        appStore.$patch({ groupId: undefined, adeResources: undefined, resourceType: "timetable", homeSelectionView: "timetable" });
        return;
    }

    appStore.$patch({ numUniv: undefined, groupId: undefined, adeResources: undefined, resourceType: "timetable", homeSelectionView: "timetable" });
};
</script>
