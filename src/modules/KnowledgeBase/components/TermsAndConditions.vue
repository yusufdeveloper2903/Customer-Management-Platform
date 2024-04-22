<script setup lang="ts">

//IMPORTED FILES
import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";
import {onMounted, ref, watch} from "vue";
import {toast} from "vue3-toastify";
import {useI18n} from "vue-i18n";
import knowledgeBase from ".././store/index"


//DECLARED VARIABLES
const store = knowledgeBase()
const props = defineProps<{
  knowledge: string
}>();
const is_disabledUz = ref(false)
const is_disabledRu = ref(false)
const is_disabledKr = ref(false)
const {t} = useI18n()


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
  } catch (error: any) {
    toast.error(t('error'));
  }
};


const updateText = () => {
  store.pagesList.text = store.pagesList.text_uz
  store.updatePages({...store.pagesList}).then(() => {
    setTimeout(() => {
      toast.success(t("updated_successfully"));
    }, 200);
    refresh()
    is_disabledUz.value = false
  })
}
const updateText2 = () => {
  store.pagesList.text = store.pagesList.text_uz

  store.updatePages({...store.pagesList}).then(() => {
    setTimeout(() => {
      toast.success(t("updated_successfully"));
    }, 200);
    refresh()
    is_disabledRu.value = false
  })
}
const updateText3 = () => {
  store.pagesList.text = store.pagesList.text_uz

  store.updatePages({...store.pagesList}).then(() => {
    setTimeout(() => {
      toast.success(t("updated_successfully"));
    }, 200);
    refresh()
    is_disabledKr.value = false
  })
}


</script>

<template>
  <div class="card">
    <Tabs pill>
      <Tab title="UZ">
        <div v-if="store.pagesList.text_uz">
          <Editor
              :placeholder="$t('enter_information')"
              content-type="html"
              toolbar="full"
              class="scrollbar rounded border"
              style="height: 45vh; overflow-y: auto;"
              v-model:content="store.pagesList.text_uz"
          >
          </Editor>
        </div>


        <div class="flex justify-end mt-2">
          <button v-if="is_disabledUz == false" class="btn-warning" @click="is_disabledUz = true">{{
              t('Edit')
            }}
          </button>

          <button v-if="is_disabledUz == true" class="btn-success" @click="updateText">{{ t('Save') }}</button>

        </div>
      </Tab>
      <Tab title="KR">
        <div v-if="store.pagesList.text_kr">
          <Editor
              :placeholder="$t('enter_information')"
              content-type="html"
              toolbar="full"
              class="scrollbar rounded border"
              style="height: 45vh; overflow-y: auto;"
              v-model:content="store.pagesList.text_kr"
          >
          </Editor>
        </div>


        <div class="flex justify-end mt-2">
          <button v-if="is_disabledKr == false" class="btn-warning" @click="is_disabledKr = true">{{
              t('Edit')
            }}
          </button>

          <button v-if="is_disabledKr == true" class="btn-success" @click="updateText3">{{ t('save') }}</button>

        </div>
      </Tab>


      <Tab title="RU">
        <div v-if="store.pagesList.text_ru">
          <Editor
              :placeholder="$t('enter_information')"
              content-type="html"
              toolbar="full"
              class="scrollbar rounded border"
              style="height: 45vh; overflow-y: auto;"
              v-model:content="store.pagesList.text_ru"
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