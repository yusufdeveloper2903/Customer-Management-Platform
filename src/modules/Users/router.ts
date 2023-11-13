export default [
  {
    path: "/users",
    name: "users",
    component: () => import("@/modules/Users/views/Users.vue"),
    meta: {
      layout: "MainLayout",
      permissions: ['admin'],
    },
  },
  {
    path: "/user-detail/:id",
    name: "user detail",
    component: () => import("@/modules/Users/pages/Details.vue"),
    meta: {
      layout: "MainLayout",
      permissions: ['admin'],
    },
  },

  {
    path: "/add-user",
    name: "add user",
    component: () => import("@/modules/Users/pages/Details.vue"),
    meta: {
      layout: "MainLayout",
      permissions: ['admin'],
    },
  },

  // {
  //   path: "/profile",
  //   name: "profiler",
  //   component: () => import("@/modules/Users/pages/Profile.vue"),
  //   meta: {
  //     layout: "MainLayout",
  //     permissions: ['agent', 'banker', 'seller', 'buyer', 'admin'],
  //   },
  // },
];
