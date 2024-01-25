export default [
    {
      path: "/transactions",
      name: "transactions",
      component: () => import("@/modules/Transactions/views/Transactions.vue"),
      meta: {
        layout: "MainLayout",
        permissions: ['admin'],
      },
    },
  ];