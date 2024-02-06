<script setup lang="ts">
import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";
import Categories from "../components/Categories.vue";
import SMSTemplate from "../components/SMSTemplate.vue";
import NewsTemplate from "../components/NewsTemplate.vue";
import NearbyPlaces from "../components/NearbyPlaces/NearbyPlaces.vue";
import VersionControl from "../components/VersionControl.vue"
import Products from "../components/Products.vue"
import PrivacyPolicy from "../components/PrivacyPolicy.vue";
</script>

<template>
  <!-- <div
    class="uk-card uk-card-default uk-card-body uk-card-small rounded dark:bg-darkLayoutStorm"
  > -->
    <Tabs vertical pill>
      <Tab :title="$t('category')">
        <Categories />
      </Tab>

      <Tab :title="$t('sms_template')">
        <SMSTemplate />
      </Tab>

      <Tab :title="$t('News template')">
        <NewsTemplate />
      </Tab>

      <Tab :title="$t('Locations')">
        <NearbyPlaces />
      </Tab>

      <Tab :title="$t('version_control')">
        <VersionControl />
      </Tab>

      <Tab :title="$t('products')">
        <Products />
      </Tab>

      <Tab :title="$t('PrivacyPolicy')">
        <PrivacyPolicy />
      </Tab>
    </Tabs>
  <!-- </div> -->
</template>
