<template>
  <v-snackbar color="error" top :timeout="timeout" v-model="error">
    Une erreur est survenue pendant la récupération des données
    <router-link to="/">
      <v-btn text>Retour</v-btn>
    </router-link>
  </v-snackbar>
</template>

<script>
export default {
  data: () => ({
    error: false,
    timeout: -1,
  }),
  mounted: function () {
    this.$root.$on("error", (boolean) => (this.error = boolean));
  },
  methods: {
    backHome() {
      this.$router.push({ path: "/" });
    },
  },
};
</script>