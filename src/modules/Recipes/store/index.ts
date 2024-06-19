import {defineStore} from "pinia";
import $axios from "@/plugins/axios";
import {
    Results,
    Params,
    Retsept,
    RecipeDetail,
    Ingredient
} from "../interfaces";


export default defineStore("recipes", {
    state: () => {
        return {
            retseptList: {
                results: [] as Retsept[]
            } as Results<Retsept>,

            retseptDetailList: {
                data: {} as RecipeDetail
            },
            ingredients: {
                results: [] as Ingredient[]
            } as Results<Ingredient>
        };
    },
    actions: {


        //GET REQUEST
        async getRetsept(params: Params) {
            const {data} = await $axios.get('/knowledge_base/retsept/', {params})
            this.retseptList = data
        },

        async getRetseptDetail(recipes_id: number) {
            const {data} = await $axios.get(`/knowledge_base/retsept/${recipes_id}/`)
            this.retseptDetailList = data
        },

        async getIngredientById(params: Params, recipe_id: number | string | string[]) {
            const {data} = await $axios.get(`/knowledge_base/ingredient/${recipe_id}/`, {params})
            this.ingredients = data
        },


        //CREATE REQUEST
        create_retsept(data: object) {
            return $axios.post(`/knowledge_base/retsept/`, data);
        },

        createIngredient(data: object) {
            return $axios.post(`/knowledge_base/ingredient/`, data);
        },


        //PATCH REQUEST
        updateRetsept(data: any) {
            return $axios.patch(`/knowledge_base/retsept/${data.id}/`, data);
        },

        updateIngredient(data: any) {
            return $axios.patch(`/knowledge_base/ingredients/${data.id}/`, data);
        },


        //DELETE REQUEST
        deleteRetsept(recipes_id: number | null) {
            return $axios.delete(`/knowledge_base/retsept/${recipes_id}/`);
        },

        deleteIngredient(ingredient_id: number | null) {
            return $axios.delete(`/knowledge_base/ingredients/${ingredient_id}/`);
        },


    },
});
