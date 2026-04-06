import { computed } from "vue";
import { useTheme } from "vuetify";
import colors from "vuetify/util/colors";

const baseSelectionColors = [
	colors.blue.darken3,
	colors.blue.base,
	colors.green.darken2,
	colors.green.lighten1,
	colors.orange.darken2,
	colors.orange.lighten1,
];

export function useSelectionColors() {
	const theme = useTheme();

	const colors = computed(() => {
		if (theme.global.name.value === "dark") {
			return baseSelectionColors.map((color) => `${color}AA`);
		}

		return baseSelectionColors;
	});

	return { colors };
}
