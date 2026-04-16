import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { ETheme } from "@/types/AppType";

export const useThemeStore = defineStore("theme", () => {
	const theme = useLocalStorage<string | undefined>("theme", ETheme.SYSTEM);

	function setTheme(value: ETheme | undefined) {
		theme.value = value;
	}

	return { theme, setTheme };
});
