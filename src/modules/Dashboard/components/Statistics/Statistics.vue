<script setup lang="ts">
import { reactive } from "vue";

const statistics = reactive([
  {
    id: 1,
    title: "IOS",
    icon: "iPhone",
    color: "#40CD7F",
    bgColor: "bg-success/10",
    value: 8,
  },
  {
    id: 2,
    title: "Android",
    icon: "Smartphone",
    color: "#40CD7F",
    bgColor: "bg-success/10",
    value: 49,
  },
  {
    id: 3,
    title: "Users",
    icon: "Users Group Two Rounded",
    color: "#40CD7F",
    bgColor: "bg-success/10",
    value: 79,
  },
  {
    id: 4,
    title: "Sellers",
    icon: "Users Group Rounded",
    color: "#40CD7F",
    bgColor: "bg-success/10",
    value: 0,
  },
]);
</script>

<template>
  <div class="grid gap-5 grid-cols-4">
    <div
      class="card flex items-center justify-between"
      v-for="(item, index) in statistics"
      :key="index"
    >
      <div>
        <h3 class="font-medium dark:text-gray-200 text-gray-600 mb-1">
          {{ item.title }}
        </h3>
        <span class="dark:text-gray-200 text-gray-600">{{ item.value }}</span>
      </div>
      <div
        class="w-[50px] h-[50px] flex items-center justify-center rounded-full"
        :class="`${item.bgColor}`"
      >
        <Icon :icon="item.icon" :color="item.color" />
      </div>
    </div>
  </div>
</template>
