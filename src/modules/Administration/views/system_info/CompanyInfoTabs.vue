<script setup lang="ts">

//              IMPORTS                    // 

import modules from '@/navigation/vertical/index'

//              COMPONENTS                //

import Tabs from '@/components/Tab/Tabs.vue'
import Tab from '@/components/Tab/Tab.vue'
import Logo from '@/assets/image/ZK.png'

//              DECLORATIONS                //

const systems = ['CRM', 'ERP', 'WMS', 'HRM', 'SRC']
const frontend = ['Java Script', 'Vue', 'React', 'Angular']
const backend = ['GO', 'Python', 'Laravel', 'PHP', 'Django', 'Iot', 'FastApi', 'Flask']
const ci_cd = ['GitLab', 'Jenkins', 'Docker', 'Kubernetes']
const database = ['PostgreSQL', 'MySQL', 'MongoDB', 'MariaDB']


</script>

<template>
    <Tabs class="card">
        <Tab title="company">
            <div class="flex justify-between gap-x-6 border rounded-xl p-4 border-[#17183B]">
                <img :src="Logo" class="w-[150px] h-[150px]" />
                <div class="w-full">
                    <div class="border-b flex pb-2 flex justify-between items-center">
                        {{ $t('company') }}
                        <b>Zamonaviy Kommunikatsiyalar LLC</b>
                    </div>
                    <div class="border-b flex py-2 flex justify-between items-center">
                        {{ $t('website') }}
                        <b>
                            <a class="text-blue-600" href="https://www.zk.uz" target="_blank">zk.uz</a>
                        </b>
                    </div>
                    <div class="border-b flex py-2 flex justify-between items-center">
                        {{ $t('email') }}
                        <b>
                            <a class="text-blue-600" href="mailto:info@zk.uz" target="_blank"> info@zk.uz </a>
                        </b>
                    </div>
                    <div class="border-b flex py-2 flex justify-between items-center">
                        {{ $t('nav.contacts') }}
                        <b>
                            <a class="text-blue-600" href="tel:+998941646633" target="_blank"> +998 94 164 66 33 </a>
                        </b>
                    </div>
                    <div class="border-b flex py-2 flex justify-between items-center">
                        {{ $t('licence') }}
                        <b style="max-width: 60%; text-align: right;">
                            © 2012-{{ new Date().getFullYear() }}. ZK.UZ - {{ $t('all_rights_reserved') }}
                        </b>
                    </div>
                    <div class="flex pt-2 flex justify-between items-center">
                        {{ $t('address') }}
                        <b>
                            Узбекистан, Ташкент, Чиланзарский р-н, с. Чиланзор, 1 кв./4
                        </b>
                    </div>
                </div>
            </div>
        </Tab>
        <Tab title="tech">
            <div class="flex justify-between gap-x-6 border rounded-xl p-4 border-[#17183B]">
                <img :src="Logo" class="w-[150px] h-[150px]" />
                <div class="w-full">
                    <div class="border-b flex pb-2 flex justify-between items-center">
                        {{ $t('systems') }}
                        <b class="flex justify-end flex-wrap">
                            <span v-for="system in systems" :key="system"
                                class="inline-flex justify-end items-center m-1 px-2 py-1 bg-green-200 hover:bg-green-300 rounded-lg text-sm font-semibold text-green-600">
                                <span class="ml-1">
                                    {{ system }}
                                </span>
                            </span>
                        </b>
                    </div>
                    <div class="border-b flex py-2 flex justify-between items-center">
                        {{ $t('frontend') }}
                        <b class="flex justify-end flex-wrap">
                            <span v-for="system in frontend" :key="system"
                                class="inline-flex justify-end items-center m-1 px-2 py-1 bg-green-200 hover:bg-green-300 rounded-lg text-sm font-semibold text-green-600">
                                <span class="ml-1">
                                    {{ system }}
                                </span>
                            </span>
                        </b>
                    </div>
                    <div class="border-b flex py-2 flex justify-between items-center">
                        {{ $t('backend') }}
                        <b class="flex justify-end flex-wrap">
                            <span v-for="system in backend" :key="system"
                                class="inline-flex justify-end items-center m-1 px-2 py-1 bg-green-200 hover:bg-green-300 rounded-lg text-sm font-semibold text-green-600">
                                <span class="ml-1">
                                    {{ system }}
                                </span>
                            </span>
                        </b>
                    </div>
                    <div class="border-b flex py-2 flex justify-between items-center">
                        {{ $t('ci_cd') }}
                        <b class="flex justify-end flex-wrap">
                            <span v-for="system in ci_cd" :key="system"
                                class="inline-flex justify-end items-center m-1 px-2 py-1 bg-green-200 hover:bg-green-300 rounded-lg text-sm font-semibold text-green-600">
                                <span class="ml-1">
                                    {{ system }}
                                </span>
                            </span>
                        </b>
                    </div>
                    <div class="flex pt-2 flex justify-between items-center">
                        {{ $t('database') }}
                        <b class="flex justify-end flex-wrap">
                            <span v-for="system in database" :key="system"
                                class="inline-flex justify-end items-center m-1 px-2 py-1 bg-green-200 hover:bg-green-300 rounded-lg text-sm font-semibold text-green-600">
                                <span class="ml-1">
                                    {{ system }}
                                </span>
                            </span>
                        </b>
                    </div>
                </div>
            </div>
        </Tab>
        <Tab title="products">
            <div class="flex justify-between gap-x-6 border rounded-xl p-4 border-[#17183B]">
                <img :src="Logo" class="w-[150px] h-[150px]" />
                <div class="w-full">
                    <div class="border-b flex pb-2 flex justify-between items-center">
                        {{ $t('users_amount') }}
                        <b>
                            -
                        </b>
                    </div>
                    <div class="border-b flex py-2 flex justify-between items-center">
                        {{ $t('system_modules') }}
                        <b class="flex justify-end flex-wrap">
                            <span v-for="item in modules" :key="item"
                                class="inline-flex justify-end items-center m-1 px-2 py-1 bg-green-200 hover:bg-green-300 rounded-lg text-sm font-semibold text-green-600">
                                <span class="ml-1">
                                    {{ $t(item.name) }}
                                </span>
                            </span>
                        </b>
                    </div>
                    <div class="flex pt-2 flex justify-between items-center">
                        {{ $t('licence') }}
                        <b>
                            ZK Digital Core
                        </b>
                    </div>
                </div>
            </div>
        </Tab>
    </Tabs>
</template>