export default [
    {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/modules/Dashboard/views/Dashboard.vue"),
        meta: {
            sidebar: 'dashboard',
            layout: "MainLayout",
            permissions: ["admin"],
        },
    },
];
