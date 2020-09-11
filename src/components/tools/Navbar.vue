<template>
  <v-app-bar app color="primary" dark>
    <div class="d-flex align-center">
      <v-img
        alt="EtuEDT Logo"
        class="shrink mr-2"
        contain
        src="/favicon.ico"
        transition="scale-transition"
        width="40"
      />

      <router-link class="ml-2 mr-2" to="/swagger" tag="button">
        <v-icon class="mb-0">mdi-book-information-variant</v-icon>
      </router-link>

      <router-link class="ml-2 mr-0" to="/" tag="button">
        <span class="white--text title font-weight-regular">Accueil</span>
      </router-link>

      <router-link class="ml-5 mr-3" to="/faq" tag="button">
        <v-icon class="mb-1">mdi-sync</v-icon>
        <span class="white--text title font-weight-regular ml-1">Sync</span>
      </router-link>

      <router-link
        :class="($vuetify.breakpoint.xs ? 'd-none': '')"
        v-if="timetable"
        class="ml-5 mr-3"
        :to="'/edt/' + timetable.numUniv + '/' + timetable.adeResources"
        tag="button"
      >
        <span class="white--text title font-weight-regular">{{timetable.nameTT}}</span>
      </router-link>
    </div>

    <v-spacer></v-spacer>

    <div v-if="routeName === 'ViewTimetable' && timetable">
      <v-icon
        v-clipboard:copy="this.apiBaseUrl + timetable.numUniv + '/' + timetable.adeResources + '/ics'"
        v-clipboard:success="() => {copyData = true}"
        @click="setRouteName"
        large
      >mdi-link</v-icon>

      <v-snackbar color="light-blue" top timeout="5000" v-model="copyData">
        Le lien direct de l'emploi du temps a été copié dans le presse-papier
        <v-btn @click="copyData = false" text>Fermer</v-btn>
      </v-snackbar>
    </div>

    <div class="ml-3">
      <v-icon v-if="!dark" @click="toggle" large>mdi-white-balance-sunny</v-icon>
      <v-icon v-if="dark" @click="toggle" large>mdi-moon-waxing-crescent</v-icon>
    </div>
  </v-app-bar>
</template>

<script>
import {
  enable as enableDarkMode,
  disable as disableDarkMode,
  setFetchMethod,
} from "darkreader";

export default {
  data: () => ({
    routeName: undefined,
    copyData: false,
    timetable: undefined,
    dark: false,
  }),
  mounted() {
    this.updateTT(localStorage.numUniv, localStorage.adeResources);
    this.setRouteName();
    this.$root.$on("updateStorage", (get) => {
      if (get.path === "adeResources")
        this.updateTT(localStorage.numUniv, get.value);
    });

    this.dark = localStorage.dark == "true";
    setFetchMethod(window.fetch);
    this.setTheme();
  },
  watch: {
    $route: function () {
      this.setRouteName();
    },
  },
  methods: {
    setRouteName() {
      this.routeName = this.$router.history.current.name;
    },
    updateTT(numUniv, adeResources) {
      if (numUniv && adeResources) {
        fetch(`${this.apiBaseUrl}${numUniv}/${adeResources}`)
          .then((res) => res.json())
          .then((res) => {
            this.timetable = res;
            this.lastRefresh = true;
          })
          .catch(() => {});
      }
    },
    toggle() {
      this.$nextTick(() => {
        this.dark = !this.dark;
        localStorage.dark = this.dark;
        this.setTheme();
      });
    },
    setTheme() {
      this.dark ? enableDarkMode() : disableDarkMode();
    },
  },
};
</script>