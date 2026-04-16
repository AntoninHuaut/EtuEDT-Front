import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";
import { buildResourceEventsRequest } from "@/api/resourceRequestFactory";
import {
	getSelectedResourceFromIdentity,
	getSelectedResourceIdentity,
	queryKeys,
	type SelectedResourceIdentity,
} from "@/hooks/queries/queryKeys";
import { useAppStore } from "@/store";
import type { IJsonEvent } from "@/types/APIType";
import { wrapFetch } from "@/utils/wrapFetch";

export function useTimetableEventsQuery() {
	const appStore = useAppStore();
	const selectedResource = computed(() => appStore.selectedResource);
	const selectedResourceIdentity = computed(() =>
		getSelectedResourceIdentity(selectedResource.value),
	);

	return useQuery<IJsonEvent[]>({
		queryKey: computed(() =>
			queryKeys.timetableEvents(selectedResourceIdentity.value),
		),
		queryFn: ({ signal, queryKey }) => {
			const [, ...identity] = queryKey as ReturnType<
				typeof queryKeys.timetableEvents
			>;
			const selectedResource = getSelectedResourceFromIdentity(
				identity as SelectedResourceIdentity,
			);

			if (!selectedResource) {
				throw new Error("Missing selected resource");
			}

			return wrapFetch({
				...buildResourceEventsRequest(selectedResource),
				signal,
			});
		},
		enabled: computed(() => selectedResource.value !== undefined),
	});
}
