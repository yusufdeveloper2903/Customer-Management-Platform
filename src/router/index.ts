import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
// import { canNavigate } from "@/layout/plugins/casl";
import {isUserLoggedIn} from "./utils";
// import registration from "./registration";main
import users from "@/modules/Users/router";
import administration from "@/modules/Administration/router";
import staff from "@/modules/Staff/router";
import knowledgeBase from "@/modules/KnowledgeBase/router";
import dashboard from "@/modules/Dashboard/router";
import news from "@/modules/News/router";
import sms from "@/modules/sms/router";
// import { check } from "@/mixins/permissions";

const routes: Array<RouteRecordRaw> = [
    // ...registration,
    ...dashboard,
    ...users,
    ...staff,
    ...knowledgeBase,
    ...administration,
    ...news,
    ...sms,

    {
        path: "/",
        redirect: () => {
            // if (isUserLoggedIn()) {
            // if (check("car_showroom")) {
            return {name: "dashboard"};
            // }
            return {name: "dashboard"};
            // }
            return {name: "login"};
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

    // if (!isLoggedIn) {
    //   return next({ name: "login" });
    // }

    // if (to.meta.permissions && !check(to?.meta?.permissions)) {
    //   return next({ name: "error-404" });
    // }
    next();
});

export default router;
