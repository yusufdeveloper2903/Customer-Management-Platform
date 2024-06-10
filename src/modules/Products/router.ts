export default [
    {
        path: "/products",
        name: "products",
        component: () => import("@/modules/Products/views/Product.vue"),
        meta: {
            sidebar: 'productsCategory',
            layout: "MainLayout",
            permissions: ['admin'],
        },
    },
    {
        path: "/product-details/:id",
        name: "product-details",
        component: () => import("@/modules/Products/pages/Details.vue"),
        meta: {
            sidebar: 'productsCategory',
            layout: "MainLayout",
            permissions: ['admin'],
        },
    },
];