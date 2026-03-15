<template>
  <v-container>
    <v-card elevation="5" :width="Math.min(width, 830)" class="mt-3 mx-auto">
      <v-card-item class="mx-1 my-3">
        <v-card-title class="text-primary mb-2 text-wrap">À propos</v-card-title>
        <v-card-subtitle class="text-wrap">
          EtuEDT est un projet open-source créé par et pour les étudiants.
          Retrouvez ci-dessous les personnes ayant contribué au projet ainsi que les liens vers les dépôts GitHub.
        </v-card-subtitle>
      </v-card-item>

      <v-card-text>
        <v-row>
          <v-col v-for="contributor in contributors" :key="contributor.name" cols="12" sm="6" md="4">
            <v-card variant="flat" class="text-center pa-2">
              <v-avatar size="100" class="mx-auto mb-3">
                <v-img :src="contributor.avatar" :alt="contributor.name"></v-img>
              </v-avatar>
              <div class="text-h6">{{ contributor.name }}</div>
              <div class="text-caption">{{ getRoleText(contributor.role) }}</div>
              <v-card-actions class="justify-center">
                <v-btn v-if="contributor.github" icon="mdi-github" variant="text" :href="contributor.github" target="_blank"
                  rel="noopener noreferrer"></v-btn>
                <v-btn v-if="contributor.linkedin" icon="mdi-linkedin" variant="text" :href="contributor.linkedin" target="_blank"
                  rel="noopener noreferrer"></v-btn>
                <v-btn v-if="contributor.website" icon="mdi-web" variant="text" :href="contributor.website" target="_blank"
                  rel="noopener noreferrer"></v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-divider class="my-6"></v-divider>

        <div class="text-center mb-4">
          <div class="text-subtitle-1 mb-2">Code Source</div>
          <v-btn class="ma-2" prepend-icon="mdi-github" variant="tonal" href="https://github.com/AntoninHuaut/EtuEDT-Back" target="_blank"
            rel="noopener noreferrer">
            Back-end
          </v-btn>
          <v-btn class="ma-2" prepend-icon="mdi-github" variant="tonal" href="https://github.com/AntoninHuaut/EtuEDT-Front" target="_blank"
            rel="noopener noreferrer">
            Front-end
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { useDisplay } from "vuetify";

import { contributors } from "@/data/contributors";

const { width } = useDisplay();

function getRoleText(role: string): string {
	switch (role) {
		case "maintainer":
			return "Mainteneur";
		case "contributor":
			return "Contributeur";
		default:
			return role;
	}
}
</script>

<style scoped>
.v-card-title {
  font-size: 1.5rem !important;
  font-weight: 600;
}
</style>
