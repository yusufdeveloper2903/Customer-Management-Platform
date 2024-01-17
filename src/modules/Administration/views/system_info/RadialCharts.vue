<script setup lang="ts">

//              IMPORTS                //

import { useI18n } from "vue-i18n";
import { ref } from 'vue'

//              PROPS/EMITS                //

const props = defineProps({
    firstData: {
        type: Array,
        required: true,
        default: () => [90, 10]
    },
    secondData: {
        type: Array,
        required: true,
        default: () => [90, 10]
    }
})

//            DECLORATIONS            //

const { t } = useI18n();

const chartOptions1 = ref({
    colors: ['#FF3B30', '#FFCC00'],
    plotOptions: {
        radialBar: {
            size: 100,
            hollow: {
                size: '50%',
            },
            track: {
                margin: 5,
            },
            dataLabels: {
                name: {
                    fontSize: '22px',
                },
                value: {
                    fontSize: '16px',
                },
                total: {
                    show: true,
                    label: t('used'),
                    formatter: function () {
                        // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                        return props.firstData[0] + '%'
                    }
                }
            },
        },
    },
    legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
    },
    stroke: {
        lineCap: 'round',
    },
    labels: [t('used'), t('available')],
})

const chartOptions2 = ref({
    colors: ['#480CA8', '#17183B'],
    plotOptions: {
        radialBar: {
            size: 100,
            hollow: {
                size: '50%',
            },
            track: {
                margin: 5,
            },
            dataLabels: {
                name: {
                    fontSize: '22px',
                },
                value: {
                    fontSize: '16px',
                },
                total: {
                    show: true,
                    label: t('used'),
                    formatter: function () {
                        // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                        return props.secondData[0] + '%'
                    }
                }
            },
        },
    },
    legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
    },
    stroke: {
        lineCap: 'round',
    },
    labels: [t('used'), t('available')],
})
</script>

<template>
    <!-- component -->
    <div class="grid gap-6 md:grid-cols-2 ">
        <div class="min-w-0 rounded-lg shadow-xs overflow-hidden bg-white dark:bg-gray-800">
            <div class="p-4 flex flex-col justify-center items-center">
                <h2 class="text-2xl font-semibold dark:text-white">
                    {{ $t('disk') }}
                </h2>
                <div id="chart" class="dark:text-white">
                    <apexchart type="radialBar" width="450" :options="chartOptions1" :series="props.firstData"></apexchart>
                </div>
            </div>
        </div>
        <div class="min-w-0 rounded-lg shadow-xs overflow-hidden bg-white dark:bg-gray-800">
            <div class="p-4 flex flex-col items-center justify-center">
                <h2 class="text-2xl font-semibold dark:text-white">
                    {{ $t('ram') }}
                </h2>
                <div id="chart" class="dark:text-white">
                    <apexchart type="radialBar" width="450" :options="chartOptions2" :series="secondData"></apexchart>
                </div>
            </div>
        </div>
    </div>
</template>