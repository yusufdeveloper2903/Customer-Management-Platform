<script setup lang="ts">

//Imported files
import { recipedetailFields } from "../constants";
import recipes from "../store/index"
import { reactive, ref, onMounted } from "vue";
import { toast } from "vue3-toastify";
import UIkit from "uikit";
import { useI18n } from "vue-i18n";
import { watchDebounced } from "@vueuse/core";
import { useRouter } from "vue-router";
import knowledgeBase from '@/modules/KnowledgeBase/store/index';
import EditRecipesModal from "../components/modals/EditRecipesModal.vue";
import { RecipeDetailEdit } from "../interfaces/index"
import DoubleRight from "@/modules/Users/img/double-right-chevron-svgrepo-com.svg"


//Declared variables
const { t } = useI18n()
const store = recipes()
const isLoading = ref(false);
const userId = ref<number | null>(null);
const router = useRouter()
const knowledgeStore = knowledgeBase()
const params = reactive({
    page_size: 10,
    search: "",
    page: 1,
    category: ""
});

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

// Mounted
onMounted(async() => {
   await refresh(params)
})

// Functions
const deleteAction = async () => {
    isLoading.value = true
    try {
        await store.deleteRetsept(userId.value);
        UIkit.modal("#recipes-delete-modal").hide();
        refresh(params)
        toast.success(t('deleted_successfully'));
        if ((store.retseptList.count - 1) % params.page_size == 0) {
            if (params.page > 1) {
                params.page = params.page - 1
                await refresh(params)
            } else {
                params.page = 1
                await refresh(params)
            }

        }
        isLoading.value = false
    } catch (error: any) {
        toast.error(
            t('error')
        );
        isLoading.value = false
    }
}


const handleDeleteModal = (id: number) => {
    UIkit.modal("#recipes-delete-modal").show();
    userId.value = id;
};


watchDebounced(() => params.search, async function () {
    params.page = 1
    await refresh(params)
}, { deep: true, debounce: 500, maxWait: 5000, })


const refresh = async (filter: any) => {
    isLoading.value = true;
    try {
        await store.getRetsept(filter);

    } catch (error: any) {
        toast.error(
            error.response || "Error"
        );
    }

    isLoading.value = false;
    knowledgeStore.getRetseptCategory()
};



const changePagionation = (e: number) => {
    params.page = e;
    refresh(params);
};


const onPageSizeChanged = (e: number) => {
    params.page_size = e
    params.page = 1
    refresh(params)
}

const saveData = (() => { 
    refresh(params)

  })

</script>

<template>
    <div class="card">
        <div class="md:flex justify-between items-end mb-10">
            <form class="md:flex items-center gap-5 md:w-7/12">
            <label for="search" class="w-1/3">
                {{ t('Search') }}
                <input type="text" class="form-input" placeholder="Search" v-model="params.search" />
            </label>

            <label for="category" class="w-1/3">{{ t('category') }}
            <VSelect v-model="params.category"
              :options="knowledgeStore.retseptCategoryList && knowledgeStore.retseptCategoryList.results"
              :getOptionLabel="(name: any) => name.name" :reduce="(item: any) => item.id"
              :placeholder="t('select_category')" />
          </label>
        </form>

            <button class="btn-primary" uk-toggle="target: #edit_recipes" @click="recipeData = <RecipeDetailEdit>{}">
                {{ t("Add") }}
            </button>
        </div>

        <EasyDataTable theme-color="#7367f0" hide-footer :loading="isLoading" :headers="recipedetailFields"
            :items="store.retseptList.results">

            <template #empty-message>
                <span class="dark:text-neutral-400">{{ t('empty_text') }}</span>
            </template>

            <template #header="header">
                {{ t(header.text) }}
            </template>

            <template #item-cooking_time="item">
                {{ item.preparation_time }}
            </template>

            <template #item-photo="items">
                <div class="py-3 flex justify-left gap-3">
                    <img v-if="items && items.photo" class="w-[45px] h-[45px] rounded" :src="items.photo"
                        alt="Photo"  style="aspect-ratio: 1/1 " />
                    <div v-else
                        class="relative text-primary inline-flex items-center justify-center w-[45px] h-[45px] overflow-hidden bg-primary/10 rounded">
                        <Icon icon="Camera" color="#356c2d" />
                    </div>

                </div>
            </template>

            <template #item-is_active="item">
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" :checked="item.is_active" disabled class="sr-only peer" />
                    <div
                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary" />
                </label>
            </template>

            <template #item-actions="item">
                <div class="py-3 flex justify-left items-center gap-3">
                    <button @click="router.push({ name: 'recipe-detail', params: { id: item.id } })" class="btn-success btn-action my-1">
                        <img :src="DoubleRight" alt="Icon">
                    </button>

                    <button class="btn-warning btn-action" uk-toggle="target: #edit_recipes" @click="recipeData = item">
                        <Icon icon="Pen New Square" color="#fff" size="16" />
                    </button>

                    <button class="btn-danger btn-action" @click="handleDeleteModal(item.id)">
                        <Icon icon="Trash Bin Trash" color="#fff" size="16" />
                    </button>
                </div>
            </template>

        </EasyDataTable>

        <TwPagination :total="knowledgeStore.retseptCategoryList.count" class="mt-10 tw-pagination" :current="params.page" :per-page="params.page_size"
            :text-before-input="t('go_to_page')" :text-after-input="t('forward')" @page-changed="changePagionation"
            @per-page-changed="onPageSizeChanged" />
    </div>

    <DeleteModal @delete-action="deleteAction" :id="'recipes-delete-modal'" />
    <EditRecipesModal  :edit-data="recipeData" @saveData="saveData"/>
</template>
