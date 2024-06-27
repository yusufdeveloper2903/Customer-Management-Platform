<script setup lang="ts">

//IMPORTED FILES
import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";
import {onMounted, ref, watch, Ref, computed} from "vue";
import {toast} from "vue3-toastify";
import {useI18n} from "vue-i18n";
import knowledgeBase from ".././store/index"
import useVuelidate, {Validation} from "@vuelidate/core";
import {required, helpers} from '@vuelidate/validators'

//DECLARED VARIABLES
const store = knowledgeBase()
const props = defineProps<{
  knowledge: string
}>();
const isEdit = ref(false)
const content = ref({
  text: "",
  text_uz: "",
  text_ru: "",
  text_kr: ""
})
const {t} = useI18n()


// validations
const rules = computed(() => {
  return {
    text_uz: {
      required: helpers.withMessage(t('required_password'), required)
    },
    text_ru: {
      required: helpers.withMessage(t('required_password'), required)
    },
    text_kr: {
      required: helpers.withMessage(t('required_password'), required)
    },
  };
});

const validate: Ref<Validation> = useVuelidate(rules, content)


//MOUNTED
onMounted(async () => {
  let knowledgeBase = localStorage.getItem('knowledgeBase')
  if (knowledgeBase == 'Terms_and_conditions') {
    await refresh()
  }
})


//WATCHERS
watch(() => props.knowledge, async function (val) {
  if (val == 'Terms_and_conditions') {
    await refresh()
  }
})


//FUNCTIONS
const refresh = async () => {
  try {
    await store.getPages({type: 'term_and_condition'});

    if (Object.keys(store.pagesList).length) {
      content.value = store.pagesList
    } else {
      content.value = {
        text: "",
        text_uz: "",
        text_ru: "",
        text_kr: ""
      }
    }
  } catch (error: any) {
    toast.error(t('error'));
  }
};


const createText = async () => {
  const result = await validate.value.$validate()

  if (result) {
    try {
      await store.createPages(content.value).then(() => {
        toast.success(t('created_successfully'));
        refresh()
      })

    } catch (err: any) {
      toast.error(err.message)
    }
  } else {
    toast.error(t('validation.all_fields_are_required'))
  }
}

const updateText = async () => {
  const result = await validate.value.$validate()

  if (result) {
    try {
      content.value.text = content.value.text_uz
      if (store.pagesList.id) {
        await store.updatePages({id: store.pagesList.id, ...content.value}).then(() => {
          toast.success(t('success'));
          refresh()
        })
      } else {
        await store.createPages(content.value)
      }

      isEdit.value = false


    } catch (err: any) {
      toast.error(err.message)
    }
  } else {
    toast.error(t('validation.all_fields_are_required'))
  }
}

const deleteTermsAndConditions = async () => {
  isEdit.value = false
}
</script>

<template>


  <div class="card">
    <div>
      <Tabs pill>
        <Tab title="UZ">
          <div v-if="!store.pagesList.id || isEdit">
            <Editor :placeholder="t('enter_information')" content-type="html" toolbar="full"
                         class="scrollbar rounded border" style="height: 45vh; overflow-y: auto;"
                         v-model:content="content.text_uz">
            </Editor>
            <p v-for="error in validate.text_uz.$errors" :key="error.$uid" class="text-danger text-sm">
              {{ t(error.$message) }}
            </p>
          </div>

          <div v-else :uk-tooltip="$t('Edit')" class="cursor-pointer" @click="isEdit = true">
            <div class="border-4 p-4 rounded-lg my-4">
              <div v-html="store.pagesList.text_uz"></div>
            </div>
          </div>
        </Tab>


        <Tab title="KR">
          <div v-if="!store.pagesList.id || isEdit">
            <Editor :placeholder="t('enter_information')" content-type="html" toolbar="full"
                         class="scrollbar rounded border" style="height: 45vh; overflow-y: auto;"
                         v-model:content="content.text_kr">
            </Editor>

            <p v-for="error in validate.text_kr.$errors" :key="error.$uid" class="text-danger text-sm">
              {{ t(error.$message) }}
            </p>
          </div>

          <div v-else :uk-tooltip="$t('Edit')" class="cursor-pointer" @click="isEdit = true">
            <div class="border-4 p-4 rounded-lg my-4">
              <div v-html="store.pagesList.text_kr"></div>
            </div>
          </div>
        </Tab>


        <Tab title="RU">
          <div v-if="!store.pagesList.id || isEdit">
            <Editor :placeholder="t('enter_information')" content-type="html" toolbar="full"
                         class="scrollbar rounded border" style="height: 45vh; overflow-y: auto;"
                         v-model:content="content.text_ru">
            </Editor>

            <p v-for="error in validate.text_ru.$errors" :key="error.$uid" class="text-danger text-sm">
              {{ t(error.$message) }}
            </p>
          </div>

          <div v-else :uk-tooltip="$t('Edit')" class="cursor-pointer" @click="isEdit = true">
            <div class="border-4 p-4 rounded-lg my-4">
              <div v-html="store.pagesList.text_ru"></div>
            </div>
          </div>
        </Tab>
      </Tabs>


      <div class="flex justify-end">
        <div class="flex items-center justify-end mt-4 gap-1" v-if="store.pagesList?.id && isEdit">
          <button class="btn-secondary mr-3" @click="deleteTermsAndConditions">{{
              t('Cancel')
            }}
          </button>

          <button class="btn-warning" @click="updateText">{{
              t('Edit')
            }}
          </button>
        </div>

        <button v-if="!store.pagesList?.id && !isEdit" class="btn-success mt-4" @click="createText">{{
            t('Save')
          }}
        </button>
      </div>
    </div>
  </div>
</template>