export default [
  {
    path: "/stuff",
    name: "stuff",
    component: () => import("@/modules/Stuff/views/Stuff.vue"),
    meta: {
      layout: "MainLayout",
      permissions: ["admin"],
    },
  },
];
