// stores/counter.js
import $axios from "@/plugins/axios";
import { defineStore } from "pinia";

interface SmsVerifyData {
  sms_code: string;
  temp_user: string | null;
}
interface UserIdentity {
  photo: string;
  temp_user: string | null;
}
interface SetPassword {
  password: string;
  temp_user: string | null;
}

interface RolesForLogin {
  id: number;
  name: { ru: string; uz: string };
  unique_name: string;
}
interface User {
  id: number;
  region?: number;
  role?: number[];
  name?: string;
  phone?: string;
  username?: string;
  password?: string;
  language?: string | null;
  theme?: string | null;
  is_active?: boolean;
}

interface TechPassport {
  state_number: string;
  address: string;
  // issue_date: string;
  manufacture_year: string;
  // issuing_authority: string;
  vehicle_identification_number: string;
  // full_mass: number | null;
  // mass_without_load: number | null;
  engine_number: string;
  engine_power: number | null;
  // number_of_seats: number | null;
  // number_of_standing_places: null;
  // special_marks: string;
  car_price: number | null;
  body_type: number | null;
  car_model: number | null;
  color: number | null;
  // fuel_type: number | null;
  owner: number | null;
  owner_name: string | null;
  region: string | null;
  registration_file_front_side: null | File | string;
  registration_file_back_side: null | File | string;
  // appraisal_act: File | null | string;
}

interface TechPasswordUpdate extends TechPassport, FormData {
  id: number | null;
}
interface StatusUpdate extends FormData {
  id: number | null;
  status_unique?: string;
}
interface CardData {
  user_id: number;
  number: string;
  exp_date: string;
  title: string;
}

interface CardConfirm {
  exp_date: string;
  sms_code: string;
  number: string;
}
interface Register {
  date_of_birth: string;
  phone: string;
  passport_data: string;
}

interface NewTechPassport {
  id: number;
  state_number: string;
  issue_date: string;
  issuing_authority: string;
  inn: string;
}

export const registration = defineStore("registration", {
  state: () => {
    return {
      startTimerCountDown: false as boolean | null,
      isTimerStopped: false as boolean | null,
      oldPhoneUsedInRegistration: '' as string | number | null,
      rolesForLogin: [] as RolesForLogin[],
      card_id: null as number | null,
      newTechpassport: {
        next: null,
        previous: null,
        page_size: 10,
        count: 0,
        total_pages: 1,
        results: [] as NewTechPassport[],
      },
      register: {
        date_of_birth: "",
        phone: "+998",
        passport_data: "",
      } as Register,
      agreeWithPoliticConfidence: false as boolean,
      techPassportData: {
        state_number: "",
        address: "",
        // issue_date: "",
        manufacture_year: "",
        // issuing_authority: "",
        vehicle_identification_number: "",
        // full_mass: null,
        // mass_without_load: null,
        engine_number: "",
        engine_power: null,
        // number_of_seats: null,
        // number_of_standing_places: null,
        // special_marks: "",
        car_price: null,
        body_type: null,
        car_model: null,
        color: null,
        // fuel_type: null,
        owner: null,
        owner_name: null,
        region: null,
        registration_file_front_side: null,
        registration_file_back_side: null,
        // appraisal_act: null,
      } as TechPassport,
    };
  },

  actions: {
    smsVerify(data: SmsVerifyData) {
      return $axios.post("/users/verify_sms/", data, {
        headers: { no_add_token: true },
      });
    },
    verifyUserIdentity(data: UserIdentity) {
      return $axios.post("/users/verify_user_identity/", data, {
        headers: { no_add_token: true },
      });
    },
    setPassword(data: SetPassword) {
      return $axios.post("/users/set_password/", data, {
        headers: { no_add_token: true },
      });
    },
    async getSellerAndBuyer() {
      const { data } = await $axios.get("/users/roles/get_seller_and_buyer/", {
        headers: { no_add_token: true },
      });
      this.rolesForLogin = data;
    },
    setRole(data: { role_id: number | null }) {
      return $axios.post(`/users/set_role/`, data);
    },
    fillTheTechPassport(data: TechPassport) {
      return $axios.post(`/registration/registration/`, data);
    },
    createUserCard(data: CardData) {
      return $axios.post(`/users/user-card/`, data);
    },
    confirmCreateUserCard(data: CardConfirm) {
      return $axios.post(`/users/user-card/check_sms_code/`, data);
    },
    // ! не нужно
    resendConfirmCreateUserCard(id: number | null) {
      return $axios.post(`/users/user-card/${id}/refresh_sms_code/`);
    },
    sendPhoneNumberToChangePassword(phone: any) {
      return $axios.post(`/users/send_sms_to_change_password/`, phone, {
        headers: { no_add_token: true },
      });
    },
    setNewPassword(data: SetPassword) {
      return $axios.post("/users/set_changed_password/", data);
    },
    fillNewTechPassportData(data) {
      return $axios.post("/registration/new-registration/", data);
    },
    async getNewTechPassportData(params) {
      const { data } = await $axios.get(`/registration/new-registration/`, {
        params,
      });
      this.newTechpassport = data;
    },
    updateTechPassport(data: TechPasswordUpdate | StatusUpdate) {
      return $axios.patch(
        `/registration/registration/${data.get("id")}/`,
        data
      );
    },
    updateNewTechPasport(data) {
      return $axios.patch(`/registration/new-registration/${data.id}/`, data);
    },
  },
});
