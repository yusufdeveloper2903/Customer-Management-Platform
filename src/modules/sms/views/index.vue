<script setup>

//IMPORTED FILES

import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";
import Message from '@/modules/sms/components/smsSending/index.vue'
import News from '@/modules/sms/components/news/index.vue'
import {ref} from 'vue'


//DECLARED VARIABLES

let sms = ref('')


//FUNCTIONS

const selectedTitle = (val) => {
  localStorage.setItem('sms', val)
  sms.value = val
}
</script>
<template>
  <div class="uk-card uk-card-default uk-card-body uk-card-small rounded dark:bg-darkLayoutStorm">
    <Tabs vertical pill @selectedTitle="selectedTitle" unique="unique">
      <Tab title="sms sending">
        <Message :sms="sms"/>
      </Tab>
      <Tab title="directory.News">
        <News :sms="sms"/>
      </Tab>
    </Tabs>
  </div>
</template>
