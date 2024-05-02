export default [
    {
        path: "/stories",
        name: "stories",
        component: () => import("@/modules/Stories/views/Stories.vue"),
        meta: {
            layout: "MainLayout",
            permissions: ['admin'],
        },
    },
    {
        path: "/stories-detail",
        name: "stories-detail",
        component: () => import("@/modules/Stories/components/CreateEditStories.vue"),
        meta: {
            layout: "MainLayout",
            permissions: ['admin'],
        }
    },
    {
        path: "/stories-detail/:id",
        name: "stories-detail-id",
        component: () => import("@/modules/Stories/components/CreateEditStories.vue"),
        meta: {
            layout: "MainLayout",
            permissions: ['admin'],
        }
    }

];
