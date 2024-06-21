//IMPORTED FILES

import {defineStore} from "pinia";
import $axios from "@/plugins/axios";
import {
    UserList,
    UsersRolesList,
    User,
    Regions,
    params,
} from "../interfaces";


//EXPORT DEFAULT

export default defineStore("users", {
    state: () => {
        return {
            usersList: {} as UserList,
            usersRolesList: {} as UsersRolesList,
            user: {} as User,
            regions: {} as Regions,
            usersListSelected: {} as UserList
        };
    },

    actions: {
        // GET REQUESTS
        async getUsers(params: params) {
            const {data} = await $axios.get("/clients/client/", {params});
            this.usersList = data;
        },
        async getUsersSelected(params:any) {
            const {data} = await $axios.get("/clients/client/", {params});
            this.usersListSelected = data;
        },
        async getUserById(id: number) {
            const {data} = await $axios.get(`/clients/client/${id}`);
            this.user = data;
        },
        async getRegions(params) {
            const {data} = await $axios.get("/knowledge_base/regions/", {params});
            this.regions = data;
            return data;
        },


        //CREATE REQUESTS
        createTerminateId(data: object) {
            return $axios.post("/clients/terminate_client_session/", data);
        },


        //DELETE REQUESTS
        deleteUser(id: number) {
            return $axios.delete(`/users/users/${id}/`);
        },

    },
});
