import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
        },
        mutations: {
            retry: 1,
        },
    },
});

export default VueQueryPlugin;
