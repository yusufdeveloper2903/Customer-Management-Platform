<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import InfoCards from './InfoCards.vue'
import RadialCharts from './RadialCharts.vue'
import LinearCharts from './LinearCharts.vue'
import CompanyInfoTabs from './CompanyInfoTabs.vue'
import OSInfoTabs from './OSInfoTabs.vue'
const socket = ref<WebSocket | null>(null);
const message = ref<string>('');
const connected = ref<boolean>(false);
const lineChartData = ref(null)

onMounted(() => {
    socket.value = new WebSocket('ws://192.168.31.111:4005/');

    socket.value.addEventListener('open', () => {
        connected.value = true;
        console.log('WebSocket connected!');
    });

    socket.value.addEventListener('message', (event) => {
        message.value = event.data;
        lineChartData.value = event.data
        
    });

    socket.value.addEventListener('error', (event) => {
        console.error('WebSocket error:', event);
    });
});
onUnmounted(() => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
        socket.value.removeEventListener('open', () => { });
        socket.value.removeEventListener('message', () => { });
        socket.value.removeEventListener('error', () => { });

        socket.value.close();
    }
});

</script>
<template>
    <div class="dark:text-white">
        <InfoCards :data="JSON.parse(lineChartData)?.server_system"/>
        <div class="grid grid-cols-2 gap-x-6 items-stretch">
            <RadialCharts :firstData="JSON.parse(lineChartData)?.server_system?.disk?.percentage?.value"
                :secondData="JSON.parse(lineChartData)?.server_system?.ddr?.percentage?.value" />
            <LinearCharts :data="JSON.parse(lineChartData)?.server_system?.system_cpu.result" />
        </div>
        <div class="grid grid-cols-2 gap-x-6  mt-6">
            <OSInfoTabs />
            <CompanyInfoTabs />
        </div>
    </div>
</template>
