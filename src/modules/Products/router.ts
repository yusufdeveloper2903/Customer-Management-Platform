export default [
    {
      path: "/products",
      name: "products",
      component: () => import("@/modules/Products/views/Product.vue"),
      meta: {
        layout: "MainLayout",
        permissions: ['admin'],
      },
    },
  ];