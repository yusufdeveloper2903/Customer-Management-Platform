//IMPORTED FILES
import {defineStore} from "pinia";
import $axios from "@/plugins/axios";
import {Results, StaffDetails} from "../interfaces/index";


//EXPORT DEFAULT
export default defineStore("staff", {
    state: () => {
        return {
            staffsList: {
                count: 0,
                results: []
            },
            users_roles: {
                results: [] as any
            } as Results<any>,
            staff: {} as StaffDetails
        };
    },

    actions: {

        //GET REQUEST
        async getStaffs(params: any) {
            const {data} = await $axios.get("/users/users/", {params});
            this.staffsList = data;
        },
        async getStaffById(id: number) {
            const {data} = await $axios.get(`/users/users/${id}`);
            this.staff = data;
        },
        async getUsersRolesList() {
            const {data} = await $axios.get("/users/roles/");
            this.users_roles = data;
        },

        //CREATE REQUEST
        createStaff(data: object) {
            return $axios.post("/users/users/", data);
        },


        //PATCH REQUEST
        updateStaff(data: any) {
            return $axios.patch(`/users/users/${data.get("id")}/`, data);
        },


        //DELETE REQUEST
        deleteStaff(id: number | null) {
            return $axios.delete(`/users/users/${id}/`);
        },


    },
});
