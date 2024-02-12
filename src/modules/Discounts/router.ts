export default [
    {
      path: "/discounts",
      name: "discounts",
      component: () => import("@/modules/Discounts/views/Discounts.vue"),
      meta: {
        layout: "MainLayout",
        permissions: ['admin'],
      },
    },
  ];