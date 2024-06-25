<script setup lang="ts">

//IMPORTED FILES
import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";
import EditComponent from "../components/EditComponent.vue";
import Mediacontent from "../components/Mediacontent.vue";
import Ingredients from "../components/Ingredients.vue";
import Preparation from "../components/Preparation.vue";
import { useI18n } from "vue-i18n";
import RecipeStorage from '@/modules/Recipes/store/index';
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";


// Declared variables
const { t } = useI18n()
const store = RecipeStorage()
const router = useRouter()


const createDetail = async(value) => {

  let status = value
  try {
      await store.createRecipeChangeStatus(status).then(() => {
        setTimeout(() => {
          toast.success(t("created_successfully"));
        }, 200);
        router.push({ name: 'recipes' })
      });

    } catch (error: any) {
      if (error) {
        toast.error(
          error.response.message || error.response.data.msg || error.response.data.error || t('error')
        );
      }
    }
}

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
        <button class="btn-secondary" @click="createDetail('RETURN')">{{ t('Cancel') }}</button>
        <button class="btn-success ml-2" @click="createDetail('ACTIVATE')">{{ t('Save') }}</button>
      </div>
    </div>

  </div>
</template>
