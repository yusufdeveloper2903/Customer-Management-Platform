<script setup lang="ts">
//Imported files
import {nextTick, reactive, ref, watch} from "vue";
import {toast} from "vue3-toastify";
import {productsFields} from "../constants";
import CreateProducts from "./modals/CreateProductsModal.vue";
import knowledgeBase from "../store/index"
import UIkit from "uikit";
import {watchDebounced} from "@vueuse/core";
import {useI18n} from "vue-i18n";
import ShowFileModal from "@/modules/KnowledgeBase/components/ShowImageModal.vue";
//Declared variables

const {t} = useI18n()
const isLoading = ref<boolean>(false);
const itemId = ref<number | null>(null);
const store = knowledgeBase()
const params = reactive({
  page_size: 10,
  page: 1,
  search: ''
});

const props = defineProps<{
  knowledge: string
}>();

let toRefresh = ref(false)
watch(() => props.knowledge, function () {
  toRefresh.value = !toRefresh.value
})

interface EditData {
  id: number | null,
  title: {
    uz: string,
    ru: string
  },
  description: {
    uz: string,
    ru: string
  },
  price: number | null,
  image: null | string,
  code: string,
  measurement_type: string | null,
  quantity: number | null
}

interface Emits {
  (event: "update:modelValue", value: File | File[]): void;

  (event: "remove", value: ReturnValue | string): void;

  (event: "show", value: ReturnValue | string): void;
}

const emit = defineEmits<Emits>();

const editData = ref<EditData>({
  id: 0,
  title: {
    uz: "",
    ru: ""
  },
  description: {
    uz: "",
    ru: ""
  },
  price: null,
  image: null,
  code: "",
  measurement_type: '',
  quantity: 0
})

const changePagionation = (e: number) => {
  params.page = e;
  refresh(params);
};
const onPageSizeChanged = (e) => {
  params.page_size = e
  params.page = 1
  refresh(params)
}

const handleDeleteModal = (id) => {
  UIkit.modal("#product-delete-modal").show()
  itemId.value = id
};

const saveProducts = () => {
  refresh(params);
}


const refresh = async (filter: any) => {
  isLoading.value = true;
  try {
    await store.getProducts(filter)
  } catch (error: any) {
    toast.error(
        t('error')
    );
  }
  isLoading.value = false;
};
refresh(params)
const deleteAction = async () => {
  isLoading.value = true
  try {
    await store.deleteProducts(itemId.value)
    UIkit.modal("#product-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    if ((store.productsList.count - 1) % params.page > 0) {
      params.page = params.page - 1
      await refresh(params)
    } else {
      await refresh(params)
    }

    isLoading.value = false
  } catch (error: any) {
    toast.error(
        t('error')
    );
  }
};
watchDebounced(
    () => params.search,
    async () => {
      params.page = 1;
      await refresh(params)
    }, {deep: true, debounce: 500, maxWait: 5000}
);
const image = ref<string>("");
const imageCard = ref();
const onShowFile = (item: any) => {
  image.value = item;
  nextTick(() => {
    UIkit.modal("#file-show-image").show();
    emit("show", item);
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
              uk-toggle="target: #create_products" @click="editData = <EditData>{}">
        {{ $t("Add") }}
      </button>
    </div>

    <EasyDataTable theme-color="#7367f0" hide-footer :loading="isLoading" :headers="productsFields"
                   :items="store.productsList.results">

      <template #empty-message>
        <span>{{ $t('empty_text') }}</span>
      </template>

      <template #header-code="header">
        {{ $t(header.text) }}
      </template>

      <template #header-title="header">
        {{ $t(header.text) }}
      </template>

      <template #header-image="header">
        {{ $t(header.text) }}
      </template>

      <template #header-actions="header">
        {{ $t(header.text) }}
      </template>

      <template #header-price="header">
        {{ $t(header.text) }}
      </template>
      <template #item-price="data">
        {{ (`${data.price}`).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' Som' }}
      </template>
      <template #header-quantity="header">
        {{ $t(header.text) }}
      </template>

      <template #item-title="item">
        {{ item.title[$i18n.locale] }}
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
        {{ item.description[$i18n.locale] }}
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
