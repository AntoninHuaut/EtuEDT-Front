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

const backToUnivList = async () => {
    const resetTimetableContext = {
        adeResources: undefined,
        adeUrl: undefined,
        resourceType: "timetable" as const,
    };

    if (route.name === "Rooms") {
        appStore.$patch(resetTimetableContext);
        await router.push({ name: "Home" });
        return;
    }

    if (appStore.groupId !== undefined) {
        appStore.$patch({ groupId: undefined, ...resetTimetableContext });
        return;
    }

    appStore.$patch({ numUniv: undefined, groupId: undefined, ...resetTimetableContext });

};
</script>
