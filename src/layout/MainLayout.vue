<template>
  <div>
    <SideBar @isSideBarOpen="isSideBarOpen"/>

    <div
        class="main-layout min-h-screen p-6 pr-7 dark:bg-darkLayoutMain bg-slate-200"
        :class="checkSidebar()"
    >
      <BreadCrumb
          BreadCrumb
          :list="BreadcrumbList"
          v-if="BreadcrumbList.length != 0"
      ></BreadCrumb>
      <slot/>
    </div>

    <div
        class="right-sidebar shadow-2xl w-16 bg-primary dark:bg-darkLayoutStorm py-5 text-white"
        :class="checkMiniSidebar()"
    >
      <Minisidebar/>
    </div>

    <ScrollToTop/>
  </div>
</template>

<script setup>
//Imported files

import "./Bars/sidebar.css";
import SideBar from "./Bars/Sidebar.vue";
import Minisidebar from "./Bars/minisidebar.vue";
import {useSidebarStore} from "@/stores/layoutConfig.ts";
import {onMounted, watch, ref, onBeforeUnmount} from "vue";
import BreadCrumb from "@/components/Breadcrumb/Index.vue";
import {useRoute} from "vue-router";
import ScrollToTop from '@/components/ScrollToTop.vue'

//Declared variables

const sidebar = useSidebarStore();
const windowWidth = window.innerWidth;
const checkMiniSidebar = () => {
  if (windowWidth <= 1000) {
    return "horizontal";
  }
  if (sidebar.miniSidebar && sidebar.isSidebarOpen) {
    return "horizontal smaller";
  } else if (sidebar.miniSidebar && !sidebar.isSidebarOpen) {
    return "horizontal";
  }
};
const checkSidebar = () => {
  if (sidebar.miniSidebar && sidebar.isSidebarOpen) {
    return "open-sidebar pt-28";
  } else if (!sidebar.miniSidebar && sidebar.isSidebarOpen) {
    return "open-sidebar";
  } else if (sidebar.miniSidebar && !sidebar.isSidebarOpen) {
    return "close-sidebar pt-28";
  } else {
    return "close-sidebar";
  }
};
let BreadcrumbList = ref([]);
const route = useRoute();

onMounted(() => {
  breadCrumbStart(route.name);
});

function breadCrumbStart(newPath) {
  console.log(newPath , 'path')
  switch (newPath) {
    case "dashboard":
      BreadcrumbList.value = [
        {title: "dashboard", active: true},
      ];
      break;
    case "users":
      BreadcrumbList.value = [
        {title: 'Users', active: true},
      ];
      break;

    case "knowledgeBase":
      BreadcrumbList.value = [
        {title: 'nav.directory', active: true},
      ];
      break;

    case "staff":
      BreadcrumbList.value = [
        {title: 'nav.staffs', active: true},
      ];
      break;
    case "sms-template":
      BreadcrumbList.value = [
        {title: 'Notifications', active: true},
      ];
      break;

    case "Backup":
      BreadcrumbList.value = [
        {title: "Administration", active: true},
        {title: "backups", active: true},
      ];
      break;
    case "Logging":
      BreadcrumbList.value = [
        {title: "Administration", active: true},
        {title: "journaling", active: true},
      ];
      break;
    case "DataArchive":
      BreadcrumbList.value = [
        {title: "Administration", active: true},
        {title: "backup&archiving", active: true},
      ];
      break;
    case "SystemInfo":
      BreadcrumbList.value = [
        {title: "Administration", active: true},
        {title: "info_about_system", active: true},
      ];
      break;
    case "discounts":
      BreadcrumbList.value = [
        {title: "Discounts", active: true},
      ];
      break;
    case "products":
      BreadcrumbList.value = [
        {title: "products", active: true},
      ];
      break;
    case "promotion":
      BreadcrumbList.value = [
        {title: "Promotion", active: true},
      ];
      break;
    default:
      break;
  }
}
</script>
