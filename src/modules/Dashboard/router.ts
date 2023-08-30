export default [
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("@/modules/Dashboard/views/Dashboard.vue"),
    meta: {
      layout: "MainLayout",
      permissions: ["admin"],
    },
  },
];
