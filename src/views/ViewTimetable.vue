<template>
  <div>
    <Error />
    <Loader />
    <ViewTimetable />
  </div>
</template>

<script>
import Error from "@/components/Error.vue";
import Loader from "@/components/Loader.vue";
import ViewTimetable from "@/components/ViewTimetable.vue";

export default {
  name: "Home",
  components: {
    Error,
    Loader,
    ViewTimetable
  }
};
</script>
