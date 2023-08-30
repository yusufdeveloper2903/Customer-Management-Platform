<template>
  <div class="additional-classes">
    <div
      class="avatar-tooltip cursor-pointer w-10 h-10 block hover:relative hover:shadow-lg ml-3.5"
    >
      <div
        v-if="!userImage"
        class="mx-auto flex h-10 w-10 items-center justify-center rounded bg-primary/20"
      >
        <Icon icon="User" color="#3ca14b" />
      </div>

      <div
        v-else
        class="mx-auto flex h-10 w-10 items-center justify-center rounded overflow-hidden"
      >
        <img
          class="w-full h-full object-cover"
          :src="userImage"
          alt="Rounded avatar"
        />
      </div>
    </div>
    <div
      v-show="sidebar.miniSidebar"
      uk-dropdown="pos: bottom-right;"
      class="bg-white dark:text-gray-300 p-0 py-2"
    >
      <div
        class="flex justify-between items-center p-3 hover:bg-primary/10 hover:text-primary"
        @click="logout"
      >
        <span class="text-success">{{ $t("logout") }}</span>
        <Icon icon="Logout 2" color="#3ca14b" />
      </div>
    </div>

    <div v-if="sidebar.miniSidebar" class="horizontal-state">
      <!-- icons -->
      <div class="ml-6 mt-10 action-icons flex items-center">
        <span
          class="my-5 block cursor-pointer burger-btn"
          @click="sidebar.toggleSidebar()"
          uk-icon="menu"
        />

        <!-- <Icon
          class="block cursor-pointer"
          icon="Magnifer"
          color="#fff"
          uk-toggle="target: #modal-search"
        /> -->

        <!-- theme togler -->
        <ThemeTogler />

        <Icon
          class="block cursor-pointer close-on-phone"
          icon="Align Horizontal Center"
          color="#fff"
          @click="changeSidebarPosition"
        />
      </div>
      <div class="flex items-center gap-x-5">
        <Locale />
        <span
          class="bg-white/10 text-white rounded-full px-4 py-1 font-semibold text-sm"
        >
          {{ getUserData().role[0].name[locale] }}
        </span>
      </div>
    </div>

    <div v-else class="vertical">
      <div
        v-if="check()"
        class="bg-white/10 mr-16 mt-2 h-7 text-white rounded-full px-4 py-1 font-semibold text-sm"
      >
        {{ getUserData().role[0].name[locale] }}
      </div>

      <Locale class="mt-5" />

      <div class="ml-6 mt-10 action-icons">
        <span
          class="my-5 block cursor-pointer burger-btn"
          @click="sidebar.toggleSidebar()"
          uk-icon="menu"
        />

        <!-- <Icon
          icon="Magnifer"
          color="#fff"
          class="cursor-pointer"
          uk-toggle="target: #modal-search"
        /> -->

        <!-- theme togler -->
        <ThemeTogler />

        <Icon
          icon="Align Vertical Center"
          color="#fff"
          class="cursor-pointer close-on-phone"
          @click="changeSidebarPosition"
        />
      </div>
    </div>
    <div class="fixed bottom-5 logout left-6 cursor-pointer" @click="logout">
      <Icon icon="Logout 2" color="#fff" />
    </div>
  </div>

  <!-- search modal-->
  <div id="modal-search" class="uk-flex-top" uk-modal>
    <div class="uk-modal-dialog overflow-hidden rounded-md">
      <div class="uk-modal-header z-50 border-0 bg-white shadow">
        <form
          class="uk-search uk-search-default mb-8 w-full"
          @submit.prevent=""
        >
          <span uk-search-icon style="margin-top: 4px" />
          <input
            id="search"
            v-model="search"
            type="search"
            autofocus
            :placeholder="$t('Search')"
            class="mt-1 block w-full rounded-md border border-slate-300 bg-white py-3 pl-9 pr-3 text-xl text-gray-600 shadow-sm duration-150 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1"
            @keyup.enter="onEnter($event)"
            @input="onSearch($event.target.value)"
          />
        </form>
      </div>

      <div class="uk-modal-body h-[60vh] overflow-y-scroll">
        <div>
          <div class="mb-5 text-xl font-medium text-primary">
            {{ $t("pages") }}
          </div>
          <div
            v-for="(item, index) in items2"
            :key="index"
            class="uk-card uk-card-small uk-card-default shadow-l mb-2 cursor-pointer rounded-md transition duration-100 hover:bg-primary hover:text-white"
            uk-toggle="target: #modal-search"
            :class="
              index == 0 && items.length == 0 && search
                ? 'bg-primary text-white'
                : 'bg-white'
            "
            @click="goToPage(item)"
          >
            <div class="uk-card-body">
              <p>{{ $t(item.name.split(" ")[0]) }}</p>
            </div>
          </div>
        </div>
      </div>
      <p class="p-5 text-center text-sm text-gray-700"></p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useSidebarStore } from "@/stores/layoutConfig.ts";
