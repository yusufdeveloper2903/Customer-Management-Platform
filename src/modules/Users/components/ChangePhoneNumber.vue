<script setup lang="ts">
import { Ref, computed, inject, watch } from "vue";
import Timer from "@/components/Timer.vue";
import { ref } from "vue";
import { toast } from "vue3-toastify";
import users from "../store/index";
import { removeSpaces } from "../features/index";
import UIkit from "uikit";

import { helpers, minLength, required } from "@vuelidate/validators";
import useVuelidate, { Validation } from "@vuelidate/core";
import { getUserData } from "@/auth/jwtService";
import { useI18n } from "vue-i18n";

const phone = ref<string>("");

const sms_code = ref<string>("");
const { t } = useI18n();

const rules = computed(() => {
  return {
    phone: {
      required: helpers.withMessage("required", required),
      minLength: helpers.withMessage(
        "must be +998 XX XXX XX XX form",
        minLength(17)
      ),
    },
  };
});

const validate: Ref<Validation> = useVuelidate(rules, { phone });

const store = users();

interface Props {
  phone: any;
}

const props = defineProps<Props>();

const timer = ref();
let isTimerStopped = ref<boolean>(false);

const timerStopped = () => {
  isTimerStopped.value = true;
};

const resendSMSCode = async () => {
  try {
    const phoneToSend = removeSpaces(phone.value);
    store.updateUserPhone(phoneToSend).then(() => {
      isTimerStopped.value = false;
      timer.value.resetTimer();
      timer.value.startTimer();
      toast.success(t("sms_code_successfully_sent_to_your_phone"));
    });
  } catch (error: any) {
    toast.error(
      error.response.data.msg || error.response.data.error || "Error"
    );
  }
};

const nextStep = async () => {
  const success = await validate.value.$validate();
  if (!success) return;
  const phoneToSend = removeSpaces(phone.value);
  store.updateUserPhone(phoneToSend).then(() => {
    toast.success(t("sms_code_successfully_sent_to_your_phone"));
  });

  getSmsCode.value = true;
  timer.value.resetTimer();
  timer.value.startTimer();
};
const showModal = inject("showModal");

const onModalChange = (newVal) => {
  if (newVal) {
    phone.value = props.phone;
  }
};

watch(showModal, onModalChange);

const clearModal = () => {
  phone.value = "";

  sms_code.value = "";
  getSmsCode.value = false;
};

const getSmsCode = ref(false);

const savePhoneNumber = () => {
  store
    .smsCodeToUpdateUserPhone({
      sms_code: sms_code.value,
      new_phone: removeSpaces(phone.value),
    })
    .then(() => {
      store.getUserById(getUserData().id);
      UIkit.modal("#change-phone-number").hide();
      toast.success(t("updated_successfully"));
      clearModal();
    });
};
</script>

