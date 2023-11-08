import { defineStore } from "pinia";
import $axios from "@/plugins/axios";
import { Banner, Results, Status } from "../interfaces";


export default defineStore("knowledgeBase", {
  state: () => {
    return {
      // sms template
      bannerList:  {
        results: [] as Banner[]
    } as Results<Banner>,
    
    statusList: {
        results: [] as Status[]
    } as Results<Status>,
    };
  },

  actions: {
    // banner
    async getBanner(params) {
      const { data } = await $axios.get("/knowledge_base/banner/", { params});
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

    // status
    async getStatus() {
        const { data } = await $axios.get("/knowledge_base/status_notification/");
        this.statusList = data;
      },
  },
});
