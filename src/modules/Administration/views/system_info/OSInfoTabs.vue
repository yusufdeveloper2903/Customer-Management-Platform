<script setup lang="ts">

//              IMPORTS                //

import { ref, onMounted } from 'vue'
import { administrationStore } from '../../store/index'

//              COMPONENTS                //

import Tabs from '@/components/Tab/Tabs.vue'
import Tab from '@/components/Tab/Tab.vue'
import Accordion from './Accordion.vue'

//              DECLORATIONS                //

const store = administrationStore()
const data = ref<any>([])

//              FUNCTIONS                //

onMounted(async () => {
   store.FETCH_OS_SYSTEM_INFO().then((response) => {
        data.value = response
    })
})

</script>

<template>
    <Tabs class="card">
        <Tab title="info_about_system">
            <div class="border rounded-xl p-4 border-[#17183B]">
                <div v-for="item in data.system_info" :key="item" class="border-b flex pb-2 flex justify-between items-center">
                    {{ item.title }}
                    <b>
                        {{ item.value }}
                    </b>
                </div>
            </div>
        </Tab>
        <Tab title="processor">
            <div class="border rounded-xl p-4 border-[#17183B]">
                <div v-for="(item, index) in data.cpu_info" :key="index" class="flex py-1 justify-between items-center border-b">
                    {{ item.title }}
                    <b>
                        {{ item.value }}
                    </b>
                </div>
            </div>
        </Tab>
        <Tab title="database">
            <div class="border rounded-xl p-4 border-[#17183B]">
                <div v-for="item in data.swmem_memory" class="border-b flex pb-2 flex justify-between items-center">
                    {{ item.title }}
                    <b>
                        <!-- {{ item.value }} -->
                        <!-- if item.value is array then get first element and show it else show item.value -->
                        {{ typeof item.value === 'object' ? item.value[0] + ' %' : item.value }}
                    </b>
                </div>
                <!-- <div class="border-b flex py-2 flex justify-between items-center">
                    Percentage
                    <b>
                        75.90%
                    </b>
                </div>
                <div class="border-b flex py-2 flex justify-between items-center">
                    Total
                    <b>
                        2.30 KB
                    </b>
                </div>
                <div class="flex pt-2 flex justify-between items-center">
                    Used
                    <b>
                        2.30 KB
                    </b>
                </div> -->
            </div>
        </Tab>

        <Tab title="disk">
            <div class="border rounded-xl p-4 border-[#17183B]">
                <Accordion :is-open="false" v-for="(item, index) in  data?.disk_info" :key="index"
                    :title="`Disk ${index + 1}`">
                    <div class="flex flex-col justify-between mb-5">
                        <div class="w-full flex justify-between p-1 border-b" v-for="i in item" :key="i">
                            <span>
                                {{ i.total_size.title || '' }}
                            </span>
                            <b>
                                {{ i.total_size.value }}
                            </b>
                        </div>
                    </div>
                </Accordion>
            </div>
        </Tab>
    </Tabs>
</template>