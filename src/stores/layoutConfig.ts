//IMPORTED FILES
import {defineStore} from "pinia";
import $axios from "@/plugins/axios";


//EXPORTED FILES
export const useSidebarStore = defineStore("counter", {
    state: () => {
        return {

            userData: {},
            imageDetail: '',
            imageBackground: '',
            tabs: 'UZ',
            isSidebarOpen: JSON.parse(
                localStorage.getItem("isSidebarOpen") || "false"
            ),
            currentTheme: localStorage.getItem("currentTheme") || "dark",
            miniSidebar: JSON.parse(localStorage.getItem("miniSidebar") || "false"),

        };
    },

    actions: {
        async getUserData(id: any) {
            const {data} = await $axios.get(`/users/users/${id}/`, )
            this.userData = data
        },
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen;
            localStorage.setItem("isSidebarOpen", this.isSidebarOpen);
        },

        changeTheme(newTheme: string) {
            this.currentTheme = newTheme;
            localStorage.setItem("currentTheme", this.currentTheme);
        },

        toggleMiniSidebarState() {
            this.miniSidebar = !this.miniSidebar;
            localStorage.setItem("miniSidebar", this.miniSidebar);
        },
    },
});
