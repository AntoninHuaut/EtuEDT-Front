<template>
  <div class="home">
    <div v-if="showUnivPage">
      <SelectUniv />
    </div>
    <div v-else>
      <SelectTimetable />
    </div>
  </div>
</template>

<script>
import SelectUniv from "@/components/SelectUniv.vue";
import SelectTimetable from "@/components/SelectTimetable.vue";

export default {
  name: "Home",
  data() {
    return {
      showUnivPage: false,
      numUniv: null,
    };
  },
  mounted() {
    this.numUniv = localStorage.numUniv;
    if (!this.numUniv) this.showUnivPage = true;

    this.$root.$on("updateStorage", (get) => {
      if (get.path === "numUniv") this.showUnivPage = false;
    });

    this.$root.$on("requestPage", (get) => {
      if (get.path === "SelectUniv") this.showUnivPage = true;
    });
  },
  components: {
    SelectTimetable,
    SelectUniv,
  },
};
</script>
