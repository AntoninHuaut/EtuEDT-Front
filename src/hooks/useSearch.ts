import { ref } from "vue";
import { useDebounce } from "@/hooks/useDebounce";

function normalizeSearchTerm(value: string) {
	return value
		.trim()
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/\s+/g, " ");
}

export function matchesSearchQuery(value: string, query: string) {
	const normalizedQuery = normalizeSearchTerm(query);
	if (!normalizedQuery) return true;

	return normalizeSearchTerm(value).includes(normalizedQuery);
}

export function useSearch(initialValue = "", delay = 250) {
	const searchQuery = ref(initialValue);
	const { debounced: debouncedQuery, isDebouncing } = useDebounce(
		searchQuery,
		delay,
	);

	const clearSearch = () => {
		searchQuery.value = initialValue;
	};

	return {
		searchQuery,
		debouncedQuery,
		isDebouncing,
		clearSearch,
	};
}
