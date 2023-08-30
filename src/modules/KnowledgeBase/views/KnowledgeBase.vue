<script setup lang="ts">
import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";
import Categories from "../components/Categories.vue";
import Splash from "../components/Splash.vue";
import Intro from "../components/Intro.vue";
</script>

<template>
  <div>
    <Tabs vertical pill>
      <Tab title="Category">
        <Categories />
      </Tab>
      <Tab title="Intro">
        <Intro />
      </Tab>
      <Tab title="Splash">
        <Splash />
      </Tab>
    </Tabs>
  </div>
</template>
