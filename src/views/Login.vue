<script setup lang="ts">
import { useRouter } from "vue-router";
import { login } from "@/auth/jwtService";
import { Ref, computed, reactive, ref } from "vue";
import { toast } from "vue3-toastify";
import { setAccessToken } from "@/auth/jwtService";
import { setRefreshToken } from "@/auth/jwtService";
import ability from "@/plugins/casl/ability";
import useVuelidate, { Validation } from "@vuelidate/core";
import { required, helpers, minLength } from "@vuelidate/validators";
import { validateMessage } from "@/plugins/validations/utils";
import { useI18n } from "vue-i18n";
import { check } from "@/mixins/permissions";

interface Login {
  phone: string;
  password: string;
}

const router = useRouter();
const { t } = useI18n();

const checkHrefSite = (): boolean => {
  return window.location.href.toLowerCase().includes("service.avtojoy.uz");
};

let formData = reactive<Login>({
  phone: checkHrefSite() ? "" : "+998",
  password: "",
});

const rules = computed(() => {
  return {
    phone: {
      required: helpers.withMessage("required", required),
      minLength: helpers.withMessage(
        validateMessage("minLength", { minLength: 12 }),
        minLength(17)
      ),
    },
    password: {
      required: helpers.withMessage("required", required),
    },
  };
});

const rulesEmployee = computed(() => {
  return {
    phone: {
      required: helpers.withMessage("required", required),
    },
    password: {
      required: helpers.withMessage("required", required),
    },
  };
});
const validate: Ref<Validation> = useVuelidate(
  checkHrefSite() ? rulesEmployee : rules,
  formData
);
const isPasswordShown = ref<Boolean>(false);

const validationForm = async () => {
  const success = await validate.value.$validate();
  if (!success) return;

  try {
    const sendData = JSON.parse(JSON.stringify(formData));
    if (!checkHrefSite()) {
      sendData.phone = sendData.phone.replace(/\D/g, "");
    }
    const { data } = await login(sendData);
    setAccessToken(data.access);
    setRefreshToken(data.refresh);
    let userAbilities = [{ subject: "all", action: "manage" }];
    localStorage.setItem("userAbilities", JSON.stringify(userAbilities));
    ability.update(userAbilities);

    if (check("car_showroom")) {
      router.push("/users");
    } else {
      router.push("/users");
    }
    setTimeout(() => {
      toast.success(t("success"));
    }, 200);
  } catch (error: any) {
    toast.error(
      error.response.data.msg || error.response.data.error || "Error"
    );
  }
};
</script>

<template>
  <div class="mx-auto flex w-full max-w-md items-center px-6 lg:w-2/6">
    <div class="flex-1">
      <div class="text-center">
        <h2
          class="text-center text-4xl font-bold text-gray-700 dark:text-white"
        >
          {{ $t("sign_in2") }}
        </h2>
      </div>

      <div class="mt-8">
        <form @submit.prevent="validationForm">
          <div v-if="checkHrefSite()">
            <div class="flex justify-between">
              <label
                for="phone"
                class="text-sm text-gray-600 dark:text-gray-200"
                >{{ $t("Login") }}</label
              >
            </div>

            <input
              v-model="formData.phone"
              id="username"
              type="text"
              name="username"
              :placeholder="$t('Login')"
              class="form-input"
              :class="validate.phone.$errors.length ? 'required-input' : ''"
            />
            <p
              v-for="error in validate.phone.$errors"
              :key="error.$uid"
              class="whitespace-nowrap text-danger text-sm"
            >
              {{ $t(error.$message) }}
            </p>
          </div>
          <div v-else>
            <div class="flex justify-between">
              <label
                for="phone"
                class="text-sm text-gray-600 dark:text-gray-200"
                >{{ $t("phone_number") }}</label
              >
            </div>
            <input
              v-model="formData.phone"
              v-maska
              data-maska="+998 ## ### ## ##"
              id="phone"
              pattern="[0-9 +]*"
              inputmode="numeric"
              type="text"
              name="phone"
              placeholder="+998 ## ### ## ##"
              class="form-input"
              :class="validate.phone.$errors.length ? 'required-input' : ''"
            />
            <p
              v-for="error in validate.phone.$errors"
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
              :placeholder="$t('Password')"
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
              {{ $t("sign_in2") }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
