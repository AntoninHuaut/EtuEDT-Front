<template>
  <v-calendar
    v-if="!loading"
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
    @click:day="clickDay"
    @click:date="clickDay"
    @click:more="clickDay"
    @click:time="clickDay"
  >
    <template v-slot:event="{event}">
      <!-- Default view / Mobile view (day) -->
      <div v-if="!$isMobile() || type == 'day'" class="pr-1 pl-1 black--text">
        <v-row class="text-wrap">
          <v-col class="pt-0 pb-0">
            <span class="font-weight-medium">{{ event.title }}</span>
          </v-col>
          <v-col class="pt-0 pb-0 text-right">
            <span class="caption">{{ event.location }}</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pt-0 pb-0">
            <span
              class="caption"
            >{{ formatDate(event.start, 'HH[h]mm') }} - {{ formatDate(event.end, 'HH[h]mm') }}</span>
          </v-col>
          <v-col class="pt-0 pb-0 text-right">
            <span bottom class="pr-1 caption font-italic font-weight-light">{{ event.enseignant }}</span>
          </v-col>
        </v-row>
      </div>

      <!-- Mobile view (week) -->
      <div v-else-if="type == 'week'" class="pl-1 pr-1 black--text">
        <v-row class="text-wrap">
          <v-col cols="12" class="line-height-mobile pt-0 pb-0">
            <span :style="getSizeByScreen(event.title)">{{ event.title }}</span>
          </v-col>
          <v-col cols="12" class="line-height-mobile pt-1 pb-0">
            <span
              v-if="type !== 'month'"
              :style="getSizeByScreen(event.location, 1)"
            >{{ event.location }}</span>
          </v-col>
          <v-col v-if="!$vuetify.breakpoint.xs" cols="12" class="pt-0 pb-0">
            <span
              :style="getSizeByScreen()"
            >{{ formatDate(event.start, 'HH[h]mm') }} - {{ formatDate(event.end, 'HH[h]mm') }}</span>
          </v-col>
        </v-row>
      </div>

      <!-- Mobile view (month) -->
      <div v-else class="pl-1 pr-1 black--text">
        <v-row class="text-wrap">
          <v-col cols="12" class="line-height-mobile pt-1 pb-0">
            <span :style="getSizeByScreen(event.title, 1.5)">{{ event.title }}</span>
          </v-col>
        </v-row>
      </div>
    </template>
  </v-calendar>
</template>

<script>
import moment from "moment";

export default {
  data: () => ({
    eventStyle: {
      matHashCode: {},
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
    type: undefined,
    focus: "",
    today: undefined,
    events: []
  }),
  mounted() {
    this.eventStyle.availableColors.forEach(color =>
      this.eventStyle.colorsList.push(color + " lighten-3")
    );

    const edtId = this.$route.params.edtId || localStorage.edtId;

    const today = moment();

    /* Skip weekends */
    const dayNum = today.days();
    if (dayNum == 6) today.add(2, "days");
    else if (dayNum == 0) today.add(1, "days");
    /* */

    this.today = today.format(this.format);
    this.setToday();

    fetch(`https://edtapi.maner.fr/${edtId}/json`)
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
      })
      .catch(() => this.$root.$emit("error", true))
      .finally(() => {
        this.$root.$emit("loader-update", false);
        this.loading = false;
      });

    this.$nextTick(() => {
      this.initWindowsSize();
    });

    document.addEventListener("keydown", this.onKeyPress);
    document.addEventListener("touchstart", this.handleTouchStart, false);
    document.addEventListener("touchmove", this.handleTouchMove, false);

    this.$root.$on("calendar-update", get => {
      switch (get.type) {
        case "setToday":
          return this.setToday();
        case "prev":
          return this.prev();
        case "next":
          return this.next();
        case "updateViewType":
          return (this.type = get.value);
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
    clickDay(event) {
      this.setViewType("day");
      this.focus = moment(event.date).format(this.format);
    },
    setViewType(viewType) {
      this.type = viewType;
      this.$root.$emit("timetable-update", {
        type: "updateViewType",
        value: viewType
      });
    },
    getColorMatiere(mat) {
      mat = mat.replace(/ /g, "");
      ["TD", "TP", "CM", "CC", "CTP"].forEach(
        get => (mat = mat.replace(get, ""))
      );

      if (!this.eventStyle.matHashCode[mat]) {
        const matHashCode = mat
          .split("")
          .reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);

        this.eventStyle.matHashCode[mat] = {
          index: Math.abs(matHashCode) % this.eventStyle.colorsList.length
        };
      }

      return this.eventStyle.colorsList[this.eventStyle.matHashCode[mat].index];
    },
    formatDate(date, format) {
      return moment(date).format(format);
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
    emitTimetableUpdate(type, value = undefined) {
      this.$root.$emit("timetable-update", {
        type: type,
        value: value
      });
    },
    initWindowsSize() {
      if (this.$isMobile()) this.setViewType("day");
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
    },
    getSizeByScreen(txt = "", penalty = 0) {
      if (this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm) {
        if (this.$vuetify.breakpoint.xs) penalty += 1.5;
        if (txt.length > 15) penalty += 1;
      }

      const fontSize = 10 - penalty;
      return `font-size: ${fontSize}px;`;
    }
  }
};
</script>

<style lang="scss">
.line-height-mobile {
  line-height: 0.85 !important;
}

.v-calendar .v-event-timed {
  font-size: 14px !important;
  font-weight: normal !important;
}
</style>