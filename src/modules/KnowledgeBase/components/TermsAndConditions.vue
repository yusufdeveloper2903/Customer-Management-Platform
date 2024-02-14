<script setup lang="ts">

//Imported files

import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";
import {reactive, ref} from "vue";
import {toast} from "vue3-toastify";
import {useI18n} from "vue-i18n";
import knowledgeBase from ".././store/index"


//Declared variables

const store = knowledgeBase()
const txt = reactive({
  id: 0,
  text: {
    uz: '',
    ru: ''
  },
  type: ''
})
const is_disabledUz = ref(false)
const is_disabledRu = ref(false)
const {t} = useI18n()

//Mounted
txt.text.ru = store.pagesList.results[0]?.text.ru
txt.text.uz = store.pagesList.results[0]?.text.uz
txt.type = store.pagesList.results[0]?.type
txt.id = store.pagesList.results[0]?.id


//All Functions

const refresh = async () => {
  try {
    await store.getPages({type: 'term_and_condition'});
  } catch (error: any) {
    toast.error(t('error'));
  }

};
refresh()

const updateText = () => {
  store.updatePages({...txt}).then(() => {
    setTimeout(() => {
      toast.success(t("updated_successfully"));
    }, 200);
    refresh()
    is_disabledUz.value = true
  })
}
const updateText2 = () => {
  store.updatePages({...txt}).then(() => {
    setTimeout(() => {
      toast.success(t("updated_successfully"));
    }, 200);
    refresh()
    is_disabledRu.value = true
  })
}


</script>

<template>
  <div class="card">
    <Tabs pill>
      <Tab :title="$t('UZ')">
        <div :style="{'pointer-events': is_disabledUz ?  'auto' : 'none'}">
          <Editor
              :placeholder="$t('enter_information')"
              content-type="html"
              toolbar="full"
              class="scrollbar rounded border"
              style="height: 45vh; overflow-y: auto;"
              v-model:content="txt.text.uz"
          >
          </Editor>
        </div>


        <div class="flex justify-end mt-2">
          <button v-if="is_disabledUz == false" class="btn-warning" @click="is_disabledUz = true">Edit</button>

          <button v-if="is_disabledUz == true" class="btn-success" @click="updateText">Add</button>

        </div>
      </Tab>


      <Tab :title="$t('RU')">
        <div :style="{'pointer-events': is_disabledRu ?  'auto' : 'none'}">
          <Editor
              :placeholder="$t('enter_information')"
              content-type="html"
              toolbar="full"
              class="scrollbar rounded border"
              style="height: 45vh; overflow-y: auto;" v-model:content="txt.text.ru"
          >

          </Editor>
        </div>
        <div class="flex justify-end mt-2">
          <button v-if="is_disabledRu == false" class="btn-warning" @click="is_disabledRu = true">Edit</button>

          <button v-if="is_disabledRu == true" class="btn-success" @click="updateText2">Add</button>
        </div>
      </Tab>
    </Tabs>
  </div>
</template>