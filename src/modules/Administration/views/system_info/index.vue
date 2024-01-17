<template>
  <div>
    <div class="flex justify-between">
      <div class="flex w-1/3 grid-rows-2 justify-between rounded bg-white p-5 pb-10 dark:bg-darkLayoutStorm dark:text-gray-300">
        <span>
          <h1 class="text-2xl font-bold dark:text-white">{{ administrationStorage?.os_system_info?.data && administrationStorage?.os_system_info?.data[2]
             && administrationStorage?.os_system_info?.data[2]?.total_cpu_usage?.value }}</h1>
          <p class="text-sm">{{ $t('cpu_usage') }}</p>
        </span>

        <div
          class="relative inline-flex h-[50px] w-[50px] items-center justify-center overflow-hidden rounded-full bg-success/20"
        >
          <span class="text-[24px] font-medium text-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21px"
              height="21px"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-cpu"
            >
              <rect
                x="4"
                y="4"
                width="16"
                height="16"
                rx="2"
                ry="2"
              />
              <rect
                x="9"
                y="9"
                width="6"
                height="6"
              />
              <line
                x1="9"
                y1="1"
                x2="9"
                y2="4"
              />
              <line
                x1="15"
                y1="1"
                x2="15"
                y2="4"
              />
              <line
                x1="9"
                y1="20"
                x2="9"
                y2="23"
              />
              <line
                x1="15"
                y1="20"
                x2="15"
                y2="23"
              />
              <line
                x1="20"
                y1="9"
                x2="23"
                y2="9"
              />
              <line
                x1="20"
                y1="14"
                x2="23"
                y2="14"
              />
              <line
                x1="1"
                y1="9"
                x2="4"
                y2="9"
              />
              <line
                x1="1"
                y1="14"
                x2="4"
                y2="14"
              />
            </svg>
          </span>
        </div>
      </div>

      <div class="mx-5 flex w-1/3 grid-rows-2 justify-between rounded bg-white p-5 pb-10 dark:bg-darkLayoutStorm dark:text-gray-300">
        <span>
          <h1 class="text-2xl font-bold dark:text-white">{{websocketData?.ram?.available?.value}}</h1>
          <p class="text-sm">{{ $t('ram_usage') }}</p>
        </span>

        <div
          class="relative inline-flex h-[50px] w-[50px] items-center justify-center overflow-hidden rounded-full bg-warning/20"
        >
          <span class="text-[24px] font-medium text-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21px"
              height="21px"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-server"
            >
              <rect
                x="2"
                y="2"
                width="20"
                height="8"
                rx="2"
                ry="2"
              />
              <rect
                x="2"
                y="14"
                width="20"
                height="8"
                rx="2"
                ry="2"
              />
              <line
                x1="6"
                y1="6"
                x2="6.01"
                y2="6"
              />
              <line
                x1="6"
                y1="18"
                x2="6.01"
                y2="18"
              />
            </svg>
          </span>
        </div>
      </div>

      <div class="flex w-1/3 grid-rows-2 justify-between rounded bg-white p-5 pb-10 dark:bg-darkLayoutStorm dark:text-gray-300">
        <span>
          <h1 class="text-2xl font-bold dark:text-white">{{ administrationStorage?.os_system_info?.data && administrationStorage?.os_system_info?.data[5] 
            && administrationStorage?.os_system_info?.data[5]?.volumes_used }}</h1>
          <p class="text-sm">{{ $t('disk_usage') }}</p>
        </span>

        <div
          class="relative inline-flex h-[50px] w-[50px] items-center justify-center overflow-hidden rounded-full bg-danger/20"
        >
          <span class="text-[24px] font-medium text-danger">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21px"
              height="21px"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-hard-drive"
            >
              <line
                x1="22"
                y1="12"
                x2="2"
                y2="12"
              />
              <path
                d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"
              />
              <line
                x1="6"
                y1="16"
                x2="6.01"
                y2="16"
              />
              <line
                x1="10"
                y1="16"
                x2="10.01"
                y2="16"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>







    <!-- chart -->
    <div class="flex">
      <div
        class="mr-5 mt-5 flex w-2/5 items-center justify-center rounded bg-white p-5 pb-10 dark:bg-darkLayoutStorm dark:text-white"
      >
        <div id="chart">
          <h1 class="text-center dark:text-white">
            {{ $t('disk') }}
          </h1>
          <Apexchart
            type="radialBar"
            width="250"
            height="250"
            :options="chartOptions"
            :series="series"
          />
        </div>

        <div id="chart">
          <h1 class="text-center dark:text-white">
            {{ $t('ram') }}
          </h1>
          <Apexchart
            type="radialBar"
            width="250"
            height="250"
            :options="chartOptions2"
            :series="series2"
          />
        </div>
      </div>

      <div class="mt-5 w-3/5 grid-rows-2 rounded bg-white p-5 pb-10 dark:bg-darkLayoutStorm dark:text-gray-300">
        <div id="chart">
          <Apexchart
            ref="chartRealtime"
            height="350"
            :options="chartOptions3"
            :series="series3"
          />
        </div>
      </div>
    </div>






    <!-- tabs -->
    <div class="flex">
      <div class="mr-5 mt-5 w-3/5 grid-rows-2 rounded bg-white p-5 pb-10 dark:bg-darkLayoutStorm dark:text-gray-300">
        <Tabs>
          <Tab :title="'info_about_system'">
            <div class="rounded-lg border border-solid border-indigo-700 p-4">
              <ul class="uk-list uk-list-divider text-sm">
                <li class="flex justify-between">
                  <span>{{administrationStorage?.os_system_info?.system_info?.system?.title}}</span>
                  <span>{{administrationStorage?.os_system_info?.system_info?.system?.value}}</span>
                </li>
                <li class="flex justify-between">
                  <span>{{administrationStorage?.os_system_info?.system_info?.machine?.title}}</span>
                  <span>{{administrationStorage?.os_system_info?.system_info?.machine?.value}}</span>
                </li>
                <li class="flex justify-between">
                  <span>{{administrationStorage?.os_system_info?.system_info?.processor?.title}}</span>
                  <span>{{administrationStorage?.os_system_info?.system_info?.processor?.value}}</span>
                </li>
                <li class="flex justify-between">
                  <span>{{administrationStorage?.os_system_info?.system_info?.version?.title}}</span>
                  <span>{{administrationStorage?.os_system_info?.system_info?.version?.value}}</span>
                </li>
                <li class="flex justify-between">
                  <span>{{administrationStorage?.os_system_info?.system_info?.node_name?.title}}</span>
                  <span>{{administrationStorage?.os_system_info?.system_info?.node_name?.value}}</span>
                </li>
                <li class="flex justify-between">
                  <span>{{administrationStorage?.os_system_info?.system_info?.release?.title}}</span>
                  <span>{{administrationStorage?.os_system_info?.system_info?.release?.value}}</span>
                </li>
              </ul>
            </div>
          </Tab>

          <Tab :title="'processor'">
            <div class="rounded-lg border border-solid border-indigo-700 p-4">
              <ul class="uk-list uk-list-divider text-sm">
                <li class="flex justify-between">
                  <span>{{administrationStorage?.os_system_info?.cpu_info?.physical_cores?.title}}</span>
                  <span>{{administrationStorage?.os_system_info?.cpu_info?.physical_cores?.value}}</span>
                </li>
                <li class="flex justify-between">
                  <span>{{administrationStorage?.os_system_info?.cpu_info?.total_cores?.title}}</span>
                  <span>{{administrationStorage?.os_system_info?.cpu_info?.total_cores?.value}}</span>
                </li>
                <li class="flex justify-between">
                  <span>{{administrationStorage?.os_system_info?.cpu_info?.max_frequency?.title}}</span>
                  <span>{{administrationStorage?.os_system_info?.cpu_info?.max_frequency?.value}}</span>
                </li>
                <li class="flex justify-between">
                  <span>{{administrationStorage?.os_system_info?.cpu_info?.min_frequency?.title}}</span>
                  <span>{{administrationStorage?.os_system_info?.cpu_info?.min_frequency?.value}}</span>
                </li>
                <li class="flex justify-between">
                  <span>{{administrationStorage?.os_system_info?.cpu_info?.current_frequency?.title}}</span>
                  <span>{{administrationStorage?.os_system_info?.cpu_info?.current_frequency?.value}}</span>
                </li>
                <li class="flex justify-between">
                  <span>{{administrationStorage?.os_system_info?.cpu_info?.total_cpu_usage?.title}}</span>
                  <span>{{administrationStorage?.os_system_info?.cpu_info?.total_cpu_usage?.value}}</span>
                </li>
              </ul>
            </div>
          </Tab>

          <Tab :title="'database'">
            <div class="rounded-lg border border-solid border-indigo-700 p-4">
              <ul class="uk-list uk-list-divider text-sm">
                <li class="flex justify-between">
                  <span>{{administrationStorage?.os_system_info?.swmem_memory?.available?.title}}</span>
                  <span>{{administrationStorage?.os_system_info?.swmem_memory?.available?.value}}</span>
                </li>
                <li class="flex justify-between">
                  <span>{{administrationStorage?.os_system_info?.swmem_memory?.percentage?.title}}</span>
                  <span>{{administrationStorage?.os_system_info?.swmem_memory?.percentage?.value[1]}}%</span>
                </li>
                <li class="flex justify-between">
                  <span>{{administrationStorage?.os_system_info?.swmem_memory?.total?.title}}</span>
                  <span>{{administrationStorage?.os_system_info?.swmem_memory?.total?.value}}</span>
                </li>
                <li class="flex justify-between">
                  <span>{{administrationStorage?.os_system_info?.swmem_memory?.used?.title}}</span>
                  <span>{{administrationStorage?.os_system_info?.swmem_memory?.used?.value}}</span>
                </li>
              </ul>
            </div>
          </Tab>

          <Tab :title="'disk2'">
            <div class="rounded-lg border border-solid border-indigo-700 p-4">
              <ul class="uk-nav-default" uk-nav>
                <li class="uk-parent" v-for="(item, index) in administrationStorage?.os_system_info?.disk_info?.volumes"
                :key="index">
                    <a href="#" style="color: black;">{{item?.device?.value}} <span uk-nav-parent-icon></span></a>
                    <ul class="uk-nav-sub uk-list uk-list-divider text-sm">
                        <li class="flex justify-between">
                          <span>{{item.total_size?.title}}</span>
                          <span>{{item.total_size?.value}}</span>
                        </li>
                        <li class="flex justify-between">
                          <span>{{item.used?.title}}</span>
                          <span>{{item.used?.value}}</span>
                        </li>
                        <li class="flex justify-between">
                          <span>{{item.free?.title}}</span>
                          <span>{{item.free?.value}}</span>
                        </li>
                        <li class="flex justify-between">
                          <span>{{item.percentage?.title}}</span>
                          <span>{{item.percentage?.value}}</span>
                        </li>
                        <li class="flex justify-between">
                          <span>{{item.device?.title}}</span>
                          <span>{{item.device?.value}}</span>
                        </li>
                        <li class="flex justify-between">
                          <span>{{item.mountpoint?.title}}</span>
                          <span>{{item.mountpoint?.value}}</span>
                        </li>
                        <li class="flex justify-between">
                          <span>{{item.fstype?.title}}</span>
                          <span>{{item.fstype?.value}}</span>
                        </li>
                    </ul>
                </li>
              </ul>

            </div>
          </Tab>
        </Tabs>
      </div>


      <!-- 2-card -->
      <div class="mt-5 w-2/5 grid-rows-2 rounded bg-white p-5 pb-10 dark:bg-darkLayoutStorm dark:text-gray-300">
        <Tabs>
          <Tab :title="'company'">
            <div class="flex justify-between rounded-lg border border-solid border-indigo-700 p-5">
              <div
                class="relative inline-flex h-[70px] w-44 w-[70px] items-center justify-center overflow-hidden rounded-full bg-success/20"
              >
                <span class="text-[36px] font-medium text-success">AI</span>
              </div>
              <div class="w-4/5">
                <ul class="uk-list uk-list-divider text-sm">
                  <li class="flex justify-between">
                    <span>{{ $t('company') }}</span>
                    <span>Zamonaviy Kommunikatsiyalar</span>
                  </li>
                  <li class="flex justify-between">
                    <span>{{ $t('website') }}</span>
                    <span>zk.uz</span>
                  </li>
                  <li class="flex justify-between">
                    <span>{{ $t('email') }}</span>
                    <span>info@zk.uz</span>
                  </li>
                  <li class="flex justify-between">
                    <span>{{ $t('nav.contacts') }}</span>
                    <span>+998 94 164 66 33</span>
                  </li>
                  <li class="flex justify-between">
                    <span>{{ $t('licence') }}</span>
                    <span class="ml-12 text-right">© 2012-2022. ZK.UZ - Замонавий Коммуникациялар. Все права
                      защищены.</span>
                  </li>
                  <li class="flex justify-between">
                    <span>{{ $t('address') }}</span>
                    <span class="ml-12 text-right">Узбекистан, Ташкент, Чиланзарский р-н, с. Чиланзор, 1 кв./4</span>
                  </li>
                </ul>
              </div>
            </div>
          </Tab>

          <Tab :title="'tech'">
            <div class="flex justify-between rounded-lg border border-solid border-indigo-700 p-5">
              <div
                class="relative inline-flex h-[70px] w-44 w-[70px] items-center justify-center overflow-hidden rounded-full bg-success/20"
              >
                <span class="text-[36px] font-medium text-success">AI</span>
              </div>
              <div class="w-4/5">
                <ul class="uk-list uk-list-divider text-sm">
                  <li class="flex justify-between">
                    <span class="mr-4">{{ $t('systems') }}</span>
                    <div class="flex flex-wrap">
                      <span class="rounded-md font-medium bg-success/20 px-4 pb-0.5 text-success text-xs mb-1 mx-1">CRM</span>
                      <span class="rounded-md font-medium bg-success/20 px-4 pb-0.5 text-success text-xs mb-1 mx-1">ERP</span>
                      <span class="rounded-md font-medium bg-success/20 px-4 pb-0.5 text-success text-xs mb-1 mx-1">WMS</span>
                      <span class="rounded-md font-medium bg-success/20 px-4 pb-0.5 text-success text-xs mb-1 mx-1">HRM</span>
                      <span class="rounded-md font-medium bg-success/20 px-4 pb-0.5 text-success text-xs mb-1 mx-1">SRC</span>
                    </div>
                  </li>
                  <li class="flex justify-between">
                    <span>{{ $t('frontend') }}</span>
                    <div class="flex flex-wrap">
                      <span class="rounded-md font-medium bg-success/20 px-4 pb-0.5 text-success text-xs mb-1 mx-1">JavaScript</span>
                      <span class="rounded-md font-medium bg-success/20 px-4 pb-0.5 text-success text-xs mb-1 mx-1">TypeScript</span>
                      <span class="rounded-md font-medium bg-success/20 px-4 pb-0.5 text-success text-xs mb-1 mx-1">Vue.js</span>
                      <span class="rounded-md font-medium bg-success/20 px-4 pb-0.5 text-success text-xs mb-1 mx-1">Nuxt.js</span>
                    </div>
                  </li>
                  <li class="flex justify-between">
                    <span>{{ $t('backend') }}</span>
                    <div class="flex flex-wrap">
                      <span class="rounded-md font-medium bg-success/20 px-4 pb-0.5 text-success text-xs mb-1 mx-1">Go</span>
                      <span class="rounded-md font-medium bg-success/20 px-4 pb-0.5 text-success text-xs mb-1 mx-1">Python</span>
                      <span class="rounded-md font-medium bg-success/20 px-4 pb-0.5 text-success text-xs mb-1 mx-1">Django</span>
                      <span class="rounded-md font-medium bg-success/20 px-4 pb-0.5 text-success text-xs mb-1 mx-1">FastAPI</span>
                      <span class="rounded-md font-medium bg-success/20 px-4 pb-0.5 text-success text-xs mb-1 mx-1">Flask</span>
                      <span class="rounded-md font-medium bg-success/20 px-4 pb-0.5 text-success text-xs mb-1 mx-1">PHP</span>
                    </div>
                  </li>
                  <li class="flex justify-between">
                    <span>{{ $t('ci_cd') }}</span>
                    <div class="flex flex-wrap">
                      <span class="rounded-md font-medium bg-success/20 px-4 pb-0.5 text-success text-xs mb-1 mx-1">Gitlab</span>
                      <span class="rounded-md font-medium bg-success/20 px-4 pb-0.5 text-success text-xs mb-1 mx-1">Kubernetes</span>
                      <span class="rounded-md font-medium bg-success/20 px-4 pb-0.5 text-success text-xs mb-1 mx-1">Docker</span>
                    </div>
                  </li>
                  <li class="flex justify-between">
                    <span>{{ $t('database') }}</span>
                    <div class="flex flex-wrap">
                      <span class="rounded-md font-medium bg-success/20 px-4 pb-0.5 text-success text-xs mb-1 mx-1">Postgre SQL</span>
                      <span class="rounded-md font-medium bg-success/20 px-4 pb-0.5 text-success text-xs mb-1 mx-1">MariaDB</span>
                      <span class="rounded-md font-medium bg-success/20 px-4 pb-0.5 text-success text-xs mb-1 mx-1">MS SQL</span>
                      <span class="rounded-md font-medium bg-success/20 px-4 pb-0.5 text-success text-xs mb-1 mx-1">MySQL</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </Tab>

          <Tab :title="'products'">
            <div class="flex justify-between rounded-lg border border-solid border-indigo-700 p-5">
              <div
                class="relative inline-flex h-[70px] w-44 w-[70px] items-center justify-center overflow-hidden rounded-full bg-success/20"
              >
                <span class="text-[36px] font-medium text-success">AI</span>
              </div>
              <div class="w-4/5">
                <ul class="uk-list uk-list-divider text-sm">
                  <li class="flex justify-between">
                    <span>{{ $t('users_amount') }}</span>
                    <span>4</span>
                  </li>
                  <li class="flex justify-between">
                    <span>{{ $t('system_modules') }}</span>
                    <div class="flex flex-wrap">
                      <span class="rounded-md font-medium bg-success/20 px-4 pb-0.5 text-success text-xs mb-1 mx-1">{{ $t('users') }}</span>
                      <span class="rounded-md font-medium bg-success/20 px-4 pb-0.5 text-success text-xs mb-1 mx-1">Справочник</span>
                      <span class="rounded-md font-medium bg-success/20 px-4 pb-0.5 text-success text-xs mb-1 mx-1">Администрация</span>
                      <span class="rounded-md font-medium bg-success/20 px-4 pb-0.5 text-success text-xs mb-1 mx-1">Сделки</span>
                      <span class="rounded-md font-medium bg-success/20 px-4 pb-0.5 text-success text-xs mb-1 mx-1">Профиль</span>
                    </div>
                  </li>
                  <li class="flex justify-between">
                    <span>{{ $t('licence') }}</span>
                    <span>ZK Digital Core</span>
                  </li>
                </ul>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script>
