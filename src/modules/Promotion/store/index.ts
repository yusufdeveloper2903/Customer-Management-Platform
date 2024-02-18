import {defineStore} from "pinia";
import $axios from "@/plugins/axios";


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
        async getPromotionList(params) {
            const {data} = await $axios.get("/knowledge_base/promotions/", {params});
            console.log(data, 'data')
            this.promotionList = data;
        },
        async getPromotionId(id: any) {
            const {data} = await $axios.get(`/knowledge_base/promotions/${id}`);
            this.promotionListId = data;
        },


        createPromotion(data: object) {
            return $axios.post("/knowledge_base/promotions/", data);
        },

        updatePromotion(data) {
            return $axios.patch(`/knowledge_base/promotions/${data.get("id")}/`, data);
        },

        deletePromotion(id: number) {
            return $axios.delete(`/knowledge_base/promotions/${id}/`);
        },
    },
});
