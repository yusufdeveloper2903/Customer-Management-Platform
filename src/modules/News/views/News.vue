<script setup lang="ts">
import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";
import News from "../components/News.vue";
import SMS from "../components/SMS.vue";
import Banner from "../components/Banner.vue";
</script>

<template>
  <div class="uk-card uk-card-default uk-card-body uk-card-small rounded dark:bg-darkLayoutStorm">
    <Tabs vertical pill>dsadsadsadas
      <Tab title="News">
        <News />
      </Tab>
      <Tab title="SMS">
        <SMS />
      </Tab>
      <Tab title="Banner">
        <Banner />
      </Tab>
    </Tabs>
  </div>
</template>
