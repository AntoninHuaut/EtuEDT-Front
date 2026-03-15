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
import { useDisplay } from "vuetify";
import SelectRoom from "@/components/Home/SelectRoom.vue";

const { mdAndDown } = useDisplay();
</script>