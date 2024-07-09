//IMPORTED FILES
import {defineStore} from "pinia";
import $axios from "@/plugins/axios";


//EXPORT DEFAULT
export default defineStore("productStore", {
    state: () => {
        return {
            productListCategory: {
                count: 0,
                results: [] as any[]
            },
            productFromKnowledgeBase: {
                count: 0,
                results: []
            },
            productListCards: {
                count: 0,
                results: [] as any[]
            }
        };
    },
    actions: {
        //GET REQUEST
        async getProductList(params?: any) {
            const {data} = await $axios.get("/products/categories/", {params});
            this.productListCategory = data;
        },
        async getProductFromKnowledgeBase(params: any) {
            const {data} = await $axios.get('/products/products/', {params})
            this.productFromKnowledgeBase = data
        },
        async getProductCardsId(params: any) {
            const {data} = await $axios.get(`/products/product_cards/`, {params});
            this.productListCards = data;
        },


        //CREATE REQUEST
        DRAG_DROP_PRODUCTS(data: any) {
            return $axios.post(`/products/categories/drag_and_drop/`, data);
        },
        DRAG_DROP_PRODUCTS_CARDS(data: any) {
            return $axios.post('/products/product_cards/drag_and_drop/', data)
        },
        async createProductCategory(data: object) {
            return $axios.post('products/categories/', data)
        },
        async createProductCard(data: object) {
            return $axios.post('/products/product_cards/', data)
        },


        //DELETE REQUESTS
        deleteProductItem(id: number | null | undefined) {
            return $axios.delete(`products/categories/${id}/`,)
        },
        deleteProductCard(id: number | null | undefined) {
            return $axios.delete(`/products/product_cards/${id}/`,)
        },

        //PATCH REQUEST
        async updateProductCategory(data: any) {
            return $axios.patch(`products/categories/${data.id}/`, data)
        },
        async updateProductCard(data: any) {
            return $axios.patch(`/products/product_cards/${data.id}/`, data)
        },

    },
});
