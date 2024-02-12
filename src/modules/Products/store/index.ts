import {defineStore} from "pinia";
import $axios from "@/plugins/axios";

export default defineStore("productStore", {
    state: () => {
        return {
            productListCategory: {
                count: 0,
                results: []
            },
            productFromKnowledgeBase: {
                count: 0,
                results: []
            },
            productListCards: {
                count: 0,
                results: []
            }
        };
    },
    actions: {
        async getProductList(params: any) {

            const {data} = await $axios.get("products/categories/", {params});
            this.productListCategory = data;
        },
        async getProductFromKnowledgeBase(params: any) {
            const {data} = await $axios.get('/products/products/', {params})
            this.productFromKnowledgeBase = data
        },
        deleteProductItem(id: number | null | undefined) {
            return $axios.delete(`products/categories/${id}/`,)
        },
        async createProductCategory(data: object) {
            return $axios.post('products/categories/', data)
        },
        async updateProductCategory(data: any) {
            return $axios.patch(`products/categories/${data.id}/`, data)
        },
        async createProductCard(data: object) {
            return $axios.post('/products/product_cards/', data)
        },
        async updateProductCard(data: any) {
            return $axios.patch(`/products/product_cards/${data.id}/`, data)
        },
        deleteProductCard(id: number | null | undefined) {
            return $axios.delete(`/products/product_cards/${id}/`,)
        },
        async getProductCards(params: any) {

            const {data} = await $axios.get("products/product_cards/", {params});
            this.productListCards = data;
        },

    },
});
