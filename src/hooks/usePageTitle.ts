import { onUnmounted, ref } from "vue";

const appName = "EtuEDT";
const appSeparator = " | ";

export const usePageTitle = () => {
    const pageTitle = ref<string>(document.title);
    onUnmounted(() => resetPageTitle());

    const setPageTitle = (title: string) => {
        // biome-ignore lint/style/noParameterAssign: skip
        title = `${appName}${appSeparator}${title}`;
        pageTitle.value = title;
        document.title = title;
    };

    const resetPageTitle = () => {
        pageTitle.value = appName;
        document.title = appName;
    };

    return { pageTitle, setPageTitle, resetPageTitle };
};
