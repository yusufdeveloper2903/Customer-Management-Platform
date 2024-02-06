<script setup>
import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";
import Editor from 'primevue/editor';

</script>

<template>
      <div
    class="uk-card uk-card-default uk-card-body uk-card-small rounded dark:bg-darkLayoutStorm"
  >
     <Tabs pill>
      <Tab :title="$t('UZ')">
        <Editor editorStyle="height: 320px" />
        <div class="flex justify-end mt-2">
            <button class="btn-success">Save</button>
        </div>
      </Tab>

      <Tab :title="$t('RU')">
        <Editor editorStyle="height: 320px" />
        <div class="flex justify-end mt-2">
            <button class="btn-success">Save</button>
        </div>
      </Tab>
    </Tabs>
    </div>
</template>