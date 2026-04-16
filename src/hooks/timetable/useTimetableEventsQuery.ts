import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";
import { buildResourceEventsRequest } from "@/api/resourceRequestFactory";
import { queryKeys } from "@/hooks/queries/queryKeys";
import { useAppStore } from "@/store";
import type { IJsonEvent } from "@/types/APIType";
import { wrapFetch } from "@/utils/wrapFetch";

export function useTimetableEventsQuery() {
	const appStore = useAppStore();

	return useQuery<IJsonEvent[]>({
		queryKey: computed(() =>
			queryKeys.timetableEvents(
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
				...buildResourceEventsRequest(selectedResource),
				signal,
			});
		},
		enabled: computed(() => appStore.canLoadSelectedResource),
	});
}
