<template>
  <div>
    <Error />

    <Timetable>
      <template v-slot:calendar>
        <Calendar />
      </template>
    </Timetable>

    <Loader />
  </div>
</template>

<script>
import Error from "@/components/tools/Error.vue";
import Calendar from "@/components/timetable/Calendar.vue";
import Loader from "@/components/tools/Loader.vue";
import Timetable from "@/components/timetable/Timetable.vue";

export default {
  name: "ViewTimeTable",
  components: {
    Error,
    Calendar,
    Loader,
    Timetable
  }
};
</script>
