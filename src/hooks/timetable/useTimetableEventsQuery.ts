import { useQuery } from "@tanstack/vue-query";
import { computed, type Ref, unref } from "vue";
import { buildResourceEventsRequest } from "@/api/resourceRequestFactory";
import {
	getSelectedResourceFromIdentity,
	getSelectedResourceIdentity,
	queryKeys,
	type SelectedResourceIdentity,
} from "@/hooks/queries/queryKeys";
import type { IJsonEvent } from "@/types/APIType";
import type { IResourceSelection } from "@/types/AppType";
import { wrapFetchTyped } from "@/utils/wrapFetch";

interface UseTimetableEventsQueryOptions {
	selectedResource:
		| IResourceSelection
		| undefined
		| Readonly<Ref<IResourceSelection | undefined>>;
}

export function useTimetableEventsQuery(
	options: UseTimetableEventsQueryOptions,
) {
	const selectedResource = computed(() => unref(options.selectedResource));
	const selectedResourceIdentity = computed(() =>
		getSelectedResourceIdentity(selectedResource.value),
	);

	return useQuery<IJsonEvent[]>({
		queryKey: computed(() =>
			queryKeys.timetableEvents(selectedResourceIdentity.value),
		),
		queryFn: async ({ signal, queryKey }) => {
			const [, ...identity] = queryKey as ReturnType<
				typeof queryKeys.timetableEvents
			>;
			const selectedResource = getSelectedResourceFromIdentity(
				identity as SelectedResourceIdentity,
			);

			if (!selectedResource) {
				throw new Error("Missing selected resource");
			}

			const events = await wrapFetchTyped<IJsonEvent[]>({
				...buildResourceEventsRequest(selectedResource),
				signal,
			});

			return events ?? [];
		},
		enabled: computed(() => selectedResource.value !== undefined),
	});
}
