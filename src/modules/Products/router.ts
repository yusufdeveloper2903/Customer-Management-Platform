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
    {
        path: "/product-details",
        name: "product-details",
        component: () => import("@/modules/Products/pages/Details.vue"),
        meta: {
            layout: "MainLayout",
            permissions: ['admin'],
        },
    },
  ];