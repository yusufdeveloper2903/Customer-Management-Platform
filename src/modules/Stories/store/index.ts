import {defineStore} from "pinia";
import $axios from "@/plugins/axios";
import {Results, storiesDetailHeaders, storiesHeaders} from "../interfaces";


export default defineStore("stories", {
    state: () => {
        return {
            storiesList: {
                count: 0,
                results: [] as storiesHeaders[],
            } as Results<storiesHeaders>,
            storiesDetailsList: {
                count: 0,
                results: [] as storiesDetailHeaders[],
            } as Results<storiesDetailHeaders>,
            storiesDetailsId: {
                data: {},
            },
            storySectionButtonType: {
                data: []
            },
            contentButtonTypeList: {
                results: []
            }
        };
    },
    actions: {


        //GET REQUEST
        async getStoriesList(params: any) {
            const {data} = await $axios.get("/knowledge_base/story/", {params})
            this.storiesList = data
        },
        async getStoriesDetailsList(params: any, id: any) {
            const {data} = await $axios.get(`/knowledge_base/story_section/${id}`, {params})
            this.storiesDetailsList = data
        },
        async getStoriesDetailId(id: any) {
            const {data} = await $axios.get(`/knowledge_base/story/${id}/`)
            this.storiesDetailsId = data
        },
        async getStoriesSectionButtonType() {
            const {data} = await $axios.get('/knowledge_base/story_content_type')
            this.storySectionButtonType = data
        },
        async getConentButtontype(model: any) {
            const {data} = await $axios.get(`${model}`)
            this.contentButtonTypeList = data
        },

        //CREATE REQUEST
        createStories(data: any) {
            return $axios.post("/knowledge_base/story/", data);
        },
        createSectionStories(data: any) {
            return $axios.post("/knowledge_base/story_section/", data);
        },


        //PATCH REQUEST
        updateStories(data) {
            return $axios.patch(`/knowledge_base/story/${data.get("id")}/`, data);
        },
        updateSectionStories(data: any) {
            return $axios.patch(`/knowledge_base/story_sections/${data.get("story_id")}/`, data);
        },


        //DELETE REQUEST
        deleteStories(id: number | null) {
            return $axios.delete(`/knowledge_base/story/${id}/`);
        },


    },
});