import { getUserData } from "@/auth/jwtService";
import users from "@/modules/Users/store/index";
import UIkit from "uikit";
import i18n from "@/plugins/i18n";
import ThemeTogler from "@/components/ThemeTogler.vue";
import { logout } from "@/auth/jwtService";
import { useI18n } from "vue-i18n";
import Locale from "./Locale.vue";

const route = useRoute();
const router = useRouter();
const { locale, t } = useI18n();

const sidebar = useSidebarStore();

let items = ref([]);
let items2 = ref([]);

function onSearch(text) {
  const inputLower = text.toLowerCase();

  items2.value = pagesList.value.filter((item) =>
    t(item.name).toLowerCase().includes(inputLower)
  );
}

function changeSidebarPosition() {
  sidebar.toggleMiniSidebarState();
}

function goToPage(item) {
  router.push(item.path);
}

function onEnter() {
  router.push(items2.value[0].path);
  UIkit.modal("#modal-search").hide();
  search.value = "";
  items2.value = pagesList.value;
}

function check() {
  if (window.innerWidth < 1000) return true;
  return false;
}

const store = users();
const userImage = ref("");

onMounted(() => {
  if (getUserData()) {
    store.getUserById(Number(getUserData().id)).then(() => {
      userImage.value = store.user.photo;
    });
  }

  // document.addEventListener("keydown", (e) => {
  //   if (e.ctrlKey && e.code === "KeyK") {
  //     e.preventDefault();
  //     UIkit.modal("#modal-search").show();
  //   }
  // });
});

let pagesList = ref([
  {
    name: "Users",
    path: "/users",
  },
  {
    name: "regions",
    path: "/reference/regions",
    icon: "File",
  },
  {
    name: "sidebar.cars",
    path: "/reference/cars",
    icon: "File",
  },
  {
    name: "sidebar.techCertificate",
    path: "/reference/tech-certificates",
    icon: "File",
  },
  {
    name: "sidebar.requisites",
    path: "/reference/requisites",
    icon: "File",
  },
  {
    name: "sidebar.installment",
    path: "/reference/installment",
    icon: "File",
  },
  {
    name: "sidebar.calculator",
    path: "/reference/calculator",
    icon: "File",
  },

  // admin
  {
    name: "administration.backups",
    path: "/reference/backup",
    icon: "File",
  },
  {
    name: "administration.journaling",
    path: "/reference/logging",
    icon: "File",
  },
  {
    name: "administration.backup&archiving",
    path: "/reference/data-archive",
    icon: "File",
  },
  {
    name: "administration.system",
    path: "/reference/system-info",
    icon: "File",
  },

  // deals
  {
    name: "sidebar.deals",
    icon: "cart",
    path: "/deals",
  },

  // profile
  {
    name: "sidebar.profile",
    icon: "user",
    path: "/profile",
  },
]);

items2.value = pagesList.value;
</script>
