import {defineStore} from "pinia";
import $axios from "@/plugins/axios";
import {Results, storiesHeaders} from "../interfaces";


export default defineStore("knowledgeBase", {
    state: () => {
        return {
            storiesList: {
                count: 0,
                results: [] as storiesHeaders[],
            } as Results<storiesHeaders>,
        };
    },
    actions: {


        //GET REQUEST
        async getStoriesList(params: any) {
            const {data} = await $axios.get("/knowledge_base/story/", {params})
            this.storiesList = data
        },


        //CREATE REQUEST
        createStories(data: any) {
            return $axios.post("/knowledge_base/story/", data);
        },


        //PATCH REQUEST
        updateStories(data) {
            return $axios.patch(`/knowledge_base/story/${data.get("id")}/`, data);
        },


        //DELETE REQUEST
        deleteStories(id: number | null) {
            return $axios.delete(`/knowledge_base/story/${id}/`);
        },


    },
});
