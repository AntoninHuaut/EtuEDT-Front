<template>
  <v-container fluid>
    <v-row class="text-center">
      <v-snackbar color="error" v-model="snackbar">
        Une erreur est survenue pendant la récupération des données
        <v-btn text @click="snackbar = false;">Fermer</v-btn>
      </v-snackbar>

      <v-col
        class="mx-auto mb-5"
        :cols="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm ? '': '6'"
      >
        <span class="display-1">Veuillez sélectionner l'établissement :</span>

        <v-divider class="mt-3"></v-divider>

        <v-col class="mx-auto" v-for="(univ, i) in univList" :key="univ.numUniv">
          <v-row justify="center">
            <v-btn
              x-large
              :class="{'subtitle-1 pl-12 pr-12': $vuetify.breakpoint.lg || $vuetify.breakpoint.xl}"
              :color="colorList[i]"
              @click="selectUniv(univ.numUniv)"
              dark
            >{{univ.nameUniv}}</v-btn>
          </v-row>
        </v-col>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      snackbar: false,
      univList: [],
      colorList: [
        "blue darken-3",
        "blue",
        "green darken-2",
        "green lighten-1",
        "orange darken-2",
        "orange lighten-1",
      ],
    };
  },
  methods: {
    selectUniv(numUniv) {
      localStorage.numUniv = numUniv;
      this.$root.$emit("updateStorage", {
        path: "numUniv",
        value: numUniv,
      });
    },
  },
  mounted() {
    fetch(this.apiBaseUrl)
      .then((res) => res.json())
      .then((univList) => {
        this.univList = univList;
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
        this.snackbar = true;
      });
  },
};
</script>