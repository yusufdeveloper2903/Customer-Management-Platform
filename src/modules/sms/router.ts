export default [
    {
        path: "/sms-template",
        name: "sms-template",
        component: () => import("@/modules/sms/views/index.vue"),
        meta: {
            sidebar:"Notifications",
            layout: "MainLayout",
            permissions: ["admin"],
        },
    },
    {
        path: "/add-sms",
        name: "add-sms",
        component: () => import("@/modules/sms/components/smsSending/AddSms.vue"),
        meta: {
            sidebar:"Notifications",
            layout: "MainLayout",
            permissions: ["admin"],
        },
    },
    {
        path: "/sms-detail/:id",
        name: "sms-detail",
        component: () => import("@/modules/sms/components/smsSending/AddSms.vue"),
        meta: {
            sidebar:"Notifications",
            layout: "MainLayout",
            permissions: ["admin"],
        },
    },
    {
        path: "/news-detail/:id",
        name: "news-detail",
        component: () => import("@/modules/sms/components/news/AddNews.vue"),
        meta: {
            sidebar:"Notifications",
            layout: "MainLayout",
            permissions: ["admin"],
        },
    },
    {
        path: "/add-news",
        name: "add-news",
        component: () => import("@/modules/sms/components/news/AddNews.vue"),
        meta: {
            sidebar:"Notifications",
            layout: "MainLayout",
            permissions: ["admin"],
        },
    },


];
