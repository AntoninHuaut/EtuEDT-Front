<template>
  <v-container fluid class="full-height">
    <v-row class="text-center">
      <v-col class="mx-auto" :cols="mdAndDown ? '12' : '6'">
        <SelectUniv v-if="toDisplay === 'selectUniv'" />
        <SelectGroup v-else-if="toDisplay === 'selectGroup'" />
        <SelectTimetable v-else-if="toDisplay === 'selectTimetable'" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import SelectGroup from "@/components/Home/SelectGroup.vue";
import SelectTimetable from "@/components/Home/SelectTimetable.vue";
import SelectUniv from "@/components/Home/SelectUniv.vue";
import { useAppStore } from "@/store/";
import { type Ref, ref, watchEffect } from "vue";
import { useDisplay } from "vuetify";

const { mdAndDown } = useDisplay();
const appStore = useAppStore();
const toDisplay: Ref<"selectUniv" | "selectGroup" | "selectTimetable"> = ref("selectUniv");

function displaySelectComponent(univ: number | undefined, groupId: number | undefined) {
    if (univ === undefined) {
        toDisplay.value = "selectUniv";
    } else if (groupId === undefined) {
        toDisplay.value = "selectGroup";
    } else {
        toDisplay.value = "selectTimetable";
    }
}

watchEffect(() => displaySelectComponent(appStore.numUniv, appStore.groupId));
</script>
