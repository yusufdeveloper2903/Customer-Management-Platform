<script setup lang="ts">


//IMPORTED FILES
import {nextTick, onMounted, reactive, ref, watch} from "vue";
import {toast} from "vue3-toastify";
import {productsFields} from "../constants";
import CreateProducts from "./modals/CreateProductsModal.vue";
import knowledgeBase from "../store/index"
import UIkit from "uikit";
import {watchDebounced} from "@vueuse/core";
import {useI18n} from "vue-i18n";
import ShowFileModal from "@/components/ShowPhotoGlobal.vue";
import {EditDataProduct} from '../interfaces/index'


//DECLARED VARIABLES
const {t} = useI18n()
const isLoading = ref<boolean>(false);
const itemId = ref<number | null>(null);
const store = knowledgeBase()
const params = reactive({
  page_size: 10,
  page: 1,
  search: null
});
const props = defineProps<{
  knowledge: string
}>();
let toRefresh = ref(false)
const editData = ref<EditDataProduct>({
  id: '',
  title: '',
  title_uz: '',
  title_kr: '',
  title_ru: '',
  description: '',
  description_uz: '',
  description_kr: '',
  description_ru: '',
  price: '',
  image: '',
  code: "",
  measurement_type: '',
  quantity: ''
})
const image = ref<string>("");
const imageCard = ref();


//MOUNTED LIFE CYCLE
onMounted(async () => {
  let knowledgeBase = localStorage.getItem('knowledgeBase')
  if (knowledgeBase == 'products') {
    await refresh()
  }
})


//WATCHERS
watch(() => props.knowledge, async function (val) {
  toRefresh.value = !toRefresh.value
  if (val == 'products') {
    await refresh()
  }
})
watchDebounced(
    () => params.search,
    async () => {
      params.page = 1;
      await refresh()
    }, {deep: true, debounce: 500, maxWait: 5000}
);


//FUNCTIONS
const changePagionation = (e: number) => {
  params.page = e;
  refresh();
};
const onPageSizeChanged = (e: number) => {
  params.page_size = e
  params.page = 1
  refresh()
}
const handleDeleteModal = (id: number) => {
  UIkit.modal("#product-delete-modal").show()
  itemId.value = id
};
const saveProducts = () => {
  refresh();
}

const refresh = async () => {
  isLoading.value = true;
  try {
    await store.getProducts(params)
  } catch (error: any) {
    toast.error(
        t('error')
    );
  }
  isLoading.value = false;
};
const deleteAction = async () => {
  isLoading.value = true
  try {
    await store.deleteProducts(itemId.value)
    await UIkit.modal("#product-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    if (store.productsList.count > 1 && ((store.productsList.count - 1) % params.page_size == 0)) {
      params.page = params.page - 1
      await refresh()
    } else {
      await refresh()
    }
    isLoading.value = false
  } catch (error: any) {
    toast.error(t('error'));
  }
};
const onShowFile = (item: any) => {
  image.value = item;
  nextTick(() => {
    UIkit.modal("#file-show-image").show();
  });
};
</script>

<template>
  <div class="card">
    <div class="flex justify-between items-end mb-7">

      <label for="search" class="w-1/4">
        {{ $t('Search') }}
        <input type="text" class="form-input" :placeholder="$t('Search')"
               v-model="params.search"/>
      </label>

      <button class="rounded-md bg-success px-6 py-2 text-white duration-100 hover:opacity-90 md:w-auto w-full"
              uk-toggle="target: #create_products" @click="editData = {}">
        {{ $t("Add") }}
      </button>
    </div>

    <EasyDataTable theme-color="#7367f0" hide-footer :loading="isLoading" :headers="productsFields"
                   :items="store.productsList.results">

      <template #empty-message>
        <div>{{ $t('no_available_data') }}</div>
      </template>

      <template #header="header">
        {{ $t(header.text) }}
      </template>
      <template #item-price="data">
        {{ (`${data.price}`).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' Som' }}
      </template>

      <template #item-title="item">
        {{ item['title_' + $i18n.locale] }}
      </template>


      <template #item-image="item">
        <div class="py-3 flex justify-left items-center gap-3">
          <img v-if="item.image"
               class="w-[45px] h-[45px] rounded object-cover"
               :src="item.image"
               alt="Rounded avatar"
               @click="onShowFile(item.image)"
          />
          <div
              v-else
              class="relative text-primary inline-flex items-center justify-center w-[45px] h-[45px] overflow-hidden bg-primary/10 rounded"
          >
            <Icon
                icon="Camera"
                color="#356c2d"
            />
          </div>
        </div>
      </template>

      <template #item-description="item">
        {{ item['description_' + $i18n.locale] }}
      </template>

      <template #item-actions="item">
        <div class="flex justify-left my-4">
          <button class="btn-warning btn-action" uk-toggle="target: #create_products" @click="editData = item">
            <Icon icon="Pen New Square" color="#fff" size="16"/>
          </button>
          <button class="ml-3 btn-danger btn-action" @click="handleDeleteModal(item.id)"
          >
            <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
          </button>
        </div>
      </template>
    </EasyDataTable>

    <DeleteModal @delete-action="deleteAction" :id="'product-delete-modal'"/>

    <TwPagination :restart="toRefresh" :total="store.productsList.count" class="mt-10 tw-pagination"
                  :current="params.page"
                  :per-page="params.page_size"
                  :text-before-input="$t('go_to_page')" :text-after-input="$t('forward')"
                  @page-changed="changePagionation" @per-page-changed="onPageSizeChanged"/>

    <CreateProducts :editData="editData" @saveProducts="saveProducts"/>
    <ShowFileModal :image="image" ref="imageCard" id="file-show-image"/>
  </div>
</template>
