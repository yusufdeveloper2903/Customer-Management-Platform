<script setup lang="ts">
import { onMounted, provide, ref } from "vue";
import { getUserData } from "@/auth/jwtService";
import { formatPhoneNumber, formatCreditCardNumber } from "../features/index";

import users from "../store/index";
import UIkit from "uikit";

// import ProfileActionsModal from "../components/ProfileActionsModal.vue";
// import DeleteUserCardModal from "../components/DeleteUserCardModal.vue";
// import ChangePhoneNumber from "../components/ChangePhoneNumber.vue";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

const store = users();
const refresh = () => {
  store.getUserCards(getUserData().id);
};

const createCard = () => {
  refresh();
};

const cardId = ref<number | null>(null);

const handleDeleteModal = (id: number) => {
  cardId.value = id;
  UIkit.modal("#card-delete-modal").show();
};

const exactCard = ref({});
const handleActionModal = (card) => {
  if (card) {
    exactCard.value = card;
  } else {
    exactCard.value = {};
  }

  UIkit.modal("#profile-actions-modal").show();
};

const showModal = ref(0);
provide("showModal", showModal);

const handlePhoneChangeModal = () => {
  ++showModal.value;
  UIkit.modal("#change-phone-number").show();
};

onMounted(() => {
  store.getUserById(getUserData().id);
  refresh();
});
</script>

<template>
  <div class="flex items-start justify-center">
    <div class="w-full">
      <div class="card mx-auto md:w-[800px] sm:w-[100%]">
        <ul uk-accordion>
          <li class="uk-open">
            <div class="flex justify-between">
              <a
                class="uk-accordion-title float-left text-primary hover:text-primary"
                href="#"
                >{{ $t("personal_information") }}</a
              >

              <button class="text-warning" @click="handlePhoneChangeModal">
                <Icon icon="Pen 2" color="#ff9f43" size="20" />
              </button>
            </div>
            <div class="uk-accordion-content">
              <div class="flex items-center mb-3 justify-between">
                <h2 class="dark:text-gray-300">{{ $t("Full Name") }}</h2>
                <h2 class="dark:text-gray-300 text-right">
                  {{ store.user.name ? store.user.name : $t("not_specified") }}
                </h2>
              </div>

              <div class="flex items-center mb-3 justify-between">
                <h2 class="dark:text-gray-300">{{ $t("birthDate") }}</h2>
                <h2 class="dark:text-gray-300">
                  {{
                    store.user.date_of_birth
                      ? store.user.date_of_birth
                      : $t("not_specified")
                  }}
                </h2>
              </div>

              <div class="flex items-center mb-3 justify-between">
                <h2 class="dark:text-gray-300">
                  {{ $t("Паспортные данные") }}
                </h2>
                <h2
                  class="dark:text-gray-300"
                  :class="store.user.passport_data && 'uppercase'"
                >
                  {{
                    store.user.passport_data
                      ? store.user.passport_data
                      : $t("not_specified")
                  }}
                </h2>
              </div>

              <div class="flex items-center mb-3 justify-between">
                <h2 class="dark:text-gray-300">{{ $t("global.phone_number") }}</h2>
                <h2 class="dark:text-gray-300">
                  {{ store.user.phone && formatPhoneNumber(store.user.phone) }}
                </h2>
              </div>

              <div class="flex items-center mb-3 justify-between">
                <h2 class="dark:text-gray-300">{{ $t("pinfl") }}</h2>
                <h2 class="dark:text-gray-300">
                  {{
                    store.user.pinfl ? store.user.pinfl : $t("not_specified")
                  }}
                </h2>
              </div>

              <div class="flex items-center mb-3 justify-between">
                <h2 class="dark:text-gray-300">{{ $t("Role") }}</h2>
                <h2 class="dark:text-gray-300">
                  <!-- needs to fix -->
                  <span
                    class="rounded bg-primary px-4 pt-0.5 pb-1.5 inline text-white"
                  >
                    {{
                      store.user.role
                        ? store.user.role[0].name[locale]
                        : $t("not_specified")
                    }}
                  </span>
                </h2>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div v-if="false" class="card mx-auto md:w-[800px] sm:w-[100%] mt-10">
        <ul>
          <li>
            <p
              class="uk-accordion-title flex justify-between text-primary hover:text-primary"
              href="#"
            >
              {{ $t("maps") }}

              <button @click="handleActionModal">
                <span
                  class="text-success mt-2"
                  v-if="store.userCards.length === 0"
                  uk-icon="plus-circle"
                ></span>
              </button>
            </p>

            <div class="uk-accordion-content">
              <p class="text-center">
                {{ !store.userCards.length ? $t("no_card") : "" }}
              </p>
              <div
                v-for="(card, index) in store.userCards"
                class="border-b dark:border-gray-700 my-3 last:border-b-0"
              >
                <div class="flex items-center mb-3 justify-between">
                  <h2 class="dark:text-gray-300">{{ $t("actions") }}</h2>
                  <div class="flex gap-3">
                    <!-- <button
                      v-show="store.userCards.length"
                      @click="handleActionModal(card)"
                    >
                      <span class="text-warning" uk-icon="file-edit"></span>
                    </button> -->
                    <button @click="handleDeleteModal(card.id)">
                      <span
                        class="text-danger"
                        v-show="store.userCards.length"
                        uk-icon="minus-circle"
                      ></span>
                    </button>
                    <button @click="handleActionModal">
                      <span
                        class="text-success"
                        v-if="Number(index) === store.userCards.length - 1"
                        uk-icon="plus-circle"
                      ></span>
                    </button>
                  </div>
                </div>

                <div class="flex items-center mb-3 justify-between">
                  <h2 class="dark:text-gray-300">{{ $t("Name") }}</h2>
                  <h2 class="dark:text-gray-300">
                    {{ card.title ? card.title : $t("not_specified") }}
                  </h2>
                </div>
                <div class="flex items-center mb-3 justify-between">
                  <h2 class="dark:text-gray-300">{{ $t("number") }}</h2>
                  <h2 class="dark:text-gray-300">
                    {{ formatCreditCardNumber(card.number) }}
                  </h2>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

<!--    <ChangePhoneNumber :phone="store.user.phone" />-->
<!--    <ProfileActionsModal @createCard="createCard" :exactCard="exactCard" />-->
<!--    <DeleteUserCardModal :cardId="cardId" @deleteUserCard="refresh()" />-->
  </div>
</template>
