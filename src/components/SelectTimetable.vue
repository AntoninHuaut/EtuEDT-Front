<template>
  <v-container fluid>
    <v-row class="text-center">
      <v-snackbar color="error" v-model="snackbar">
        Une erreur est survenue pendant la récupération des données
        <v-btn text @click="snackbar = false;">Fermer</v-btn>
      </v-snackbar>

      <v-col
        :cols="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm ? '': '6'"
        class="mx-auto mb-5"
      >
        <span class="display-1">Veuillez sélectionner un emploi du temps :</span>

        <v-divider class="mt-3"></v-divider>

        <v-col class="mx-auto" v-for="(eta) in etaList" :key="eta.numEta">
          <h2 class="mt-3 mb-1">{{eta.nomEta}} :</h2>

          <v-row justify="center">
            <v-col cols="6" class="mx-auto" v-for="(annee) in eta.data" :key="annee.numAnnee">
              <h2 class="font-weight-regular">Année {{annee.numAnnee}} :</h2>
              <v-col class="pt-2 pb-1 mx-auto" v-for="(edt, i) in annee.data" :key="edt.edtId">
                <router-link :to="'/edt/' + edt.edtId">
                  <v-btn
                    x-large
                    :class="{'subtitle-1 pt-6 pb-6 pl-12 pr-12': $vuetify.breakpoint.lg || $vuetify.breakpoint.xl}"
                    :color="colorList[i]"
                    @click="selectEDT(edt.edtId)"
                    dark
                  >{{edt.edtName}}</v-btn>
                </router-link>
              </v-col>
            </v-col>
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
      etaList: [],
      colorList: [
        "blue darken-3",
        "blue",
        "green darken-2",
        "green lighten-1",
        "orange darken-2",
        "orange lighten-1"
      ]
    };
  },
  methods: {
    selectEDT(edtId) {
      localStorage.edtId = edtId;
    }
  },
  mounted() {
    fetch(`https://edt.maner.fr/data/`)
      .then(res => res.json())
      .then(edtList => {
        let etaList = [];

        edtList.forEach(item => {
          let itemEta = etaList.find(subItem => subItem.numEta == item.numEta);
          if (!itemEta)
            etaList.push({
              numEta: item.numEta,
              nomEta: item.nomEta,
              data: []
            });
          let indexEta = itemEta
            ? etaList.indexOf(itemEta)
            : etaList.length - 1;
          let dataAnnee = etaList[indexEta].data;

          let itemAnnee = dataAnnee.find(
            subItem => subItem.numAnnee == item.numAnnee
          );
          if (!itemAnnee)
            dataAnnee.push({
              numAnnee: item.numAnnee,
              data: []
            });
          let indexAnnee = itemAnnee
            ? dataAnnee.indexOf(itemAnnee)
            : dataAnnee.length - 1;
          dataAnnee[indexAnnee].data.push(item);
        });

        this.etaList = etaList;
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
        this.snackbar = true;
      });
  }
};
</script>