import Tab from "@/components/Tab/Tab.vue"
import Tabs from "@/components/Tab/Tabs.vue"
import {
  ref,
  toRef,
  toRefs,
  onMounted,
} from 'vue'
import { administrationStore } from '../../store/index'

export default {
  components: {
    Tabs,
    Tab,
  },
  setup() {

    const administrationStorage = administrationStore()

    let series = ref([])


    onMounted(async () => {
      await administrationStorage.FETCH_OS_SYSTEM_INFO()

      series.value = administrationStorage?.os_system_info?.system?.volume && administrationStorage?.os_system_info?.system?.volume[0] && 
      administrationStorage?.os_system_info?.system?.volume[0]?.percentage?.value ? administrationStorage?.os_system_info?.system?.volume[0]?.percentage?.value : []
    })


    return {
      administrationStorage,
      series,
    }
  },
  data() {
    return {
      series: [76, 24],
      chartOptions: {
        chart: {
          height: 350,
          type: 'radialBar',
        },
        colors: ['#FF3B30', '#FFCC00'],
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                fontSize: '22px',
              },
              value: {
                fontSize: '16px',
              },
              total: {
                show: true,
                label: '',
                formatter: function (w) {
                  // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                  return 249
                },
              },
            },
          },
        },
        stroke: {
          lineCap: 'round',
        },
        labels: ['свободно', 'занято'],
      },


      series2: [76, 24],
      chartOptions2: {
        chart: {
          height: 350,
          type: 'radialBar',
        },
        colors: ['#480CA8', '#356C2D'],
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                fontSize: '22px',
              },
              value: {
                fontSize: '16px',
              },
              total: {
                show: true,
                label: '',
                formatter: function (w) {
                  // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                  return 185
                },
              },
            },
          },
        },
        stroke: {
          lineCap: 'round',
        },
        labels: ['свободно', 'занято'],
      },




      chartOptions3: {
          chart: {
          type: 'bar',
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparents']
        },
        xaxis: {
          categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        },
        yaxis: {
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return "$ " + val + " thousands"
            }
          }
        }
        },

        series3: [{
          name: 'СНГ',
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        }, {
          name: 'Европа',
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
        }, {
          name: 'Азия',
          data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
        }],
      
      dataset: [],
      websocketData: {}
    }
  },
  created(){
    
  },
  mounted: function () {



    this.$options.sockets.onmessage = (data) => {
      let response  = JSON.parse(data.data)
      this.websocketData = response

      let used = (parseFloat(response.ram.used.value) * 100) / parseFloat(response.ram.total.value)
      this.series2[0] = parseFloat(used).toFixed(2)
      let available = (parseFloat(response.ram.available.value) * 100) / parseFloat(response.ram.total.value)
      this.series2[1] = parseFloat(available).toFixed(2)


     

      if(response && response.cpu && response.cpu.result){

        
        if(this.dataset.length == 0){
          response.cpu.result.forEach((elem, index) => {

            this.dataset.push({
              name: elem.title,
              data: [Number(elem.percentage)]
            })
            
          })
        }



        if(this.dataset.length > 0){

         

          response.cpu.result.forEach((elem, index) => {
            this.dataset[index].data.push(Number(elem.percentage))
          })
          

          this.$refs.chartRealtime.updateSeries(this.dataset)
        }
        console.log(this.dataset)

        

         if(this.dataset && this.dataset[0] && this.dataset[0].data.length > 10){
            this.dataset.forEach((elem, index) => {
              this.dataset[index].data.shift()
            })  
          }

        



        
      }
    }




    var me = this
    window.setInterval(function () {
      // getNewSeries(lastDate, {
      //   min: 10,
      //   max: 90
      // })

      // me.$refs.chart.updateSeries([{
      //   data: data
      // }])
    }, 1000)

    // every 60 seconds, we reset the data to prevent memory leaks
    window.setInterval(function () {
      // resetData()

      // me.$refs.chart.updateSeries([{
      //   data,
      // }], false, true)
    }, 60000)
  },


  methods: {
     
  },
}
</script>

<style>
.dark .vue-apexcharts div svg g text {
  fill: #ffffff !important;
}
</style>