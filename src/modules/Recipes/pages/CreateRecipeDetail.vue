<script setup lang="ts">

//IMPORTED FILES
import { onMounted } from "vue"
import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";
import EditComponent from "../components/EditComponent.vue";
import Mediacontent from "../components/Mediacontent.vue";
import Ingredients from "../components/Ingredients.vue";
import Preparation from "../components/Preparation.vue";





//MOUNTED LIFE CYCLE
onMounted(async () => {

})

</script>

<template>
  <div class="md:flex sm:block items-start gap-5 dark:text-white h-fit">
    <div class="md:w-4/12 sm:w-full">

      <EditComponent  />

      <Mediacontent  />

    </div>


    <div class="md:w-8/12 sm:w-full card">
      <Tabs>
        <Tab title="Ingredients">
          <Ingredients  />
        </Tab>

        <Tab title="Preparation">
          <Preparation  />
        </Tab>
      </Tabs>
    </div>
  </div>
</template>

<style lang="scss">
.card-bg {
  background-color: #F2F2F2;
}
</style>