<script setup lang="ts">


//IMPORTED FILES
import {reactive, onMounted, computed, Ref, ref, watch} from "vue";
import "@/assets/modal.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import UIkit from "uikit";
import {
  LocationPlaceData,
  LocationPlace,
} from "@/modules/KnowledgeBase/interfaces";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate, {Validation} from "@vuelidate/core";
import knowledgeStore from "@/modules/KnowledgeBase/store";
import {toast} from "vue3-toastify";
import {useI18n} from "vue-i18n";
import ModalTab from "@/components/Tab/ModalTab.vue";
import ModalTabs from "@/components/Tab/ModalTabs.vue";
import FileInput from "@/components/FileInput/FileInput.vue";
import {objectToFormData} from "@/mixins/formmatter";
import {useSidebarStore} from '@/stores/layoutConfig'
import axios from "axios";


interface Props {
  oldData?: LocationPlace;
}


//DECLARED VARIABLES
const regionValue = ref("")
const emptyData = ref(false)
const general = useSidebarStore()
const props = defineProps<Props>();
const emit = defineEmits(["refresh", "getRegion"]);
const store = knowledgeStore();
const search = ref('')
let delay = reactive(null)
let features = ref([])
const {t} = useI18n();
const showMap = ref(false);
let map = ref(null)
let marker = ref(null)
let openTime = ref()
let closeTime = ref()

let location = reactive<LocationPlaceData>({
  id: '',
  title: '',
  title_uz: '',
  title_ru: '',
  title_kr: '',
  address: "",
  address_uz: "",
  address_kr: "",
  address_ru: "",
  photo: '',
  closed_at: '',
  opened_at: '',
  phones: '',
  region: '',
  district: "",
  coordinatesData: {lat: null, lng: null},
  coordinates: {lat: null, lng: null},
});


//FUNCTIONS

function findLocation() {
  clearTimeout(delay)

  delay = setTimeout(async () => {
    refresh()
  }, 500)

}

const onSubmit = async () => {
  if (!location.title_uz && !location.address_uz) {
    general.tabs = 'UZ'
  } else if (!location.title_kr && !location.address_kr) {
    general.tabs = 'KR'
  } else if (!location.title_ru && !location.address_ru) {
    general.tabs = 'RU'
  }
  const success = await validate.value.$validate();
  if (!success) return;
  location.title = location.title_uz
  location.address = location.address_uz
  location.coordinates = JSON.stringify(location.coordinatesData)
  const fd = objectToFormData(['photo'], location);
  if (location.id) {
    await store.updateOneForm(fd);
    toast.success(t("success"));
  } else {
    await store.AddForms(fd);
    toast.success(t("success"));
  }
  await UIkit.modal("#location-modal").hide();
  emit("refresh");
};

const hideModal = () => {
  openTime.value = '';
  closeTime.value = '';
  general.tabs = ''
  emptyData.value = false
  Object.assign(location, {
    id: undefined,
    title_uz: '',
    title_ru: '',
    title_kr: '',
    address_uz: '',
    address_kr: '',
    address_ru: '',
    closed_at: '',
    opened_at: '',
    phones: '',
    region: null,
    district: "",

    coordinates: {lat: null, lng: null},
    coordinatesData: {lat: null, lng: null},
  });


}

function refresh() {
  axios.get(`https://search-maps.yandex.ru/v1/?text=${search.value}&type=geo&lang=uz_UZ&apikey=76991167-004f-460a-8741-153b0762aa6d`)
      .then(res => {
        if (res.data && res.data.features) {
          features.value = res.data.features


        }
      }).catch((err) => {
    features.value = []
  })
}


