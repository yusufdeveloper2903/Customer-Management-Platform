// stores/counter.js
import { defineStore } from "pinia";

export const useSidebarStore = defineStore("counter", {
  state: () => {
    return {
      isSidebarOpen: JSON.parse(
        localStorage.getItem("isSidebarOpen") || "false"
      ),
      currentTheme: localStorage.getItem("currentTheme") || "dark",
      miniSidebar: JSON.parse(localStorage.getItem("miniSidebar") || "false"),
    };
  },

  actions: {
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
