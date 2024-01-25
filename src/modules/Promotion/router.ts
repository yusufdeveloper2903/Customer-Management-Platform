export default [
    {
      path: "/promotion",
      name: "promotion",
      component: () => import("@/modules/Promotion/views/Promotion.vue"),
      meta: {
        layout: "MainLayout",
        permissions: ['admin'],
      },
    },
  ];