import { defineStore } from "pinia";
import $axios from "@/plugins/axios";

import {
  UserList,
  UsersRolesList,
  User,
  Regions,
  userCards,
} from "../interfaces";

export default defineStore("users", {
  state: () => {
    return {
      usersList: {} as UserList,
      usersRolesList: {} as UsersRolesList,
      user: {} as User,
      regions: {} as Regions,
      userCards: {} as userCards,
    };
  },

  actions: {
    async getUsers(params) {
      const { data } = await $axios.get("/users/users/", { params });
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

    async getUserCards(id: number) {
      const { data } = await $axios.get(`/users/user-cards/${id}/`);
      this.userCards = data;
    },

    createUserCard(data) {
      return $axios.post(`/users/user-card/`, data);
    },

    updateUserCard(data) {
      return $axios.patch(`/users/user-card/${data.id}/`, data);
    },

    deleteUserCard(id: number) {
      return $axios.delete(`/users/user-card/${id}/`);
    },

    // change user phone
    updateUserPhone(phone) {
      return $axios.post(`/users/change_user_phone/`, phone);
    },

    smsCodeToUpdateUserPhone(data) {
      return $axios.post(`/users/change_user_phone/check_sms_code/`, data);
    },

    checkScoring(id) {
      return $axios.post(`/users/scoring/${id}/`, id);
    },
  },
});
