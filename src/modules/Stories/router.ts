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

];
