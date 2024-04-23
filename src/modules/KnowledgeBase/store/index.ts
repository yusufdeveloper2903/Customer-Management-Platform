import {defineStore} from "pinia";
import $axios from "@/plugins/axios";
import {
    SmsTemplate,
    Results,
    Params,
    NewsTemplate,
    LocationPlace,
    Regions,
    VersionControl,
    Products,
    Link,
    Phones

} from "../interfaces";


export default defineStore("knowledgeBase", {
    state: () => {
        return {
            knowledge: '',
            smsTemplateList: {
                count: 0,
                results: [] as SmsTemplate[],
            } as Results<SmsTemplate>,
            newTemplate: {
                results: [] as NewsTemplate[],
            } as Results<NewsTemplate>,
            locationList: {
                results: [] as LocationPlace[],
            } as Results<LocationPlace>,
            regionsList: {
                results: [] as Regions[],
            } as Results<Regions>,

            versionControlList: {
                results: [] as VersionControl[]
            } as Results<VersionControl>,
            productsList: {
                results: [] as Products[]
            } as Results<Products>,
            pagesList: {
                text: '',
                text_ru: '',
                text_kr: '',
                text_uz: '',
                type: '',
                id: null,
            },
            pagesListPolicy: {
                text: '',
                text_ru: '',
                text_uz: '',
                text_kr: '',
                type: '',
                id: null
            },
            image: '',
            linksList: {
                results: [] as Link[]
            } as Results<Link>,

            phonesList: {
                results: [] as Phones[]
            } as Results<Phones>

        };
    },
    actions: {


        //GET REQUEST
        async getSmsTemplate(params: any) {
            const {data} = await $axios.get("/knowledge_base/sms_template/", {params})
            this.smsTemplateList = data
        },
        async getNewsTemplate(params: Params) {
            const {data} = await $axios.get(`/knowledge_base/news_template/`, {params});
            this.newTemplate = data;
        },
        async getAllFormsList(params: any) {
            const {data} = await $axios.get("/knowledge_base/location/", {params});
            this.locationList = data;
            return this.locationList;
        },
        async getRegions(params: any) {
            const {data} = await $axios.get(`/knowledge_base/region/`, {params});
            this.regionsList = data;
            return this.regionsList;
        },
        async getVersionControl(params) {
            const {data} = await $axios.get('/versions/version_list/', {params})
            this.versionControlList = data
        },
        async getProducts(params) {
            const {data} = await $axios.get('/products/products/', {params})
            this.productsList = data
        },
        async getPages(params) {
            const {data} = await $axios.get('/knowledge_base/pages/get_current_page', {params})
            this.pagesList = data
            this.pagesList.text = data.text
        },
        async getPagesPolicy(params) {
            const {data} = await $axios.get('/knowledge_base/pages/get_current_page', {params})
            this.pagesListPolicy = data
            this.pagesListPolicy.text = data.text
        },
        async getSocialMediaLinks(params) {
            const {data} = await $axios.get('/knowledge_base/social_media_links/', {params})
            this.linksList = data
        },
        async getPhones(params) {
            const {data} = await $axios.get('/knowledge_base/phones/', {params})
            this.phonesList = data
        },


        //CREATE REQUEST
        createSmsTemplate(data: object) {
            return $axios.post("/knowledge_base/sms_template/", data);
        },
        createNewsTemplate(data: NewsTemplate) {
            return $axios.post(`/knowledge_base/news_template/`, data);
        },
        AddForms(data) {
            return $axios.post("/knowledge_base/location/", data);
        },
        createRegions(data: object) {
            return $axios.post('knowledge_base/region/', data)
        },
        createVersion(data: object) {
            return $axios.post(`/versions/create_version/`, data);
        },
        createProducts(data) {
            return $axios.post(`/products/products/`, data);
        },
        create_drag_and_drop(data) {
            return $axios.post(`/knowledge_base/social_media_links/drag_and_drop/`, data);
        },

        createSocialMediaLinks(data) {
            return $axios.post(`/knowledge_base/social_media_links/`, data)
        },

        createPhones(data) {
            return $axios.post(`/knowledge_base/phones/`, data);
        },
        create_phones_drag_and_drop(data) {
            return $axios.post(`/knowledge_base/phones/drag_and_drop/`, data);
        },


        //PATCH REQUEST
        updateSmsTemplate(data) {
            return $axios.patch(`/knowledge_base/sms_template/${data.id}/`, data);
        },
        updateNewsTemplate(data) {
            return $axios.patch(`/knowledge_base/news_template/${data.get("id")}/`, data);
        },
        updateOneForm(data) {
            return $axios.patch(`/knowledge_base/location/${data.id}/`, data);
        },
        updateRegions(data: any) {
            return $axios.patch(`knowledge_base/region/${data.id}/`, data)
        },
        updateVersion(data) {
            return $axios.patch(`/versions/version/${data.id}/`, data);
        },
        updateProducts(data) {
            return $axios.patch(
                `/products/products/${data.id || data.get("id")}/`,
                data
            );
        },
        updatePages(data) {
            return $axios.patch(`/knowledge_base/pages/${data.id}/`, data);
        },
        updateSocialMediaLinks(data) {
            return $axios.patch(`/knowledge_base/social_media_links/${data.id}/`, data);
        },
        updatePhones(data) {
            return $axios.patch(`/knowledge_base/phones/${data.id}/`, data);
        },


        //DELETE REQUEST
        deleteSmsTemplate(id: number | null) {
            return $axios.delete(`/knowledge_base/sms_template/${id}/`);
        },
        deleteRegion(id: number | null) {
            return $axios.delete(`/knowledge_base/region/${id}/`);
        },
        deleteNewsTemplate(id: number | null) {
            return $axios.delete(`/knowledge_base/news_template/${id}/`);
        },
        deleteLokation(id: number | null | undefined) {
            return $axios.delete(`/knowledge_base/location/${id}/`);
        },
        deleteVersion(id: number | null) {
            return $axios.delete(`/versions/version/${id}/`);
        },
        deleteProducts(id: number | null) {
            return $axios.delete(`/products/products/${id}/`);
        },
        deleteSocialMediaLinks(id: number | null) {
            return $axios.delete(`/knowledge_base/social_media_links/${id}/`);
        },
        deletePhones(id: number | null) {
            return $axios.delete(`/knowledge_base/phones/${id}/`);
        },


    },
});
