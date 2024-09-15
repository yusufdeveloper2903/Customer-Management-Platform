<script setup lang="ts">

//IMPORTED FILES
import {useRouter} from "vue-router";
import {Ref, computed, reactive, ref, watch} from "vue";
import {toast} from "vue3-toastify";
import useVuelidate, {Validation} from "@vuelidate/core";
import {required, helpers} from "@vuelidate/validators"
import {useI18n} from "vue-i18n";
import {SignUp} from '../interface/index'
import {useSidebarStore} from "@/stores/layoutConfig";


//DECLARED VARIABLES
const store = useSidebarStore()
const router = useRouter();
const {t} = useI18n();
let formData = reactive<SignUp>({
  username: "",
  password: "",
  name: ""
});
const isPasswordShown = ref<Boolean>(false);
const isValidated = ref(false)


//WATCHERS


watch(
    () => formData,
    (value) => {
      isValidated.value = !!(value.password && value.username && value.name);
    },
    {deep: true}
)


//FUNCTIONS
const validationForm = async () => {
  const success = await validate.value.$validate();
  if (!success) return;
  try {
    let data = ref<string | undefined>('')
    if (store.webInfo && store.webInfo.length) {
      data.value = store.webInfo.find((item) => item.username == formData.username)?.username
    }
    if (!data.value) {
      store.webInfo.push(formData)
      window.webInfor = store.webInfo
      localStorage.setItem("userAbilities", JSON.stringify(store.webInfo));
      await router.push("/users");
      toast.success(t("success"));
    } else {
      toast.error(t('A user with such username exists'));
    }
  } catch (error: any) {
    toast.error(t('error'));
  }
};

//COMPUTED
const rules = computed(() => {
  return {
    username: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    password: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    name: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
  };
});

const validate: Ref<Validation> = useVuelidate(rules, formData);
</script>

<template>
  <div class="mx-auto flex w-full max-w-md items-center px-6 lg:w-2/6">
    <div class="flex-1">
      <div class="text-center">
        <h2
            class="text-center text-4xl font-bold  dark:text-white"
        >
          {{ t("Sign Up") }}
        </h2>
      </div>

      <div class="mt-8">
        <form @submit.prevent="validationForm">
          <div>
            <div class="flex justify-between">
              <label
                  for="Full Name"
                  class="text-sm  dark:text-gray-200"
              >{{ t("Full Name") }}</label
              >
            </div>
            <input
                v-model="formData.name"
                id="login"
                type="text"
                name="login"
                class="form-input "
                :class="validate.name.$errors.length ? 'required-input' : ''"
            />
            <p
                v-for="error in validate.name.$errors"
                :key="error.$uid"
                class="whitespace-nowrap  text-sm"
                style="color:#ff7081"
            >
              {{ t(error.$message) }}
            </p>
          </div>
          <div>
            <div class="mt-6  flex justify-between">
              <label
                  for="login"
                  class="text-sm  dark:text-gray-200"
              >{{ t("Login") }}</label
              >
            </div>
            <input
                v-model="formData.username"
                id="login"
                type="text"
                name="login"
                class="form-input "
                :class="validate.username.$errors.length ? 'required-input' : ''"
            />
            <p
                v-for="error in validate.username.$errors"
                :key="error.$uid"
                class="whitespace-nowrap  text-sm"
                style="color:#ff7081"
            >
              {{ t(error.$message) }}
            </p>
          </div>

          <div class="mt-6 relative">
            <div class="flex justify-between">
              <label
                  for="password"
                  class="text-sm  dark:text-gray-200"
              >{{ t("Password") }}</label
              >
            </div>

            <input
                v-model="formData.password"
                id="password"
                :type="isPasswordShown ? 'text' : 'password'"
                name="password"
                class="form-input "
                :class="validate.password.$errors.length ? 'required-input' : ''"
            />
            <button
                @click="isPasswordShown = !isPasswordShown"
                type="button"
                class="absolute top-[2.40rem] right-3"
            >
              <Icon
                  :icon="isPasswordShown ? 'Eye Closed' : 'Eye'"
                  color="#9ca3af"
                  size="16"
              />
            </button>
            <p
                class="whitespace-nowrap  text-sm"
                v-for="error in validate.password.$errors"
                :key="error.$uid"
                style="color:#ff7081"
            >
              {{ t(error.$message) }}
            </p>
          </div>
          <div class="mt-12">
            <button type="submit" class="btn-dark w-full" :class="[isValidated ? '!text-green-500' : '']">
              {{ t("Sign Up") }}
            </button>
          </div>
          <p class="text-center mt-4">{{ $t('Already have an account?') }} <span
              class="text-blue-700 dark:text-blue-700 cursor-pointer"
              @click="router.push('/login')">{{
              $t('Login')
            }}</span></p>
        </form>
      </div>
    </div>
  </div>
</template>


