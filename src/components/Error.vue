<template>
  <v-container v-if="error" fluid fill-height>
    <v-row align="center" justify="center">
      <v-alert type="error">
        Une erreur est survenue pendant la récupération des données
        <router-link to="/">
          <v-btn text>Fermer</v-btn>
        </router-link>
      </v-alert>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    error: false
  }),
  mounted: function() {
    this.$root.$on("error", boolean => (this.error = boolean));
  }
};
</script>