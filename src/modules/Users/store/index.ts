import { defineStore } from "pinia";
import $axios from "@/plugins/axios";

import {
  UserList,
  UsersRolesList,
  User,
  Regions,
} from "../interfaces";

export default defineStore("users", {
  state: () => {
    return {
      usersList: {} as UserList,
      usersRolesList: {} as UsersRolesList,
      user: {} as User,
      regions: {} as Regions,
    };
  },

  actions: {
    async getUsers(params) {
      const { data } = await $axios.get("/users/users/", { params});
      this.usersList = data;
    },

    async getUserById(id: number) {
      const { data } = await $axios.get(`/users/users/${id}`);
      this.user = data;
    },

    createUser(data: object) {
      return $axios.post("/users/users/", data);
    },

    updateUser(data) {
      return $axios.patch(`/users/users/${data.get("id")}/`, data);
    },

    deleteUser(id: number) {
      return $axios.delete(`/users/users/${id}/`);
    },

    async getUsersRoles() {
      const { data } = await $axios.get("/users/roles/");
      this.usersRolesList = data;
    },
    async getRegions(params) {
      const { data } = await $axios.get("/knowledge_base/regions/", {params});
      this.regions = data;
      return data;
    },
  },
});
