import { onUnmounted } from "vue";

const appName = "EtuEDT";
const appSeparator = " | ";

export const usePageTitle = () => {
	onUnmounted(() => resetPageTitle());

	const setPageTitle = (title: string) => {
		title = `${appName}${appSeparator}${title}`;
		document.title = title;
	};

	const resetPageTitle = () => {
		document.title = appName;
	};

	return { setPageTitle, resetPageTitle };
};
