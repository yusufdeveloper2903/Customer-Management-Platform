<script setup lang="ts">
import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";
import Editor from 'primevue/editor';
import { onMounted, ref } from "vue";
import knowledgeBase from ".././store/index"
import { toast } from "vue3-toastify";
import { useI18n } from "vue-i18n";

const store = knowledgeBase()
const txt = ref({
  id: 0,
  text: {
    uz: '',
    ru: ''
  },
  type: ''
})
const is_disabledUz = ref(false)
const is_disabledRu = ref(false)

const { t } = useI18n()

const refresh = async () => {
  try {
    await store.getPages({ type: 'term_and_condition' });
    store.pagesList.results.forEach(element => {
      txt.value = element

    });
  } catch (error: any) {
    toast.error(
      error.response || "Error"
    );
  }

};

const updateText = () => {
  store.updatePages({ ...txt.value }).then(() => {
    setTimeout(() => {
      toast.success(t("updated_successfully"));
    }, 200);
    refresh()
  })
}

onMounted(async () => {
  refresh()
});

</script>

<template>
  <div class="uk-card uk-card-default uk-card-body uk-card-small rounded dark:bg-darkLayoutStorm">
    <Tabs pill>
      <Tab :title="$t('UZ')">
        <Editor editorStyle="height: 320px" v-model="txt.text.uz" :readonly="is_disabledUz == false" />

        <div class="flex justify-end mt-2">
          <button v-if="is_disabledUz == false" class="btn-warning" @click="is_disabledUz = true">Edit</button>

          <button v-if="is_disabledUz == true" class="btn-success" @click="updateText">Add</button>

        </div>
      </Tab>





      <Tab :title="$t('RU')">
        <Editor editorStyle="height: 320px" v-model="txt.text.ru" :readonly="is_disabledRu == false" />
        <div class="flex justify-end mt-2">
          <button v-if="is_disabledRu == false" class="btn-warning" @click="is_disabledRu = true">Edit</button>

          <button v-if="is_disabledRu == true" class="btn-success" @click="updateText">Add</button>
        </div>
      </Tab>
    </Tabs>
  </div>
</template>