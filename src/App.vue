<script setup lang="ts">
import { useSidebarStore } from "@/stores/layoutConfig";
import EmptyLayout from "@/layout/EmptyLayout.vue";
import MainLayout from "@/layout/MainLayout.vue";
import LoginLayout from "@/layout/LoginLayout.vue";
import { onMounted, ref, watch } from "vue";

const sidebar = useSidebarStore();

const layouts = {
  EmptyLayout: EmptyLayout,
  MainLayout: MainLayout,
  LoginLayout: LoginLayout,
};

const body = ref<HTMLElement | null>(document.querySelector("body"));

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

onMounted(() => {
  body.value?.classList.add(sidebar.currentTheme);
});
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
</script>

<template>
  <component :is="layouts[<string>$route.meta.layout] || EmptyLayout">
    <RouterView />
  </component>
</template>

<style lang="scss">
.height-200 {
  height: 200px;
}

.my-editor {
  /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
  /* background: #2d2d2d; */
  color: #ccc;

  /* you must provide font-family font-size line-height. Example:*/
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

/* optional class for removing the outline */
.prism-editor__textarea:focus {
  outline: none;
}

.uk-open > .uk-accordion-title.show-code::before,
.uk-accordion-title.show-code::before {
  background-image: url(./assets/icons/Code.svg);
}

.uk-open > .uk-accordion-title.show-code:hover,
.uk-accordion-title.show-code:hover {
  transform: translate(0);
}

.bg-dark-theme {
  // background: rgb(40, 48, 70);
  background-color: white;
}
</style>

<style lang="less">
@import "../node_modules/uikit/src/less/uikit.less";
</style>
