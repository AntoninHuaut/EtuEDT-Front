import type { App } from "vue";
import Vue3Toastify from "vue3-toastify";
import router from "@/router";
import pinia from "./pinia";
import tanstackQuery, { queryClient } from "./tanstackQuery";
import toastifyOptions from "./toastify";
import vuetify from "./vuetify";

export function registerPlugins(app: App) {
	app
		.use(vuetify)
		.use(pinia)
		.use(router)
		.use(tanstackQuery, {
			queryClient: queryClient,
		})
		.use(Vue3Toastify, toastifyOptions());
}
