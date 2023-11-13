<script setup lang="ts">
import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";
import Categories from "../components/Categories.vue";
// import Intro from "../components/Intro.vue";
// import Splash from "../components/Splash.vue";
import Locations from "../components/Locations.vue";
import SMSTemplate from "../components/SMSTemplate.vue";
import NewsTemplate from "../components/NewsTemplate.vue";
</script>

<template>
  <div
    class="uk-card uk-card-default uk-card-body uk-card-small rounded dark:bg-darkLayoutStorm"
  >
    <!-- 
      <Tab
          title="Intro"
      >
        <Intro/>
      </Tab>

      <Tab
          title="Splash"
      >
        <Splash/>
      </Tab> -->
    <Tabs vertical pill>
      <Tab title="Категория">
        <Categories />
      </Tab>

      <Tab title="Локации">
        <Locations />
      </Tab>

      <Tab title="СМС шаблон">
        <SMSTemplate />
      </Tab>

      <Tab title="Шаблон новости">
        <NewsTemplate />
      </Tab>
    </Tabs>
  </div>
</template>
