<script setup lang="ts">
import Locale from "@/layout/Bars/Locale.vue";
</script>

<template>
  <div class="dark:bg-gray-900">
    <div class=" min-h-screen justify-center
  ">
      <header
          class="flex justify-between items-center px-5 md:px-20 py-7 mb-10"
      >
        <div class="w-52 flex items-center gap-4 font-medium">
          <img src="@/assets/system/logo.png" alt="" class="lg:w-[70px] w-[40px]"/>

          <h1 class="lg:text-[48px] text-[25px]">CMP</h1>
        </div>

        <div
            class="flex items-center gap-4 !bg-dark  pt-3 pb-3 px-4 rounded-md"
        >
          <Locale/>
        </div>
      </header>

      <slot/>
    </div>
  </div>
</template>
