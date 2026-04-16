import { useQuery } from "@tanstack/vue-query";
import { computed, type Ref, unref } from "vue";
import { buildResourceDetailsRequest } from "@/api/resourceRequestFactory";
import {
	getSelectedResourceFromIdentity,
	getSelectedResourceIdentity,
	queryKeys,
	type SelectedResourceIdentity,
} from "@/hooks/queries/queryKeys";
import { useAppStore } from "@/store";
import type { IRoom, ITimetable } from "@/types/APIType";
import { getTimetableName } from "@/utils/timetable";
import { wrapFetch } from "@/utils/wrapFetch";

interface UseTimetableOptions {
	enabled?: boolean | Ref<boolean>;
}

export const useTimetable = (options?: UseTimetableOptions) => {
	const appStore = useAppStore();
	const selectedResource = computed(() => appStore.selectedResource);
	const selectedResourceIdentity = computed(() =>
		getSelectedResourceIdentity(selectedResource.value),
	);
	const queryEnabled = computed(() => {
		const enabled = options?.enabled;
		return (
			selectedResource.value !== undefined &&
			(enabled === undefined || Boolean(unref(enabled)))
		);
	});
	const timetableQueryKey = computed(() =>
		queryKeys.timetable(selectedResourceIdentity.value),
	);

	const ttQuery = useQuery<ITimetable | IRoom>({
		queryKey: timetableQueryKey,
		queryFn: ({ signal, queryKey }) => {
			const [, ...identity] = queryKey as ReturnType<
				typeof queryKeys.timetable
			>;
			const resourceSelection = getSelectedResourceFromIdentity(
				identity as SelectedResourceIdentity,
			);

			if (!resourceSelection) {
				throw new Error("Missing selected resource");
			}

			return wrapFetch({
				...buildResourceDetailsRequest(resourceSelection),
				signal,
			});
		},
		enabled: queryEnabled,
	});

	const timetable = computed(() => ttQuery.data.value);
	const currentResourceType = computed(
		() => selectedResource.value?.resourceType ?? appStore.resourceType,
	);

	const nameTT = computed(() =>
		getTimetableName(timetable.value, currentResourceType.value),
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
