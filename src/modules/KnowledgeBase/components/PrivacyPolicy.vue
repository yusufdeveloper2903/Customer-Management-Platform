<script setup lang="ts">

//IMPORTED FILES
import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";
import {onMounted, ref, watch} from "vue";
import knowledgeBase from ".././store/index"
import {toast} from "vue3-toastify";
import {useI18n} from "vue-i18n";


//DECLARED VARIABLES
const store = knowledgeBase()
const is_disabledUz = ref(true)
const is_disabledKr = ref(false)
const is_disabledRu = ref(false)
const {t} = useI18n()
const props = defineProps<{
  knowledge: string
}>();

//MOUNTED LIFE CYCLE
onMounted(async () => {
  let knowledgeBase = localStorage.getItem('knowledgeBase')
  if (knowledgeBase == 'PrivacyPolicy') {
    await refresh()
  }
})


//WATCHERS
watch(() => props.knowledge, async function (val) {
  if (val == 'PrivacyPolicy') {
    await refresh()
  }
})

//FUNCTIONS
const refresh = async () => {
  try {
    await store.getPagesPolicy({type: 'privacy_policy'});
  } catch (error: any) {
    toast.error(t('error'));
  }
};


const updateText = async () => {
  store.pagesListPolicy.text = store.pagesListPolicy.text_uz
  await store.updatePages(store.pagesListPolicy)
  await refresh()
  toast.success(t("updated_successfully"));
  is_disabledUz.value = false

}
const updateText2 = async () => {
  store.pagesListPolicy.text = store.pagesListPolicy.text_uz
  await store.updatePages(store.pagesListPolicy)
  await refresh()
  toast.success(t("updated_successfully"));
  is_disabledRu.value = false
}
const updateText3 = async () => {
  store.pagesListPolicy.text = store.pagesListPolicy.text_uz
  await store.updatePages(store.pagesListPolicy)
  await refresh()
  toast.success(t("updated_successfully"));
  is_disabledKr.value = false
}


</script>

<template>
  <div class="card">
    <Tabs pill>
      <Tab title="UZ">
        <div v-if="store.pagesListPolicy.text_uz">
          <Editor
              :placeholder="t('enter_information')"
              content-type="html"
              toolbar="full"
              aria-readonly="true"
              class="scrollbar rounded border"
              style="height: 45vh; overflow-y: auto;"
              v-model:content="store.pagesListPolicy.text_uz"
              
          >
          </Editor>
        </div>

        <div class="flex justify-end mt-2">
          <button v-if="is_disabledUz == true" class="btn-warning" @click="is_disabledUz = false">{{
              t('Edit')
            }}
          </button>

          <button v-if="is_disabledUz == false" class="btn-success" @click="updateText">{{ t('Save') }}</button>

        </div>
      </Tab>
      <Tab title="KR">
        <div v-if="store.pagesListPolicy.text_kr">
          <Editor

              :placeholder="t('enter_information')"
              content-type="html"
              toolbar="full"
              class="scrollbar rounded border"
              style="height: 45vh; overflow-y: auto;" v-model:content="store.pagesListPolicy.text_kr"
          >

          </Editor>
        </div>

        <div class="flex justify-end mt-2">
          <button v-if="is_disabledKr == false" class="btn-warning" @click="is_disabledKr = true">{{
              t('Edit')
            }}
          </button>

          <button v-if="is_disabledKr == true" class="btn-success" @click="updateText3">{{ t('Save') }}</button>

        </div>
      </Tab>


      <Tab title="RU">
        <div v-if="store.pagesListPolicy.text_ru">
          <Editor
              :placeholder="t('enter_information')"
              content-type="html"
              toolbar="full"
              class="scrollbar rounded border"
              style="height: 45vh; overflow-y: auto;" v-model:content="store.pagesListPolicy.text_ru"
          >

          </Editor>
        </div>

        <div class="flex justify-end mt-2">
          <button v-if="is_disabledRu == false" class="btn-warning" @click="is_disabledRu = true">{{
              t('Edit')
            }}
          </button>

          <button v-if="is_disabledRu == true" class="btn-success" @click="updateText2">{{ t('Save') }}</button>
        </div>
      </Tab>
    </Tabs>
  </div>
</template>