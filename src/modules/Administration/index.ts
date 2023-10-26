import { defineStore } from "pinia";
import axios from "@/plugins/axios"


interface Params {
    page?: number | string;
    page_size?: number | string;
    total?: number | string;
    search?: string;
    pre_payment?: number | null;
    parent?: number | null;
}






interface Regions {
    id?: number;
    name?: string;
    is_active?: boolean;
    parent?: { id: number; name?: string; is_active?: boolean };
}
interface AddRegion {
    data: {
        name?: string;
        is_active?: boolean;
        parent?: number;
    }
}
interface UpdateRegion {
    data: {
        name?: string;
        is_active?: boolean;
        parent?: { id?: number; name?: string; is_active?: boolean };
    },
    id?: number;
}   
interface DeleteId {
    id: number;
}   
interface Districts {
    id: number;
    name?: string;
    is_active?: boolean;
    parent?: { id: number; name?: string; is_active?: boolean };
}
interface CarModels {
    id: number;
    name?: string;
    is_active?: boolean;
}
interface CarColors {
    id: number;
    name?: string;
    is_active?: boolean;
    model?: { id: number; name?: string; is_active?: boolean };
}
interface CarBodyTypes {
    id: number;
    name?: string;
    is_active?: boolean;
}
interface CarFuelTypes {
    id: number;
    name?: string;
    is_active?: boolean;
}
interface BankRequisites {
    id: number;
    name?: string;
    phone_number?: string;
    mfo?: string;
    settlement_account?: string;
    is_active?: boolean;
}
  



