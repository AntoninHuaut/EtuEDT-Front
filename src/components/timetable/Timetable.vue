<template>
  <v-container fluid>
    <v-row justify="space-between">
      <v-col :cols="this.$isMobile() ? '12': '6'">
        <v-row class="ml-0" :justify="this.$isMobile() ? 'center': 'left'" align="center">
          <v-btn
            outlined
            color="grey darken-2"
            class="mr-5"
            @click="emitCalendarUpdate('setToday')"
          >Aujourd'hui</v-btn>
          <v-toolbar-title>{{edt ? edt.edtName : 'N/A'}}</v-toolbar-title>
          <v-btn fab text small color="grey darken-2" @click="emitCalendarUpdate('prev')">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="emitCalendarUpdate('next')">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </v-col>

      <v-col
        :class="'text-right mr-0 ' + (this.$isMobile() ? 'd-none': '')"
        :cols="this.$isMobile() ? '12': '6'"
      >
        <v-btn-toggle mandatory dense v-model="type" tile color="blue accent-2" group>
          <v-btn @click="setViewType('day')" value="day">Jour</v-btn>
          <v-btn @click="setViewType('week')" value="week">Semaine</v-btn>
          <v-btn @click="setViewType('month')" value="month">Mois</v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <slot name="calendar"></slot>

    <v-snackbar color="light-blue" top timeout="4500" v-model="lastRefresh">
      Dernière mise à jour de l'emploi du temps le {{!edt ? 'N/A' : formatDate(edt.lastUpdate, 'DD/MM/YYYY HH[h]mm')}}
      <v-btn text @click="lastRefresh = false;">Fermer</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import moment from "moment";

export default {
  data: () => ({
    edt: undefined,
    type: "week",
    lastRefresh: false
  }),
  mounted() {
    const edtId = this.$route.params.edtId || localStorage.edtId;

    fetch(`https://edtapi.maner.fr/${edtId}`)
      .then(res => res.json())
      .then(res => {
        this.edt = res;
        this.lastRefresh = true;
      })
      .catch(() => this.$root.$emit("error", true));

    this.$root.$on("timetable-update", get => {
      switch (get.type) {
        case "updateViewType":
          return (this.type = get.value);
      }
    });

    this.setViewType(this.type);
  },
  methods: {
    setViewType(viewType) {
      this.type = viewType;
      this.emitCalendarUpdate("updateViewType", viewType);
    },
    emitCalendarUpdate(type, value = undefined) {
      this.$root.$emit("calendar-update", {
        type: type,
        value: value
      });
    },
    formatDate(date, format) {
      return moment(date).format(format);
    }
  }
};
</script>