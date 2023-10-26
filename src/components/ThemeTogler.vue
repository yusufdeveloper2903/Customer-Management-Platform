<template>
  <button
    v-if="sidebar.currentTheme === 'light'"
    @click="sidebar.changeTheme('dark')"
  >
    <Icon icon="Moon" color="#ffffff"/>
  </button>
  <button v-else>
    <!-- <img src="@/assets/icons/Sun.svg" @click="sidebar.changeTheme('light')" /> -->
    <Icon icon="Sun" @click="sidebar.changeTheme('light')" color="#FFCC00" />
  </button>
</template>

<script setup lang="ts">
import { useSidebarStore } from "@/stores/layoutConfig.ts";
import Icon from "@/components/Icons/Icon.vue";

const sidebar = useSidebarStore();
</script>