export const administrationStore = defineStore('administrationStorage', {
  state: () => {
      return {
        regions: [] as Regions[],
        districts: [] as Districts[],
        car_models: [] as CarModels[],
        car_colors: [] as CarColors[],
        car_body_types: [] as CarBodyTypes[],
        car_fuel_types: [] as CarFuelTypes[],
        bank_requisites: [] as BankRequisites[],

        pre_payments: [],
        periods: [],






        back_up_list: [],
        back_up_media_list: [],
        journal_authorization_list: [],
        journal_activities_list: [],
        os_system_info: [],
      }
  },
    

  actions: {



    
      async FETCH_PRE_PAYMENTS(params: Params) {
        return await axios({
            method: "GET",
            url: '/knowledge_base/pre_payments/',
            params,
        })
            .then(async (e) => {
                this.pre_payments = e.data
                return e.data;            
            })
            .catch((error) => {
                return error;
            })
      },
      async ADD_PRE_PAYMENTS(payload) {
        return await axios({
            method: "POST",
            url: `/knowledge_base/pre_payments`,
            data: payload.data,
          })
            .then(async (e) => {
                return e.data;            
            })
            .catch((error) => {
                return error;
            })
      },
      async FETCH_ONE_PRE_PAYMENTS(payload) {
        return await axios({
            method: "GET",
            url: `/knowledge_base/pre_payments/${payload.id}`,
            params: payload.params,
        })
            .then(async (e) => {
                this.pre_payments = e.data
                return e.data;            
            })
            .catch((error) => {
                return error;
            })
      },
      async UPDATE_PUT_PRE_PAYMENTS(payload) {
        return await axios({
            method: "PUT",
            url: `/knowledge_base/pre_payments/${payload}`,
            params: payload,
        })
            .then(async (e) => {
                this.pre_payments = e.data
                return e.data;            
            })
            .catch((error) => {
                return error;
            })
      },
      async UPDATE_PATCH_PRE_PAYMENTS(payload) {
        return await axios({
            method: "PATCH",
            url: `/knowledge_base/pre_payments/${payload.id}`,
            data: payload.data,
        })
            .then(async (e) => {
                this.pre_payments = e.data
                return e.data;            
            })
            .catch((error) => {
                return error;
            })
      },
      async DELETE_PRE_PAYMENTS(payload: DeleteId) {
        return await axios({
            method: "DELETE",
            url: `/knowledge_base/pre_payments/${payload.id}`,
        })
            .then(async (e) => {
                return e.data;            
            })
            .catch((error) => {
                return error;
            })
      },





























      



    

    
      async FETCH_PERIODS(params: Params) {
        return await axios({
            method: "GET",
            url: '/knowledge_base/periods/',
            params,
        })
            .then(async (e) => {
                this.periods = e.data
                return e.data;            
            })
            .catch((error) => {
                return error;
            })
      },
      async ADD_PERIODS(payload) {
        return await axios({
            method: "POST",
            url: `/knowledge_base/periods`,
            data: payload.data,
          })
            .then(async (e) => {
                return e.data;            
            })
            .catch((error) => {
                return error;
            })
      },
      async FETCH_ONE_PERIODS(payload) {
        return await axios({
            method: "GET",
            url: `/knowledge_base/periods/${payload.id}`,
            params: payload.params,
        })
            .then(async (e) => {
                this.periods = e.data
                return e.data;            
            })
            .catch((error) => {
                return error;
            })
      },
      async UPDATE_PUT_PERIODS(payload) {
        return await axios({
            method: "PUT",
            url: `/knowledge_base/periods/${payload}`,
            params: payload,
        })
            .then(async (e) => {
                this.periods = e.data
                return e.data;            
            })
            .catch((error) => {
                return error;
            })
      },
      async UPDATE_PATCH_PERIODS(payload) {
        return await axios({
            method: "PATCH",
            url: `/knowledge_base/periods/${payload.id}`,
            data: payload.data,
        })
            .then(async (e) => {
                this.periods = e.data
                return e.data;            
            })
            .catch((error) => {
                return error;
            })
      },
      async DELETE_PERIODS(payload: DeleteId) {
        return await axios({
            method: "DELETE",
            url: `/knowledge_base/periods/${payload.id}`,
        })
            .then(async (e) => {
                return e.data;            
            })
            .catch((error) => {
                return error;
            })
      },























      
      
      async CREATE_BACKUP(params) {
        return await axios({
          method: "GET",
          url: `/knowledge_base/back_up_create/`,
          params
        })
          .then(async (e) => {
            //   this.get_period_by_prepayment_amount = e.data
              return e.data;            
          })
          .catch((error) => {
              return error;
          })
      },

      async FETCH_BACKUP_LIST(params) {
        return await axios({
          method: "GET",
          url: `/knowledge_base/back_up_list/`,
          params
        })
          .then(async (e) => {
            this.back_up_list = e.data
            return e.data;            
          })
          .catch((error) => {
            return error;
          })
      },

      async DELETE_BACKUP(payload) {
        return await axios({
          method: "DELETE",
          url: `knowledge_base/back_up_delete/${payload}`,
        })
          .then(async (e) => {
              return e.data;            
          })
          .catch((error) => {
              return error;
          })
      },



















  

      async CREATE_BACKUP_MEDIA(params) {
        return await axios({
          method: "GET",
          url: `/knowledge_base/back_up_media_create/`,
          params
        })
          .then(async (e) => {
              return e.data;            
          })
          .catch((error) => {
              return error;
          })
      },

      async FETCH_BACKUP_MEDIA_LIST(params) {
        return await axios({
          method: "GET",
          url: `/knowledge_base/back_up_media_list/`,
          params
        })
          .then(async (e) => {
            this.back_up_media_list = e.data
            return e.data;            
          })
          .catch((error) => {
            return error;
          })
      },

      async DELETE_BACKUP_MEDIA(payload) {
        return await axios({
          method: "DELETE",
          url: `knowledge_base/back_up_media_delete/${payload}`,
        })
          .then(async (e) => {
              return e.data;            
          })
          .catch((error) => {
              return error;
          })
      },


















      async FETCH_JOURNAL_AUTHORIZATION_LIST(params) {
        return await axios({
          method: "GET",
          url: `/knowledge_base/journal_authorization_list/`,
          params
        })
          .then(async (e) => {
            this.journal_authorization_list = e.data
            return e.data;            
          })
          .catch((error) => {
            return error;
          })
      },
      async FETCH_JOURNAL_AKTIVITIEST_LIST(params) {
        return await axios({
          method: "GET",
          url: `/knowledge_base/journal_activities_list/`,
          params
        })
          .then(async (e) => {
            this.journal_activities_list = e.data
            return e.data;            
          })
          .catch((error) => {
            return error;
          })
      },





      async FETCH_JOURNAL_AUTHORIZATION_LIST_EXCEL(params) {
        return await axios({
          method: "GET",
          url: `/knowledge_base/journal_authorization_list/`,
          params,
          responseType: 'blob'
        })
          .then(async (e) => {
            return e.data;            
          })
          .catch((error) => {
            return error;
          })
      },
      async FETCH_JOURNAL_AKTIVITIEST_LIST_EXCEL(params) {
        return await axios({
          method: "GET",
          url: `/knowledge_base/journal_activities_list/`,
          params,
          responseType: 'blob'
        })
          .then(async (e) => {
            return e.data;            
          })
          .catch((error) => {
            return error;
          })
      },





    




      async FETCH_OS_SYSTEM_INFO(params) {
        return await axios({
          method: "GET",
          url: `/os_info/system_information/`,
          params,
        })
          .then(async (e) => {
            this.os_system_info = e.data
            return e.data;            
          })
          .catch((error) => {
            return error;
          })
      },





  },
});