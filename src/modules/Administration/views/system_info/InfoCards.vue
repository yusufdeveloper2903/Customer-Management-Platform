<script setup lang="ts">

//              PROPS/EMITS                //

const props = defineProps({
    data: {
        type: Object,
        required: true,
        default: () => ({
            cpu_info: {
                value: 0,
                percentage: {
                    value: 0,
                    color: ''
                }
            },
            ddr: {
                used: {
                    value: 0,
                    percentage: {
                        value: 0,
                        color: ''
                    }
                },
                total: 0
            },
            disk: {
                used: {
                    value: 0,
                    percentage: {
                        value: 0,
                        color: ''
                    }
                },
                total: 0
            }
        })
    }
})
</script>

<template>
    <!-- component -->
    <div class="grid gap-6 mb-6 md:grid-cols-2 xl:grid-cols-3">
        <div class="min-w-0 rounded-lg shadow-xs overflow-hidden bg-white dark:bg-gray-800">
            <div class="p-4 flex justify-between items-center">
                <div class="p-3 rounded-full text-green-500 dark:text-green-100 bg-[#17183B] dark:bg-green-500 mr-4">
                    <Icon icon="Cpu" color="#fff" />
                </div>
                <div>
                    <p class="text-lg font-semibold dark:text-white text-right text-[#17183B]">
                        {{ props.data?.cpu_info?.value }}
                    </p>
                    <p class="mt-2 text-sm font-medium text-gray-600 dark:text-white">
                        {{ $t('cpu_usage') }}
                    </p>
                </div>
            </div>
        </div>
        <div class="min-w-0 rounded-lg shadow-xs overflow-hidden bg-white dark:bg-gray-800">
            <div class="p-4 flex items-center justify-between">
                <div class="p-3 rounded-full text-blue-500 dark:text-blue-100 bg-amber-400 mr-4">
                    <Icon icon="Pie Chart" color="#fff" />
                </div>
                <div>
                    <p class="text-lg font-semibold dark:text-white text-right text-amber-400">
                        {{ props.data?.ddr?.used?.value }}
                    </p>
                    <p class="mt-2 text-sm font-medium text-gray-600 dark:text-white">
                        {{ $t('ram_usage') }}
                    </p>
                </div>
            </div>
        </div>
        <div class="min-w-0 rounded-lg shadow-xs overflow-hidden bg-white dark:bg-gray-800">
            <div class="p-4 flex items-center justify-between">
                <div class="p-3 rounded-full text-teal-500 dark:text-teal-100 bg-red-500 mr-4">
                    <Icon icon="Database" color="#fff" />
                </div>
                <div>
                    <p class="text-lg font-semibold dark:text-white text-right text-red-500">
                        {{ props.data?.disk?.used?.value }}
                    </p>
                    <p class="mt-2 text-sm font-medium text-gray-600 dark:text-white">
                        {{ $t('disk_usage') }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>