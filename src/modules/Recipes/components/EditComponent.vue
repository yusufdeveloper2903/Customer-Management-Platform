<script lang="ts" setup>
// Imported files
import { useI18n } from "vue-i18n";
import EditRecipesModal from "./modals/EditRecipesModal.vue";
import {useRoute} from "vue-router";
import { ref } from 'vue';
import RecipeStorage from "@/modules/Recipes/store/index"
import { RecipeDetailEdit } from "../interfaces/index"
import {toast} from "vue3-toastify";





// Declared variables
const {t} = useI18n()
const route = useRoute()
const store = RecipeStorage()
const emits = defineEmits(["recipes"]);
const isLoading = ref<boolean>(false);
const recipeData = ref<RecipeDetailEdit>({
  id: null,
  title: "",
  title_kr: "",
  title_uz: "",
  title_ru: "",
  category: null,
  calorie: 0,
  preparation_time: "",
  rating: "",
  is_active: false
})



// Functions
const refresh = async () => {
    isLoading.value = true;
    try {
      if (route.params.id){
       await store.getRetseptDetail(Number(route.params.id));
       recipeData.value = store.retseptDetailList.data
      
      } 
    } catch (error: any) {
        toast.error(
            error.response || "Error"
        );
    }

    isLoading.value = false;
};
refresh()


  const saveData = (() => {
    refresh()
  })
</script>


<template>
         <div class="card">

<div class="flex justify-between items-center mb-3">
  <h2 class="text-success"><b>{{ t('General') }}</b></h2>
  <button uk-toggle="target: #edit_recipes" >
    <Icon icon="Pen New Square" color="#FFC107" size="16" />
  </button>
</div>

<div>
  <img src="@/assets/image/loading.svg" alt="loading.svg" class="inline w-4 h-4 text-white animate-spin mr-2"
           v-if="isLoading" />

<div class="flex justify-between">
  <div>{{ t('name') }}</div>
  <div>
    <b v-if="recipeData.title">{{ recipeData.title }}</b>
    <b v-else>-</b>
  </div>
</div>

<div class="flex justify-between my-1">
  <div>{{ t('category') }}</div>
  <div>
    <b v-if="recipeData.category">{{ recipeData.category }}</b>
    <b v-else>-</b>
  </div>
</div>

<div class="flex justify-between">
  <div>{{ t('calorie_content') }}</div>
  <div>
    <b v-if="recipeData.calorie">{{ recipeData.calorie }}</b>
    <b v-else>-</b>
  </div>
</div>

<div class="flex justify-between my-1">
  <div>{{ t('preparation_time') }}</div>
  <div>
    <b v-if="recipeData.preparation_time">{{ recipeData.preparation_time }}</b>
    <b v-else>-</b>
  </div>
</div>

<div class="flex justify-between">
  <div>{{ t('rating') }}</div>
  <div>
    <b v-if="recipeData.rating">{{ recipeData.rating }}</b>
    <b v-else>-</b>
  </div>
</div>

<div class="flex justify-between mt-1">
  <div>{{ t('Status') }}</div>
  <div>
    <b :class="recipeData.is_active == true ? 'text-success': 'text-danger'">{{ recipeData.is_active == true ? t('Active'): t('Inactive') }} </b>
  </div>
</div>
</div>
</div>

<EditRecipesModal :edit-data="recipeData" @saveData="saveData"/>
</template>