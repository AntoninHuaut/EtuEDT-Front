<template>
  <v-container fluid>
    <v-row class="text-center">
      <v-snackbar color="error" v-model="snackbar">
        Une erreur est survenue pendant la récupération des données
        <v-btn text @click="snackbar = false;">Fermer</v-btn>
      </v-snackbar>

      <v-col class="mx-auto mb-5" :cols="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm ? '' : '6'">
        <span class="display-1">Veuillez sélectionner un emploi du temps :</span>

        <v-divider class="mt-3"></v-divider>

        <v-col class="mx-auto">
          <h2 class="mt-3 mb-1">{{ nameUniv }}</h2>
          <v-row justify="center">
            <v-col :cols="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm ? '6' : '4'" class="mx-auto" v-for="(year) in ttsInfo.yearList"
              :key="year">
              <h2 class="font-weight-regular">Année {{ year }} :</h2>
              <v-col class="pt-2 pb-1 mx-auto" v-for="(timetable, i) in ttsInfo.ttsByYear[year]" :key="timetable.adeResources">
                <router-link :to="`/edt/${timetable.numUniv}/${timetable.adeResources}`" tag="button">
                  <v-btn x-large :class="{ 'subtitle-1 pl-12 pr-12': $vuetify.breakpoint.lg || $vuetify.breakpoint.xl }" :color="colorList[i]"
                    @click="selectEDT(timetable.adeResources)" dark>{{ timetable.nameTT }}</v-btn>
                </router-link>
              </v-col>
            </v-col>
          </v-row>
        </v-col>
      </v-col>
    </v-row>

    <v-col class="text-center mx-auto mb-5" :cols="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm ? '' : '6'">
      <v-btn :class="{ 'subtitle-1 pl-12 pr-12': $vuetify.breakpoint.lg || $vuetify.breakpoint.xl }" @click="requestPage('SelectUniv')">
        Retour à la sélection de l'établissement
      </v-btn>
    </v-col>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      snackbar: false,
      ttsInfo: {
        ttsByYear: [],
        yearList: [],
      },
      nameUniv: "",
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
    selectEDT(adeResources) {
      localStorage.adeResources = adeResources;
      this.$root.$emit("updateStorage", {
        path: "adeResources",
        value: adeResources,
      });
    },
    requestPage(page) {
      this.$root.$emit("requestPage", {
        path: page,
      });
    },
  },
  mounted() {
    fetch(`${this.apiBaseUrl}${localStorage.numUniv}`)
      .then((res) => res.json())
      .then((ttList) => {
        if (!ttList || ttList.length < 1) return;

        this.ttsInfo.ttsByYear = ttList.reduce(function (r, a) {
          r[a.numYearTT] = r[a.numYearTT] || [];
          r[a.numYearTT].push(a);
          return r;
        }, Object.create(null));
        this.ttsInfo.yearList = Object.keys(this.ttsInfo.ttsByYear);

        this.nameUniv = ttList[0].nameUniv;
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
        this.snackbar = true;
      });
  },
};
</script>