<script setup lang="ts">
// import ThemeTogler from "@/components/ThemeTogler.vue";
import Locale from "@/layout/Bars/Locale.vue";


</script>

<template>
  <div class=" dark:bg-gray-900 backgroundImage">
    <div class=" min-h-screen justify-center
  ">
      <header
          class="flex justify-between items-center px-5 md:px-20 py-7 mb-10"
      >
        <div class="w-52 flex items-center gap-4 font-medium">
          <img src="@/assets/havas/logo.svg" alt="" class="lg:w-[70px] w-[40px]"/>

          <h1 class="lg:text-[48px] text-white text-[25px]">Havas</h1>
        </div>

        <div
            class="flex items-center gap-4 bg-white dark:bg-darkLayoutMain pt-3 pb-3 px-4 rounded-md"
        >
<!--          <ThemeTogler/>-->

          <Locale/>
        </div>
      </header>

      <slot/>
    </div>
  </div>
</template>

<style>

.backgroundImage {
  background-image: url('../assets/backgroundImageLogin.png') !important;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 100%;
}

</style>
