<template>
  <v-row class="align-center timetable-bar" :class="{ 'timetable-bar--stacked': smAndDown }" no-gutters>
    <v-col cols="12" sm="8" class="d-flex align-center flex-wrap" :class="{ 'justify-center': smAndDown }">
      <v-tooltip text="💡 [Espace]" open-delay="350">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="outlined"
            density="comfortable"
            :size="getBtnSize()"
			color="primary"
            id="today-label"
            @click="() => setDate(null, 'today')"
          >
            Aujourd'hui
          </v-btn>
        </template>
      </v-tooltip>

          <p id="date-label" class="title-label">{{ getDisplayedDate(timetableViewStore.calDate) }}</p>

      <v-tooltip text="💡 [Flèche/swipe gauche]" open-delay="350">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            density="compact"
            :size="getBtnSize()"
            icon="mdi-chevron-left"
            @click="() => setDate(null, 'prev')"
          />
        </template>
      </v-tooltip>

      <v-tooltip text="💡 [Flèche/swipe droit]" open-delay="350">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            density="compact"
            :size="getBtnSize()"
            icon="mdi-chevron-right"
            @click="() => setDate(null, 'next')"
          />
        </template>
      </v-tooltip>

       <p id="timetable-label" class="title-label">{{ timetableData.nameTT }}</p>
    </v-col>

    <v-col cols="12" sm="4" class="d-flex" :class="smAndDown ? 'justify-center mt-2' : 'justify-sm-end'">
      <v-tooltip text="💡 [W]" open-delay="350">
        <template #activator="{ props }">
          <v-btn-toggle
            v-bind="props"
            v-model="timetableViewStore.viewMode"
            variant="outlined"
            color="primary"
            density="compact"
            class="timetable-view-toggle"
            mandatory
          >
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
const { xs, smAndDown } = useDisplay();
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
	timetableViewStore.setCalDate(newCalDate);
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
	timetableViewStore.setViewMode(view);
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
#today-label {
  border-radius: 6px;
  font-size: 1rem;
  height: 36px;
  color: rgba(var(--v-theme-on-surface), 0.75); 
  border-color: rgba(var(--v-theme-primary), 0.75);
}

#timetable-label {
  margin: 0 0 0 8px;
  padding-top: 4px;
  padding-bottom: 4px;
}

#date-label {
  margin: 0 8px 0 12px;
}

.timetable-bar--stacked #timetable-label,
.timetable-bar--stacked #date-label {
	margin: 0 8px;
}

.title-label {
	font-size: 1.1rem;
	line-height: 1.2;
	font-weight: 500;
	color: rgba(var(--v-theme-on-surface), 0.75);
}

.timetable-view-toggle :deep(.v-btn) {
  font-size: 0.78rem;
}
</style>
