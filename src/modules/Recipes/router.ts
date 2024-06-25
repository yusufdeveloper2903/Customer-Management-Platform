export default [
    {
        path: "/recipes",
        name: "recipes",
        component: () => import("@/modules/Recipes/views/Recipes.vue"),
        meta: {
            sidebar: 'Recipes',
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

]