<script lang="ts" setup>


//IMPORTED FILES
import PollsStore from ".././store/index";
import {computed, onMounted, Ref, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import {toast} from "vue3-toastify";
import Tab from "@/components/Tab/Tab.vue";
import Tabs from "@/components/Tab/Tabs.vue";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate, {Validation} from "@vuelidate/core";
import {useRoute, useRouter} from "vue-router";

//DECLARED VARIABLES
const route = useRoute()
const router = useRouter()
let QuestionPollList = ref<object[]>([]);
const {t} = useI18n()
const store = PollsStore();
const statusQuestion = ref(false)
let pollAdd = ref<any>({
  description: '',
  title: '',
  description_uz: '',
  description_kr: '',
  description_ru: '',
  question_type: 'SINGLE',
  poll: null,
  options: [
    {
      context: '',
      context_uz: '',
      context_kr: '',
      context_ru: '',
      option_id: 0,
      index: 0
    }
  ]

})
const isLoading = ref(false);

//WATCHERS
watch(() => statusQuestion.value, (val) => {
  if (val) {
    pollAdd.value.question_type = 'MULTIPLE'
  } else {
    pollAdd.value.question_type = 'SINGLE'
  }
})

//MOUNTED LIFE CYCLE
onMounted(async () => {
  if (route.params.id) {
    await refresh()
    pollAdd.value = store.questionsPollsId.data
    if (pollAdd.value.question_type == 'SINGLE') {
      statusQuestion.value = false
    } else {
      statusQuestion.value = true
    }
  }
})


//FUNCTIONS
const saveEdit = async () => {
  const success = await validate.value.$validate();
  if (!success) return;
  pollAdd.value.description = pollAdd.value.description_uz

  if (route.params.id) {
    pollAdd.value.poll = route.query.editId
    pollAdd.value.options.forEach((item: any, index: any) => {
      pollAdd.value.options[index].context = item.context_uz
      pollAdd.value.options[index].index = index
      if (item.option_id) {
        pollAdd.value.options[index].option_id = item.option_id
      } else {
        pollAdd.value.options[index].option_id = 0

      }
    })
    try {
      await store.updatePollsQuestion(pollAdd.value)
      toast.success(t("updated_successfully"));

      router.go(-1);
    } catch (error: any) {
      toast.error(t("error"));
    }
  } else {
    pollAdd.value.poll = route.query.id

    pollAdd.value.options.forEach((item: any, index: any) => {
      pollAdd.value.options[index].context = item.context_uz
      pollAdd.value.options[index].index = index
      pollAdd.value.options[index].option_id = 0
    })
    try {
      await store.createSectionQuestion(pollAdd.value)
      toast.success(t("created_successfully"));

      router.go(-1);
    } catch (error: any) {
      toast.error(t('error'));
    }
  }
};

const addOption = () => {
  pollAdd.value.options.push({})
}
const removeOption = (val: any) => {
  pollAdd.value.options.splice(val, 1)
}
const refresh = async () => {
  isLoading.value = true;
  try {
    await store.getQuestionPollsId(route.params.id);
    QuestionPollList.value = store.questionsPolls.data.results
    isLoading.value = false;
  } catch (error: any) {
    toast.error(
        t('error')
    );
  }

};


const rules = computed(() => {
  return {
    description_uz: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    description_kr: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    description_ru: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
  };

});

const validate: Ref<Validation> = useVuelidate(rules, pollAdd);
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
                rows="4"
                v-model="pollAdd.description_uz"
                :class="validate.description_uz.$errors.length ? 'required-input' : ''"

            />
            <p
                v-for="error in validate.description_uz.$errors"
                :key="error.$uid"
                class="text-danger text-sm"
            >
              {{ $t(error.$message) }}
            </p>
          </label>
        </Tab>
        <Tab title="KR">
          <label
          >{{ $t('description') + ' ' + $t('KR') }}
            <textarea
                type="text"
                class="form-input"
                rows="4"
                v-model="pollAdd.description_kr"
                :class="validate.description_kr.$errors.length ? 'required-input' : ''"

            />
            <p
                v-for="error in validate.description_kr.$errors"
                :key="error.$uid"
                class="text-danger text-sm"
            >
              {{ $t(error.$message) }}
            </p>

          </label>


        </Tab>

        <Tab title="RU">
          <label
          >{{ $t('description') + ' ' + $t('RU') }}
            <textarea
                type="text"
                class="form-input"
                rows="4"
                v-model="pollAdd.description_ru"
                :class="validate.description_ru.$errors.length ? 'required-input' : ''"
            />
            <p
                v-for="error in validate.description_ru.$errors"
                :key="error.$uid"
                class="text-danger text-sm"
            >
              {{ $t(error.$message) }}
            </p>
          </label>
        </Tab>
      </Tabs>

      <p class=" mt-4 ">{{ $t("Несколько ответов") }}</p>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
            type="checkbox"
            class="sr-only peer"
            v-model="statusQuestion"

        />
        <div
            className="w-11 h-6 bg-gray-200 peer-focus:outline-none
          rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
        ></div>
      </label>


    </div>
    <div class="card w-4/6">
      <Tabs class="mb-4">
        <Tab title="UZ">
          <label>{{ $t('options') + ' ' + $t('UZ') }}</label>
          <div v-for="(_, index) in pollAdd.options" :key="index" class="flex items-center p-3 mt-3"
               style="border:1px solid green; border-radius:10px">
            {{ index + 1 }}
            <input
                type="text"
                class="form-input ml-2"
                v-model="pollAdd.options[index].context_uz"
            />
            <button
                class="ml-3 btn-danger btn-action"
                @click="removeOption(index)"
            >
              <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
            </button>
          </div>
        </Tab>
        <Tab title="KR">
          <label>{{ $t('options') + ' ' + $t('KR') }}</label>
          <div v-for="(_, index) in pollAdd.options" :key="index" class="flex items-center p-3 mt-3"
               style="border:1px solid green; border-radius:10px">
            {{ index + 1 }}
            <input
                type="text"
                class="form-input ml-2"
                v-model="pollAdd.options[index].context_kr"
            />
            <button
                class="ml-3 btn-danger btn-action"
                @click="removeOption(index)"
            >
              <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
            </button>
          </div>
        </Tab>
        <Tab title="RU">
          <label>{{ $t('options') + ' ' + $t('RU') }}</label>

          <div v-for="(_, index) in pollAdd.options" :key="index" class="flex items-center p-3 mt-3"
               style="border:1px solid green; border-radius:10px">
            {{ index + 1 }}
            <input
                type="text"
                class="form-input ml-2"
                v-model="pollAdd.options[index].context_ru"
            />
            <button
                class="ml-3 btn-danger btn-action"
                @click="removeOption(index)"
            >
              <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
            </button>
          </div>
        </Tab>
      </Tabs>
      <button class="btn-success btn-action mt-4 rounded-md" uk-icon="plus" @click="addOption"/>
      <div
          class=" flex gap-4 justify-end"
      >
        <button class="btn-secondary" @click="router.go(-1);">
          {{ $t("Cancel") }}
        </button>

        <button @click="saveEdit"
                class="rounded-md bg-success px-6 py-2 text-white duration-100 hover:opacity-90 md:w-auto w-full">
          {{ $t('Add') }}
        </button>
      </div>
    </div>
  </div>
</template>



