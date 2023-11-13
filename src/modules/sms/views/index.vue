<script setup>
import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";
import Message from '@/modules/sms/components/smsSending/index.vue'
import News from '@/modules/sms/components/news/index.vue'
import Banner from '@/modules/sms/components/banner/index.vue'

</script>
<template>
  <div class="uk-card uk-card-default uk-card-body uk-card-small rounded dark:bg-darkLayoutStorm">
    <Tabs vertical pill>
      <Tab title="СМС рассылка">
        <Message/>
      </Tab>
      <Tab title="Новости">
        <News/>
      </Tab>
      <Tab title="Баннер">
        <Banner/>
      </Tab>
    </Tabs>
  </div>
</template>
