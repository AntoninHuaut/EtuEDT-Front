import { useAppStore } from "@/store";
import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";
import { getResourceRouteSelectionFromQuery } from "./resourceRoute";
import { ROUTE_NAME } from "./routeNames";

const routes: RouteRecordRaw[] = [
	{
		path: "/",
		component: () => import("@/layouts/default/Default.vue"),
		children: [
			{
				path: "",
				name: ROUTE_NAME.HOME,
				component: () => import("@/views/Home.vue"),
			},
			{
				path: "sync",
				name: ROUTE_NAME.SYNC,
				component: () => import("@/views/Sync.vue"),
			},
			{
				path: "timetable",
				name: ROUTE_NAME.TIMETABLE_GROUP,
				component: () => import("@/views/Timetable.vue"),
				beforeEnter: (to) => {
					const appStore = useAppStore();
					const selection = getResourceRouteSelectionFromQuery(
						to.query,
						"timetable",
					);

					if (!selection) {
						return { name: ROUTE_NAME.NOT_FOUND };
					}

					appStore.applyRouteSelection(selection);
					return true;
				},
			},
			{
				path: "room",
				name: ROUTE_NAME.TIMETABLE_ROOM,
				component: () => import("@/views/Timetable.vue"),
				beforeEnter: (to) => {
					const appStore = useAppStore();
					const selection = getResourceRouteSelectionFromQuery(
						to.query,
						"room",
					);

					if (!selection) {
						return { name: ROUTE_NAME.NOT_FOUND };
					}

					appStore.applyRouteSelection(selection);
					return true;
				},
			},
			{
				path: "about",
				name: ROUTE_NAME.ABOUT,
				component: () => import("@/views/About.vue"),
			},
			{
				path: "/:pathMatch(.*)*",
				name: ROUTE_NAME.NOT_FOUND,
				component: () => import("@/views/NotFound.vue"),
			},
		],
	},
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

export default router;
