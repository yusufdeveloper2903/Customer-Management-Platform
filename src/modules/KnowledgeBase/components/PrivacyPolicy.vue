<script setup lang="ts">

//Imported files

import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";
import {ref} from "vue";
import knowledgeBase from ".././store/index"
import {toast} from "vue3-toastify";
import {useI18n} from "vue-i18n";


//Declared variables

const store = knowledgeBase()

const is_disabledUz = ref(false)
const is_disabledRu = ref(false)
const {t} = useI18n()


//Mounted


const refresh = async () => {
  try {
    await store.getPagesPolicy({type: 'privacy_policy'});
  } catch (error: any) {
    toast.error(t('error'));
  }

};
refresh()

const updateText = () => {
  store.updatePages({...store.pagesListPolicy}).then(() => {
    setTimeout(() => {
      toast.success(t("updated_successfully"));
    }, 200);
    refresh()
  })
  is_disabledUz.value = false

}
const updateText2 = () => {
  store.updatePages({...store.pagesListPolicy}).then(() => {
    setTimeout(() => {
      toast.success(t("updated_successfully"));
    }, 200);
    refresh()
    is_disabledRu.value = false
  })
}


</script>

<template>
  <div class="card">
    <Tabs pill>

      <Tab :title="$t('UZ')" >
        <div v-if="store.pagesListPolicy.text.uz" >
          <Editor

              :placeholder="$t('enter_information')"
              content-type="html"
              toolbar="full"
              class="scrollbar rounded border"
              style="height: 45vh; overflow-y: auto;" v-model:content="store.pagesListPolicy.text.uz"
          >

          </Editor>
        </div>

        <div class="flex justify-end mt-2">
          <button v-if="is_disabledUz == false" class="btn-warning" @click="is_disabledUz = true">Edit</button>

          <button v-if="is_disabledUz == true" class="btn-success" @click="updateText">Add</button>

        </div>
      </Tab>


      <Tab :title="$t('RU')">
        <div >
          <Editor
              v-if="store.pagesListPolicy.text.ru"
              :placeholder="$t('enter_information')"
              content-type="html"
              toolbar="full"
              class="scrollbar rounded border"
              style="height: 45vh; overflow-y: auto;" v-model:content="store.pagesListPolicy.text.ru"
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