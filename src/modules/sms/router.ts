export default [
    {
        path: "/sms-template",
        name: "sms-template",
        component: () => import("@/modules/sms/views/index.vue"),
        meta: {
            layout: "MainLayout",
            permissions: ["admin"],
        },
    },
    {
        path: "/add-sms",
        name: "add-sms",
        component: () => import("@/modules/sms/components/smsSending/AddSms.vue"),
        meta: {
            layout: "MainLayout",
            permissions: ["admin"],
        },
    },
    {
        path: "/sms-detail/:id",
        name: "sms-detail",
        component: () => import("@/modules/sms/components/smsSending/AddSms.vue"),
        meta: {
            layout: "MainLayout",
            permissions: ["admin"],
        },
    },
    {
        path: "/news-detail/:id",
        name: "news-detail",
        component: () => import("@/modules/sms/components/news/AddNews.vue"),
        meta: {
            layout: "MainLayout",
            permissions: ["admin"],
        },
    },
    {
        path: "/add-news",
        name: "add-news",
        component: () => import("@/modules/sms/components/news/AddNews.vue"),
        meta: {
            layout: "MainLayout",
            permissions: ["admin"],
        },
    },
    {
        path: "/banner-detail/:id",
        name: "banner-detail",
        component: () => import("@/modules/sms/components/banner/AddBanner.vue"),
        meta: {
            layout: "MainLayout",
            permissions: ["admin"],
        },
    },
    {
        path: "/add-banner",
        name: "add-banner",
        component: () => import("@/modules/sms/components/banner/AddBanner.vue"),
        meta: {
            layout: "MainLayout",
            permissions: ["admin"],
        },
    },
];
