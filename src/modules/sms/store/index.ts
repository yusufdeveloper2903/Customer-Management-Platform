//IMPORTED FILES
import {defineStore} from "pinia";
import $axios from "@/plugins/axios";
import {Results, Status, News, SmsSending, Reseivers} from "../interfaces";


//EXPORT DEFAULT
export default defineStore("sms", {
    state: () => {
        return {
            statusList: {
                results: [] as Status[]
            } as Results<Status>,
            newsList: {
                results: [] as News[]
            } as Results<News>,
            newsListDetail: {} as any,
            smsSendingList: {
                results: [] as SmsSending[]
            } as Results<SmsSending>,
            smsSendingDetail: {} as SmsSending,
            receiversList: {
                results: [] as Reseivers[]
            } as Results<Reseivers>
        };
    },

    actions: {


        //GET REQUESTS
        async getNews(params) {
            const {data} = await $axios.get("/knowledge_base/news/", {params});
            this.newsList = data;
        },
        async getNewsDetail(params) {
            const {data} = await $axios.get(`/knowledge_base/news/${params.id}`, {params});
            this.newsListDetail = data;
        },
        async getSmsSending(params) {
            const {data} = await $axios.get("/knowledge_base/sms/", {params});
            this.smsSendingList = data;
        },
        async getSmsSendingDetail(params) {
            const {data} = await $axios.get(`/knowledge_base/sms/${params.id}/`, {params});
            this.smsSendingDetail = data;
        },
        async getStatus() {
            const {data} = await $axios.get("/knowledge_base/status_notification/");
            this.statusList = data;
        },
        async getReseivers(params: any) {
            const {data} = await $axios.get("/clients/client/get_receivers_of_notification/", {params});
            this.receiversList = data;
        },


        //CREATE REQUEST
        createNews(data: object) {
            return $axios.post("/knowledge_base/news/", data);
        },
        createSmsSending(data: object) {
            return $axios.post("/knowledge_base/sms/", data);
        },


        //PATCH REQUEST
        updateNews(data) {
            return $axios.patch(`/knowledge_base/news/${data.id || data.get('id')}/`, data);
        },
        updateSmsSending(data) {
            return $axios.patch(`/knowledge_base/sms/${data.id}/`, data);
        },


        //DELETE REQUEST
        deleteNews(id: number | null) {
            return $axios.delete(`/knowledge_base/news/${id}/`);
        },
        deleteSmsSending(id: number | null) {
            return $axios.delete(`/knowledge_base/sms/${id}/`);
        },

    },
});
