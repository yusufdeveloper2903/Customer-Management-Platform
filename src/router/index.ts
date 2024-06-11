//IMPORTED FILES
import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import users from "@/modules/Users/router";
import administration from "@/modules/Administration/router";
import staff from "@/modules/Staff/router";
import knowledgeBase from "@/modules/KnowledgeBase/router";
import dashboard from "@/modules/Dashboard/router";
import sms from "@/modules/sms/router";
import promotion from "@/modules/Promotion/router"
import transactions from "@/modules/Transactions/router"
import promo_code from "@/modules/Products/router"
import recipes from "@/modules/Recipes/router"
import stories from '@/modules/Stories/router'
import polls from "@/modules/Polls/router"
import {isUserLoggedIn} from './utils'

//DECLARED VARIABLES
const routes: Array<RouteRecordRaw> = [
    ...promo_code,
    ...users,
    ...dashboard,
    ...staff,
    ...knowledgeBase,
    ...administration,
    ...sms,
    ...promotion,
    ...transactions,
    ...recipes,
    ...stories,
    ...polls,

    {
        path: "/",
        redirect: () => {
            if (isUserLoggedIn()) {
                return {name: 'dashboard'}
            }
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
        if (to.fullPath !== '/stories-detail') {
            localStorage.setItem('createdData', '')
        }
        let sidebar = localStorage.getItem('sidebar');
        if (to.name !== sidebar) {
            localStorage.setItem('page', '1')
            localStorage.setItem('page_size', '10')
        }
        if (to.meta.loginNotRequired) {
            next(); // Allow navigation to the route without login
        } else {
            // Check if the user is logged in or any other condition

            if (isUserLoggedIn()) {
                next(); // Allow navigation to the route
            } else {
                next('/error-404'); // Prevent navigation to the route
            }
        }

    }
)


export default router;
