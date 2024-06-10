<script setup>

//IMPORTED FILES

import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";
import Message from '@/modules/sms/components/smsSending/index.vue'
import News from '@/modules/sms/components/news/index.vue'
import {ref} from 'vue'


//DECLARED VARIABLES

let sms = ref('')
let params = ref({
  page: 1,
  page_size: 10
})

//FUNCTIONS

const selectedTitle = (val) => {
  localStorage.setItem('page', '1')
  localStorage.setItem('page_size', '10')
  localStorage.setItem('sms', val)
  sms.value = val
}
</script>
<template>
  <div class="uk-card uk-card-default uk-card-body uk-card-small rounded dark:bg-darkLayoutStorm">
    <Tabs vertical pill @selectedTitle="selectedTitle" unique="unique">
      <Tab title="sms sending">
        <Message :sms="sms" :params="params" />
      </Tab>
      <Tab title="directory.News">
        <News :sms="sms" :params="params" />
      </Tab>
    </Tabs>
  </div>
</template>
