import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { ETheme } from "@/types/AppType";

function isTheme(value: unknown): value is ETheme {
	return (
		value === ETheme.DARK || value === ETheme.LIGHT || value === ETheme.SYSTEM
	);
}

export const useThemeStore = defineStore("theme", () => {
	const theme = useLocalStorage<ETheme | undefined>("theme", ETheme.SYSTEM);

	if (!isTheme(theme.value)) {
		theme.value = ETheme.SYSTEM;
	}

	function setTheme(value: ETheme | undefined) {
		theme.value = value && isTheme(value) ? value : ETheme.SYSTEM;
	}

	return { theme, setTheme };
});
