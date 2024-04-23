import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import users from "@/modules/Users/router";
import administration from "@/modules/Administration/router";
import staff from "@/modules/Staff/router";
import knowledgeBase from "@/modules/KnowledgeBase/router";
import dashboard from "@/modules/Dashboard/router";
import news from "@/modules/News/router";
import sms from "@/modules/sms/router";
import promotion from "@/modules/Promotion/router"
import transactions from "@/modules/Transactions/router"
import promo_code from "@/modules/Products/router"

const routes: Array<RouteRecordRaw> = [
    ...promo_code,
    ...users,
    ...dashboard,
    ...staff,
    ...knowledgeBase,
    ...administration,
    ...news,
    ...sms,
    ...promotion,
    ...transactions,
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

    if (to.meta.loginNotRequired) return next();

    next();
});

export default router;