const onShowModal = () => {

      emptyData.value = true
      if (props.oldData?.id) {
        const {region, opened_at, closed_at, coordinates, ...rest} = props.oldData;
        Object.assign(location, {region: region.id, ...rest});
        if (coordinates) {
          location.coordinatesData = coordinates
        }

        if (opened_at) {
          let time = opened_at.split(':')
          openTime.value = {
            hours: time[0], minutes: time[1], seconds: time[2]
          }
        }
        if (closed_at) {
          let timClose = closed_at.split(':')
          closeTime.value = {
            hours: timClose[0], minutes: timClose[1], seconds: timClose[2]
          }
        }


      }
      showMap.value = true;
      // setTimeout(() => {
      //   let map = L.map("map1").setView([41.2995, 69.2401], 11);
      //   L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      //     attribution:
      //         '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      //   }).addTo(map);
      //   let markerIcon = L.icon({
      //     iconUrl: '/marker-icon.png',
      //     iconSize: [25, 41],
      //     // iconAnchor: [12, 36]
      //   });
      //   let marker = L.marker(location.coordinatesData, {icon: markerIcon}).addTo(map);

      //   map.on("click", function (e) {
      //     location.coordinatesData = e.latlng;

      //     if (marker) {
      //       map.removeLayer(marker);
      //     }
      //     marker = L.marker(location.coordinatesData, {icon: markerIcon}).addTo(map);
      //   });
      // }, 800);


      setTimeout(() => {

        let DefaultIcon = L.icon({
          iconUrl: '/marker-icon.png',
          iconSize: [25, 41],
          // iconAnchor: [12, 36]
        });

        L.Marker.prototype.options.icon = DefaultIcon;
        map.value = L.map("map1").setView([41.2995, 69.2401], 11);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
              '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map.value);

        marker.value = L.marker(location.coordinatesData,).addTo(map.value);

        map.value.on("click", async function (e) {

          location.coordinatesData = e.latlng;


          if (marker.value) {
            map.value.removeLayer(marker.value);
          }
          marker.value = L.marker(location.coordinatesData,).addTo(map.value)
        });
      }, 1000);
    }
;


function setLocation(mapData, index) {

  search.value = mapData.properties.name
  features.value = []

  const [lng, lat] = mapData.geometry.coordinates
  let cor = {lat: lat, lng: lng}
  location.coordinatesData = cor
  // console.log([lng, lat], 'oldi');
  map.value.setView([lat, lng], 11)


  if (marker.value) {
    map.value.removeLayer(marker.value);
  }
  marker.value = L.marker(cor).addTo(map.value)
}


//MOUNTED LIFE CYCLE
onMounted(() => {
  UIkit.util.on("#location-modal", "show", () => {
    onShowModal();
  });
  UIkit.util.on("#location-modal", "hidden", () => {
    showMap.value = false;
    validate.value.$reset();
  });
});


//WATCHERS
watch(() => openTime.value, function (val) {
  if (val && val.hours && val.minutes) {
    location.opened_at = val.hours + ':' + val.minutes
  } else {
    location.opened_at = ''
  }
})

watch(() => closeTime.value, function (val) {
  if (val && val.hours && val.minutes) {
    location.closed_at = val.hours + ':' + val.minutes
  } else {
    location.closed_at = ''
  }

})


//COMPUTED
const rules = computed(() => {
      return {
        title_ru: {
          required: helpers.withMessage("validation.this_field_is_required", required),
        },
        title_uz: {
          required: helpers.withMessage("validation.this_field_is_required", required),
        },
        title_kr: {
          required: helpers.withMessage("validation.this_field_is_required", required),
        },
        address_ru: {
          required: helpers.withMessage("validation.this_field_is_required", required)
        },
        address_uz: {
          required: helpers.withMessage("validation.this_field_is_required", required)
        },
        address_kr: {
          required: helpers.withMessage("validation.this_field_is_required", required)
        },
        phones: {
          required: helpers.withMessage("validation.this_field_is_required", required)
        },
        region: {
          required: helpers.withMessage("validation.this_field_is_required", required)
        },
        coordinatesData: {
          lat: {
            required: helpers.withMessage("validation.this_field_is_required", required)
          },
          lng: {
            required: helpers.withMessage("validation.this_field_is_required", required)
          }
        },
      };
    })
;

const validate: Ref<Validation> = useVuelidate(rules, location);


watch(() => location.region, async function () {
  await store.getDistrict({parent: location.region})

})


</script>

