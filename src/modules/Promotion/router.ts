export default [
    {
        path: "/promotion",
        name: "promotion",
        component: () => import("@/modules/Promotion/views/Promotion.vue"),
        meta: {
            sidebar: 'Promotions',
            layout: "MainLayout",
            permissions: ['admin'],
        },
    },
];