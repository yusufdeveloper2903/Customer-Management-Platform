import {defineStore} from "pinia";
import $axios from "@/plugins/axios";
import {
    Results,
    Params,
    Retsept,
    RecipeDetail
} from "../interfaces";


export default defineStore("recipes", {
    state: () => {
        return {
            retseptList: {
                results: [] as Retsept[]
            } as Results<Retsept>,

            retseptDetailList: {} as RecipeDetail,
        };
    },
    actions: {


        //GET REQUEST
        async getRetsept(params: Params) {
            const {data} = await $axios.get('/knowledge_base/retsept/', {params})
            this.retseptList = data
        },

        async getRetseptDetail(id: number) {
            const {data} = await $axios.get(`/knowledge_base/retsept/${id}/`)
            this.retseptDetailList = data
        },


        //CREATE REQUEST
        create_retsept(data: object) {
            return $axios.post(`/knowledge_base/retsept/`, data);
        },


        //PATCH REQUEST
        updateRetsept(data: any) {
            return $axios.patch(`/knowledge_base/retsept/${data.id}/`, data);
        },


        //DELETE REQUEST
        deleteRetsept(recipes_id: number | null) {
            return $axios.delete(`/knowledge_base/retsept/${recipes_id}/`);
        },


    },
});
