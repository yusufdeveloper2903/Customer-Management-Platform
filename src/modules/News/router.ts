export default [
  {
    path: "/news",
    name: "news",
    component: () => import("@/modules/News/views/News.vue"),
    meta: {
      layout: "MainLayout",
      permissions: ["admin"],
    },
  },
];
