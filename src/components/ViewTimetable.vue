<template>
  <v-container fluid>
    <v-row justify="space-between">
      <v-col :cols="$vuetify.breakpoint.lg || $vuetify.breakpoint.xl ? '6': '12'">
        <v-row justify="center" align="center">
          <v-btn outlined color="grey darken-2" class="mr-5" @click="setToday">Aujourd'hui</v-btn>
          <v-toolbar-title>{{edt ? edt.edtName : ''}}</v-toolbar-title>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </v-col>

      <v-col
        :class="'text-center ' + ($vuetify.breakpoint.lg || $vuetify.breakpoint.xl ? '': 'd-none')"
        :cols="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm ? '12': '6'"
      >
        <v-btn-toggle mandatory dense v-model="type" tile color="deep-purple accent-3" group>
          <v-btn @click="type = 'day'" value="day">Jour</v-btn>
          <v-btn @click="type = 'week'" value="week">Semaine</v-btn>
          <v-btn @click="type = 'month'" value="month">Mois</v-btn>
          <v-btn @click="type = '4day'" value="4day">4 Jours</v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
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
          <v-row>
            <v-col class="pt-0 pb-0">
              <span class="font-weight-medium">{{ event.title }}</span>
            </v-col>
            <v-col class="pt-0 pb-0 text-right">
              <span class="caption">{{ event.location }}</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pt-0 pb-0">
              <span class="caption">{{ formatDate(event.start) }} - {{ formatDate(event.end) }}</span>
            </v-col>
            <v-col class="pt-0 pb-0 text-right">
              <span bottom class="pr-1 caption font-italic font-weight-light">{{ event.enseignant }}</span>
            </v-col>
          </v-row>
        </div>
      </template>
    </v-calendar>
  </v-container>
</template>

<script>
import moment from "moment";

export default {
  data: () => ({
    edt: undefined,
    colors: {
      availableColors: [
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
        "blue-grey",
        "light-green",
        "lime",
        "amber"
      ],
      colorsList: [],
      mats: { increment: 0 }
    },
    handleTouch: {
      xDown: undefined,
      yDown: undefined
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
    this.onWindowResize();

    this.colors.availableColors.forEach(color =>
      this.colors.colorsList.push(color + " lighten-3")
    );

    const edtId = this.$route.params.edtId || localStorage.edtId;

    fetch(`https://maner.fr:3008/${edtId}`)
      .then(res => res.json())
      .then(res => (this.edt = res))
      .catch(() => this.$root.$emit("error", true));

    fetch(`https://maner.fr:3008/${edtId}/json`)
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

    window.addEventListener("resize", this.onWindowResize);
    document.addEventListener("keydown", this.onKeyPress);
    document.addEventListener("touchstart", this.handleTouchStart, false);
    document.addEventListener("touchmove", this.handleTouchMove, false);
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
    },
    onKeyPress(key) {
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
    },
    onWindowResize() {
      console.log("resize", this.$vuetify.breakpoint.name);
      if (["xs", "sm", "md"].includes(this.$vuetify.breakpoint.name))
        this.type = "day";
    },
    handleTouchStart(evt) {
      const firstTouch = evt.touches[0];
      this.handleTouch.xDown = firstTouch.clientX;
      this.handleTouch.yDown = firstTouch.clientY;
    },
    handleTouchMove(evt) {
      if (!this.handleTouch.xDown || !this.handleTouch.yDown) return;
      let xUp = evt.touches[0].clientX;
      let yUp = evt.touches[0].clientY;
      let xDiff = this.handleTouch.xDown - xUp;
      let yDiff = this.handleTouch.yDown - yUp;
      this.handleTouch.xDown = undefined;
      this.handleTouch.yDown = undefined;

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff < 0) this.prev();
        else this.next();
      }
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