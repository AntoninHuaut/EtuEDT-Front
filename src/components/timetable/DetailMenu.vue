<template>
  <v-menu
    v-model="selectedOpen"
    :close-on-content-click="false"
    :activator="selectedElement"
    offset-x
  >
    <v-card color="grey lighten-4" min-width="350px" flat>
      <v-toolbar :color="selectedEvent.color" dark>
        <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <div v-html="selectedEvent.location"></div>
        <div v-html="selectedEvent.enseignant"></div>
        <v-divider class="mt-2 mb-2"></v-divider>
        <div v-html="formatDescription(selectedEvent)"></div>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  data: () => ({
    selectedOpen: false,
    selectedElement: null,
    selectedEvent: {},
  }),
  mounted() {
    this.$root.$on("timetable-update", (get) => {
      if (get.type === "showEvent") this.showEvent(get.value);
    });
  },
  methods: {
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    formatDescription(event) {
      if (!event.description) return;

      return event.description
        .replace(event.enseignant, "")
        .trim()
        .replace(/(?:\r\n|\r|\n)/g, "<br />");
    },
  },
};
</script>