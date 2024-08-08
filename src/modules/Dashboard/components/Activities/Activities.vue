<script setup lang="ts">
//IMPORTED FILES
import statisticDashboard from '../../store/index'
import {useI18n} from "vue-i18n";
import {formatDate} from "@/mixins/features";
import {onMounted, ref} from "vue";
import {toast} from "vue3-toastify";


//DECLARED VARIABLES
const {t} = useI18n()
const store = statisticDashboard()
const activeList = ref([])


const refresh = async () => {
  try {
    await store.getActivities({page_size: 8});
  } catch (error: any) {
    toast.error(
        t('error')
    );
  }
};


onMounted(async () => {
  await refresh()
  if (store.activitiesList && store.activitiesList.results.length > 0) {
    activeList.value = store.activitiesList.results
  } else {
    activeList.value = []
  }
})

//DECLARED VARIABLES
</script>

<template>
  <div class="card">
    <div
        class="flex items-center justify-between mb-5"
        v-for="(item, index) in activeList"
        :key="index"
    >
      <div class="flex items-center">
        <div
            class="rounded-lg bg-gray-200 w-[40px] h-[40px] flex justify-center items-center"
        >
          <Icon icon="Smartphone"/>
        </div>

        <span class="dark:text-gray-200 text-gray-600 ml-2">{{ item.device_type }}</span>
      </div>
      <div>
        <span class="dark:text-gray-100 text-gray-300 text-sm">{{ formatDate(item.last_visit) }}</span>
        <!--        <h5 class="font-medium dark:text-gray-200 text-gray-600 mb-0 pb-0">-->
        <!--          {{ item.date }}-->
        <!--        </h5>-->
      </div>
    </div>

  </div>
</template>

<style></style>
