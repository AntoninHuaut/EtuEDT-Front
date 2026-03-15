// Composables

import type { RouteLocationNormalized } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";
import { createTimetableContext } from "@/utils/timetableContext";

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
				component: () => import("@/views/Rooms.vue"),
			},
			{
				path: "edt/:numUniv(\\d+)?/:groupId(\\d+)?/:resourceType(timetable|room)?/:adeResources(\\d+)?",
				name: "Timetable",
				component: () => import("@/views/Timetable.vue"),
				beforeEnter: (to: RouteLocationNormalized) => {
					if (createTimetableContext(to.params)) {
						return true;
					}

					return { name: "Home" };
				},
			},
			{
				path: "contributors",
				name: "Contributors",
				component: () => import("@/views/Contributors.vue"),
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

export default router;
