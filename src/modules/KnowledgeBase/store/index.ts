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
    Phones,
    RetseptCategory,
    Onboarding,
    Splash,
    QuantityType,
    District,
    ErrorMessage
    
} from "../interfaces";


export default defineStore("knowledgeBase", {
    state: () => {
        return {
            tabs: 'UZ',
            knowledge: '',
            smsTemplateList: {
                count: 0,
                results: [] as SmsTemplate[],
            } as Results<SmsTemplate>,
            newTemplate: {
                results: [] as NewsTemplate[],
            } as Results<NewsTemplate>,
            onBoarding: {
                results: [] as Onboarding[],
            } as Results<Onboarding>,

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
            } as Results<Phones>,

            retseptCategoryList: {
                results: [] as RetseptCategory[]
            } as Results<RetseptCategory>,

            splashList: {
                results: [] as Splash[]
            } as Results<Splash>,

            quantityTypeList: {
                results: [] as QuantityType[]
            } as Results<QuantityType>,

            distrctList: {
                results: [] as District[],
            } as Results<District>,

            errorMessageList: {
                results: [] as ErrorMessage[],
            } as Results<ErrorMessage>,
            
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
        async getOnboarding(params: Params) {
            const {data} = await $axios.get(`/knowledge_base/onboarding/`, {params});
            this.onBoarding = data;
        },
        async getAllFormsList(params: any) {
            const {data} = await $axios.get("/knowledge_base/location/", {params});
            this.locationList = data;
            return this.locationList;
        },
        async getRegions(params?: any) {
            const {data} = await $axios.get(`/knowledge_base/region/`, {params});
            this.regionsList = data;
            return this.regionsList;
        },
        async getVersionControl(params) {
            const {data} = await $axios.get('/versions/version_list/', {params})
            this.versionControlList = data
        },
        async getProducts(params?) {
            const {data} = await $axios.get('/products/products/', {params})
            this.productsList = data
        },
        async getPages(params) {
            const {data} = await $axios.get('/knowledge_base/pages/get_current_page/', {params})
            this.pagesList = data
            this.pagesList.text = data.text
        },
        async getPagesPolicy(params) {
            const {data} = await $axios.get('/knowledge_base/pages/get_current_page/', {params})
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

        async getRetseptCategory(params?: Params) {
            const {data} = await $axios.get('/knowledge_base/retsept_category/', {params})
            this.retseptCategoryList = data
        },

        async getSplash(params?: Params) {
            const {data} = await $axios.get('/knowledge_base/splash/', {params})
            this.splashList = data
        },

        async getQuantityType(params?: Params) {
            const {data} = await $axios.get('/products/product_type/', {params})
            this.quantityTypeList = data
        },

        async getDistrict(params?) {
            const {data} = await $axios.get('/knowledge_base/region/get_districts/', {params})
            this.distrctList = data
        },

        async getErrorMessage(params?) {
            const {data} = await $axios.get('/knowledge_base/error_message/', {params})
            this.errorMessageList = data
        },

        //CREATE REQUEST
        createSmsTemplate(data: any) {
            return $axios.post("/knowledge_base/sms_template/", data);
        },
        createNewsTemplate(data: any) {
            return $axios.post(`/knowledge_base/news_template/`, data);
        },
        createOnboarding(data: any) {
            return $axios.post(`/knowledge_base/onboarding/`, data);
        },
        AddForms(data: any) {
            return $axios.post("/knowledge_base/location/", data);
        },
        createRegions(data: object) {
            return $axios.post('knowledge_base/region/', data)
        },
        createVersion(data: object) {
            return $axios.post(`/versions/create_version/`, data);
        },
        createProducts(data: any) {
            return $axios.post(`/products/products/`, data);
        },
        create_drag_and_drop(data: any) {
            return $axios.post(`/knowledge_base/social_media_links/drag_and_drop/`, data);
        },

        createSocialMediaLinks(data: any) {
            return $axios.post(`/knowledge_base/social_media_links/`, data)
        },

        createPhones(data: any) {
            return $axios.post(`/knowledge_base/phones/`, data);
        },
        create_phones_drag_and_drop(data: any) {
            return $axios.post(`/knowledge_base/phones/drag_and_drop/`, data);
        },

        createRecipeCategory(data: any) {
            return $axios.post(`/knowledge_base/retsept_category/`, data);
        },
        
        createPages(data: any) {
            return $axios.post(`/knowledge_base/pages/`, data);
        },

        createSplash(data: any) {
            return $axios.post(`/knowledge_base/splash/`, data);
        },

        createQuantityType(data: any) {
            return $axios.post(`/products/product_type/`, data);
        },

        create_onboarding_drag_and_drop(data: any) {
            return $axios.post(`/knowledge_base/onboarding/${data.id}/drag_and_drop/`, data);
        },


        //PATCH REQUEST
        updateSmsTemplate(data: any) {
            return $axios.patch(`/knowledge_base/sms_template/${data.id}/`, data);
        },
        updateNewsTemplate(data: any) {
            return $axios.patch(`/knowledge_base/news_template/${data.get("id")}/`, data);
        },
        updateOnboarding(data: any) {
            return $axios.patch(`/knowledge_base/onboarding/${data.get("id")}/`, data);
        },
        updateOneForm(data: any) {
            return $axios.patch(`/knowledge_base/location/${data.get('id')}/`, data);
        },
        updateRegions(data: any) {
            return $axios.patch(`knowledge_base/region/${data.id}/`, data)
        },
        updateVersion(data: any) {
            return $axios.patch(`/versions/version/${data.id}/`, data);
        },
        updateProducts(data: any) {
            return $axios.patch(
                `/products/products/${data.id || data.get("id")}/`,
                data
            );
        },
        updatePages(data: any) {
            return $axios.patch(`/knowledge_base/pages/${data.id}/`, data);
        },
        updateSocialMediaLinks(data: any) {
            return $axios.patch(`/knowledge_base/social_media_links/${data.id}/`, data);
        },
        updatePhones(data: any) {
            return $axios.patch(`/knowledge_base/phones/${data.id}/`, data);
        },

        updateRecipeCategory(data: any) {
            return $axios.patch(`/knowledge_base/retsept_category/${data.id}/`, data);
        },

        updateSplash(data: any) {
            return $axios.patch(`/knowledge_base/splash/${data.get("id")}/`, data);
        },

        updateQuantityType(data: any) {
            return $axios.patch(`/products/product_type/${data.id}/`, data);
        },

        updateErrorMessage(data: any) {
            return $axios.patch(`/knowledge_base/error_message/${data.status_code}/`, data);
        },

        //DELETE REQUEST
        deleteSmsTemplate(id: number | null) {
            return $axios.delete(`/knowledge_base/sms_template/${id}/`);
        },
        detelePoll(id: number | null) {
            return $axios.delete(`knowledge_base/poll/${id}/`)
        },
        deleteRegion(id: number | null) {
            return $axios.delete(`/knowledge_base/region/${id}/`);
        },
        deleteNewsTemplate(id: number | null) {
            return $axios.delete(`/knowledge_base/news_template/${id}/`);
        },
        deleteOnboarding(id: number | null) {
            return $axios.delete(`/knowledge_base/onboarding/${id}/`);
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

        deleteRecipeCategory(food_category_id: number | null) {
            return $axios.delete(`/knowledge_base/retsept_category/${food_category_id}/`);
        },

        deleteSplash(id: number | null) {
            return $axios.delete(`/knowledge_base/splash/${id}/`);
        },

        deleteQuantityType(id: number | null) {
            return $axios.delete(`/products/product_type/${id}/`);
        },


    },
});
