<template>
  <div
    class="sidebar bg-[#051e34] dark:bg-darkLayoutStorm"
    :class="{ open: sidebar.isSidebarOpen }"
  >
    <div class="logo-details bg-[#051e34] dark:bg-darkLayoutStorm">
      <div class="logo_name">
        <span v-if="sidebar.isSidebarOpen">Havas</span>
      </div>
      <i id="btn" :class="`bx ${menuBtnChange()}`" @click="toggleSidebar" />
    </div>
    <div class="container">
      <div class="main-section">
        <ul class="nav-list">
          <li
            v-for="(route, index) in sidebarRoutes"
            :key="index"
            :class="
              (isOpenLink[index] &&
                sidebar.isSidebarOpen &&
                'open_dropdown multiple-item') ||
              ($route.path === route.path && 'bg-[#ffffff1e]')
            "
          >
            <a
              class="link"
              @click="toggleDropdwon(route, index)"
              v-if="check(route.permissions)"
            >
              <i class="flex w-[30px] items-center justify-center text-white">
                <Icon :icon="route.icon" color="#fff" />
              </i>
              <span class="links_name">
                {{ $t(route.name) }}
              </span>

              <button v-if="route.child" class="links_dropdown_arrow">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 9L12 15L5 9"
                    stroke="#ffffff"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </a>
            <span v-if="route.child" class="tooltip">
              <span v-if="!sidebar.isSidebarOpen" class="my-3 block">{{
                $t(route.name)
              }}</span>
              <router-link
                v-for="(child, index) in route.child"
                :key="index"
                active-class="active-route"
                :to="child.path"
                @click="onMobile ? toggleSidebar() : ''"
              >
                <template v-if="check(child.permissions)">
                  <i
                    class="flex w-[30px] items-center justify-center text-white"
                  >
                    <Icon :icon="child.icon" color="#fff" size="16" />
                  </i>
                  {{ $t(child.name) }}
                </template>
              </router-link>
            </span>
            <span v-else class="tooltip">
              <router-link active-class="active-route" :to="route.path">
                <i
                  uk-icon="chevron-double-right"
                  class="flex w-[30px] items-center justify-center text-white"
                />
                <span class="text-white">
                  {{ $t(route.name) }}
                </span>
              </router-link>
            </span>
          </li>

          <li
            class="profile bg-white/10 cursor-pointer md:hidden"
            @click="logout()"
          >
            <div class="profile-details">
              <div class="name_job">
                <div class="name">{{ $t("logout") }}</div>
              </div>
            </div>
            <div>
              <Icon icon="Logout 2" color="#fff" />
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div
    class="sidebar-blur absolute w-full h-full z-[98] md:hidden"
    v-if="sidebar.isSidebarOpen"
    @click="sidebar.toggleSidebar()"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useSidebarStore } from "@/stores/layoutConfig";
import sidebarRoutes from "@/navigation/vertical/index";
import { useRouter } from "vue-router";
import { logout } from "@/auth/jwtService";
import { check } from "@/mixins/permissions";

const sidebar = useSidebarStore();

let isOpenLink = ref<boolean[]>([]);
const router = useRouter();
const onMobile = ref(false);

const toggleSidebar = () => {
  sidebar.toggleSidebar();
  menuBtnChange();
};

const menuBtnChange = () => {
  return sidebar.isSidebarOpen ? "bx-menu-alt-right" : "bx-menu";
};

const toggleDropdwon = (route, index) => {
  if (route && !route.child) {
    router.push(route.path);
  } else {
    isOpenLink.value[index] = !isOpenLink.value[index];
  }

  if (!route.child && onMobile.value) {
    toggleSidebar();
  }

  return;
};

router.beforeEach(() => {
  const modal = document.getElementsByClassName("uk-modal");
  const modalArray = Array.from(modal) as Element[];
  modalArray.forEach((el) => el.remove());
});

onMounted(() => {
  isOpenLink.value = new Array(sidebarRoutes.length).fill(false);

  if (window.screen.width <= 1000) {
    onMobile.value = true;
  }
});
</script>
