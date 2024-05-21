export default [
    {
        path: "/staff",
        name: "staff",
        component: () => import("@/modules/Staff/views/Staff.vue"),
        meta: {
            sidebar: 'nav.staffs',
            layout: "MainLayout",
            permissions: ["admin"],
        },
    },
    {
        path: "/staff-detail/:id",
        name: "staff detail",
        component: () => import("@/modules/Staff/pages/Details.vue"),
        meta: {
            sidebar: 'nav.staffs',
            layout: "MainLayout",
            permissions: ["admin"],
        },
    },

    {
        path: "/add-staff",
        name: "add staff",
        component: () => import("@/modules/Staff/pages/Details.vue"),
        meta: {
            sidebar: 'nav.staffs',
            layout: "MainLayout",
            permissions: ["admin"],
        },
    },
];
