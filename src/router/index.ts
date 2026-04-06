import { createRouter, createWebHistory } from "vue-router";
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
				path: "edt",
				name: "Timetable",
				component: () => import("@/views/Timetable.vue"),
				beforeEnter: () => {
					const appStore = useAppStore();
					if (!appStore.canLoadSelectedResource) {
						return { name: "Home" };
					}

					return true;
				},
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

export default router;
