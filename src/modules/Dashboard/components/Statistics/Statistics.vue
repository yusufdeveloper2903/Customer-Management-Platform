<script setup lang="ts">
//IMPORTED FILES
import statisticDashboard from '../../store/index'
import {useI18n} from "vue-i18n";

import {onMounted, reactive, watch} from "vue";
import {toast} from "vue3-toastify";


//DECLARED VARIABLES
const {t} = useI18n()
const store = statisticDashboard()

const refresh = async () => {
  try {
    await store.getStatistic();
  } catch (error: any) {
    toast.error(t('error'));
  }
};


onMounted(async () => {
  await refresh()
})

watch(() => store.statisticList, async function (val) {
  statistics[0].value = val?.data.ios || null
  statistics[1].value = val?.data.android || null
  statistics[2].value = val?.data.client || null
  statistics[3].value = val?.data.staff || null
})


const statistics = reactive([
  {
    id: 1,
    title: "ios",
    icon: "iPhone",
    color: "#40CD7F",
    bgColor: "bg-success/10",
    value: null,
  },
  {
    id: 2,
    title: "android",
    icon: "Smartphone",
    color: "#40CD7F",
    bgColor: "bg-success/10",
    value: null,
  },
  {
    id: 3,
    title: "users",
    icon: "Users Group Two Rounded",
    color: "#40CD7F",
    bgColor: "bg-success/10",
    value: null,
  },
  {
    id: 4,
    title: "admins",
    icon: "Users Group Rounded",
    color: "#40CD7F",
    bgColor: "bg-success/10",
    value: null,
  },
]);
</script>

<template>
  <div class="grid gap-5 grid-cols-4">
    <div
        class="card flex items-center justify-between"
        v-for="(item, index) in statistics"
        :key="index"
    >
      <div>
        <h3 class="font-medium dark:text-gray-200 text-gray-600 mb-1">
          {{ $t(item.title) }}
        </h3>
        <span class="dark:text-gray-200 text-gray-600" v-if="item.value">{{ item.value }}</span>
        <span class="dark:text-gray-200 text-gray-600" v-else>-</span>
      </div>
      <div
          class="w-[50px] h-[50px] flex items-center justify-center rounded-full"
          :class="`${item.bgColor}`"
      >
        <Icon :icon="item.icon" :color="item.color"/>
      </div>
    </div>
  </div>
</template>
