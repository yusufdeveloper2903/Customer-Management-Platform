import { defineStore } from "pinia";
import $axios from "@/plugins/axios";
import { SmsTemplate, Results } from "../interfaces";


export default defineStore("knowledgeBase", {
  state: () => {
    return {
      // sms template
      smsTemplateList:  {
        results: [] as SmsTemplate[]
    } as Results<SmsTemplate>,
    
    };
  },

  actions: {
    // sms template
    async getSmsTemplate(params) {
      const { data } = await $axios.get("/knowledge_base/sms_template/", { params});
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
  },
});
