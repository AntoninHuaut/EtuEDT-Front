<template>
  <div class="home">
    <SelectTimetable />

    <div align="center">
      <v-alert
        outlined
        type="warning"
        max-width="950"
        elevation="2"
      >Les synchronisations, effectuées avec l'ancienne version de l'application, ne fonctionnent plus. Elles doivent être recréées.</v-alert>
    </div>
  </div>
</template>

<script>
import SelectTimetable from "@/components/SelectTimetable.vue";

export default {
  name: "Home",
  components: {
    SelectTimetable
  }
};
</script>
