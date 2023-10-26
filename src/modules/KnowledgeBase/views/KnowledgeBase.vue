<script setup lang="ts">
import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";
import Categories from "../components/Categories.vue";
import Intro from "../components/Intro.vue";
import Splash from "../components/Splash.vue";
import Locations from "../components/Locations.vue";
import SMSTemplate from "../components/SMSTemplate.vue";
</script>

<template>
  <div class="uk-card uk-card-default uk-card-body uk-card-small rounded dark:bg-darkLayoutStorm">
    <Tabs
        vertical
        pill
    >
      <Tab
          title="Category"
      >
        <Categories/>
      </Tab>

      <Tab
          title="Intro"
      >
        <Intro/>
      </Tab>

      <Tab
          title="Splash"
      >
        <Splash/>
      </Tab>

      <Tab
          title="Locations"
      >
        <Locations/>
      </Tab>

      <Tab
          title="SMS Template"
      >
        <SMSTemplate/>
      </Tab>
    </Tabs>
  </div>
</template>
