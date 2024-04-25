//IMPORTED FILES
import {defineStore} from "pinia";
import $axios from "@/plugins/axios";

//EXPORTED FILES
export default defineStore("prmotionBase", {
    state: () => {
        return {
            promotionList: {
                count: 0,
                results: [] as any[]
            },
            promotionListId: {} as any[]
        };
    },

    actions: {
        //GET REQUESTS
        async getPromotionList(params) {
            const {data} = await $axios.get("/knowledge_base/promotions/", {params});
            console.log(data, 'data')
            this.promotionList = data;
        },
        async getPromotionId(id: any) {
            const {data} = await $axios.get(`/knowledge_base/promotions/${id}`);
            this.promotionListId = data;
        },

        //CREATE REQUESTS
        createPromotion(data: object) {
            return $axios.post("/knowledge_base/promotions/", data);
        },


        //PATCH REQUESTS
        updatePromotion(data: any) {
            return $axios.patch(`/knowledge_base/promotions/${data.get("id")}/`, data);
        },


        //DELETE REQUESTS
        deletePromotion(id: any) {
            return $axios.delete(`/knowledge_base/promotions/${id}/`);
        },
    },
});
