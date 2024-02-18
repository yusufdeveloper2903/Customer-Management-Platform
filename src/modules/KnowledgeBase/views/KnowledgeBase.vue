<script setup lang="ts">
import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";
import SMSTemplate from "../components/SMSTemplate.vue";
import NewsTemplate from "../components/NewsTemplate.vue";
import NearbyPlaces from "../components/NearbyPlaces/NearbyPlaces.vue";
import VersionControl from "../components/VersionControl.vue"
import Products from "../components/Products.vue"
import PrivacyPolicy from "../components/PrivacyPolicy.vue";
import TermsAndConditions from "../components/TermsAndConditions.vue"
import Contacts from "../components/Links.vue";

</script>

<template>
  <div
      class="uk-card uk-card-default uk-card-body uk-card-small rounded dark:bg-darkLayoutStorm"
  >
    <Tabs vertical pill>

      <Tab :title="'sms_template'">
        <SMSTemplate/>
      </Tab>

      <Tab :title="'News template'">
        <NewsTemplate/>
      </Tab>

      <Tab :title="'Locations'">
        <NearbyPlaces/>
      </Tab>

      <Tab :title="'version_control'">
        <VersionControl/>
      </Tab>

      <Tab :title="'products'">
        <Products/>
      </Tab>

      <Tab :title="'PrivacyPolicy'">
        <PrivacyPolicy/>
      </Tab>

      <Tab :title="'Terms_and_conditions'">
        <TermsAndConditions/>
      </Tab>

      <Tab :title="'contacts'">
        <Contacts/>
      </Tab>
    </Tabs>
  </div>
</template>
