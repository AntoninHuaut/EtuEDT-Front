import { useQuery } from "@tanstack/vue-query";
import { computed, type Ref, unref } from "vue";
import { buildResourceDetailsRequest } from "@/api/resourceRequestFactory";
import {
	getSelectedResourceFromIdentity,
	getSelectedResourceIdentity,
	queryKeys,
	type SelectedResourceIdentity,
} from "@/hooks/queries/queryKeys";
import type { IRoom, ITimetable } from "@/types/APIType";
import type { IResourceSelection } from "@/types/AppType";
import { getTimetableName } from "@/utils/timetable";
import { wrapFetchTyped } from "@/utils/wrapFetch";

interface UseTimetableOptions {
	selectedResource:
		| IResourceSelection
		| undefined
		| Readonly<Ref<IResourceSelection | undefined>>;
	enabled?: boolean | Ref<boolean>;
}

export const useTimetable = (options: UseTimetableOptions) => {
	const selectedResource = computed(() => unref(options.selectedResource));
	const selectedResourceIdentity = computed(() =>
		getSelectedResourceIdentity(selectedResource.value),
	);
	const queryEnabled = computed(() => {
		const enabled = options.enabled;
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
		queryFn: async ({ signal, queryKey }) => {
			const [, ...identity] = queryKey as ReturnType<
				typeof queryKeys.timetable
			>;
			const resourceSelection = getSelectedResourceFromIdentity(
				identity as SelectedResourceIdentity,
			);

			if (!resourceSelection) {
				throw new Error("Missing selected resource");
			}

			const details = await wrapFetchTyped<ITimetable | IRoom>({
				...buildResourceDetailsRequest(resourceSelection),
				signal,
			});

			if (!details) {
				throw new Error("Missing timetable details response");
			}

			return details;
		},
		enabled: queryEnabled,
	});

	const timetable = computed(() => ttQuery.data.value);
	const currentResourceType = computed(
		() => selectedResource.value?.resourceType ?? "timetable",
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
