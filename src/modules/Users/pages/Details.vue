<script setup lang="ts">
import { Ref, computed, onMounted, reactive, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { toast } from "vue3-toastify";
import { objectToFormData } from "@/mixins/formmatter";
import { User } from "../interfaces/index";
import users from "../store/index";
import { helpers, minLength, required } from "@vuelidate/validators";
import useVuelidate, { Validation } from "@vuelidate/core";
import { useI18n } from "vue-i18n";

const router = useRouter();
const route = useRoute();
const store = users();
const { locale, t } = useI18n();
let imageUrl = ref<any>("");
const isPasswordShown = ref(false);
const isDiller = ref(false);

let userData = ref<User>({
  id: null,
  username: "",
  regions: [],
  role: [],
  password: null,
  name: "",
  phone: "",
  photo: "",
  is_active: true,
  date_of_birth: "", //remove
  pinfl: "", //remove,
  passport_data: "",
  car_showroom: {
    name: null,
    bank_requisite: null,
    settlement_account: null,
    inn: null,
    mfo: null,
    oked: null,
    address: null,
    company_name: null,
  },
});

const rules = computed(() => {
  return {
    // password: {
    //   required: helpers.withMessage("required", required),
    //   minLength: helpers.withMessage("kamida 4 ta", minLength(4)),
    // },
    phone: {
      required: helpers.withMessage("required", required),
      minLength: helpers.withMessage(
        "Номер телефона необходимо вводить в формате: '998 [XX] [XXX XX XX]",
        minLength(17)
      ),
    },
    role: {
      required: helpers.withMessage("required", required),
    },
    regions: {
      required: helpers.withMessage("required", required),
    },

    // oked: {
    //   required: helpers.withMessage("required", required),
    // },

    // inn: {
    //   required: helpers.withMessage("required", required),
    // },

    // mfo: {
    //   required: helpers.withMessage("required", required),
    // },

    // settlement_account: {
    //   required: helpers.withMessage("required", required),
    // },
  };
});

const validate: Ref<Validation> = useVuelidate(rules, userData);

const CorrectPassword = ref(false);
const isSubmitted = ref(false);

const checkPassword = (input) => {
  if (!route.params.id || userData.value.password) {
    const regex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (route.params.id && checkRoleForPassword()) {
      if (input.length >= 4) {
        return (CorrectPassword.value = true);
      } else {
        return (CorrectPassword.value = false);
      }
    } else {
      if (regex.test(input)) {
        return (CorrectPassword.value = true);
      } else {
        return (CorrectPassword.value = false);
      }
    }
  }

  return;
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (event: any) => {
    imageUrl.value = event.target.result;
    userData.value.photo = file;
  };
  reader.readAsDataURL(file);
};

const deleteImage = () => {
  imageUrl.value = "";
  userData.value.photo = "";
};

function removeSpaces(str) {
  return str.replace(/[\s+]/g, "");
}

const checkRoleForPassword = () => {
  const role =
    userData.value.role[0]?.unique_name || userData.value.role?.unique_name;

  if (route.params.id) {
    if (role === "seller" || role === "buyer") {
      return true;
    }
  }
  return;
};

watch(
  () => userData.value.role,
  () => {
    checkRoleForPassword();

    if (Array.isArray(userData.value.role)) {
      if (userData.value.role[0].unique_name === "car_showroom") {
        isDiller.value = true;
      } else {
        isDiller.value = false;
      }
    } else {
      if (userData.value.role.unique_name === "car_showroom") {
        isDiller.value = true;
      } else {
        isDiller.value = false;
      }
    }
  }
);

const saveUser = async () => {
  isSubmitted.value = true;
  const success = await validate.value.$validate();
  if (!success) return;

  if (userData.value.phone) {
    userData.value.phone = removeSpaces(userData.value.phone);
  }

  if (typeof userData.value.password === "string" && !userData.value.password) {
    userData.value.password = null;
  }

  const newData = reactive({
    ...userData.value,
  });

  if (Array.isArray(newData.role)) {
    newData.role = userData.value.role[0].id;

    if (userData.value.role[0].unique_name !== "car_showroom") {
      newData.car_showroom = {
        name: null,
        bank_requisite: null,
        settlement_account: null,
        inn: null,
        mfo: null,
        oked: null,
        address: null,
        company_name: null,
      };
    }
  } else {
    newData.role = userData.value.role.id;

    if (userData.value.role.unique_name !== "car_showroom") {
      newData.car_showroom = {
        name: null,
        bank_requisite: null,
        settlement_account: null,
        inn: null,
        mfo: null,
        oked: null,
        address: null,
        company_name: null,
      };
    }
  }

  newData.regions = userData.value.regions.map((region) => region.id);

  const formData = objectToFormData(newData);
  if (route.params.id) {
    if (!userData.value.password || CorrectPassword.value) {
      try {
        await store.updateUser(formData).then(() => {
          router.push("/users");
          setTimeout(() => {
            toast.success(t("updated_successfully"));
          }, 200);
          isSubmitted.value = false;
        });
      } catch (error: any) {
        isSubmitted.value = false;
        if (error) {
          toast.error(
            error.response.data.msg || error.response.data.error || "Error"
          );
        }
      }
    }
  } else {
    if (CorrectPassword.value)
      try {
        await store.createUser(formData).then(() => {
          setTimeout(() => {
            toast.success(t("created_successfully"));
          }, 200);
          router.push("/users");
        });
        isSubmitted.value = false;
      } catch (error: any) {
        isSubmitted.value = false;
        if (error) {
          toast.error(
            error.response.data.msg || error.response.data.error || "Error"
          );
        }
      }
  }
};

onMounted(() => {
  if (route.params.id) {
    store.getUserById(Number(route.params.id)).then(() => {
      userData.value = store.user;
      checkRoleForPassword();

      if (!userData.value.car_showroom) {
        userData.value.car_showroom = {
          name: null,
          bank_requisite: null,
          settlement_account: null,
          inn: null,
          mfo: null,
          oked: null,
          address: null,
          company_name: null,
        };
      }

      if (store.user.photo) {
        imageUrl.value = store.user.photo;
        userData.value.photo = null;
      }

      if (store.user.role[0].unique_name === "car_showroom") {
        isDiller.value = true;
      } else {
        isDiller.value = false;
      }
    });
  }
});

store.getUsersRoles();
store.getRegions({ page_Size: 10 });
</script>

<template>
  <div>
    <div class="md:flex sm:block items-start gap-5 dark:text-white h-fit">
      <div class="md:w-3/12 sm:w-full">
        <div class="card mb-5">
          <div
            class="mb-5 flex h-56 w-full mx-auto items-center justify-center overflow-hidden rounded bg-slate-200 dark:bg-darkLayoutMain"
          >
            <span v-if="!imageUrl" class="font-medium dark:text-white">{{
              $t("no_photo")
            }}</span>
            <img
              v-else
              class="w-full h-full object-cover"
              :src="imageUrl"
              alt=""
            />
          </div>
          <div class="flex gap-3 mb-0.5">
            <div class="w-full" :class="imageUrl && 'w-10/12'">
              <input
                id="upload"
                class="form-file-input"
                type="file"
                @change="handleFileUpload"
              />
            </div>
            <button
              v-if="imageUrl"
              class="btn-outline-danger btn-action float-right w-2/12 mt-1"
              @click="deleteImage"
            >
              <Icon icon="Trash Bin Trash" color="#ea5455" size="20" />
            </button>
          </div>
        </div>

        <div class="w-full card" v-show="isDiller">
          <form>
            <label for="login" class="block text-xs">
              {{ $t("Full Name") }}:
              <input
                id="login"
                type="text"
                :placeholder="$t('Full Name')"
                class="form-input"
                v-model="userData.name"
              />
            </label>

            <label for="phone" class="my-5 block text-xs">
              {{ $t("phone_number") }}:
              <input
                :placeholder="$t('phone_number')"
                v-model="userData.phone"
                v-maska
                data-maska="+998 ## ### ## ##"
                class="form-input"
                :class="validate.phone.$errors.length ? 'required-input' : ''"
              />

              <p
                v-for="error in validate.phone.$errors"
                :key="error.$uid"
                class="text-danger text-sm"
              >
                {{ $t(error.$message) }}
              </p>
            </label>
          </form>
        </div>
      </div>

      <div class="md:w-6/12 sm:w-full card md:my-0 my-5">
        <form>
          <div class="mb-5 md:flex items-start gap-8">
            <label for="loginDetail" class="w-6/12 text-xs">
              {{ $t("Login") }}:
              <input
                autocomplete="off"
                id="loginDetail"
                v-model="userData.username"
                type="text"
                :placeholder="$t('Login')"
                class="form-input md:mb-0 mb-4"
              />
            </label>

            <label for="passwordDetail" class="w-6/12 text-xs relative">
              {{ $t("Password") }}:
              <input
                autocomplete="off"
                id="passwordDetail"
                :type="isPasswordShown ? 'text' : 'password'"
                placeholder="*********"
                class="form-input"
                v-model="userData.password"
                @input="(e: any) => checkPassword(e.target.value)"
              />
              <button
                @click="isPasswordShown = !isPasswordShown"
                type="button"
                class="absolute top-8 right-3"
              >
                <Icon
                  :icon="isPasswordShown ? 'Eye Closed' : 'Eye'"
                  color="#9ca3af"
                  size="16"
                />
              </button>
              <p
                v-if="
                  !route.params.id &&
                  isSubmitted &&
                  !userData.password &&
                  !CorrectPassword
                "
                class="text-danger text-sm"
              >
                {{ $t("the_password_must_be_at_least_8_characters_long_and") }}
              </p>
              <p
                v-if="
                  !checkRoleForPassword() &&
                  !CorrectPassword &&
                  isSubmitted &&
                  userData.password
                "
                class="text-danger text-sm"
              >
                {{ $t("the_password_must_be_at_least_8_characters_long_and") }}
              </p>

              <!-- validation -->
              <div v-if="checkRoleForPassword()">
                <p
                  v-if="!CorrectPassword && isSubmitted && userData.password"
                  class="text-danger text-sm"
                >
                  Пароль должен быть не менее 4 символов
                </p>
              </div>
            </label>
          </div>

          <label class="mt-5 mb-1 block text-xs"> {{ $t("Role") }}: </label>
          <v-select
            v-model="userData.role"
            :clearable="false"
            :options="store.usersRolesList.results"
            :getOptionLabel="
              (role) => (role.name && role.name[locale]) || role.name
            "
            :placeholder="$t('Role')"
            :class="validate.role.$errors.length ? 'required-input' : ''"
          >
            <template #no-options> {{ $t("no_matching_options") }} </template>
          </v-select>
          <p
            v-for="error in validate.role.$errors"
            :key="error.$uid"
            class="text-danger text-sm"
          >
            {{ $t(error.$message) }}
          </p>
          <label class="mt-5 mb-1 block text-xs"> {{ $t("region") }}: </label>
          <LazySelect
            v-model="userData.regions"
            :options="store.regions"
            :getOptionLabel="
              (region) => (region.name && region.name.ru) || region.name
            "
            multiple
            :closeOnSelect="false"
            :fetch="store.getRegions"
            :placeholder="$t('region')"
            :class="validate.regions.$errors.length ? 'required-input' : ''"
          >
            <!-- :reduce="(region) => region.id" -->
            <template #no-options> {{ $t("no_matching_options") }} </template>
          </LazySelect>

          <p
            v-for="error in validate.regions.$errors"
            :key="error.$uid"
            class="text-danger text-sm"
          >
            {{ $t(error.$message) }}
          </p>

          <p class="text-xs mt-5 mb-1">{{ $t("Status") }}:</p>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="userData.is_active"
              class="sr-only peer"
            />
            <div
              className="w-11 h-6 bg-gray-200 peer-focus:outline-none 
          rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
            ></div>
          </label>
        </form>
      </div>

      <div class="md:w-3/12 sm:w-full">
        <div class="w-full card mb-5" v-show="!isDiller">
          <form>
            <label for="login" class="block text-xs">
              {{ $t("Full Name") }}:
              <input
                id="login"
                type="text"
                :placeholder="$t('Full Name')"
                class="form-input"
                v-model="userData.name"
              />
            </label>

            <label for="phone" class="my-5 block text-xs">
              {{ $t("phone_number") }}:
              <input
                :placeholder="$t('phone_number')"
                v-model="userData.phone"
                v-maska
                data-maska="+998 ## ### ## ##"
                class="form-input"
                :class="validate.phone.$errors.length ? 'required-input' : ''"
              />

              <p
                v-for="error in validate.phone.$errors"
                :key="error.$uid"
                class="text-danger text-sm"
              >
                {{ $t(error.$message) }}
              </p>
            </label>
          </form>
        </div>
        <!-- diller -->
        <div v-if="isDiller" class="w-full card">
          <form>
            <label for="login" class="block text-xs">
              {{ $t("nameOfBank") }}:
              <input
                id="login"
                type="text"
                :placeholder="$t('nameOfBank')"
                class="form-input"
              />
            </label>
            <label for="login" class="mt-4 block text-xs">
              {{ $t("address") }}:
              <input
                id="login"
                type="text"
                :placeholder="$t('address')"
                class="form-input"
                v-model="userData.car_showroom.address"
              />
            </label>

            <label for="login" class="mt-4 block text-xs">
              {{ $t("checkingAmount") }}:
              <input
                id="login"
                type="text"
                :placeholder="$t('checkingAmount')"
                class="form-input"
                v-model="userData.car_showroom.settlement_account"
              />

              <!-- <p
                v-for="error in validate.settlement_account.$errors"
                :key="error.$uid"
                class="text-danger text-sm"
              >
                {{ $t(error.$message) }}
              </p> -->
            </label>

            <label for="login" class="mt-4 block text-xs">
              {{ $t("inn") }}:
              <input
                id="login"
                type="text"
                :placeholder="$t('inn')"
                class="form-input"
                v-model="userData.car_showroom.inn"
              />
              <!-- <p
                v-for="error in validate.inn.$errors"
                :key="error.$uid"
                class="text-danger text-sm"
              >
                {{ $t(error.$message) }}
              </p> -->
            </label>

            <label for="login" class="mt-4 block text-xs">
              {{ $t("mfo") }}:
              <input
                id="login"
                type="text"
                :placeholder="$t('mfo')"
                class="form-input"
                v-model="userData.car_showroom.mfo"
              />
              <!-- <p
                v-for="error in validate.mfo.$errors"
                :key="error.$uid"
                class="text-danger text-sm"
              >
                {{ $t(error.$message) }}
              </p> -->
            </label>

            <label for="login" class="mt-4 block text-xs">
              {{ $t("ОКЭД") }}:
              <input
                id="login"
                type="text"
                :placeholder="$t('ОКЭД')"
                class="form-input"
                v-model="userData.car_showroom.oked"
              />

              <!-- <p
                v-for="error in validate.oked.$errors"
                :key="error.$uid"
                class="text-danger text-sm"
              >
                {{ $t(error.$message) }}
              </p> -->
            </label>

            <label for="login" class="block text-xs mt-4">
              {{ $t("bank_requests") }}:
              <input
                id="login"
                type="text"
                :placeholder="$t('bank_requests')"
                class="form-input"
                v-model="userData.car_showroom.bank_requisite"
              />
            </label>

            <label for="login" class="mt-4 block text-xs">
              {{ $t("company_name") }}:
              <input
                id="login"
                type="text"
                :placeholder="$t('company_name')"
                class="form-input"
                v-model="userData.car_showroom.company_name"
              />
            </label>

            <label for="login" class="block text-xs mt-4">
              {{ $t("car_dealership") }}:
              <input
                id="login"
                type="text"
                :placeholder="$t('car_dealership')"
                class="form-input"
                v-model="userData.car_showroom.name"
              />
            </label>
          </form>
        </div>

        <div class="mt-8 flex flex-wrap justify-end gap-4">
          <button class="btn-danger" @click="router.push('/users')">
            {{ $t("cancel2") }}
          </button>
          <button class="btn-success" @click="saveUser">
            {{ route.params.id ? $t("Change") : $t("Add") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
