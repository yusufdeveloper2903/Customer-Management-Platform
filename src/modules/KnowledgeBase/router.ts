export default [
    {
        path: "/knowledgeBase",
        name: "knowledgeBase",
        component: () => import("@/modules/KnowledgeBase/views/KnowledgeBase.vue"),
        meta: {
            sidebar: 'nav.directory',
            layout: "MainLayout",
            permissions: ["admin"],
        },
    },
];
