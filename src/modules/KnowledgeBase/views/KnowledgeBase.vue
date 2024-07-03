<script setup lang="ts">
//IMPORTED FILES
import Tabs from '@/components/Tab/Tabs.vue'
import Tab from '@/components/Tab/Tab.vue'
import SMSTemplate from '../components/SMSTemplate.vue'
import NewsTemplate from '../components/NewsTemplate.vue'
import Onboarding from '../components/Onboarding.vue'
import NearbyPlaces from '../components/NearbyPlaces/NearbyPlaces.vue'
import VersionControl from '../components/VersionControl.vue'
import Products from '../components/Products.vue'
import PrivacyPolicy from '../components/PrivacyPolicy.vue'
import TermsAndConditions from '../components/TermsAndConditions.vue'
import Contacts from '../components/Links.vue'
import Regions from '../components/Regions.vue'
import Category from '../components/Categories.vue'
import Splash from '../components/Splash.vue'
import QuantityType from '../components/QuantityType.vue'
import { ref } from 'vue'
import Districts from '../components/Districts.vue'
import ProductCategories from '../components/ProductCategories.vue'

//DECLARED VARIABLES
const knowledge = ref('')
let params = ref({
  page: 1,
  page_size: 10,
})

//FUNCTIONS
const selectedTitle = (val: any) => {
  localStorage.setItem('page', '1')
  localStorage.setItem('page_size', '10')
  localStorage.setItem('knowledgeBase', val)
  knowledge.value = val
}
</script>

<template>
  <div
    class="uk-card uk-card-default uk-card-body uk-card-small rounded dark:bg-darkLayoutStorm">
    <Tabs vertical pill @selectedTitle="selectedTitle" unique="unique">
      <Tab title="sms_template">
        <SMSTemplate :knowledge="knowledge" :params="params" />
      </Tab>
      <Tab title="News template">
        <NewsTemplate :knowledge="knowledge" :params="params" />
      </Tab>

      <Tab title="Locations">
        <NearbyPlaces :knowledge="knowledge" :params="params" />
      </Tab>

      <Tab title="version_control">
        <VersionControl :knowledge="knowledge" :params="params" />
      </Tab>

      <Tab title="products">
        <Products :knowledge="knowledge" :params="params" />
      </Tab>

      <Tab title="product_categories">
        <ProductCategories :knowledge="knowledge" :params="params" />
      </Tab>

      <Tab title="PrivacyPolicy">
        <PrivacyPolicy :knowledge="knowledge" :params="params" />
      </Tab>

      <Tab title="region">
        <Regions :knowledge="knowledge" :params="params" />
      </Tab>

      <Tab title="districts">
        <Districts :knowledge="knowledge" :params="params" />
      </Tab>

      <Tab title="Terms_and_conditions">
        <TermsAndConditions :knowledge="knowledge" :params="params" />
      </Tab>
      <Tab title="Onboarding">
        <Onboarding :knowledge="knowledge" :params="params" />
      </Tab>
      <Tab title="contacts">
        <Contacts :knowledge="knowledge" :params="params" />
      </Tab>

      <Tab title="splash">
        <Splash :knowledge="knowledge" :params="params" />
      </Tab>

      <Tab title="recipe category">
        <Category :knowledge="knowledge" :params="params" />
      </Tab>

      <Tab title="type_quantity">
        <QuantityType :knowledge="knowledge" :params="params" />
      </Tab>
    </Tabs>
  </div>
</template>
