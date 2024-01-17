<script setup lang="ts">

//              IMPORTS                //

import { ref, watch } from 'vue'
import { useI18n } from "vue-i18n";

//              PROPS/EMITS                //

const props = defineProps(['data'])

//              DECLORATIONS                //

const { t } = useI18n();
const series = ref<any>([
    {
        title: 'Core 1',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    {
        title: 'Core 2',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    {
        title: 'Core 3',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    {
        title: 'Core 4',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    {
        title: 'Core 5',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    {
        title: 'Core 6',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    {
        title: 'Core 7',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    {
        title: 'Core 8',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    {
        title: 'Core 9',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    {
        title: 'Core 10',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    {
        title: 'Core 11',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    {
        title: 'Core 12',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },

])

//              OPTIONS                //

const chartOptions3 = ref({
    chart: {
        height: 350,
        type: 'line',
        zoom: {
            enabled: false
        },
        toolbar: {
            show: false
        },
        animations: {
            enabled: false,
            easing: 'linear',
            dynamicAnimation: {
                speed: 1000
            }
        },
    },
    dataLabels: {
        enabled: false
    },
    // stroke: {
    //     curve: 'straight',
    // },
    stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        colors: undefined,
        width: 2,
        dashArray: 0,
    },
    title: {
        text: t('cpu_usage'),
        align: 'left'
    },
})

//              COMPUTED                //

// check there is props.data and if it is, start function to set series and array
watch(() => props.data, () => {
    if (props.data) {
        setSeries()
    }
})

//              FUNCTIONS                //

const setSeries = () => {
    for (let i = 0; i < props.data.length; i++) {
        series.value[i].title = props.data[i]?.title
        series.value[i].data.push(props.data[i].percentage)
        series.value[i].data.shift()
    }
}

</script>

<template>
    <div class="rounded-lg shadow-xs overflow-hidden bg-white dark:text-white dark:bg-gray-800">
        <div class="p-4 ">
            <Apexchart ref="chartRealtime" type="line" height="350" :options="chartOptions3" :series="series" />
        </div>
    </div>
</template>