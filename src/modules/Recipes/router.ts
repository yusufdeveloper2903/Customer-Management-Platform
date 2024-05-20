export default [
    {
        path: "/recipes",
        name: "recipes",
        component: () => import("@/modules/Recipes/views/Recipes.vue"),
        meta: {
            layout: "MainLayout",
            permissions: ["admin"],
        },
    },
    {
        path: "/recipe-detail/:id",
        name: "recipe-detail",
        component: () => import("@/modules/Recipes/pages/CreateRecipeDetail.vue"),
        meta: {
            layout: "MainLayout",
            permissions: ["admin"],
        },
    },
    // {
    //     path: "/edit-recipe-detail/:id",
    //     name: "edit-recipe-detail",
    //     component: () => import("@/modules/Recipes/pages/CreateRecipeDetail.vue"),
    //     meta: {
    //         layout: "MainLayout",
    //         permissions: ["admin"],
    //     },
    // },
    {
        path: "/add-recipe",
        name: "add-recipe",
        component: () => import("@/modules/Recipes/pages/CreateRecipeDetail.vue"),
        meta: {
            layout: "MainLayout",
            permissions: ["admin"],
        },
    },
]