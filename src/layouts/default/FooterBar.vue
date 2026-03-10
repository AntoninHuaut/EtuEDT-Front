<template>
  <v-footer :app="!mobile" :height="64" class="bg-primary pa-1">
    <v-row justify="center" no-gutters>
      <v-col cols="12" class="text-center">
        <router-link to="/contributors" class="text-body-2 d-flex align-center justify-center">
          <v-icon size="24px" icon="mdi-github" class="mr-2" />
          <span>Open Source</span>
        </router-link>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script lang="ts" setup>
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const linkedinURL = "https://www.linkedin.com/in/antonin-huaut/";
const githubURL = "https://github.com/AntoninHuaut/";
</script>

<style scoped>
a {
  text-decoration: none;
  color: inherit;
}
</style>
