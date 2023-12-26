<template>
  <div>
    <SideBar @isSideBarOpen="isSideBarOpen" />

    <div
      class="main-layout min-h-screen p-6 pr-7 dark:bg-darkLayoutMain bg-slate-200"
      :class="checkSidebar()"
    >
      <BreadCrumb
        BreadCrumb
        :list="BreadcrumbList"
        v-if="BreadcrumbList.length != 0"
      ></BreadCrumb>
      <slot />
    </div>

    <div
      class="right-sidebar shadow-2xl w-16 bg-primary dark:bg-darkLayoutStorm py-5 text-white"
      :class="checkMiniSidebar()"
    >
      <Minisidebar />
    </div>

    <ScrollToTop />
  </div>
</template>

<script setup>
import "./Bars/sidebar.css";
import SideBar from "./Bars/Sidebar.vue";
import Minisidebar from "./Bars/minisidebar.vue";
import { useSidebarStore } from "@/stores/layoutConfig.ts";
import { onMounted, watch, ref, onBeforeUnmount } from "vue";
import BreadCrumb from "@/components/Breadcrumb/Index.vue";
import { useRoute } from "vue-router";
import ScrollToTop from '@/components/ScrollToTop.vue'

const sidebar = useSidebarStore();
const windowWidth = window.innerWidth;

const checkMiniSidebar = () => {
  if (windowWidth <= 1000) {
    // sidebar.toggleMiniSidebarState()
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

const routerChanged = watch(
  () => route.name,
  (newPath, oldPath) => {
    breadCrumbStart(newPath);
  }
);

onMounted(() => {
  breadCrumbStart(route.name);
});

function breadCrumbStart(newPath) {
  switch (newPath) {
    case "Cars":
      BreadcrumbList.value = [
        { title: "Administration", active: false },
        { title: "sidebar.cars", active: true },
      ];
      break;
    case "Regions":
      BreadcrumbList.value = [
        { title: "Administration", active: false },
        { title: "regions", active: true },
      ];
      break;
    case "Installment":
      BreadcrumbList.value = [
        { title: "Administration", active: false },
        { title: "installment_plan", active: true },
      ];
      break;
    case "TechCertificates":
      BreadcrumbList.value = [
        { title: "Administration", active: false },
        { title: "sidebar.techCertificate", active: true },
      ];
      break;
    case "Requisites":
      BreadcrumbList.value = [
        { title: "Administration", active: false },
        { title: "sidebar.requisites", active: true },
      ];
      break;

    case "Calculator":
      BreadcrumbList.value = [
        // {title: 'sidebar.calculator', active: false},
      ];
      break;

    case "Backup":
      BreadcrumbList.value = [
        { title: "Administration", active: false },
        { title: "backups", active: true },
      ];
      break;
    case "Logging":
      BreadcrumbList.value = [
        { title: "Administration", active: false },
        { title: "journaling", active: true },
      ];
      break;
    case "DataArchive":
      BreadcrumbList.value = [
        { title: "Administration", active: false },
        { title: "backup&archiving", active: true },
      ];
      break;
    case "SystemInfo":
      BreadcrumbList.value = [
        { title: "Administration", active: false },
        { title: "system", active: true },
      ];
      break;

    case "Deals":
      BreadcrumbList.value = [
        // {title: 'sidebar.deals', active: true},
      ];
      break;
    case "Download tech passport":
      BreadcrumbList.value = [
        { title: "sidebar.deals", active: false },
        { title: "sidebar.deals", active: true },
      ];
      break;
    case "Checkout":
      BreadcrumbList.value = [
        { title: "sidebar.deals", active: false },
        { title: "sidebar.deals", active: true },
      ];
      break;
    case "Payment":
      BreadcrumbList.value = [
        { title: "sidebar.deals", active: false },
        { title: "sidebar.deals", active: true },
      ];
      break;
    case "confirm request":
      BreadcrumbList.value = [
        { title: "sidebar.deals", active: false },
        { title: "sidebar.deals", active: true },
      ];
      break;
    case "details":
      BreadcrumbList.value = [
        { title: "sidebar.deals", active: false },
        { title: "sidebar.deals", active: true },
      ];
      break;

    case "profiler":
      BreadcrumbList.value = [
        // {title: 'sidebar.profile', active: true},
      ];
      break;

    case "users":
      BreadcrumbList.value = [
        // {title: 'sidebar.users', active: true},
      ];
      break;
    case "user detail":
      BreadcrumbList.value = [
        { title: "sidebar.users", active: false },
        { title: "user_details", active: true },
      ];
      break;
    case "add user":
      BreadcrumbList.value = [
        { title: "sidebar.users", active: false },
        { title: "user_add", active: true },
      ];
      break;

    default:
      break;
  }
}
</script>
