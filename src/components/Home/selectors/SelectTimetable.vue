<template>
    <SelectHeader
        title="Choix de l'emploi du temps"
        :show-back="true"
        :action="{
            prependIcon: 'mdi-door-open',
            variant: 'tonal',
            color: 'primary',
            onClick: goToRooms,
            text: 'Salles',
        }"
    />

    <v-divider class="mt-3 mb-3"></v-divider>

    <SearchBarWithDebounce
		v-model="searchQuery"
		label="Rechercher un emploi du temps..."
		:is-debouncing="isDebouncing"
	/>

    <div class="d-flex flex-column">
        <SelectionLoadingBlock v-if="isInitialLoadingTimetables" />

		<div v-else>
			<UniversityTitle :title="univAndGroupTitle" />

			<v-row class="justify-center">
				<v-col
					v-for="yearGroup in timetablesByYear"
					:key="yearGroup.year"
					cols="12"
					sm="6"
					md="4"
					lg="3"
					class="px-5"
				>
					<p class="text-title-large mt-3 mb-1">{{ getYearTitle(yearGroup.year) }}</p>
					<v-row class="pt-2 pb-1 align-stretch timetable-grid-row" density="compact">
						<v-col
							v-for="(timetable, i) in yearGroup.timetables"
							:key="timetable.adeResources"
						:cols="smAndDown ? 6 : 12"
						class="px-1 d-flex timetable-grid-col"
					>
							<TimetableButton
								:timetable="timetable"
								:colorHex="colorList[i % colorList.length]"
							/>
						</v-col>
					</v-row>
				</v-col>
				<v-col v-if="filteredTimetables.length === 0" class="text-center mt-5">
					<p class="text-grey">Aucun emploi du temps trouvé</p>
				</v-col>
            </v-row>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query";
import { computed, watch } from "vue";
import { useDisplay } from "vuetify";
import { timetableListRequest } from "@/api/api_requests";
import { queryKeys } from "@/hooks/queries/queryKeys";
import { useQueryNotifications } from "@/hooks/useQueryNotifications";
import { useResourceSelection } from "@/hooks/useResourceSelection";
import { matchesSearchQuery, useSearch } from "@/hooks/useSearch";
import { useSelectionColors } from "@/hooks/useSelectionColors";
import { useAppStore } from "@/store";
import type { ITimetable } from "@/types/APIType";
import { getYearTitle } from "@/utils/timetable";
import { wrapFetch } from "@/utils/wrapFetch";
import TimetableButton from "../buttons/TimetableButton.vue";
import SearchBarWithDebounce from "../shared/SearchBarWithDebounce.vue";
import SelectHeader from "../shared/SelectHeader.vue";
import SelectionLoadingBlock from "../shared/SelectionLoadingBlock.vue";
import UniversityTitle from "../shared/UniversityTitle.vue";

const { smAndDown } = useDisplay();
const appStore = useAppStore();
const { goToRooms } = useResourceSelection();
const { colors: colorList } = useSelectionColors();

const { searchQuery, debouncedQuery, isDebouncing, clearSearch } = useSearch();

const timetableQuery = useQuery<ITimetable[]>({
	queryKey: queryKeys.timetableList(appStore.numUniv, appStore.groupId),
	queryFn: ({ signal }) =>
		wrapFetch({
			...timetableListRequest(appStore.numUniv ?? 0, appStore.groupId ?? 0),
			signal,
		}),
	enabled: computed(
		() => appStore.numUniv !== undefined && appStore.groupId !== undefined,
	),
});

const univAndGroupTitle = computed(() => {
	const universityName = appStore.univName ?? "";
	const groupName = appStore.groupName ?? "";
	return `${universityName} - ${groupName}`;
});

const filteredTimetables = computed(() => {
	return (timetableQuery.data.value ?? []).filter((tt) =>
		matchesSearchQuery(
			`${getYearTitle(tt.year)} ${tt.label}`,
			debouncedQuery.value,
		),
	);
});

const timetablesByYear = computed(() => {
	const byYear = new Map<number, ITimetable[]>();

	for (const timetable of filteredTimetables.value) {
		const yearTimetables = byYear.get(timetable.year);

		if (yearTimetables) {
			yearTimetables.push(timetable);
		} else {
			byYear.set(timetable.year, [timetable]);
		}
	}

	return [...byYear.entries()]
		.sort(([leftYear], [rightYear]) => leftYear - rightYear)
		.map(([year, timetables]) => ({ year, timetables }));
});

useQueryNotifications<ITimetable[]>({
	contextName: "Timetable List",
	getError: () => timetableQuery.error.value,
	getIsSuccess: () => timetableQuery.isSuccess.value,
	getData: () => timetableQuery.data.value,
});

watch(() => [appStore.numUniv, appStore.groupId], clearSearch);

const isInitialLoadingTimetables = computed(
	() => timetableQuery.isLoading.value,
);
</script>

<style scoped>
.timetable-grid-row {
    align-items: stretch;
}

.timetable-grid-col {
    align-self: stretch;
}
</style>
