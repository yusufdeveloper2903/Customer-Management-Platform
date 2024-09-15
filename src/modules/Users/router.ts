export default [
    {
        path: "/users",
        name: "users",
        component: () => import("@/modules/Users/views/Users.vue"),
        meta: {
            sidebar: 'Users',
            layout: "MainLayout",
            permissions: ["admin"],
        },
    },
    {
        path: "/users-detail/:id",
        name: "users detail",
        component: () => import("@/modules/Users/pages/Details.vue"),
        meta: {
            sidebar: 'Users',
            layout: "MainLayout",
            permissions: ["admin"],
        },
    },

    {
        path: "/add-users",
        name: "add users",
        component: () => import("@/modules/Users/pages/Details.vue"),
        meta: {
            sidebar: 'Users',
            layout: "MainLayout",
            permissions: ["admin"],
        },
    },
];
