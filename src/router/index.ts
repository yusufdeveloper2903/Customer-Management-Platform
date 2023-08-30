import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
// import { canNavigate } from "@/layout/plugins/casl";
import { isUserLoggedIn } from "./utils";
import registration from "./registration";
import users from "@/modules/Users/router";
import administration from "@/modules/Administration/router";
import stuff from "@/modules/Stuff/router";
import { check } from "@/mixins/permissions";

const routes: Array<RouteRecordRaw> = [
  ...registration,
  ...users,
  ...administration,
  ...stuff,

  {
    path: "/",
    redirect: () => {
      if (isUserLoggedIn()) {
        if (check("car_showroom")) {
          return { name: "users" };
        }
        return { name: "users" };
      }
      return { name: "login" };
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
    meta: {
      loginNotRequired: true,
      layout: "LoginLayout",
    },
  },
  {
    path: "/oferta",
    name: "oferta",
    component: () => import("@/components/Oferta/Index.vue"),
    meta: {
      loginNotRequired: true,
      layout: "LoginLayout",
    },
  },
  {
    path: "/error-404",
    name: "error-404",
    component: () => import("@/views/error/Error404.vue"),
    meta: {
      loginNotRequired: true,
      layout: "EmptyLayout",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "error-404",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _, next) => {
  const isLoggedIn = isUserLoggedIn();

  if (to.meta.loginNotRequired) return next();

  if (!isLoggedIn) {
    return next({ name: "login" });
  }

  if (to.meta.permissions && !check(to?.meta?.permissions)) {
    return next({ name: "error-404" });
  }
  next();
});

export default router;
