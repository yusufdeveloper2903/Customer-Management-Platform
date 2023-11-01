import { defineStore } from "pinia";
import $axios from "@/plugins/axios";

import { IStaff, Results, UsersRoles } from "../interfaces/index";

export default defineStore("staff", {
  state: () => {
    return {
      staffsList: {
          results: [] as IStaff[]
      } as Results<IStaff>,

      users_roles: {
        results: [] as UsersRoles[]
    } as Results<UsersRoles>,
    };
  },

  actions: {
    async getStaffs(params) {
      const { data } = await $axios.get("/users/users/", { params });
      this.staffsList = data;  
    },

    // async getStaffById(id: number) {
    //   const { data } = await $axios.get(`/staffs/staffs/${id}`);
    //   this.staff = data;
    // },

    createStaff(data: object) {
      return $axios.post("/users/users/", data);
    },

    updateStaff(data) {
      return $axios.patch(`/staffs/staffs/${data.get("id")}/`, data);
    },

    deleteStaff(id: number) {
      return $axios.delete(`/users/users/${id}/`);
    },

    // role
    async getUsersRolesList() {
      const { data } = await $axios.get("/users/roles/");
      this.users_roles = data;  
    },
  },
});
