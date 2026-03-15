<template>
  <v-container fluid class="full-height">
    <v-row class="text-center">
      <v-col class="mx-auto" :cols="mdAndDown ? '12' : '6'">
        <SelectRoom />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import SelectRoom from "@/components/Home/SelectRoom.vue";
import { useDisplay } from "vuetify";

const { mdAndDown } = useDisplay();
</script>