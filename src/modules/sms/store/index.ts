import { defineStore } from "pinia";
import $axios from "@/plugins/axios";
import { Banner, Results, Status, News, SmsSending } from "../interfaces";


export default defineStore("knowledgeBase", {
  state: () => {
    return {
      // banner
      bannerList: {
        results: [] as Banner[]
      } as Results<Banner>,

      statusList: {
        results: [] as Status[]
      } as Results<Status>,

      // news
      newsList: {
        results: [] as News[]
      } as Results<News>,

      // sms sending
      smsSendingList: {
        results: [] as SmsSending[]
      } as Results<SmsSending>

    };
  },

  actions: {
    // banner
    async getBanner(params) {
      const { data } = await $axios.get("/knowledge_base/banner/", { params });
      this.bannerList = data;
    },

    createBanner(data: object) {
      return $axios.post("/knowledge_base/banner/", data);
    },

    updateBanner(data) {
      return $axios.patch(`/knowledge_base/banner/${data.id}/`, data);
    },

    deleteBanner(id: number) {
      return $axios.delete(`/knowledge_base/banner/${id}/`);
    },

    // news
    async getNews(params) {
      const { data } = await $axios.get("/knowledge_base/news/", { params });
      this.newsList = data;
    },

    createNews(data: object) {
      return $axios.post("/knowledge_base/news/", data);
    },

    updateNews(data) {
      return $axios.patch(`/knowledge_base/news/${data.id || data.get('id')}/`, data);
    },

    deleteNews(id: number) {
      return $axios.delete(`/knowledge_base/news/${id}/`);
    },

    // sms sending
    async getSmsSending(params) {
      const { data } = await $axios.get("/knowledge_base/sms/", { params });
      this.smsSendingList = data;
    },

    createSmsSending(data: object) {
      return $axios.post("/knowledge_base/sms/", data);
    },

    updateSmsSending(data) {
      return $axios.patch(`/knowledge_base/sms/${data.id}/`, data);
    },

    deleteSmsSending(id: number) {
      return $axios.delete(`/knowledge_base/sms/${id}/`);
    },

    // status
    async getStatus() {
      const { data } = await $axios.get("/knowledge_base/status_notification/");
      this.statusList = data;
    },
  },
});
