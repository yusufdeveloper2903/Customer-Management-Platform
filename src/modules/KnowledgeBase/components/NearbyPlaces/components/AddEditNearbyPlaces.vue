<script setup lang="ts">
import { reactive, onMounted, computed, Ref, ref } from "vue";
import "@/assets/modal.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import UIkit from "uikit";
import {
  LocationPlaceData,
  LocationPlace,
} from "@/modules/KnowledgeBase/interfaces";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate, { Validation } from "@vuelidate/core";
import knowledgeStore from "@/modules/KnowledgeBase/store";
import { toast } from "vue3-toastify";
import { useI18n } from "vue-i18n";

interface Props {
  oldData?: LocationPlace;
}

const props = defineProps<Props>();
const emit = defineEmits(["refresh"]);
const store = knowledgeStore();
const { t, locale } = useI18n();
const showMap = ref(false);

let location = reactive<LocationPlaceData>({
  title: {
    uz: "",
    ru: "",
  },
  address: {
    uz: "",
    ru: "",
  },
  phones: [],
  region: null,
  coordinates: { lat: null, lng: null },
});

const rules = computed(() => {
  return {
    title: {
      ru: {
        required: helpers.withMessage(
          "validation.this_field_is_required",
          required
        ),
      },
      uz: {
        required: helpers.withMessage(
          "validation.this_field_is_required",
          required
        ),
      },
    },
    address: {
      ru: {
        required: helpers.withMessage(
          "validation.this_field_is_required",
          required
        ),
      },
      uz: {
        required: helpers.withMessage(
          "validation.this_field_is_required",
          required
        ),
      },
    },
    phones: {
      required: helpers.withMessage(
        "validation.this_field_is_required",
        required
      ),
    },
    region: {
      required: helpers.withMessage(
        "validation.this_field_is_required",
        required
      ),
    },
    coordinates: {
      lat: {
        required: helpers.withMessage(
          "validation.this_field_is_required",
          required
        ),
      },
      lng: {
        required: helpers.withMessage(
          "validation.this_field_is_required",
          required
        ),
      },
    },
  };
});

const validate: Ref<Validation> = useVuelidate(rules, location);

const onSubmit = async () => {
  const success = await validate.value.$validate();
  if (!success) return;
  if (location.id) {
    await store.updateOneForm(location);

    toast.success(t("success"));
  } else {
    await store.AddForms(location);

    toast.success(t("success"));
  }
  UIkit.modal("#location-modal").hide();
  emit("refresh");
};
const onShowModal = () => {
  if (props.oldData?.id) {
    const { region, ...rest } = props.oldData;
    Object.assign(location, { region: region.id, ...rest });
  } else {
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
      phones: [],
      region: null,
      coordinates: { lat: null, lng: null },
    });
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
};

onMounted(() => {
  UIkit.util.on("#location-modal", "show", () => {
    onShowModal();
  });
  UIkit.util.on("#location-modal", "hidden", () => {
    showMap.value = false;
    validate.value.$reset();
  });
});
</script>

<template>
  <div id="location-modal" class="uk-flex-top" uk-modal>
    <div class="uk-modal-dialog uk-margin-auto-vertical rounded-lg w-[1000px]">
      <button class="uk-modal-close-default" type="button" uk-close />
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ $t("Add") }}
        </h2>
      </div>

      <div class="uk-modal-body py-4">
        <form>
          <div >
            <div class="flex gap-4">
              <div class="w-1/2">
                <div class="flex items-center gap-4 mb-4">
                  <div class="w-full">
                    <label for="form-stacked-text">{{ $t("name") }} RU</label>
                    <div class="uk-form-controls">
                      <input
                        v-model="location.title.ru"
                        :placeholder="$t('name') + ' RU'"
                        class="form-input"
                        id="form-stacked-text"
                        type="text"
                      />
                      <p
                        v-for="error in validate.title.ru.$errors"
                        :key="error.$uid"
                        class="text-danger text-sm"
                      >
                        {{ $t(error.$message) }}
                      </p>
                    </div>
                  </div>

                  <div class="w-full">
                    <label for="form-stacked-text">{{ $t("name") }} UZ</label>
                    <div class="uk-form-controls">
                      <input
                        v-model="location.title.uz"
                        class="form-input"
                        :placeholder="$t('name') + ' UZ'"
                        id="form-stacked-text"
                        type="text"
                      />
                      <p
                        v-for="error in validate.title.uz.$errors"
                        :key="error.$uid"
                        class="text-danger text-sm"
                      >
                        {{ $t(error.$message) }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="w-full mb-4">
                  <label for="status">
                    {{ $t("phone_number") }}
                    <input
                      :placeholder="$t('phone_number')"
                      v-model="location.phones[0]"
                      v-maska
                      data-maska="+998 ## ### ## ##"
                      class="form-input"
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

                <div class="w-full mb-4">
                  <label for="status">
                    {{ $t("region") }}
                    <LazySelect
                      v-model="location.region"
                      id="model"
                      :placeholder="$t('region')"
                      :options="store.regionsList"
                      :fetch="store.getRegions"
                      :reduce="(el) => el.id"
                      :getOptionLabel="(v) => v.name[locale] || ''"
                    />
                    <p
                      v-for="error in validate.region.$errors"
                      :key="error.$uid"
                      class="text-danger text-sm"
                    >
                      {{ $t(error.$message) }}
                    </p>
                  </label>
                </div>

                <div class="w-full">
                  <label for="form-stacked-text">{{ $t("address") }} RU</label>
                  <div class="uk-form-controls">
                    <textarea
                      v-model="location.address.ru"
                      :placeholder="$t('address') + ' RU'"
                      class="form-input"
                      rows="2"
                    ></textarea>
                    <p
                      v-for="error in validate.address.ru.$errors"
                      :key="error.$uid"
                      class="text-danger text-sm"
                    >
                      {{ $t(error.$message) }}
                    </p>
                  </div>
                </div>

                <div class="w-full mt-4">
                  <label for="form-stacked-text">{{ $t("address") }} UZ</label>
                  <div class="uk-form-controls">
                    <textarea
                      v-model="location.address.uz"
                      :placeholder="$t('address') + ' UZ'"
                      class="form-input"
                      rows="3"
                    ></textarea>
                    <p
                      v-for="error in validate.address.uz.$errors"
                      :key="error.$uid"
                      class="text-danger text-sm"
                    >
                      {{ $t(error.$message) }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="w-1/2">
                <!-- Place of map -->
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
          </div>
        </form>

        <div
          class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white"
        >
          <button uk-toggle="target: #location-modal" class="btn-danger">
            {{ $t("Cancel") }}
          </button>

          <button class="btn-primary" @click="onSubmit">
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
