<template>
  <v-footer :app="!mobile" :height="64" class="bg-primary pa-1">
    <v-row justify="center" no-gutters>
      <v-col cols="12 text-center">
        <a :href="linkedinURL" class="text-body-1" target="_blank" rel="noopener noreferrer">Antonin Huaut</a>
      </v-col>

      <v-col cols="12 text-center text-body-2">
        <a :href="githubURL + 'EtuEDT-Back'" target="_blank" tag="button">
          <span>Back-end</span>
        </a>

        <a :href="githubURL" class="ml-2 mr-2" target="_blank" rel="noopener noreferrer">
          <v-icon size="24px" icon="mdi-github" />
        </a>

        <a :href="githubURL + 'EtuEDT-Front'" target="_blank">
          <span>Front-end</span>
        </a>
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
