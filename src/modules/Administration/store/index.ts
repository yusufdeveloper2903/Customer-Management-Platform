//IMPORTED FILES
import {defineStore} from "pinia";
import axios from "@/plugins/axios"
import {
    Regions,
    Districts,
    CarModels,
    CarColors,
    CarBodyTypes,
    CarFuelTypes,
    BankRequisites,
    BackUpList,
    backUpMedialist,
    journalAuthorizationList,
    journalActivitiesList,
    Params,
    DeleteId
} from '../interface/index'

//EXPORT FILES
export default defineStore('administrationStorage', {
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
            back_up_list: {
                count: 0,
                results: [] as BackUpList[]
            },
            back_up_media_list: {
                count: 0,
                results: [] as backUpMedialist[]
            },
            journal_authorization_list: {
                count: 0,
                results: [] as journalAuthorizationList[]
            },
            journal_activities_list: {
                count: 0,
                results: [] as journalActivitiesList[]
            },
            os_system_info: [],
        }
    },


    actions: {

        //GET REQUESTS
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
        async FETCH_ONE_PRE_PAYMENTS(payload: any) {
            return await axios({
                method: "GET",
                url: `/knowledge_base/pre_payments/${payload.id}/`,
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
        async FETCH_BACKUP_LIST(params: any) {
            return await axios({
                method: "GET",
                url: `/knowledge_base/back_up_list/`,
                params
            })
                .then(async (e) => {
                    this.back_up_list = e.data
                })
                .catch((error) => {
                    return error;
                })
        },
        async FETCH_BACKUP_MEDIA_LIST(params: any) {
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
        async FETCH_JOURNAL_AUTHORIZATION_LIST(params: any) {
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
        async FETCH_JOURNAL_AKTIVITIEST_LIST(params: any) {
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


        async FETCH_JOURNAL_AUTHORIZATION_LIST_EXCEL(params: any) {
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
        async FETCH_JOURNAL_AKTIVITIEST_LIST_EXCEL(params: any) {
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


        async FETCH_OS_SYSTEM_INFO() {
            return await axios({
                method: "GET",
                url: `/os_info/system_information/`,
            })
                .then(async (e) => {
                    this.os_system_info = e.data
                    return e.data;
                })
                .catch((error) => {
                    return error;
                })
        },

        //CREATE REQUESTS
        async ADD_PRE_PAYMENTS(payload: any) {
            return await axios({
                method: "POST",
                url: `/knowledge_base/pre_payments/`,
                data: payload.data,
            })
                .then(async (e) => {
                    return e.data;
                })
                .catch((error) => {
                    return error;
                })
        },
        async ADD_PERIODS(payload: any) {
            return await axios({
                method: "POST",
                url: `/knowledge_base/periods/`,
                data: payload.data,
            })
                .then(async (e) => {
                    return e.data;
                })
                .catch((error) => {
                    return error;
                })
        },
        async CREATE_BACKUP() {
            return await axios({
                method: "GET",
                url: `/knowledge_base/back_up_create/`,
                responseType: 'blob'
            })
                .then(async (e) => {
                    //   this.get_period_by_prepayment_amount = e.data
                    return e.data;
                })
                .catch((error) => {
                    return error;
                })
        },

        async CREATE_BACKUP_MEDIA() {
            return await axios({
                method: "GET",
                url: `/knowledge_base/back_up_media_create/`,
                responseType: 'blob',
            })
                .then(async (e) => {
                    return e.data;
                })
                .catch((error) => {
                    return error;
                })
        },

        async FETCH_ONE_PERIODS(payload: any) {
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


        //PATCH REQUESTS
        async UPDATE_PUT_PRE_PAYMENTS(payload: any) {
            return await axios({
                method: "PUT",
                url: `/knowledge_base/pre_payments/${payload}/`,
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
        async UPDATE_PATCH_PRE_PAYMENTS(payload: any) {
            return await axios({
                method: "PATCH",
                url: `/knowledge_base/pre_payments/${payload.id}/`,
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
                url: `/knowledge_base/pre_payments/${payload.id}/`,
            })
                .then(async (e) => {
                    return e.data;
                })
                .catch((error) => {
                    return error;
                })
        },


        async UPDATE_PUT_PERIODS(payload: any) {
            return await axios({
                method: "PUT",
                url: `/knowledge_base/periods/${payload}/`,
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
        async UPDATE_PATCH_PERIODS(payload: any) {
            return await axios({
                method: "PATCH",
                url: `/knowledge_base/periods/${payload.id}/`,
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


        //DELETE REQUESTS
        async DELETE_PERIODS(payload: DeleteId) {
            return await axios({
                method: "DELETE",
                url: `/knowledge_base/periods/${payload.id}/`,
            })
                .then(async (e) => {
                    return e.data;
                })
                .catch((error) => {
                    return error;
                })
        },


        async DELETE_BACKUP(payload: any) {
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

        async DELETE_BACKUP_MEDIA(payload: any) {
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


    },
});