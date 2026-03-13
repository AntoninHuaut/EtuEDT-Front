// Composables
import { createRouter, createWebHistory } from "vue-router";

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
                path: "swagger",
                name: "Swagger",
                component: () => import("@/views/Swagger.vue"),
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
                path: "edt/:numUniv?/:groupId?/:resourceType?/:adeResources?",
                name: "Timetable",
                component: () => import("@/views/Timetable.vue"),
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
