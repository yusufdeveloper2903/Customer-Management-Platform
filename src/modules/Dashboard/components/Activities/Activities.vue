<script setup lang="ts">
//IMPORTED FILES
import {reactive} from "vue";


//DECLARED VARIABLES
const activities = reactive([
  {
    id: 1,
    title: "IOS",
    icon: "iPhone",
    time: "13:44:51",
    date: "22.08.2023",
  },
  {
    id: 2,
    title: "Android",
    icon: "Smartphone",
    time: "13:44:51",
    date: "22.08.2023",
  },
  {
    id: 2,
    title: "Android",
    icon: "Smartphone",
    time: "13:44:51",
    date: "22.08.2023",
  },
  {
    id: 2,
    title: "Android",
    icon: "Smartphone",
    time: "13:44:51",
    date: "22.08.2023",
  },
  {
    id: 2,
    title: "Android",
    icon: "Smartphone",
    time: "13:44:51",
    date: "22.08.2023",
  },
  {
    id: 2,
    title: "Android",
    icon: "Smartphone",
    time: "13:44:51",
    date: "22.08.2023",
  },
  {
    id: 2,
    title: "Android",
    icon: "Smartphone",
    time: "13:44:51",
    date: "22.08.2023",
  },
]);
</script>

<template>
  <div class="card">
    <div
        class="flex items-center justify-between mb-5"
        v-for="(item, index) in activities"
        :key="index"
    >
      <div class="flex items-center">
        <div
            class="rounded-lg bg-gray-200 w-[40px] h-[40px] flex justify-center items-center"
        >
          <Icon :icon="item.icon"/>
        </div>

        <span class="dark:text-gray-200 text-gray-600 ml-2">{{ item.title }}</span>
      </div>
      <div>
        <span class="dark:text-gray-100 text-gray-300 text-sm">{{item.time }}</span>
        <h5 class="font-medium dark:text-gray-200 text-gray-600 mb-0 pb-0">
          {{ item.date }}
        </h5>
      </div>
    </div>
    <div class="flex justify-center">
      <button class="btn-primary">
        {{ $t('All') }}
      </button>
    </div>
  </div>
</template>

<style></style>
