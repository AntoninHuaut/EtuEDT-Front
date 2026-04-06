import { ref } from "vue";
import { useResourceSelection } from "@/hooks/useResourceSelection";
import type { ResourceType } from "@/types/AppType";

export function useSelectResourceAction() {
	const { selectResource } = useResourceSelection();
	const loadingResourceId = ref<number | undefined>();

	async function select(resourceType: ResourceType, adeResources: number) {
		loadingResourceId.value = adeResources;
		try {
			await selectResource(resourceType, adeResources);
		} finally {
			loadingResourceId.value = undefined;
		}
	}

	return {
		loadingResourceId,
		select,
	};
}
