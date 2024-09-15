//IMPORTED FILES
import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import users from "@/modules/Users/router";
import {isUserLoggedIn} from './utils'


//DECLARED VARIABLES
// let userData = JSON.parse(localStorage.getItem('userAbilities') || '""')
const routes: Array<RouteRecordRaw> = [
    ...users,
    {
        path: "/",
        redirect: () => {

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
        path: "/signup",
        name: "signup",
        component: () => import("@/views/SignUp.vue"),
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
        if (to.meta.loginNotRequired) {
            next(); // Allow navigation to the route without login
        } else {
            // Check if the user is logged in or any other condition
            // console.log(isUserLoggedIn(), 'isUserLoggedIn')
            // if ((userData && userData.length) || isUserLoggedIn()) {
            next(); // Allow navigation to the route
            // } else {
            //     next('/login'); // Prevent navigation to the route
            // }
        }


    }
)


export default router;
