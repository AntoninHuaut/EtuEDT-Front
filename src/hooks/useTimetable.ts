import { useQuery } from "@tanstack/vue-query";
import { computed, type Ref, unref } from "vue";
import { buildResourceDetailsRequest } from "@/api/resourceRequestFactory";
import { queryKeys } from "@/hooks/queries/queryKeys";
import { useAppStore } from "@/store";
import type { IRoom, ITimetable } from "@/types/APIType";
import { getTimetableName } from "@/utils/timetable";
import { wrapFetch } from "@/utils/wrapFetch";

interface UseTimetableOptions {
	enabled?: boolean | Ref<boolean>;
}

export const useTimetable = (options?: UseTimetableOptions) => {
	const appStore = useAppStore();
	const queryEnabled = computed(() => {
		const enabled = options?.enabled;
		return (
			appStore.canLoadSelectedResource &&
			(enabled === undefined || Boolean(unref(enabled)))
		);
	});

	const ttQuery = useQuery<ITimetable | IRoom>({
		queryKey: computed(() =>
			queryKeys.timetable(
				appStore.numUniv,
				appStore.groupId,
				appStore.adeResources,
				appStore.resourceType,
			),
		),
		queryFn: ({ signal }) => {
			const selectedResource = appStore.selectedResource;

			if (!selectedResource) {
				throw new Error("Missing selected resource");
			}

			return wrapFetch({
				...buildResourceDetailsRequest(selectedResource),
				signal,
			});
		},
		enabled: queryEnabled,
	});

	const timetable = computed(() => ttQuery.data.value);

	const nameTT = computed(() =>
		getTimetableName(timetable.value, appStore.resourceType),
	);
	const lastUpdate = computed(() => timetable.value?.lastUpdate ?? "");
	const adeUrl = computed(() => timetable.value?.adeUrl);
	const isLoading = computed(
		() => ttQuery.isLoading.value || ttQuery.isFetching.value,
	);
	const error = computed(() => ttQuery.error.value);

	return {
		nameTT,
		lastUpdate,
		adeUrl,
		isLoading,
		error,
	};
};
