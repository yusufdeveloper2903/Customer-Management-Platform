//IMPORTED FILES
import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import {ref} from 'vue'
import users from "@/modules/Users/router";

let userData = JSON.parse(localStorage.getItem('userAbilities') || '""')
let userInformation = ref<boolean>(false)

//DECLARED VARIABLES
const routes: Array<RouteRecordRaw> = [
    ...users,
    {
        path: "/",
        redirect: () => {
            if (userData && userData.name || userInformation) {
                return {name: 'users'}
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
            if (window.webInfor && window.webInfor.username) {
                userInformation.value = true
            } else {
                userInformation.value = false
            }
            if ((userData && userData.length) || userInformation.value) {
                next(); // Allow navigation to the route
            } else {
                next('/login'); // Prevent navigation to the route
            }
        }

    }
)


export default router;
