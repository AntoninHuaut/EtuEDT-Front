// Composables

import type { RouteLocationNormalized } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";
import pinia from "@/plugins/pinia";
import { useAppStore } from "@/store";

const routes = [
	{
		path: "/",
		component: () => import("@/layouts/default/Default.vue"),
		children: [
			{
				path: "",
				name: "Home",
				component: () => import("@/views/Home.vue"),
			},
			{
				path: "sync",
				name: "Sync",
				component: () => import("@/views/Sync.vue"),
			},
			{
				path: "rooms",
				name: "Rooms",
				component: () => import("@/views/Home.vue"),
			},
			{
				path: "edt",
				alias:
					"edt/:numUniv(\\d+)?/:groupId(\\d+)?/:resourceType(timetable|room)?/:adeResources(\\d+)?",
				name: "Timetable",
				component: () => import("@/views/Timetable.vue"),
			},
			{
				path: "about",
				name: "About",
				component: () => import("@/views/About.vue"),
			},
			{
				path: "/:pathMatch(.*)*",
				name: "NotFound",
				component: () => import("@/views/NotFound.vue"),
			},
		],
	},
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

router.beforeEach((to: RouteLocationNormalized) => {
	if (to.name !== "Timetable") {
		return true;
	}

	const appStore = useAppStore(pinia);
	if (!appStore.canLoadSelectedResource) {
		return { name: "Home" };
	}

	return true;
});

export default router;
