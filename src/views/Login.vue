<script setup lang="ts">

//IMPORTED FILES
import {useRouter} from "vue-router";
import {login} from "@/auth/jwtService";
import {Ref, computed, reactive, ref} from "vue";
import {toast} from "vue3-toastify";
import {setAccessToken} from "@/auth/jwtService";
import {setRefreshToken} from "@/auth/jwtService";
import ability from "@/plugins/casl/ability";
import useVuelidate, {Validation} from "@vuelidate/core";
import {required, helpers} from "@vuelidate/validators"
import {useI18n} from "vue-i18n";
import {Login} from '@/interface'


//DECLARED VARIABLES
const router = useRouter();
const {t} = useI18n();
let formData = reactive<Login>({
  username: "",
  password: "",
});
const isPasswordShown = ref<Boolean>(false);


//FUNCTIONS
const validationForm = async () => {
  const success = await validate.value.$validate();
  if (!success) return;

  try {
    const sendData = JSON.parse(JSON.stringify(formData));
    const {data} = await login(sendData);
    setAccessToken(data.access);
    setRefreshToken(data.refresh);
    let userAbilities = [{subject: "all", action: "manage"}];
    localStorage.setItem("userAbilities", JSON.stringify(userAbilities));
    localStorage.setItem("knowledgeBase", 'sms_template');
    localStorage.setItem("sms", 'sms sending');
    ability.update(userAbilities);
    await router.push("/dashboard");
    toast.success(t("success"));
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
  };
});

const validate: Ref<Validation> = useVuelidate(rules, formData);
</script>

<template>
  <div class="mx-auto flex w-full max-w-md items-center px-6 lg:w-2/6">
    <div class="flex-1">
      <div class="text-center">
        <h2
            class="text-center text-4xl font-bold text-gray-700 dark:text-white"
        >
          {{ $t("Login") }}
        </h2>
      </div>

      <div class="mt-8">
        <form @submit.prevent="validationForm">
          <div>
            <div class="flex justify-between">
              <label
                  for="login"
                  class="text-sm text-gray-600 dark:text-gray-200"
              >{{ $t("Login") }}</label
              >
            </div>
            <input
                v-model="formData.username"
                id="login"
                type="text"
                name="login"
                class="form-input"
                :class="validate.username.$errors.length ? 'required-input' : ''"
            />
            <p
                v-for="error in validate.username.$errors"
                :key="error.$uid"
                class="whitespace-nowrap text-danger text-sm"
            >
              {{ $t(error.$message) }}
            </p>
          </div>

          <div class="mt-6 relative">
            <div class="flex justify-between">
              <label
                  for="password"
                  class="text-sm text-gray-600 dark:text-gray-200"
              >{{ $t("Password") }}</label
              >
            </div>

            <input
                v-model="formData.password"
                id="password"
                :type="isPasswordShown ? 'text' : 'password'"
                name="password"
                class="form-input"
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
                class="whitespace-nowrap text-danger text-sm"
                v-for="error in validate.password.$errors"
                :key="error.$uid"
            >
              {{ $t(error.$message) }}
            </p>
          </div>

          <div class="mt-12">
            <button type="submit" class="btn-primary w-full">
              {{ $t("Login") }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
