<script setup lang="ts">
import { Ref, computed, reactive, ref } from "vue";
import staff from "../store/index";
import { useI18n } from "vue-i18n";
import useVuelidate, { Validation } from "@vuelidate/core";
import { helpers, minLength, required } from "@vuelidate/validators";

// store
const store = staff()
console.log(store)

// variables
const { locale } = useI18n();
const imageUrl = ref<string>("")
const isPasswordShown = ref<boolean>(false)


// user's data
const userData = reactive({
  id: null,
  name: "",
  phoneNumber: "",
  username: "",
  password: "",
  role: null,
  is_active: true
})

// required fields
const rules = computed(() => {
  return {
    phoneNumber: {
      required: helpers.withMessage("required", required),
      minLength: helpers.withMessage(
        "Номер телефона необходимо вводить в формате: '998 [XX] [XXX XX XX]",
        minLength(17)
      ),
    },
    role: {
      required: helpers.withMessage("required", required),
    },
    password: {
      required: helpers.withMessage("required", required),
    }
  };
});

const validate: Ref<Validation> = useVuelidate(rules, userData);


// functions
const handleFileUpload = () => {}
const deleteImage = () => {}
const saveUser = () => {}
</script>

<template>
  <div>
    <div class="md:flex sm:block items-start gap-5 dark:text-white h-fit">
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
            </label>
          </div>

          <label class="mt-5 mb-1 block text-xs"> {{ $t("Role") }}: 
            <v-select
              v-model="userData.role"
              :clearable="false"
              :options="[]"
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
          </label>
          
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
        <div class="w-full card mb-5">
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

            <label for="phoneNumber" class="my-5 block text-xs">
              {{ $t("phone_number") }}:
              <input
                :placeholder="$t('phone_number')"
                v-model="userData.phoneNumber"
                v-maska
                data-maska="+998 ## ### ## ##"
                class="form-input"
                :class="validate.phoneNumber.$errors.length ? 'required-input' : ''"
              />

              <p
                v-for="error in validate.phoneNumber.$errors"
                :key="error.$uid"
                class="text-danger text-sm"
              >
                {{ $t(error.$message) }}
              </p>
            </label>
          </form>
        </div>

        <div class="mt-8 flex flex-wrap justify-end gap-4">
          <button class="btn-danger" @click="$router.push('/staff')">
            {{ $t("cancel2") }}
          </button>
          <button class="btn-success" @click="saveUser">
            {{ $route.params.id ? $t("Change") : $t("Add") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
