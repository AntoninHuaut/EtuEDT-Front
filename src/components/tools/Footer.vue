<template>
  <v-footer class="flex primary" dark padless>
    <v-row justify="center" no-gutters class="pa-1">
      <v-col cols="12 text-center">
        <span class="body-1">Antonin Huaut</span>
      </v-col>

      <v-col cols="12 text-center body-2">
        <a :href="icons[0].url" class="white--text" target="_blank" tag="button">
          <span>{{ icons[0].text }}</span>
        </a>

        <a
          href="https://github.com/Manerr/"
          class="ml-2 mr-2 white--text"
          target="_blank"
          rel="noopener noreferrer"
        >
          <v-icon size="24px">{{ icons[1].icon }}</v-icon>
        </a>

        <a :href="icons[1].url" class="white--text" target="_blank">
          <span>{{ icons[1].text }}</span>
        </a>
      </v-col>
    </v-row>
  </v-footer>
</template>-

<script>
export default {
  data: () => ({
    icons: [
      {
        icon: "mdi-github",
        text: "Back-end",
        url: "https://github.com/Manerr/EtuEDT-Deno"
      },
      {
        icon: "mdi-github",
        text: "Front-end",
        url: "https://github.com/Manerr/EtuEDT-vue"
      }
    ]
  })
};
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>