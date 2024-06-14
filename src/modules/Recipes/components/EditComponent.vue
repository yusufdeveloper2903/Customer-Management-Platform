<script lang="ts" setup>
// Imported files
import { useI18n } from "vue-i18n";
import EditRecipesModal from "./modals/EditRecipesModal.vue";
import {useRoute} from "vue-router";
import { onMounted, ref } from 'vue';
import RecipeStorage from "@/modules/Recipes/store/index"
import { RecipeDetailEdit } from "../interfaces/index"

// Declared variables
const {t} = useI18n()
const route = useRoute()
const store = RecipeStorage()
const recipeData = ref<RecipeDetailEdit>({
  id: null,
  title: "",
  category: null,
  calorie: 0,
  preparation_time: "",
  rating: "",
  is_active: false
})


  onMounted(async() => {
    if (route.params.id) {  
     await store.getRetseptDetail(Number(route.params.id))
      recipeData.value.id = store.retseptDetailList.data?.id
      recipeData.value.title = store.retseptDetailList.data?.title
      recipeData.value.category = store.retseptDetailList.data?.category
      recipeData.value.calorie = store.retseptDetailList.data?.calorie
      recipeData.value.preparation_time = store.retseptDetailList.data?.preparation_time
      recipeData.value.rating = store.retseptDetailList.data?.rating
      recipeData.value.is_active = store.retseptDetailList.data?.is_active
    } else {
      recipeData.value.id = null
      recipeData.value.title = ""
      recipeData.value.category = null
      recipeData.value.calorie = 0
      recipeData.value.preparation_time = ""
      recipeData.value.rating = ""
      recipeData.value.is_active = false
    }
  })
</script>


<template>
         <div class="card">

<div class="flex justify-between items-center mb-3">
  <h2 class="text-success"><b>{{ t('General') }}</b></h2>
  <button uk-toggle="target: #edit_recipes" >
    <Icon icon="Pen New Square" :color="route.params.id ? '#FFC107' : '#009933'" size="16" />
  </button>
</div>

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
  <div>{{ t('cooking_time') }}</div>
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
    <b v-if="recipeData.is_active" :class="recipeData.is_active == true ? 'text-success': 'text-danger'">{{ recipeData.is_active == true ? 'Активный': "Неактивный" }} </b>
    <b v-else>-</b>
  </div>
</div>
</div>

<EditRecipesModal :recipeData="recipeData" />
</template>