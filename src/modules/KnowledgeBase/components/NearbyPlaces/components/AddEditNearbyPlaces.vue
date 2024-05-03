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
import Tab from "@/components/Tab/Tab.vue";
import Tabs from "@/components/Tab/Tabs.vue";
import FileInput from "@/components/FileInput/FileInput.vue";

interface Props {
  oldData?: LocationPlace;
}


//DECLARED VARIABLES
const props = defineProps<Props>();
const emit = defineEmits(["refresh", "getRegion"]);
const store = knowledgeStore();
const {t, locale} = useI18n();
const showMap = ref(false);
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
  phones: [],
  region: '',
  coordinates: {lat: null, lng: null},
});


//FUNCTIONS


const onGetData = async () => {
  emit('getRegion')
}
const onSubmit = async () => {
  const success = await validate.value.$validate();
  if (!success) return;
  const formData = new FormData()
  formData.append('title', location.title_uz)
  formData.append('title_ru', location.title_ru)
  formData.append('title_kr', location.title_kr)
  formData.append('title_uz', location.title_uz)
  formData.append('address', location.address_uz)
  formData.append('address_uz', location.address_uz)
  formData.append('address_kr', location.address_kr)
  formData.append('address_ru', location.address_ru)
  formData.append('coordinates', JSON.stringify(location.coordinates))
  formData.append('phones', `${location.phones}`)
  formData.append('opened_at', location.opened_at)
  formData.append('closed_at', location.closed_at)
  formData.append('region', location.region)
  formData.append('id', location.id)
  if (typeof location.photo !== 'string') {
    formData.append('photo', location.photo)
  }
  if (location.id) {
    await store.updateOneForm(formData);
    toast.success(t("success"));
  } else {
    await store.AddForms(formData);
    toast.success(t("success"));
  }
  UIkit.modal("#location-modal").hide();
  emit("refresh");
};

