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

//IMPORTED FILES
import "./Bars/sidebar.css";
import SideBar from "./Bars/Sidebar.vue";
import Minisidebar from "./Bars/minisidebar.vue";
import {useSidebarStore} from "@/stores/layoutConfig.ts";
import {onMounted, watch, ref, onBeforeUnmount} from "vue";
import BreadCrumb from "@/components/Breadcrumb/Index.vue";
import {useRoute} from "vue-router";
import ScrollToTop from '@/components/ScrollToTop.vue'

//DECLARED VARIABLES
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


//WATCHERS
watch(() => route.name, function (val) {
  breadCrumbStart(route.name);

})


//MOUNTED
onMounted(() => {
  breadCrumbStart(route.name);

});

function breadCrumbStart(newPath) {
  localStorage.setItem('sidebar', newPath)
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
    case "polls":
      BreadcrumbList.value = [
        {title: 'Polls', active: true},
      ];
      break;
    case "polls-detail-id":
      BreadcrumbList.value = [
        {title: 'Polls', active: false},
        {title: 'Poll Details', active: true},
      ];
      break
    case "polls-question-add":
      BreadcrumbList.value = [
        {title: 'Polls', active: false},
        {title: 'Poll Details', active: false},
        {title: 'Poll Questions Add', active: true},
      ];
      break;
    case "polls-question-id":
      BreadcrumbList.value = [
        {title: 'Polls', active: false},
        {title: 'Poll Details', active: false},
        {title: 'Poll Questions Edit', active: true},
      ];
      break;

    case "stories":
      BreadcrumbList.value = [
        {title: 'Stories', active: true},
      ];
      break;
    case "stories-detail-id":
      BreadcrumbList.value = [
        {title: 'Stories', active: false},
        {title: 'storiesDetail', active: true},
      ];
      break;
    case "stories-detail":
      BreadcrumbList.value = [
        {title: 'Stories', active: false},
        {title: 'storiesDetail', active: true},
      ]
      break;
    case "user detail":
      BreadcrumbList.value = [
        {title: 'Users', active: false},
        {title: 'user_details', active: true},
      ];
      break;
    case "transactions":
      BreadcrumbList.value = [
        {title: 'Transactions', active: true},
      ];
      break;

    case "add-sms":
      BreadcrumbList.value = [
        {title: 'Notifications', active: false},
        {title: 'addNotification', active: true},
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
    case "add staff":
      BreadcrumbList.value = [
        {title: 'nav.staffs', active: false},
        {title: 'add_staff', active: true},
      ];
      break;
    case "staff detail":
      BreadcrumbList.value = [
        {title: 'nav.staffs', active: false},
        {title: 'staff_details', active: true},
      ];
      break;
    case "sms-template":
      BreadcrumbList.value = [
        {title: 'Notifications', active: true},
      ];
      break;
    case "news-detail":
      BreadcrumbList.value = [
        {title: 'Notifications', active: false},
        {title: 'detailNews', active: true}
      ]
      break;
    case "add-news":
      BreadcrumbList.value = [
        {title: 'Notifications', active: false},
        {title: 'addNews', active: true}
      ]
      break;

    case "sms-detail":
      BreadcrumbList.value = [
        {title: 'Notifications', active: false},
        {title: 'detailNotification', active: true},
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
        {title: "productsCategory", active: true},
      ];
      break;
    case "product-details":
      BreadcrumbList.value = [
        {title: "productsCategory", active: false},
        {title: "products", active: true},
      ];
      break;
    case "promotion":
      BreadcrumbList.value = [
        {title: "Promotions", active: true},
      ];
      break;

      case "recipes":
      BreadcrumbList.value = [
        {title: 'Recipes', active: true},
      ];
      break;
      case "recipe-detail":
      BreadcrumbList.value = [
      {title: 'Recipes', active: false},
        {title: 'recipe detail', active: true},
      ];
      break;

      case "add-recipe":
      BreadcrumbList.value = [
      {title: 'Recipes', active: false},
        {title: 'add_recipe', active: true},
      ];
      break;
    default:
      break;
  }
}
</script>
