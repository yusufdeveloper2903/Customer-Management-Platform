<script lang="ts" setup>
//IMPORT FILES
import i18n from "@/plugins/i18n";
import {useI18n} from "vue-i18n";


//DECLARED VARIABLES
const {locale} = useI18n();


//FUNCTIONS
function onChangeLocale(lang: any) {
  i18n.global.locale.value = lang;
  localStorage.setItem("last-locale", lang);
}
</script>
<template>
  <div class="mx-auto w-[35px] cursor-pointer lang flex justify-end" :lang="locale">
    <div class="inline-block w-[28px]">
      <img
          v-if="locale == 'ru'"
          class="w-[48px]"
          src="@/assets/image/flags/ru.png"
          alt="ru"
      />

      <img
          v-if="locale == 'uz'"
          class="w-[48px]"
          src="@/assets/image/flags/uz.png"
          alt="uz"
      />
    </div>

    <div
        uk-dropdown="pos: left-top;"
        class="bg-white dark:text-gray-300 p-0 py-2"
    >
      <div
          class="p-3 hover:bg-primary/20 hover:text-primary"
          @click="onChangeLocale('ru')"
      >
        <img
            class="mr-2 inline-block w-[28px]"
            src="@/assets/image/flags/ru.png"
            alt="ru"
        />
        <span>Russian</span>
      </div>

      <div
          class="p-3 hover:bg-primary/10 hover:text-primary"
          @click="onChangeLocale('uz')"
      >
        <img
            class="mr-2 inline-block w-[28px]"
            src="@/assets/image/flags/uz.png"
            alt="uz"
        />
        <span>Uzbek</span>
      </div>
    </div>
  </div>
</template>
