<template>
  <button
      v-if="sidebar.currentTheme === 'light'"
      @click="sidebar.changeTheme('dark')"
  >
    <Icon icon="Moon" color="#ffffff"/>
  </button>
  <button v-else>
    <Icon icon="Sun" @click="sidebar.changeTheme('light')" color="#FFCC00"/>
  </button>
</template>

<script setup lang="ts">
import {useSidebarStore} from "@/stores/layoutConfig"
import Icon from "@/components/Icons/Icon.vue";

const sidebar = useSidebarStore();
</script>
