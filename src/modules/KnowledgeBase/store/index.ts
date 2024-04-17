import {defineStore} from "pinia";
import $axios from "@/plugins/axios";
import {
    SmsTemplate,
    Results,
    Params,
    NewsTemplate,
    LocationPlace,
    LocationPlaceData,
    Regions,
    VersionControl,
    Products,
    // Pages,
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
                text: {
                    uz: '',
                    ru: ''
                },
                type: '',
                id: null
            },
            pagesListPolicy: {
                text: {
                    uz: '',
                    ru: ''
                },
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
        async getSmsTemplate(params) {
            const {data} = await $axios.get("/knowledge_base/sms_template/", {
                params,
            });
            this.smsTemplateList = data;
        },

        createSmsTemplate(data: object) {
            return $axios.post("/knowledge_base/sms_template/", data);
        },

        updateSmsTemplate(data) {
            return $axios.patch(`/knowledge_base/sms_template/${data.id}/`, data);
        },

        deleteSmsTemplate(id: number) {
            return $axios.delete(`/knowledge_base/sms_template/${id}/`);
        },
        deleteRegion(id: number) {
            return $axios.delete(`/knowledge_base/region/${id}/`);
        },
        async getNewsTemplate(params: Params) {
            const {data} = await $axios.get(`/knowledge_base/news_template/`, {
                params,
            });
            this.newTemplate = data;
        },

        createNewsTemplate(data: NewsTemplate) {
            return $axios.post(`/knowledge_base/news_template/`, data);
        },
        updateNewsTemplate(data) {
            return $axios.patch(`/knowledge_base/news_template/${data.get("id")}/`, data);
        },


        deleteNewsTemplate(id: number) {
            return $axios.delete(`/knowledge_base/news_template/${id}/`);
        },

        AddForms(data: LocationPlaceData) {
            return $axios.post("/knowledge_base/location/", data);
        },


        async getAllFormsList(params: any) {
            const {data} = await $axios.get("/knowledge_base/location/", {params});
            this.locationList = data;
            return this.locationList;
        },

        updateOneForm(data: LocationPlaceData, id: number) {
            return $axios.patch(`/knowledge_base/location/${id}/`, data);
        },
        deleteLokation(id: number) {
            return $axios.delete(`/knowledge_base/location/${id}/`);
        },

        async getRegions(params) {
            const {data} = await $axios.get(`/knowledge_base/region/`, params);
            this.regionsList = data;
            return this.regionsList;
        },
        createRegions(data: object) {
            return $axios.post('knowledge_base/region/', data)
        },
        updateRegions(data: any) {
            return $axios.patch(`knowledge_base/region/${data.id}/`, data)
        },

        // version control
        async getVersionControl(params) {
            const {data} = await $axios.get('/versions/version_list/', {params})
            this.versionControlList = data
        },

        createVersion(data: object) {
            return $axios.post(`/versions/create_version/`, data);
        },

        updateVersion(data) {
            return $axios.patch(`/versions/version/${data.id}/`, data);
        },

        deleteVersion(id: number) {
            return $axios.delete(`/versions/version/${id}/`);
        },

        // products
        async getProducts(params) {
            const {data} = await $axios.get('/products/products/', {params})
            this.productsList = data
        },

        createProducts(data) {
            return $axios.post(`/products/products/`, data);
        },

        updateProducts(data) {
            return $axios.patch(
                `/products/products/${data.id || data.get("id")}/`,
                data
            );
        },

        deleteProducts(id: number) {
            return $axios.delete(`/products/products/${id}/`);
        },


        // terms and condition
        async getPages(params) {
            const {data} = await $axios.get('/knowledge_base/pages/get_current_page', {params})
            this.pagesList = data
        },
        async getPagesPolicy(params) {
            const {data} = await $axios.get('/knowledge_base/pages/get_current_page', {params})
            console.log(data, 'data')
            this.pagesListPolicy = data
        },
        updatePages(data) {
            return $axios.patch(`/knowledge_base/pages/${data.id}/`, data);
        },

        // links
        async getSocialMediaLinks(params) {
            const {data} = await $axios.get('/knowledge_base/social_media_links/', {params})
            this.linksList = data
        },


        create_drag_and_drop(data) {
            return $axios.post(`/knowledge_base/social_media_links/drag_and_drop/`, data);
        },

        createSocialMediaLinks(data) {
            return $axios.post(`/knowledge_base/social_media_links/`, data)
        },

        updateSocialMediaLinks(data) {
            return $axios.patch(`/knowledge_base/social_media_links/${data.id}/`, data);
        },

        deleteSocialMediaLinks(id: number | null) {
            return $axios.delete(`/knowledge_base/social_media_links/${id}/`);
        },

        // phones
        async getPhones(params) {
            const {data} = await $axios.get('/knowledge_base/phones/', {params})
            this.phonesList = data
        },

        createPhones(data) {
            return $axios.post(`/knowledge_base/phones/`, data);
        },


        create_phones_drag_and_drop(data) {
            return $axios.post(`/knowledge_base/phones/drag_and_drop/`, data);
        },

        updatePhones(data) {
            return $axios.patch(`/knowledge_base/phones/${data.id}/`, data);
        },

        deletePhones(id: number | null) {
            return $axios.delete(`/knowledge_base/phones/${id}/`);
        },

    },
});
