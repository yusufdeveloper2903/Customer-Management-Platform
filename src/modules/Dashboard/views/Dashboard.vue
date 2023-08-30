<script setup lang="ts">
import Statistics from "../components/Statistics/Statistics.vue";
import Activities from "../components/Activities/Activities.vue";
import Products from "../components/Products/Products.vue";
</script>

<template>
  <div>
    <Statistics />
    <div class="flex justify-between mt-5 gap-5">
      <div class="w-1/3">
        <Activities />
      </div>
      <div class="w-2/3">
        <Products />
      </div>
    </div>
  </div>
</template>

<style></style>
