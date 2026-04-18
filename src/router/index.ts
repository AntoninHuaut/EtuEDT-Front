import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";
import { useAppStore } from "@/store";
import { guards, resolveResourceGuard } from "./guards";
import { resolveResourceRouteSelection } from "./resourceRoute";
import { ROUTE_NAME } from "./routeNames";
import { getStoreFallbackSelection } from "./storeFallbackSelection";

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
				props: (route) => {
					const appStore = useAppStore();
					const fallbackSelection = getStoreFallbackSelection(
						appStore,
						"timetable",
					);
					return {
						selectedResource: resolveResourceRouteSelection(
							route.query,
							"timetable",
							fallbackSelection,
						),
					};
				},
				beforeEnter: guards.timetable,
			},
			{
				path: "room",
				name: ROUTE_NAME.TIMETABLE_ROOM,
				component: () => import("@/views/Timetable.vue"),
				props: (route) => {
					const appStore = useAppStore();
					const fallbackSelection = getStoreFallbackSelection(appStore, "room");
					return {
						selectedResource: resolveResourceRouteSelection(
							route.query,
							"room",
							fallbackSelection,
						),
					};
				},
				beforeEnter: guards.room,
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

router.beforeEach((to) => {
	if (to.name === ROUTE_NAME.TIMETABLE_GROUP) {
		return resolveResourceGuard(to.query, "timetable");
	}

	if (to.name === ROUTE_NAME.TIMETABLE_ROOM) {
		return resolveResourceGuard(to.query, "room");
	}

	return true;
});

export default router;
