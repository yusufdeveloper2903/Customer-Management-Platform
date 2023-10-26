<script setup lang="ts">
import { locationFields, locationItems } from "../constants";
</script>

<template>
  <div class="card">
    <div class="flex justify-between items-end mb-10">
      <label for="search" class="w-1/4">
        Search
        <input type="text" class="form-input" placeholder="Search" />
      </label>
      <button class="btn-primary" uk-toggle="target: #intro">
        {{ $t("global.add") }}
      </button>
    </div>

    <EasyDataTable
      theme-color="#7367f0"
      hide-footer
      :headers="locationFields"
      :items="locationItems"
    >
      <template #item-actions="">
        <div class="flex my-4">
          <button class="btn-warning btn-action">
            <Icon icon="Pen New Square" color="#fff" size="16" />
          </button>
          <button class="ml-3 btn-danger btn-action">
            <Icon icon="Trash Bin Trash" color="#fff" size="16" />
          </button>
        </div>
      </template>
    </EasyDataTable>
  </div>
</template>