<template>
  <div id="location-modal" class="uk-flex-top" uk-modal @hidden="hideModal">
    <div class="uk-modal-dialog uk-margin-auto-vertical rounded-lg w-[1000px]">
      <button class="uk-modal-close-default" type="button" uk-close/>
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ props.oldData ? $t("ChangeLocation") : $t('AddLocation') }}
        </h2>
      </div>

      <div class="uk-modal-body py-4">
        <form>
          <div class="flex gap-4">
            <div class="w-1/2">
              <ModalTabs>
                <ModalTab title="UZ">
                  <div class="w-full">

                    <label for="form-stacked-text">{{ $t("name") + ' ' + $t('UZ') }} </label>
                    <div class="uk-form-controls">
                      <input v-model="location.title_uz" class="form-input" id="form-stacked-text" type="text"
                             :class="validate.title_uz.$errors.length ? 'required-input' : ''"/>
                      <p v-for="error in validate.title_uz.$errors" :key="error.$uid" class="text-danger text-sm">
                        {{ $t(error.$message) }}
                      </p>
                    </div>
                  </div>
                  <div class="w-full mt-4">
                    <label for="form-stacked-text">{{ $t("address") + ' ' + $t('UZ') }} </label>
                    <div class="uk-form-controls">
                      <textarea v-model="location.address_uz" class="form-input" rows="3"
                                :class="validate.address_uz.$errors.length ? 'required-input' : ''"></textarea>
                      <p v-for="error in validate.address_uz.$errors" :key="error.$uid" class="text-danger text-sm">
                        {{ $t(error.$message) }}
                      </p>
                    </div>
                  </div>
                </ModalTab>
                <ModalTab title="KR">
                  <div class="w-full">

                    <label for="form-stacked-text">{{ $t("name") + ' ' + $t('KR') }} </label>
                    <div class="uk-form-controls">
                      <input v-model="location.title_kr" class="form-input" id="form-stacked-text" type="text"
                             :class="validate.title_kr.$errors.length ? 'required-input' : ''"/>
                      <p v-for="error in validate.title_kr.$errors" :key="error.$uid" class="text-danger text-sm">
                        {{ $t(error.$message) }}
                      </p>
                    </div>
                  </div>
                  <div class="w-full mt-4">
                    <label for="form-stacked-text">{{ $t("address") + ' ' + $t('KR') }} </label>
                    <div class="uk-form-controls">
                      <textarea v-model="location.address_kr" class="form-input" rows="3"
                                :class="validate.address_kr.$errors.length ? 'required-input' : ''"></textarea>
                      <p v-for="error in validate.address_kr.$errors" :key="error.$uid" class="text-danger text-sm">
                        {{ $t(error.$message) }}
                      </p>
                    </div>
                  </div>
                </ModalTab>
                <ModalTab title="RU">
                  <div class="w-full">
                    <label for="form-stacked-text">{{ $t("name") + ' ' + $t('RU') }}</label>
                    <div class="uk-form-controls">
                      <input v-model="location.title_ru" class="form-input" id="form-stacked-text" type="text"
                             :class="validate.title_ru.$errors.length ? 'required-input' : ''"/>
                      <p v-for="error in validate.title_ru.$errors" :key="error.$uid" class="text-danger text-sm">
                        {{ $t(error.$message) }}
                      </p>
                    </div>
                  </div>
                  <div class="w-full mt-4">
                    <label for="form-stacked-text">{{ $t("address") + ' ' + $t('RU') }}</label>
                    <div class="uk-form-controls">
                      <textarea v-model="location.address_ru" class="form-input"
                                :class="validate.address_ru.$errors.length ? 'required-input' : ''" rows="3"></textarea>
                      <p v-for="error in validate.address_ru.$errors" :key="error.$uid" class="text-danger text-sm">
                        {{ $t(error.$message) }}
                      </p>
                    </div>
                  </div>
                </ModalTab>
              </ModalTabs>
              <div class="w-full mt-4">
                <p class="mt-5">{{ $t("region") }}</p>
                <v-select :options="store.regionsList.results" v-model="location.region"
                          :getOptionLabel="(name: any) => name['name_' + $i18n.locale]"
                          :reduce="(name: any) => name.id">
                  <template #no-options> {{ $t("no_matching_options") }}</template>
                </v-select>
                <p v-for="error in validate.region.$errors" :key="error.$uid" class="text-danger text-sm">
                  {{ $t(error.$message) }}
                </p>

              </div>


              <div class="w-full mt-4">
                <p class="mt-5">{{ $t("districts") }}</p>

                <v-select :disabled="!location.region" :options="store.distrctList.results" v-model="location.district"
                          :getOptionLabel="(name: any) => name['name_' + $i18n.locale]"
                          :reduce="(name: any) => name.id">
                  <template #no-options> {{ $t("no_matching_options") }}</template>
                </v-select>
                <p v-for="error in validate.region.$errors" :key="error.$uid" class="text-danger text-sm">
                  {{ $t(error.$message) }}
                </p>

              </div>


              <div class="w-full mt-4">
                <label for="status">
                  {{ $t("phone_number") }}
                  <input v-model="location.phones" v-maska data-maska="+998#########" class="form-input"
                         :class="validate.phones.$errors.length ? 'required-input' : ''"/>
                  <p v-for="error in validate.phones.$errors" :key="error.$uid" class="text-danger text-sm">
                    {{ $t(error.$message) }}
                  </p>
                </label>
              </div>
              <div class="w-full mt-4">
                <label class="relative"> {{ $t('Open hour') }}</label>
                <VueDatePicker auto-apply v-model="openTime" time-picker></VueDatePicker>
              </div>
              <div class="w-full mt-4">
                <label class="relative"> {{ $t('Close hour') }} </label>
                <VueDatePicker auto-apply v-model="closeTime" time-picker></VueDatePicker>

              </div>
              <div class="w-full mt-4">

                <label>{{ $t('photo') }} </label>
                <FileInput :empty="emptyData" v-model="location.photo" @remove="location.photo = null"
                           :typeModal="props.oldData?.id" name="nearby-location"/>


              </div>

            </div>

            <div class="w-1/2">
              <div class="relative">
                <div class="w-full">
                  <div class="w-full uk-margin mb-5">
                    <label for="form-stacked-text">{{ $t('Search') }}</label>
                    <div class="uk-form-controls">
                      <!--                  @input="findLocation"-->
                      <input class="form-input" id="form-stacked-text" type="text" v-model="search"
                             @input="findLocation">
                    </div>
                  </div>
                </div>

                <div v-if="features.length"
                     class="absolute top-[66px] w-full left-0 bg-white max-h-[300px] overflow-y-auto"
                     style="z-index: 2000">
                  <div v-for="(item, index) in features" :key="index">
                    <!--                    :class="indeex === index ? 'active rounded' : ''"-->
                    <div v-if="search" class="p-2 rounded  cursor-pointer mb-50 hover:bg-gray-300"
                         @click="setLocation(item, index)">
                      <small>
                        {{ item.properties.name }} <span>({{ item.properties.GeocoderMetaData.text }})</span>
                      </small>
                    </div>
                  </div>
                </div>

                <div id="map1" v-if="showMap"></div>
              </div>

              <div class="flex items-center gap-4 mt-4">
                <div class="w-full">
                  <label for="form-stacked-text">{{ $t("Lat") }}</label>
                  <div class="uk-form-controls">
                    <input class="form-input" id="form-stacked-text" type="text" v-model="location.coordinatesData.lat"
                           :class="validate.coordinatesData.lat.$errors.length ? 'required-input' : ''"/>
                    <p v-for="error in validate.coordinatesData.lat.$errors" :key="error.$uid"
                       class="text-danger text-sm">
                      {{ $t(error.$message) }}
                    </p>
                  </div>
                </div>

                <div class="w-full">
                  <label for="form-stacked-text">{{ $t("Lng") }}</label>
                  <div class="uk-form-controls">
                    <input class="form-input" id="form-stacked-text" type="text"
                           :class="validate.coordinatesData.lng.$errors.length ? 'required-input' : ''"
                           v-model="location.coordinatesData.lng"/>
                    <p v-for="error in validate.coordinatesData.lng.$errors" :key="error.$uid"
                       class="text-danger text-sm">
                      {{ $t(error.$message) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white">
          <button uk-toggle="target: #location-modal" class="btn-secondary">
            {{ $t("Cancel") }}
          </button>

          <button class="btn-success" @click="onSubmit">
            {{ $t("Save") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#map1 {
  height: 350px;
}
</style>
