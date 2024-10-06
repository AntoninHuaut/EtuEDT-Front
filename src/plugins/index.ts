import router from "@/router";
import Vue3Toastify from "vue3-toastify";

import pinia from "./pinia";
import tanstackQuery, { queryClient } from "./tanstackQuery";
import toastifyOptions from "./toastfiy";
import vuetify from "./vuetify";

import type { App } from "vue";

export function registerPlugins(app: App) {
    app.use(vuetify)
        .use(router)
        .use(pinia)
        .use(tanstackQuery, {
            queryClient: queryClient,
        })
        .use(Vue3Toastify, toastifyOptions());
}
