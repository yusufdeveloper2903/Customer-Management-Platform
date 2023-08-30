import { defineStore } from "pinia";
import $axios from "@/plugins/axios";

import { IStuffList } from "../interfaces";

export default defineStore("stuff", {
  state: () => {
    return {
      stuffList: {} as IStuffList,
    };
  },

  actions: {
    async getStuff(params) {
      const { data } = await $axios.get("/stuff/stuff/", { params });
      this.stuffList = data;
    },
  },
});