<template>
  <div id="change-phone-number" class="uk-flex-top" uk-modal>
    <div
      class="uk-modal-dialog uk-margin-auto-vertical uk-border-rounded overflow-hidden"
    >
      <button class="uk-modal-close-default" type="button" uk-close />
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ $t("change_phone_number") }}
        </h2>
      </div>
      <div class="uk-modal-body">
        <div v-show="!getSmsCode">
          <label for="phoneNumber">{{ $t("phone_number") }}</label>
          <input
            id="phoneNumber"
            placeholder="+998 ## ### ## ##"
            class="form-input"
            v-maska
            data-maska="+998 ## ### ## ##"
            v-model="phone"
            :class="
              validate.phone.$errors.length ? 'required-input' : ''
            "
          />
          <p
            v-for="error in validate.phone.$errors"
            :key="error.$uid"
            class="text-danger text-sm"
          >
            {{ $t(error.$message) }}
          </p>
        </div>

        <div v-show="getSmsCode" class="flex justify-between items-end gap-5">
          <label for="smsCode" class="w-1/2"
            >{{ $t("sms_kod") }}
            <input
              id="smsCode"
              type="text"
              :placeholder="$t('sms_kod')"
              class="form-input"
              v-model="sms_code"
            />
          </label>
          <button
            :disabled="!isTimerStopped"
            class="w-1/2 bg-primary duration-100 hover:shadow-buttonShadow hover:shadow-primary active:shadow-none disabled:bg-secondary mt-1 py-2 px-4 rounded-lg text-white flex justify-center items-center disabled:hover:shadow-none"
            @click="resendSMSCode"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="mr-1"
            >
              <path
                d="M7.37756 11.6296H6.62756H7.37756ZM7.37756 12.5556L6.81609 13.0528C6.95137 13.2056 7.14306 13.2966 7.34695 13.3049C7.55084 13.3133 7.74932 13.2382 7.89662 13.0969L7.37756 12.5556ZM9.51905 11.5414C9.81805 11.2547 9.82804 10.7799 9.54137 10.4809C9.2547 10.182 8.77994 10.172 8.48095 10.4586L9.51905 11.5414ZM6.56148 10.5028C6.28686 10.1927 5.81286 10.1639 5.50277 10.4385C5.19267 10.7131 5.16391 11.1871 5.43852 11.4972L6.56148 10.5028ZM14.9317 9.0093C15.213 9.31337 15.6875 9.33184 15.9915 9.05055C16.2956 8.76927 16.3141 8.29476 16.0328 7.9907L14.9317 9.0093ZM12.0437 6.25C9.05802 6.25 6.62756 8.653 6.62756 11.6296H8.12756C8.12756 9.49251 9.87531 7.75 12.0437 7.75V6.25ZM6.62756 11.6296L6.62756 12.5556H8.12756L8.12756 11.6296H6.62756ZM7.89662 13.0969L9.51905 11.5414L8.48095 10.4586L6.85851 12.0142L7.89662 13.0969ZM7.93904 12.0583L6.56148 10.5028L5.43852 11.4972L6.81609 13.0528L7.93904 12.0583ZM16.0328 7.9907C15.0431 6.9209 13.6212 6.25 12.0437 6.25V7.75C13.1879 7.75 14.2154 8.23504 14.9317 9.0093L16.0328 7.9907Z"
                fill="white"
              />
              <path
                d="M16.6188 11.4443L17.1795 10.9462C17.044 10.7937 16.8523 10.703 16.6485 10.6949C16.4447 10.6868 16.2464 10.7621 16.0993 10.9034L16.6188 11.4443ZM14.4805 12.4581C14.1817 12.745 14.1722 13.2198 14.4591 13.5185C14.746 13.8173 15.2208 13.8269 15.5195 13.54L14.4805 12.4581ZM17.4393 13.4972C17.7144 13.8068 18.1885 13.8348 18.4981 13.5597C18.8078 13.2846 18.8358 12.8106 18.5607 12.5009L17.4393 13.4972ZM9.04688 15.0047C8.76342 14.7027 8.28879 14.6876 7.98675 14.9711C7.68472 15.2545 7.66966 15.7292 7.95312 16.0312L9.04688 15.0047ZM11.9348 17.7499C14.9276 17.7499 17.3688 15.3496 17.3688 12.3703H15.8688C15.8688 14.5047 14.1158 16.2499 11.9348 16.2499V17.7499ZM17.3688 12.3703V11.4443H15.8688V12.3703H17.3688ZM16.0993 10.9034L14.4805 12.4581L15.5195 13.54L17.1383 11.9853L16.0993 10.9034ZM16.0581 11.9425L17.4393 13.4972L18.5607 12.5009L17.1795 10.9462L16.0581 11.9425ZM7.95312 16.0312C8.94543 17.0885 10.3635 17.7499 11.9348 17.7499V16.2499C10.792 16.2499 9.76546 15.7704 9.04688 15.0047L7.95312 16.0312Z"
                fill="white"
              />
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="white"
                stroke-width="1.5"
              />
            </svg>
            <Timer
              ref="timer"
              @timerStopped="timerStopped"
              :break-on-mount="true"
            />
          </button>
        </div>
      </div>
      <div
        class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white"
      >
        <!-- v-show="!getSmsCode" -->
        <button uk-toggle="target: #change-phone-number" class="btn-secondary">
          {{ $t("Cancel") }}
        </button>
        <!-- <button
          v-show="getSmsCode"
          class="btn-secondary"
          @click="getSmsCode = false"
        >
          {{ $t('back') }}
        </button> -->
        <button
          class="btn-success"
          v-show="getSmsCode"
          :disabled="sms_code.length === 0"
          @click="savePhoneNumber"
        >
          {{ $t("Change") }}
        </button>
        <button v-show="!getSmsCode" class="btn-success" @click="nextStep">
          {{ $t("further") }}
        </button>
      </div>
    </div>
  </div>
</template>
