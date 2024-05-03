<script setup lang="ts">



//IMPORTED FILES
import { reactive } from "vue";
import { productsFields } from "../../constants/index";
import { formatCurrency } from "@/mixins/features";


//DECLARED VARIABLES
const tableData = reactive([
  {
    id: 1,
    product: {
      img: "https://picsum.photos/300",
      title: "product",
      price: 450000,
    },
    status: "Status",
    seller: {
      img: "https://picsum.photos/300",
      name: "nickname",
    },
    user: {
      img: "https://picsum.photos/300",
      name: "user",
    },
  },
]);
</script>

<template>
  <div class="card">
    <EasyDataTable
        :headers="productsFields"
        :items="tableData"
        hide-footer
    >
      <template #empty-message>
        <div>{{ $t('no_available_data') }}</div>
      </template>
      <template #item-product="items">
        <div class="p-2 flex items-center">
          <img :src="items.product.img" class="w-[100px] rounded" />
          <div class="ml-3">
            <p>{{ items.product.title }}</p>
            <span>{{ formatCurrency(items.product.price) }}</span>
          </div>
        </div>
      </template>
      <template #item-status="items">
        <div class="badge-primary">
          {{ items.status }}
        </div>
      </template>
      <template #item-seller="items">
        <div class="p-2 flex items-center">
          <img :src="items.seller.img" class="w-[50px] rounded-full" />
          <div class="ml-3">
            <p>{{ items.seller.name }}</p>
          </div>
        </div>
      </template>
      <template #item-user="items">
        <div class="p-2 flex items-center">
          <img :src="items.user.img" class="w-[50px] rounded-full" />
          <div class="ml-3">
            <p>{{ items.user.name }}</p>
          </div>
        </div>
      </template>
      <template #item-view>
        <button class="btn-secondary">{{ $t('View') }}</button>
      </template>
    </EasyDataTable>

    <div class="w-full flex justify-end mt-5">
      <button class="btn-primary">{{ $t('directory.seeAll') }}</button>
    </div>
  </div>
</template>

<style></style>
