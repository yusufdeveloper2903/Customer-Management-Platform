<script setup lang="ts">


//IMPORTED FILES
import knowledgeBase from ".././store/index";
import {onMounted, reactive, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import UIkit from "uikit";
import FaqsModal from "../components/modals/FaqsModal.vue";
import {FaqsTemplate} from "../interfaces/index";
import {toast} from "vue3-toastify";
import {watchDebounced} from "@vueuse/core";


//DECLARED VARIABLES
const {t} = useI18n()
const store = knowledgeBase();
const isLoading = ref(false);
const itemToDelete = ref<number | null>(null);
const dataToEdit = ref<FaqsTemplate>({
  id: null,
  question: '',
  question_uz: '',
  question_kr: '',
  question_ru: '',
  answer: '',
  answer_uz: '',
  answer_kr: '',
  answer_ru: '',
});
const params = reactive({
  page: 1,
  page_size: 10,
  search: ''
})
const props = defineProps<{
  knowledge: string
  params: {
    page: number,
    page_size: number
  }
}>();
let toRefresh = ref(false)


//MOUNTED LIFE CYCLE
onMounted(async () => {
  let page = localStorage.getItem('page')
  let page_size = localStorage.getItem('page_size')
  if (page) {
    params.page = JSON.parse(page)
  }
  if (page_size) {
    params.page_size = JSON.parse(page_size)
  }
  let knowledgeBase = localStorage.getItem('knowledgeBase')
  if (knowledgeBase == 'faqs') {
    await refresh()
  }
});


//WATCHERS
watch(() => props.knowledge, async function (val) {
  toRefresh.value = !toRefresh.value
  if (val == 'faqs') {
    params.page = props.params.page
    params.page_size = props.params.page_size
    await refresh()
  }

})
watchDebounced(() => params.search, async function () {
  params.page = 1
  localStorage.setItem('page', '1')
  await refresh()
}, {deep: true, debounce: 500, maxWait: 5000})


//FUNCTIONS
const refresh = async () => {
  await store.getFaqs(params);
};
const openModal = (val) => {
  if (val) {
    UIkit.modal("#faqs_template").show()
    dataToEdit.value = val
  } else {
    UIkit.modal("#faqs_template").show()
    dataToEdit.value = {};
  }
}


const deleteAction = async () => {
  isLoading.value = true
  try {
    await store.deleteFaqs(itemToDelete.value)
    await UIkit.modal("#faqs-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    if (store.faqsList.count > 1 && ((store.faqsList.count - 1) % params.page_size == 0)) {
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
const changePagination = (page: number) => {
  params.page = page;
  refresh();
};
const onPageSizeChanged = (e: number) => {
  params.page_size = e
  params.page = 1
  refresh()

}
const handleDeleteModal = (id: number) => {
  itemToDelete.value = id
  UIkit.modal("#faqs-delete-modal").show()
};

</script>

<template>
  <div>
    <div class="flex justify-between items-end mb-7">
      <label for="search">
        {{ $t('Search') }}
        <input
            v-model="params.search"
            type="text"
            class="form-input"
        />
      </label>
      <button class="rounded-md bg-success px-6 py-2 text-white duration-100 hover:opacity-90 md:w-auto w-full"
              @click="openModal(false)">
        {{ $t("Add") }}
      </button>
    </div>
    <section class="accordion mt-3" v-if="store.faqsList.results.length">
      <div class="tab" v-for="item in  store.faqsList.results" :key="item.id">
        <input type="checkbox" name="accordion-1" :id="String(item.id)">
        <label :for="String(item.id)" class="tab__label card">
          <div class="ml-3 mt-1">{{ item.id }}</div>
          <div class="ml-4 mt-1 select-none flex items-center">{{ item["question_" + $i18n.locale] }}</div>
          <small class="ml-auto">
            <small class="flex my-4 justify-end">

              <button @click="openModal(item)" class="btn-warning btn-action"
              >
                <Icon icon="Pen New Square" color="#fff" size="16"/>
              </button>
              <button
                  class="ml-3 btn-danger btn-action"
                  @click="handleDeleteModal(item.id)"
              >
                <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
              </button>
            </small>
          </small>
        </label>
        <div class="tab__content mt-2 mb-2 ">
          <div class="card relative ">
            <div class="quilTable">
              <Editor
                  content-type="html"
                  :readOnly="true"
                  toolbar="false"
                  class="scrollbar"
                  style="height: 7vh; overflow-y: scroll;border:none;margin-top:-12px"
                  v-model:content="item['answer_' + $i18n.locale] "
              >
              </Editor>
            </div>
          </div>

        </div>
      </div>

    </section>
    <section v-else class="card mt-3">
      <div class="text-center">{{ $t('no_available_data') }}</div>
    </section>
    <TwPagination
        :total="store.faqsList.count"
        class="mt-10 tw-pagination"
        :current="params.page"
        :restart="toRefresh"
        :per-page="params.page_size"
        :text-before-input="$t('go_to_page')"
        :text-after-input="$t('forward')"
        @page-changed="changePagination"
        @per-page-changed="onPageSizeChanged"
    />
  </div>
  <DeleteModal @delete-action="deleteAction" id="faqs-delete-modal"/>
  <FaqsModal :edit-data="dataToEdit" @refresh="refresh"/>
</template>
<style lang="scss" scoped>


.dark .card {
  --tw-bg-opacity: 1;
  background-color: rgb(23 29 50 / var(--tw-bg-opacity)) !important;
  color: white !important;
}

.card {
  box-shadow: none
}

.new {
  padding: 50px;
}

.form-group-checkbox {
  display: block;

  //margin-bottom: 10px;
}

.form-group-checkbox input {
  padding: 0;
  height: initial;
  width: initial;
  margin-bottom: 0;
  display: none;
  cursor: pointer;

}

.form-group-checkbox label {
  position: relative;
  cursor: pointer;
}

.form-group-checkbox label:before {
  content: '';
  -webkit-appearance: none;
  background-color: transparent;
  border: 2px solid #ddd;;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), inset 0px -15px 10px -12px rgba(0, 0, 0, 0.05);
  padding: 8px;
  display: inline-block;
  position: relative;
  vertical-align: middle;
  cursor: pointer;
  margin-right: 10px;
}

.form-group-checkbox input:checked + label:after {
  content: '';
  display: block;
  position: absolute;
  top: 2px;
  left: 9px;
  width: 6px;
  height: 14px;
  border: solid #0079bf;
  border-width: 0 2px 2px 0;

  transform: rotate(45deg);
}

[type="radio"]:checked,
[type="radio"]:not(:checked) {
  position: absolute;
  left: -9999px;
}

[type="radio"]:checked + label,
[type="radio"]:not(:checked) + label {
  position: relative;
  padding-left: 28px;
  cursor: pointer;
  line-height: 20px;
  display: inline-block;
  color: #666;

}

[type="radio"]:checked + label:before,
[type="radio"]:not(:checked) + label:before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 18px;
  height: 18px;
  border: 1px solid #ddd;
  border-radius: 100%;
  background: #fff;
}

[type="radio"]:checked + label:after,
[type="radio"]:not(:checked) + label:after {
  content: '';
  width: 12px;
  height: 12px;
  background: #F87DA9;
  position: absolute;
  top: 4px;
  left: 4px;
  border-radius: 100%;
  -webkit-transition: all 0.2s ease;
  transition: all 0.2s ease;
}

[type="radio"]:not(:checked) + label:after {
  opacity: 0;

  transform: scale(0);
}


.tab input {
  position: absolute;
  opacity: 0;
  z-index: -1;
}

.tab__content {
  max-height: 0;
  overflow: hidden;
  transition: all 0.35s;
}

.tab input:checked ~ .tab__content {
  max-height: 20rem;
}

.tab__label,
.tab__close {
  display: flex;
  color: black;
  background: #FFF;
  cursor: pointer;
}

.dark .tab__label,
.tab__close {
  display: flex;
  color: white;
  --tw-bg-opacity: 1;
  background-color: rgb(40 48 70 / var(--tw-bg-opacity));
  cursor: pointer;
}

.tab__label {
  align-items: center;
  padding: 0.5rem 1rem 0.5rem 1rem;
}

.tab__label::before {
  content: "\276F";
  width: 1.6em;
  color: green;
  height: 1.6em;
  border: 2px solid green;
  border-radius: 4px;
  text-align: center;
  transform: rotate(90deg);
  transition: all 0.35s;
}

.tab input:checked + .tab__label::before {
  transform: rotate(270deg);
}

.tab__content p {
  margin: 0;
  padding: 1rem;
}


.tab__close {
  justify-content: flex-end;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
}


</style>
<style lang="scss">
.quilTable .ql-toolbar {
  display: none !important;
}

.quilTable .ql-editor::before {
  display: none;
}
</style>