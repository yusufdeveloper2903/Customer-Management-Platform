<script lang="ts" setup>


//IMPORTED FILES
import PollsStore from ".././store/index";
import {onMounted, reactive, ref} from "vue";
import {useI18n} from "vue-i18n";
import {toast} from "vue3-toastify";
import Tab from "@/components/Tab/Tab.vue";
import Tabs from "@/components/Tab/Tabs.vue";


//DECLARED VARIABLES
let QuestionPollList = ref<object[]>([]);
const {t} = useI18n()
const store = PollsStore();
let optionsList = ref([{
  name: ''
}])
const isLoading = ref(false);
// let questionPoll = ref({
//   description: '',
//   description_kr: '',
//   description_ru: '',
//   description_uz: '',
//   question_type: ''
// })
const params = reactive({
  page: 1,
  page_size: 10,
  search: null,
})


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
  await refresh()

})


//FUNCTIONS
const addOption = () => {
  optionsList.value.push({})
}
const removeOption = (val) => {
  optionsList.value.splice(val, 1)
}
const refresh = async () => {
  isLoading.value = true;
  try {
    await store.getQuestionPolls(params);
    QuestionPollList.value = store.questionsPolls.data.results
    isLoading.value = false;
  } catch (error: any) {
    toast.error(
        t('error')
    );
  }

};


</script>

<template>
  <div class="flex items-start gap-4">
    <div class="card w-2/6">
      <Tabs class="mb-4">
        <Tab title="UZ">
          <label
          >{{ $t('description') + ' ' + $t('UZ') }}
            <textarea
                type="text"
                class="form-input"
                rows="5"

            />
          </label>
        </Tab>
        <Tab title="KR">
          <label
          >{{ $t('description') + ' ' + $t('KR') }}
            <textarea
                type="text"
                class="form-input"
                rows="5"

            />

          </label>


        </Tab>

        <Tab title="RU">
          <label
          >{{ $t('description') + ' ' + $t('RU') }}
            <textarea
                type="text"
                class="form-input"
                rows="5"

            />
          </label>
        </Tab>
      </Tabs>

      <p class=" mt-4 ">{{ $t("Несколько ответов") }}</p>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
            type="checkbox"
            class="sr-only peer"
        />
        <div
            className="w-11 h-6 bg-gray-200 peer-focus:outline-none
          rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
        ></div>
      </label>


    </div>
    <div class="card w-4/6">
      <h4>Options</h4>
      <div v-for="(_, index) in optionsList" :key="index" class="flex items-center p-3 mt-3"
           style="border:1px solid green; border-radius:10px">
        {{ index + 1 }}
        <input
            type="text"
            class="form-input ml-2"
            v-model="optionsList[index].name"
        />
        <button
            class="ml-3 btn-danger btn-action"
            @click="removeOption(index)"
        >
          <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
        </button>
      </div>
      <button class="btn-success btn-action mt-4 rounded-md" uk-icon="plus" @click="addOption"/>
      <div
          class=" flex gap-4 justify-end"
      >
        <button class="btn-secondary">
          {{ $t("Cancel") }}
        </button>

        <button
            class="rounded-md bg-success px-6 py-2 text-white duration-100 hover:opacity-90 md:w-auto w-full">
          {{ $t('Add') }}
        </button>
      </div>
    </div>
  </div>
</template>



