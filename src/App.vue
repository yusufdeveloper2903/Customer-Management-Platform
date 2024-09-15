<script setup lang="ts">

//IMPORT FILES
import {useSidebarStore} from "@/stores/layoutConfig";
import EmptyLayout from "@/layout/EmptyLayout.vue";
import MainLayout from "@/layout/MainLayout.vue";
import LoginLayout from "@/layout/LoginLayout.vue";
import {onMounted, ref, watch} from "vue";


//DECLARED VARIABLES
const sidebar = useSidebarStore();
const layouts = {
  EmptyLayout: EmptyLayout,
  MainLayout: MainLayout,
  LoginLayout: LoginLayout,
};
const body = ref<HTMLElement | null>(document.querySelector("body"));


//MOUNTED
onMounted(() => {
  body.value?.classList.add(sidebar.currentTheme);
  sidebar.webInfo = JSON.parse(localStorage.getItem("userAbilities") || '[]');
});


//WATCHERS
watch(
    () => sidebar.currentTheme,
    () => {
      if (sidebar.currentTheme === "light") {
        body.value?.classList.remove("dark");
        body.value?.classList.add("light");
      } else {
        body.value?.classList.remove("light");
        body.value?.classList.add("dark");
      }
    }
);


</script>

<template>
  <component :is="layouts[<string>$route.meta.layout] || EmptyLayout">
    <RouterView/>
  </component>
</template>


<style lang="less">
@import "../node_modules/uikit/src/less/uikit.less";
</style>
