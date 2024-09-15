<script setup lang="ts">


//IMPORTED FILES
import {Ref, computed, ref, onMounted} from "vue";
import users from "../store/index";
import {useI18n} from "vue-i18n";
import useVuelidate, {Validation} from "@vuelidate/core";
import {helpers, minLength, required} from "@vuelidate/validators";
import {useRoute, useRouter} from "vue-router";
import {toast} from "vue3-toastify";
import {UserAdd} from "../interfaces/index";

//DECLARED VARIABLES
const store = users()
const {t} = useI18n();
const router = useRouter();
const route = useRoute();
let userData = ref<UserAdd>({
  id: 3,
  name: "",
  phone: "",
  username: "",
  hobbies: [],
  email: "",
  age: null
})


//MOUNTED

onMounted(() => {
  if (route.params.id) {
    userData.value = store.userDetail

  } else {
    userData = {
      id: 3,
      name: "",
      phone: "",
      username: "",
      hobbies: [],
      email: "",
      age: null
    }
  }
})


//FUNCTIONS

function removeSpaces(str) {
  return str.replace(/[\s+]/g, "");
}


const saveUser = async () => {
  const success = await validate.value.$validate();
  if (!success) return;

  if (userData.value.phone) {
    userData.value.phone = removeSpaces(userData.value.phone);
  }

  if (route.params.id) {
    try {
      const foundIndex = store.usersList.results.findIndex((element) => element.id == +route.params.id)
      store.usersList.results.splice(foundIndex, 1, userData.value);
      await router.push("/users");
      toast.success(t("updated_successfully"));
    } catch (error: any) {
      toast.error(t('error'))
    }

  } else {
    try {
      userData.value.id = store.usersList.results[store.usersList.results.length - 1].id + 1
      store.usersList.count = store.usersList.count + 1
      store.usersList.results.push(userData.value)
      await router.push("/users");
      toast.success(t("created_successfully"));
    } catch (error: any) {
      toast.error(t('error'))
    }
  }
};
const handleChangeTag = (hobbies) => {
  userData.value.hobbies = hobbies;
};

//COMPUTED
const rules = computed(() => {
  return {
    username: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    age: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    email: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    hobbies: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    name: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    phone: {
      required: helpers.withMessage("validation.this_field_is_required", required),
      minLength: helpers.withMessage(
          "Номер телефона необходимо вводить в формате: '998 [XX] [XXX XX XX]",
          minLength(17)
      ),
    },
  };

});

const validate: Ref<Validation> = useVuelidate(rules, userData);


</script>


<template>
  <div>
    <div class="md:flex gap-5 dark:text-white">
      <div class="md:w-9/12 sm:w-full card">
        <div class=" md:flex items-start gap-8">
          <label for="loginDetail" class="w-4/12 text-xs">
            {{ $t("username") }}:
            <input
                autocomplete="off"
                id="loginDetail"
                v-model="userData.username"
                type="text"
                class="form-input md:mb-0 mb-4"
                :class="validate.username.$errors.length ? 'required-input' : ''"
            />
            <p
                v-for="error in validate.username.$errors"
                :key="error.$uid"
                class="text-danger text-sm"
            >
              {{ $t(error.$message) }}
            </p>
          </label>

          <label for="passwordDetail" class="w-4/12 text-xs relative">
            {{ $t("email") }}:
            <input
                autocomplete="off"
                id="passwordDetail"
                type="email"
                class="form-input"
                v-model="userData.email"
                :class="validate.email.$errors.length ? 'required-input' : ''"
            />
            <p
                v-for="error in validate.email.$errors"
                :key="error.$uid"
                class="text-danger text-sm"
            >
              {{ $t(error.$message) }}
            </p>
          </label>
          <label for="passwordDetail" class="w-4/12 text-xs relative">
            {{ $t("age") }}:
            <input
                autocomplete="off"
                id="passwordDetail"
                type="number"
                class="form-input"
                v-model="userData.age"
                :class="validate.age.$errors.length ? 'required-input' : ''"
            />

          </label>
        </div>
        <label class="mt-5 mb-1 block text-xs"> {{ $t("hobbies") }}:
          <vue3-tags-input
              :class="validate.hobbies.$errors.length ? 'required-input' : ''"
              style="border:1px solid rgb(209 213 219);
               padding:0.100rem;
               background-color:rgb(249 250 251)"
              @on-tags-changed="handleChangeTag"
              :tags="userData.hobbies"
              :placeholder="$t('enter_your_hobby')"/>
          <p
              v-for="error in validate.hobbies.$errors"
              :key="error.$uid"
              class="text-danger text-sm"
          >
            {{ $t(error.$message) }}
          </p>
        </label>

      </div>

      <div class="md:w-3/12 card sm:w-full">

        <label for="login" class="block text-xs">
          {{ $t("Full Name") }}:
          <input
              id="login"
              type="text"
              class="form-input"
              v-model="userData.name"
              :class="validate.name.$errors.length ? 'required-input' : ''"
          />
          <p
              v-for="error in validate.name.$errors"
              :key="error.$uid"
              class="text-danger text-sm"
          >
            {{ $t(error.$message) }}
          </p>
        </label>

        <label for="phoneNumber" class="mt-4 block text-xs">
          {{ $t("phone_number") }}:
          <input
              v-model="userData.phone"
              v-maska
              data-maska="+998 ## ### ## ##"
              class="form-input"
              :class="validate.phone.$errors.length ? 'required-input' : ''"
          />
          <p
              v-for="error in validate.name.$errors"
              :key="error.$uid"
              class="text-danger text-sm"
          >
            {{ $t(error.$message) }}
          </p>
        </label>

      </div>
    </div>
    <div class="mt-5 flex justify-end gap-4">
      <button class="btn-secondary" @click="$router.push('/users')">
        {{ $t("Cancel") }}
      </button>
      <button class="btn-success" @click="saveUser">
        {{ route.params.id ? $t("Change") : $t("Add") }}
      </button>
    </div>
  </div>
</template>
