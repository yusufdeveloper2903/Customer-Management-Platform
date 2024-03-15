import {defineStore} from "pinia";
import $axios from "@/plugins/axios";

import {Results, UsersRoles, StaffDetails} from "../interfaces/index";

export default defineStore("staff", {
    state: () => {
        return {
            staffsList: {
                count: 0,
                results: []
            },

            users_roles: {
                results: [] as UsersRoles[]
            } as Results<UsersRoles>,

            staff: {} as StaffDetails
        };
    },

    actions: {
        async getStaffs(params: any) {
            const {data} = await $axios.get("/users/users/", {params});
            this.staffsList = data;
        },

        async getStaffById(id: number) {
            const {data} = await $axios.get(`/users/users/${id}`);
            this.staff = data;
        },

        createStaff(data: object) {
            return $axios.post("/users/users/", data);
        },

        updateStaff(data) {
            return $axios.patch(`/users/users/${data.get("id")}/`, data);
        },

        deleteStaff(id: number) {
            return $axios.delete(`/users/users/${id}/`);
        },


        // role
        async getUsersRolesList() {
            const {data} = await $axios.get("/users/roles/");
            this.users_roles = data;
        },
    },
});
