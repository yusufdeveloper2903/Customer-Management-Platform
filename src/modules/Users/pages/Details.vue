<script setup lang="ts">

//IMPORTED FILES
import {onMounted, ref} from "vue"
import users from "../store/index"
import {useRoute} from "vue-router";
import UIkit from "uikit";
import TerminateSessionModal from "../components/TerminateSessionModal.vue"
import ConfirmUntieCardModal from "../components/ConfirmUntieCardModal.vue"
import {fieldsUserDetail} from "../constants/index"


//DECLARED VARIABLES
const store = users()
const route = useRoute()
const userItem = ref<object>({});
const userId = ref<null | number>(null)


//MOUNTED LIFE CYCLE
onMounted(async () => {
  let id = +route.params.id
  await store.getUserById(id)
  userItem.value = store.user

})

// FUNCTION
const showTerminateModal = (item) => {
  UIkit.modal("#terminate-session-modal").show();
  userId.value = item.id
};

const showUntieCardModal = (item) => {
  UIkit.modal("#untie-card-confirm-modal").show();
  userId.value = item.id
};
</script>

<template>
  <div class="md:flex sm:block items-start gap-5 dark:text-white h-fit">
    <div class="md:w-3/12 sm:w-full">
      <div class="card">
        <h2 class="text-success mb-3"><b>Профиль</b></h2>
        <div class="flex justify-between">
          <div>Ф.И.О.</div>
          <div><small><b>{{ userItem.full_name }}</b></small></div>
        </div>

        <div class="flex justify-between my-2">
          <div>Номер телефона</div>
          <div v-if="userItem.phone"><small><b>+{{ userItem.phone }}</b></small></div>
        </div>

        <div class="flex justify-between">
          <div>Создано</div>
          <div><small><b>{{ userItem.created_date }}</b></small></div>
        </div>
      </div>


      <div class="card mt-4">
        <h2 class="text-success mb-3"><b>Активные сессии</b></h2>
        <ul class="uk-list uk-list-divider" v-if="store.user && store.user.sessions && store.user.sessions.length">
          <li v-for="(item, index) in store.user.sessions" :key="index"
              class="dark:bg-secondary card-bg p-3 rounded-md">

            <div class="flex justify-between">
              <div>Устройство</div>
              <div><small><b>{{ item.device_model }}</b></small></div>
            </div>

            <div class="flex justify-between mt-2">
              <div>Версия приложения</div>
              <div><small><b>{{ item.device_type }}</b></small></div>
            </div>

            <div class="flex justify-between mt-2">
              <div>IP-адресс</div>
              <div><small><b>{{ item.ip_address }}</b></small></div>
            </div>

            <div class="flex justify-between my-2">
              <div>Дата создания</div>
              <div><small><b>{{ item.created_date }}</b></small></div>
            </div>

            <div class="flex justify-between">
              <div>Посещение</div>
              <div><small><b>{{ item.last_visit }}</b></small></div>
            </div>

            <button class="mt-2 w-full rounded-md bg-danger text-white" @click="showTerminateModal(item)">
              <small>Завершить</small>

            </button>

          </li>
        </ul>
        <h2 v-else class="text-center">{{ $t('no_available_data') }}</h2>
      </div>
    </div>


    <div class="md:w-6/12 sm:w-full card">
      <EasyDataTable
          theme-color="#7367f0"
          hide-footer
          :headers="fieldsUserDetail"
          :items="[]"
      >
        <template #empty-message>
          <div class="dark:text-white">{{ $t("no_available_data") }}</div>
        </template>
        <template #header="header">
          {{ $t(header.text) }}
        </template>
        <template #item-created="item">
          {{ item.created_date }}
        </template>

        <template #item-device="item">
          {{ item.device_model }}
        </template>
      </EasyDataTable>
    </div>


    <div class="md:w-3/12 sm:w-full card">
      <h2 class="text-success mb-3"><b>Карты</b></h2>
      <ul class="uk-list uk-list-divider">
        <li class="card-bg p-3 rounded-md dark:bg-secondary">
          <div class="flex justify-between ">
            <div>Имя</div>
            <div><small><b>Uzbekistan Bank</b></small></div>
          </div>

          <div class="flex justify-between my-2">
            <div>Номер</div>
            <div><small><b>8600 **** **** 2434</b></small></div>
          </div>

          <div class="flex justify-between">
            <div>Добавлено</div>
            <div><small><b>12:00 / 25.12.2023</b></small></div>
          </div>

          <button class="mt-2 w-full rounded-md bg-danger text-white" @click="showUntieCardModal">
            <small>Отвязать</small>
          </button>

        </li>
      </ul>
    </div>
  </div>

  <TerminateSessionModal :userId="userId"/>
  <ConfirmUntieCardModal/>
</template>

<style lang="scss">
.card-bg {
  background-color: #F2F2F2;
}
</style>