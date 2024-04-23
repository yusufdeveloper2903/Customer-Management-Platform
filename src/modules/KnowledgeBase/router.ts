export default [
    {
        path: "/knowledgeBase",
        name: "knowledgeBase",
        component: () => import("@/modules/KnowledgeBase/views/KnowledgeBase.vue"),
        meta: {
            layout: "MainLayout",
            permissions: ["admin"],
        },
    },
];
