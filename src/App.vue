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


.vue3-easy-data-table__header {
  tr {
    th:last-child {
      span {
        div {
          margin-right: 6px !important;

        }
      }
    }
  }
}

.height-200 {
  height: 200px;
}

.my-editor {
  color: #ccc;
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

.prism-editor__textarea:focus {
  outline: none;
}

.uk-open > .uk-accordion-title.show-code::before,
.uk-accordion-title.show-code::before {
  background-image: url(./assets/icons/Code.svg);
}

.uk-modal-dialog .uk-margin-auto-vertical {
  overflow: auto
}

.uk-open > .uk-accordion-title.show-code:hover,
.uk-accordion-title.show-code:hover {
  transform: translate(0);
}

.bg-dark-theme {
  background-color: white;
}

.empty_table {
  text-align: center;
  color: #6e6b7b !important;
  font-size: var(--easy-table-message-font-size);
  padding: var(--easy-table-message-padding);
}

.vue3-easy-data-table__header {
  text-transform: uppercase !important;
}

.vue3-easy-data-table__header tr th span {
  font-weight: 500 !important;
  color: #6e6b7b !important;
}

.vue3-easy-data-table th {
  padding: 13px !important;
  color: #6e6b7b !important;
}

.vue3-easy-data-table__body tr {
  height: 52px !important;
  color: #6e6b7b !important;
}

.vue3-easy-data-table__body tr td {
  text-align: left !important;
}

#text-after-input {
  color: rgb(156 163 175 / var(--tw-text-opacity));
}

.main-section {
  user-select: none !important;
}

.save-class {
  background-color: #1a4b75 !important;

  border-radius: 0.5rem;
  --tw-bg-opacity: 1;
  background-color: rgb(40 205 65 / var(--tw-bg-opacity));
  padding-left: 2rem;
  padding-right: 2rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
  border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out, background 0s,
  border 0s;
}

.save-class:hover {
  box-shadow: 0 8px 25px -8px #1a4b75;
}

.cancel-class {
  background-color: #82868b !important;

  border-radius: 0.5rem;
  --tw-bg-opacity: 1;
  background-color: rgb(40 205 65 / var(--tw-bg-opacity));
  padding-left: 2rem;
  padding-right: 2rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
  border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out, background 0s,
  border 0s;
}

.cancel-class:hover {
  box-shadow: 0 8px 25px -8px #82868b;
}

.vs__search {
  padding: 5px 7px !important;
  margin: 0 !important
}

.dp__input_wrap input{
  padding: 0.68rem 7px !important;
}

.custom-button {
  background-color: white !important;
  color: black !important;
  font-weight: bold !important;
  padding: 11px !important;
  border-radius: 0.357rem;
  position: absolute;
  top: 29px;
  right: 36px;
  box-shadow: 0 5px 20px 0 rgba(34, 41, 47, 0.1);
  opacity: 1;
  transition: all 0.25s;
}

.custom-button:hover {
  top: 36px;
}

.dp__active_date {
  color: white !important
}

.vue3-easy-data-table__main {
  border: 1px solid #e0e0e0;
}

.Toastify__toast-body {
  font-family: Montserrat, Helvetica, Arial, serif !important;
}

.dark .dp__menu_inner {
  --tw-bg-opacity: 1;
  background-color: rgb(40 48 70 / var(--tw-bg-opacity));

  .dp__calendar_header {
    color: white
  }

  .dp__month_year_wrap {
    button {
      color: white
    }
  }

  .dp__calendar_row .dp__range_between {
    color: black !important
  }

  .dp__calendar {
    div {
      color: white;

    }
  }

  :hover {
    color: black !important
  }
}
</style>
