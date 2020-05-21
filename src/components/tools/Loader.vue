<template>
  <v-container v-if="loading" fluid fill-height>
    <v-col align="center" justify="center">
      <v-progress-circular :size="128" :width="10" color="primary" indeterminate></v-progress-circular>
      <div class="ma-5 display-1">Chargement ...</div>
    </v-col>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    loading: true
  }),
  mounted: function() {
    this.$root.$on("loader-update", boolean => (this.loading = boolean));
  }
};
</script>