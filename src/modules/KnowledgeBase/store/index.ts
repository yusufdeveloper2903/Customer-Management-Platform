import { defineStore } from "pinia";
import $axios from "@/plugins/axios";
import { SmsTemplate, Results, Params, NewsTemplate } from "../interfaces";

export default defineStore("knowledgeBase", {
  state: () => {
    return {
      // sms template
      smsTemplateList: {
        results: [] as SmsTemplate[],
      } as Results<SmsTemplate>,
      newTemplate: {
        results: [] as NewsTemplate[],
      } as Results<NewsTemplate>,
    };
  },

  actions: {
    // sms template
    async getSmsTemplate(params) {
      const { data } = await $axios.get("/knowledge_base/sms_template/", {
        params,
      });
      this.smsTemplateList = data;
    },

    createSmsTemplate(data: object) {
      return $axios.post("/knowledge_base/sms_template/", data);
    },

    updateSmsTemplate(data) {
      return $axios.patch(`/knowledge_base/sms_template/${data.id}/`, data);
    },

    deleteSmsTemplate(id: number) {
      return $axios.delete(`/knowledge_base/sms_template/${id}/`);
    },

    async getNewsTemplate(params: Params) {
      const { data } = await $axios.get(`/knowledge_base/news_template/`, {
        params,
      });
      this.newTemplate = data;
    },

    createNewsTemplate(data: NewsTemplate) {
      return $axios.post(`/knowledge_base/news_template/`, data);
    },

    updateNewsTemplate(data) {
      return $axios.patch(`/knowledge_base/news_template/${data.id || data.get('id')}/`, data);
    },
    deleteNewsTemplate(id: number) {
      return $axios.delete(`/knowledge_base/news_template/${id}/`);
    },
  },
});
