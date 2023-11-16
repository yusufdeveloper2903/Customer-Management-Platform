import { defineStore } from "pinia";
import $axios from "@/plugins/axios";
import { Banner, Results, Status, News, SmsSending, Reseivers } from "../interfaces";


export default defineStore("sms", {
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

      newsListDetail: {} as News,

      // sms sending
      smsSendingList: {
        results: [] as SmsSending[]
      } as Results<SmsSending>,

      smsSendingDetail: {} as SmsSending,

      reseiversList: {
        results: [] as Reseivers[]
      } as Results<Reseivers>
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
      return $axios.patch(`/knowledge_base/banner/${data.id || data.get('id')}/`, data);
    },

    deleteBanner(id: number) {
      return $axios.delete(`/knowledge_base/banner/${id}/`);
    },

    // news
    async getNews(params) {
      const { data } = await $axios.get("/knowledge_base/news/", { params });
      this.newsList = data;
    },

    async getNewsDetail(params) {
      const { data } = await $axios.get(`/knowledge_base/news/${params.id}`, { params });
      this.newsListDetail = data;
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

    async getSmsSendingDetail(params) {
      const { data } = await $axios.get(`/knowledge_base/sms/${params.id}/`, { params });
      this.smsSendingDetail = data;
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

    // clients receivers
    async getReseivers(params: any) {
      const { data } = await $axios.get("/clients/client/get_receivers_of_notification/", {params});
      this.reseiversList = data;
    },

  },
});
