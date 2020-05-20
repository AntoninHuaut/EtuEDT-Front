<template>
  <v-row v-if="!loading">
    <v-col>
      <v-toolbar flat color="white">
        <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">Aujourd'hui</v-btn>
        <v-btn fab text small color="grey darken-2" @click="prev">
          <v-icon small>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn fab text small color="grey darken-2" @click="next">
          <v-icon small>mdi-chevron-right</v-icon>
        </v-btn>
        <v-toolbar-title>{{toolBar.edt ? toolBar.edt.edtName : ''}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-menu :open-on-hover="toolBar.openOnHover" bottom right>
          <template v-slot:activator="{ on }">
            <v-btn outlined color="grey darken-2" v-on="on">
              <span>{{ toolBar.typeToLabel[type] }}</span>
              <v-icon right>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="type = 'day'">
              <v-list-item-title>Jour</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'week'">
              <v-list-item-title>Semaine</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'month'">
              <v-list-item-title>Mois</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = '4day'">
              <v-list-item-title>4 Jours</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
      <v-calendar
        ref="calendar"
        v-model="focus"
        :value="today"
        :events="events"
        :locale="locale"
        :short-weekdays="shortWeekdays"
        :weekdays="weekdays"
        :max-days="maxDays"
        :first-interval="firstInterval"
        :event-color="getEventColor"
        :type="type"
        :now="today"
      >
        <template v-slot:event="{event}">
          <div class="pr-1 pl-1 black--text">
            <div class="d-flex justify-space-between">
              <span class="font-weight-medium">{{ event.title }}</span>
              <span class="caption">{{ event.location }}</span>
            </div>
            <div class="d-flex justify-space-between">
              <span class="caption">{{ formatDate(event.start) }} - {{ formatDate(event.end) }}</span>
              <span class="caption font-italic font-weight-light">{{ event.enseignant }}</span>
            </div>
          </div>
        </template>
      </v-calendar>
    </v-col>
  </v-row>
</template>

<script>
import moment from "moment";

export default {
  data: () => ({
    toolBar: {
      openOnHover: true,
      edt: undefined,
      typeToLabel: {
        month: "Mois",
        week: "Semaine",
        day: "Jour",
        "4day": "4 Jours"
      }
    },
    colors: {
      colorsList: [],
      mats: { increment: 0 }
    },

    shortWeekdays: false,
    weekdays: [1, 2, 3, 4, 5],
    maxDays: 5,
    firstInterval: 8,
    locale: "fr",
    format: "YYYY-MM-DD HH:mm",

    loading: true,
    type: "week",
    focus: "",
    today: undefined,
    events: []
  }),
  mounted() {
    const colors = [
      "red",
      "pink",
      "purple",
      "deep-purple",
      "indigo",
      "blue",
      "light-blue",
      "cyan",
      "teal",
      "green",
      "orange",
      "deep-orange",
      "brown",
      "blue-grey"
    ];
    colors.forEach(color => this.colors.colorsList.push(color + " lighten-3"));
    ["light-green", "lime", "amber"].forEach(color =>
      this.colors.colorsList.push(color + " lighten-2")
    );

    fetch(`https://maner.fr:3008/${localStorage.edtId}`)
      .then(res => res.json())
      .then(res => (this.toolBar.edt = res))
      .catch(() => this.$root.$emit("error", true));

    fetch(`https://maner.fr:3008/${localStorage.edtId}/json`)
      .then(res => res.json())
      .then(res => {
        res = res.map(item => {
          item.name = item.title;
          item.start = moment(item.start).format(this.format);
          item.end = moment(item.end).format(this.format);
          item.color = this.getColorMatiere(item.title);
          return item;
        });

        this.events = res;
        this.today = moment().format(this.format);
      })
      .catch(() => this.$root.$emit("error", true))
      .finally(() => {
        this.loading = false;
        this.$root.$emit("loader", false);
      });

    document.addEventListener("keydown", key => {
      switch (key.keyCode) {
        case 37:
          this.prev();
          break;

        case 39:
          this.next();
          break;

        case 17:
          this.setToday();
          break;
      }
    });
  },
  methods: {
    setToday() {
      this.focus = this.today;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    getEventColor(event) {
      return event.color;
    },
    getColorMatiere(mat) {
      mat = mat.replace(/ /g, "");
      ["TD", "TP", "CM", "CC", "CTP"].forEach(
        get => (mat = mat.replace(get, ""))
      );

      if (!this.colors.mats[mat]) {
        if (this.colors.mats.increment >= this.colors.colorsList.length)
          this.colors.mats.increment = 0;

        this.colors.mats[mat] = this.colors.colorsList[
          this.colors.mats.increment++
        ];
      }

      return this.colors.mats[mat];
    },
    formatDate(date) {
      return moment(date).format("HH[h]mm");
    }
  }
};
</script>

<style lang="scss">
.v-calendar .v-event-timed {
  font-size: 14px !important;
  font-weight: normal !important;
}
</style>