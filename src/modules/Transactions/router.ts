export default [
    {
        path: "/transactions",
        name: "transactions",
        component: () => import("@/modules/Transactions/views/Transactions.vue"),
        meta: {
            sidebar: 'Transactions',
            layout: "MainLayout",
            permissions: ['admin'],
        },
    },
];