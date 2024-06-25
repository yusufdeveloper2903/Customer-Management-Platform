import {defineStore} from "pinia";
import $axios from "@/plugins/axios";
import {
    Results,
    Params,
    Retsept,
    RecipeDetail,
    Ingredient,
    Preparation,
    RecipeMedia
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
            } as Results<Ingredient>,

            preparationList: {
                results: [] as Preparation[]
            } as Results<Preparation>,

            recipeMediaList: {
                data: [] as RecipeMedia[]
            }
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

        async getPreparationById(params, food_id: number | string | string[]) {
            const {data} = await $axios.get(`/knowledge_base/preparation/${food_id}/`, {params})
            this.preparationList = data
        },

        async getRecipeMediaById(recipes_id: number | string | string[]) {
            const {data} = await $axios.get(`/knowledge_base/retsept_media/${recipes_id}/`)
            this.recipeMediaList = data
        },


        //CREATE REQUEST
        create_retsept(data: object) {
            return $axios.post(`/knowledge_base/retsept/`, data);
        },

        createIngredient(data: object) {
            return $axios.post(`/knowledge_base/ingredient/`, data);
        },

        createPreparation(data: object) {
            return $axios.post(`/knowledge_base/preparation/`, data);
        },

        createPreparationDrag_and_drop ( data: any ) {
            return $axios.post(`/knowledge_base/preparation_drag_and_drop/${data.id}/`, data);
        },

        createRecipeMedia(data: object ) {
            return $axios.post(`/knowledge_base/retsept_media/`, data);
        },

        createRecipeChangeStatus(data: string ) {
            return $axios.post(`/knowledge_base/recipe_change_status/`, data);
        },


        //PATCH REQUEST
        updateRetsept(data: any) {
            return $axios.patch(`/knowledge_base/retsept/${data.id}/`, data);
        },

        updateIngredient(ingredient_id, data: any) {
            return $axios.patch(`/knowledge_base/ingredients/${ingredient_id}/`, data);
        },

        updatePreparation(data: any) {
            return $axios.patch(`/knowledge_base/preparations/${data.id}/`, data);
        },

        updateRecipeMedia(data: any) {
            return $axios.patch(`/knowledge_base/retsept_media/${data.id}/`, data);
        },


        //DELETE REQUEST
        deleteRetsept(recipes_id: number | null) {
            return $axios.delete(`/knowledge_base/retsept/${recipes_id}/`);
        },

        deleteIngredient(ingredient_id: number | null) {
            return $axios.delete(`/knowledge_base/ingredients/${ingredient_id}/`);
        },

        deletePreparation(preparation_id: number | null) {
            return $axios.delete(`/knowledge_base/preparations/${preparation_id}/`);
        },

        deleteRecipeMedia(media_file_id: number | null) {
            return $axios.delete(`/knowledge_base/retsept_media_delete/${media_file_id}/`);
        },


    },
});
