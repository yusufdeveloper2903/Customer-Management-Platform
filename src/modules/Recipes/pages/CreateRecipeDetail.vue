<script setup lang="ts">

//IMPORTED FILES
import { onMounted } from "vue"
import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";
import EditComponent from "../components/EditComponent.vue";
import Mediacontent from "../components/Mediacontent.vue";
import Ingredients from "../components/Ingredients.vue";
import Preparation from "../components/Preparation.vue";
import { useI18n } from "vue-i18n";



const { t } = useI18n()



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


    <div class="md:w-8/12 sm:w-full">
      <div class="card">
      <Tabs>
        <Tab title="Ingredients">
          <Ingredients  />
        </Tab>

        <Tab title="Preparation">
          <Preparation  />
        </Tab>
      </Tabs>
    </div>
      <div class="flex justify-end mt-5">
        <button class="btn-secondary">{{ t('Cancel') }}</button>
        <button class="btn-success ml-2">{{ t('Save') }}</button>
      </div>
    </div>

  </div>
</template>
