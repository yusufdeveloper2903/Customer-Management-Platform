import {defineStore} from "pinia";
import $axios from "@/plugins/axios";

export default defineStore("dashboard", {
    state: () => {
        return {
            statisticList: [],
            activitiesList: []
        };
    },

    actions: {
        async getStatistic() {
            const {data} = await $axios.get('/clients/get_home_page_card/')
            this.statisticList = data
        },
        async getActivities(params) {
            const {data} = await $axios.get('/clients/get_home_page_last_login_list/', {params})
            this.activitiesList = data
        },
    },
});
