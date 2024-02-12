import { defineStore } from "pinia";
import $axios from "@/plugins/axios";

import { INews, INewsList } from "../../";

export default defineStore("news", {
    state: () => {
        return {
            newsList: {} as INewsList,
            news: {} as INews,
        };
    },

    actions: {
        async getNewsLis(params) {
            const { data } = await $axios.get("/news/news/", { params });
            this.newsList = data;
        },

        async getNewsById(id: number) {
            const { data } = await $axios.get(`/news/news/${id}`);
            this.news = data;
        },

        createNews(data: object) {
            return $axios.post("/news/news/", data);
        },

        updateNews(data) {
            return $axios.patch(`/news/news/${data.get("id")}/`, data);
        },

        deleteNews(id: number) {
            return $axios.delete(`/news/news/${id}/`);
        },
    },
});