const hideModal = () => {
  openTime.value = '';
  closeTime.value = '';
  Object.assign(location, {
    id: undefined,
    title: {
      uz: "",
      ru: "",
    },
    address: {
      uz: "",
      ru: "",
    },
    closed_at: '',
    opened_at: '',
    phones: [],
    region: null,
    coordinates: {lat: null, lng: null},
  });

}
const onShowModal = () => {
      if (props.oldData?.id) {
        const {region, opened_at, closed_at, ...rest} = props.oldData;
        Object.assign(location, {region: region.id, ...rest});
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
      setTimeout(() => {
        let map = L.map("map1").setView([41.2995, 69.2401], 11);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
              '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        let marker = L.marker(location.coordinates).addTo(map);

        map.on("click", function (e) {
          location.coordinates = e.latlng;

          if (marker) {
            map.removeLayer(marker);
          }
          marker = L.marker(location.coordinates).addTo(map);
        });
      }, 800);
    }
;


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
  if (val.hours && val.minutes) {
    location.opened_at = val.hours + ':' + val.minutes
  }
})
watch(() => closeTime.value, function (val) {
  if (val.hours && val.minutes) {
    location.closed_at = val.hours + ':' + val.minutes
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
        coordinates: {
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

</script>

<template>
  <div id="location-modal" class="uk-flex-top" uk-modal @hidden="hideModal">
    <div class="uk-modal-dialog uk-margin-auto-vertical rounded-lg w-[1000px]">
      <button class="uk-modal-close-default" type="button" uk-close/>
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ $t("Add") }}
        </h2>
      </div>

      <div class="uk-modal-body py-4">
        <form>
          <div class="flex gap-4">
            <div class="w-1/2">
              <Tabs>
                <Tab title="UZ">
                  <div class="w-full">

                    <label for="form-stacked-text">{{ $t("name") + ' ' + $t('UZ') }} </label>
                    <div class="uk-form-controls">
                      <input
                          v-model="location.title_uz"
                          :placeholder="$t('name') + ' ' +  $t('UZ')"
                          class="form-input"
                          id="form-stacked-text"
                          type="text"
                          :class="validate.title_uz.$errors.length ? 'required-input' : ''"
                      />
                      <p
                          v-for="error in validate.title_uz.$errors"
                          :key="error.$uid"
                          class="text-danger text-sm"
                      >
                        {{ $t(error.$message) }}
                      </p>
                    </div>
                  </div>
                  <div class="w-full mt-4">
                    <label for="form-stacked-text">{{ $t("address") + ' ' + $t('UZ') }} </label>
                    <div class="uk-form-controls">
                    <textarea
                        v-model="location.address_uz"
                        :placeholder="$t('address') + ' ' + $t('UZ')"
                        class="form-input"
                        rows="3"
                        :class="validate.address_uz.$errors.length ? 'required-input' : ''"
                    ></textarea>
                      <p
                          v-for="error in validate.address_uz.$errors"
                          :key="error.$uid"
                          class="text-danger text-sm"
                      >
                        {{ $t(error.$message) }}
                      </p>
                    </div>
                  </div>
                </Tab>
                <Tab title="KR">
                  <div class="w-full">

                    <label for="form-stacked-text">{{ $t("name") + ' ' + $t('KR') }} </label>
                    <div class="uk-form-controls">
                      <input
                          v-model="location.title_kr"
                          :placeholder="$t('name') +  ' '  +  $t('KR')"
                          class="form-input"
                          id="form-stacked-text"
                          type="text"
                          :class="validate.title_kr.$errors.length ? 'required-input' : ''"
                      />
                      <p
                          v-for="error in validate.title_kr.$errors"
                          :key="error.$uid"
                          class="text-danger text-sm"
                      >
                        {{ $t(error.$message) }}
                      </p>
                    </div>
                  </div>
                  <div class="w-full mt-4">
                    <label for="form-stacked-text">{{ $t("address") + ' ' + $t('KR') }} </label>
                    <div class="uk-form-controls">
                    <textarea
                        v-model="location.address_kr"
                        :placeholder="$t('address') + ' ' +  $t('UZ')"
                        class="form-input"
                        rows="3"
                        :class="validate.address_kr.$errors.length ? 'required-input' : ''"
                    ></textarea>
                      <p
                          v-for="error in validate.address_kr.$errors"
                          :key="error.$uid"
                          class="text-danger text-sm"
                      >
                        {{ $t(error.$message) }}
                      </p>
                    </div>
                  </div>
                </Tab>
                <Tab title="RU">
                  <div class="w-full">
                    <label for="form-stacked-text">{{ $t("name") + ' ' + $t('RU') }}</label>
                    <div class="uk-form-controls">
                      <input
                          v-model="location.title_ru"
                          class="form-input"
                          :placeholder="$t('name') + ' ' +  $t('RU')"
                          id="form-stacked-text"
                          type="text"
                          :class="validate.title_ru.$errors.length ? 'required-input' : ''"
                      />
                      <p
                          v-for="error in validate.title_ru.$errors"
                          :key="error.$uid"
                          class="text-danger text-sm"
                      >
                        {{ $t(error.$message) }}
                      </p>
                    </div>
                  </div>
                  <div class="w-full mt-4">
                    <label for="form-stacked-text">{{ $t("address") + ' ' + $t('RU') }}</label>
                    <div class="uk-form-controls">
                    <textarea
                        v-model="location.address_ru"
                        :placeholder="$t('address') + ' ' +  $t('RU')"
                        class="form-input"
                        :class="validate.address_ru.$errors.length ? 'required-input' : ''"
                        rows="3"
                    ></textarea>
                      <p
                          v-for="error in validate.address_ru.$errors"
                          :key="error.$uid"
                          class="text-danger text-sm"
                      >
                        {{ $t(error.$message) }}
                      </p>
                    </div>
                  </div>
                </Tab>
              </Tabs>
              <div class="w-full mt-4">
                <p class="mt-5">{{ $t("region") }}</p>

                <v-select
                    :options="store.regionsList.results"
                    v-model="location.region"
                    :placeholder="$t('region')"
                    :getOptionLabel="(name:any) => name['name_'+ $i18n.locale]"
                    :reduce="(name:any) => name.id"

                >
                  <template #no-options> {{ $t("no_matching_options") }}</template>
                </v-select>
                <p
                    v-for="error in validate.region.$errors"
                    :key="error.$uid"
                    class="text-danger text-sm"
                >
                  {{ $t(error.$message) }}
                </p>

              </div>

              <div class="w-full mt-4">
                <label for="status">
                  {{ $t("phone_number") }}
                  <input
                      :placeholder="$t('phone_number')"
                      v-model="location.phones[0]"
                      v-maska
                      data-maska="+998#########"
                      class="form-input"
                      :class="validate.phones.$errors.length ? 'required-input' : ''"
                  />
                  <p
                      v-for="error in validate.phones.$errors"
                      :key="error.$uid"
                      class="text-danger text-sm"
                  >
                    {{ $t(error.$message) }}
                  </p>
                </label>
              </div>
              <div class="w-full mt-4">
                <label class="relative"> {{ $t('Open hour') }}</label>
                <VueDatePicker

                    auto-apply
                    v-model="openTime"
                    :placeholder="$t('Open hour')"
                    time-picker
                ></VueDatePicker>
              </div>
              <div class="w-full mt-4">
                <label class="relative"> {{ $t('Close hour') }} </label>
                <VueDatePicker
                    auto-apply
                    v-model="closeTime"
                    :placeholder="$t('Close hour')"
                    time-picker
                ></VueDatePicker>

              </div>
              <div class="w-full mt-4">

                <label
                >{{ $t('photo') }} </label>
                <FileInput
                    v-model="location.photo"
                    @remove="location.photo = ''"
                    :typeModal="props.oldData?.id"
                    name="nearby-location"
                />


              </div>

            </div>

            <div class="w-1/2">
              <div class="w-full">
                <div id="map1" v-if="showMap"></div>
              </div>

              <div class="flex items-center gap-4 mb-4">
                <div class="w-full">
                  <label for="form-stacked-text">{{ $t("Lat") }}</label>
                  <div class="uk-form-controls">
                    <input
                        class="form-input"
                        id="form-stacked-text"
                        :placeholder="$t('Lat')"
                        type="text"
                        v-model="location.coordinates.lat"
                        :class="validate.coordinates.lat.$errors.length ? 'required-input' : ''"

                    />
                    <p
                        v-for="error in validate.coordinates.lat.$errors"
                        :key="error.$uid"
                        class="text-danger text-sm"
                    >
                      {{ $t(error.$message) }}
                    </p>
                  </div>
                </div>

                <div class="w-full">
                  <label for="form-stacked-text">{{ $t("Lng") }}</label>
                  <div class="uk-form-controls">
                    <input
                        class="form-input"
                        id="form-stacked-text"
                        type="text"
                        :placeholder="$t('Lng')"
                        :class="validate.coordinates.lng.$errors.length ? 'required-input' : ''"
                        v-model="location.coordinates.lng"
                    />
                    <p
                        v-for="error in validate.coordinates.lng.$errors"
                        :key="error.$uid"
                        class="text-danger text-sm"
                    >
                      {{ $t(error.$message) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div
            class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white"
        >
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
.menu_xxl {
  width: 1165px !important;
}

#map1 {
  height: 400px;
}
</style>
