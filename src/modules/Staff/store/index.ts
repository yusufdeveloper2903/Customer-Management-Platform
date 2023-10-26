import { defineStore } from "pinia";
import $axios from "@/plugins/axios";

import { IStaff, IStaffList } from "../interfaces";

export default defineStore("staff", {
  state: () => {
    return {
      staffsList: {} as IStaffList,
      staff: {} as IStaff,
    };
  },

  actions: {
    async getStaffs(params) {
      const { data } = await $axios.get("/users/users/", { params });
      this.staffsList = data;
    },

    async getStaffById(id: number) {
      const { data } = await $axios.get(`/staffs/staffs/${id}`);
      this.staff = data;
    },

    createStaff(data: object) {
      return $axios.post("/staffs/staffs/", data);
    },

    updateStaff(data) {
      return $axios.patch(`/staffs/staffs/${data.get("id")}/`, data);
    },

    deleteStaff(id: number) {
      return $axios.delete(`/staffs/staffs/${id}/`);
    },
  },
});
