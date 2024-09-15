<template>
  <div
      class="sidebar bg-primary dark:bg-darkLayoutStorm"
      :class="{ open: sidebar.isSidebarOpen }"
  >
    <div class="logo-details bg-primary dark:bg-darkLayoutStorm">
      <div class="w-24 h-24 mt-12 ml-3" v-if="sidebar.isSidebarOpen">
        <img src="../../assets/system/logo.png" alt=""/>
      </div>
      <div class="logo_name">
        <span v-if="sidebar.isSidebarOpen">CMP</span>
      </div>
      <i id="btn" :class="`bx ${menuBtnChange()}`" @click="toggleSidebar"/>
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
              ($route.meta.sidebar ==  route.name && 'active-module')
            "
          >
            <a
                class="link"
                @click="toggleDropdwon(route, index)"
            >
              <i class="flex w-[30px] items-center justify-center text-white">
                <Icon :icon="route.icon" :color="$route.meta.sidebar ==  route.name ? '#FFCC00' : '#fff'"/>
              </i>
              <span class="links_name">
                {{ $t(route.name) }}
              </span>


            </a>
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
              <Icon icon="Logout 2" color="#fff"/>
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

//IMPORTED FILES
import {onMounted, ref} from "vue";
import {useSidebarStore} from "@/stores/layoutConfig";
import sidebarRoutes from "@/navigation/vertical/index";
import {useRouter} from "vue-router";
import {logout} from "@/auth/jwtService";


//DECLARED VARIABLES
const sidebar = useSidebarStore();
let isOpenLink = ref<boolean[]>([]);
const router = useRouter();
const onMobile = ref(false);


//MOUNTED

onMounted(() => {
  isOpenLink.value = new Array(sidebarRoutes.length).fill(false);
  if (window.screen.width <= 1000) {
    onMobile.value = true;
  }
});


//FUNCTIONS
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


//ROUTER
router.beforeEach(() => {
  const modal = document.getElementsByClassName("uk-modal");
  const modalArray = Array.from(modal) as Element[];
  modalArray.forEach((el) => el.remove());
});


</script>

<style scoped lang="scss">
.active-module {
  background: rgba(255, 204, 0, 0.10);

  a {
    color: #FFCC00 !important;
  }

  .links_name {
    transition: none !important;
  }
}
</style>
