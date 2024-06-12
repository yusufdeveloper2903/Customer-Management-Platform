<script lang="ts" setup>
// Imported files
import { useI18n } from "vue-i18n";
import EditRecipesModal from "./modals/EditRecipesModal.vue";


// Declared variables
const {t} = useI18n()
</script>


<template>
         <div class="card">

<div class="flex justify-between items-center mb-3">
  <h2 class="text-success"><b>{{ t('General') }}</b></h2>
  <button uk-toggle="target: #edit_recipes">
    <Icon icon="Pen New Square" color="#FFC107" size="16" />
  </button>
</div>

<div class="flex justify-between">
  <div>{{ t('name') }}</div>
  <div><small><b>-</b></small></div>
</div>

<div class="flex justify-between my-1">
  <div>{{ t('category') }}</div>
  <div><small><b>-</b></small></div>
</div>

<div class="flex justify-between">
  <div>{{ t('calorie_content') }}</div>
  <div><small><b>-</b></small></div>
</div>

<div class="flex justify-between my-1">
  <div>{{ t('cooking_time') }}</div>
  <div><small><b>-</b></small></div>
</div>

<div class="flex justify-between">
  <div>{{ t('rating') }}</div>
  <div><small><b>-</b></small></div>
</div>

<div class="flex justify-between mt-1">
  <div>{{ t('Status') }}</div>
  <div><small><b>-</b></small></div>
</div>
</div>

<EditRecipesModal  />
</template>