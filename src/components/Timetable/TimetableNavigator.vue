<template>
  <v-row justify="space-between" class="align-center">
    <v-col :cols="xs ? '12' : 'auto'" class="d-flex justify-center">
      <v-row justify="space-between" class="align-center px-3 pl-3">
        <v-col :cols="xs ? '12' : 'auto'" class="d-flex justify-center px-0 py-0">
          <v-tooltip text="💡 [Espace]" open-delay="350">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" variant="outlined" density="default" :size="getBtnSize()" class="mr-3"
                @click="() => setDate(null, 'today')">
                Aujourd'hui
              </v-btn>
            </template>
          </v-tooltip>

          <p id="timetableName" :class="xs ? 'mx-0' : 'text-h6 mx-2'">{{ timetableData.nameTT }}</p>

          <v-tooltip text="💡 [Flèche/swipe gauche]" open-delay="350">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" variant="text" density="comfortable" :size="getBtnSize()" icon="mdi-chevron-left"
                @click="() => setDate(null, 'prev')" />
            </template>
          </v-tooltip>
          <v-tooltip text="💡 [Flèche/swipe droit]" open-delay="350">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" variant="text" density="comfortable" :size="getBtnSize()" icon="mdi-chevron-right"
                @click="() => setDate(null, 'next')" />
            </template>
          </v-tooltip>
        </v-col>

        <v-col :cols="xs ? '12' : 'auto'" class="d-flex justify-center px-0 py-1">
          <p :class="xs ? 'mx-0' : 'text-h6 mx-2'"> {{ getDisplayedDate(timetableViewStore.calDate) }}</p>
        </v-col>
      </v-row>
    </v-col>

    <v-col :cols="xs ? '12' : 'auto'" :class="'d-flex justify-center ' + (xs ? 'mt-0 pt-0' : 'pl-0 pr-3 py-2')">
      <v-tooltip text="💡 [W]" open-delay="350">
        <template v-slot:activator="{ props }">
          <v-btn-toggle v-bind="props" v-model="timetableViewStore.viewMode" variant="text" color="blue accent-2" density="compact"
            mandatory group>
            <v-btn :size="getBtnSize()" value="day" @click="() => setDate(null, 'today')">Jour</v-btn>
            <v-btn :size="getBtnSize()" value="week">Semaine</v-btn>
            <v-btn :size="getBtnSize()" value="month-grid">Mois</v-btn>
          </v-btn-toggle>
        </template>
      </v-tooltip>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { onKeyStroke, useSwipe } from "@vueuse/core";
import { watch } from "vue";
import { useDisplay } from "vuetify";
import { useDateHelper } from "@/hooks/useDateHelper";
import { useTimetable } from "@/hooks/useTimetable";
import { useTimetableViewStore } from "@/store";

const timetableData = useTimetable();
const timetableViewStore = useTimetableViewStore();
const dateHelper = useDateHelper();
const { xs } = useDisplay();
const { isSwiping, direction } = useSwipe(document.body);

function getBtnSize() {
	return xs.value ? "small" : undefined;
}

function setDate(
	evt: KeyboardEvent | null,
	navigationType: "prev" | "today" | "next",
) {
	evt?.preventDefault();

	let newCalDate: Temporal.PlainDate;
	if (navigationType === "today") {
		newCalDate = Temporal.Now.zonedDateTimeISO().toPlainDate();
	} else {
		const invertIfPrev = navigationType === "prev" ? -1 : 1;

		switch (timetableViewStore.viewMode) {
			case "month-grid":
				newCalDate = timetableViewStore.calDate.add({
					months: 1 * invertIfPrev,
				});
				break;
			case "week":
				newCalDate = timetableViewStore.calDate.add({
					days: 7 * invertIfPrev,
				});
				break;
			case "day":
				newCalDate = timetableViewStore.calDate.add({
					days: 1 * invertIfPrev,
				});
				break;
			default:
				return;
		}
	}

	newCalDate = dateHelper.skipWeekend(newCalDate, navigationType);
	timetableViewStore.$patch({ calDate: newCalDate });
}

function getDisplayedDate(date: Temporal.PlainDate) {
	return date
		.toLocaleString(navigator.language, {
			month: "long",
			year: "numeric",
		})
		.replace(/^\w/, (c) => c.toUpperCase());
}

function setView(view: "day" | "week" | "month-grid") {
	timetableViewStore.$patch({ viewMode: view });
}

watch(isSwiping, (isSwiping) => {
	if (isSwiping) {
		if (direction.value === "left") setDate(null, "next");
		else if (direction.value === "right") setDate(null, "prev");
	}
});

onKeyStroke(["w", "W"], (_e) => {
	switch (timetableViewStore.viewMode) {
		case "day":
			setView("week");
			break;
		case "week":
			setView("month-grid");
			break;
		case "month-grid":
			setView("day");
			break;
	}
});

onKeyStroke("ArrowLeft", (e) => setDate(e, "prev"));
onKeyStroke("ArrowRight", (e) => setDate(e, "next"));
onKeyStroke(" ", (e) => setDate(e, "today"));
</script>

<style scoped>
#timetableName {
  margin-top: 2px;
}
</style>
