export interface Results<T> {
    count: number;
    next: number | null;
    previous: number | null;
    results: T[];
}


export interface SmsTemplate {
    id: number;
    title: {
        uz: string | null;
        ru: string | null;
        kr: string | null;
    };
    description: {
        uz: string | null;
        ru: string | null;
        kr: string | null;

    };
}

export interface OnBoarding {
    id: number;
    title: {
        uz: string | null;
        ru: string | null;
        kr: string | null;
    };
    description: {
        uz: string | null;
        ru: string | null;
        kr: string | null;
    };
}

export interface Polls {
    id: number | null;
    name: string;
    is_active: boolean;
}

export interface NewsTemplate {
    id: number | null;
    title: string;
    title_uz: string;
    title_kr: string;
    title_ru: string;
    description: string;
    description_uz: string;
    description_kr: string;
    description_ru: string;
    file: null | string;
    url: string;
}
export interface Onboarding {
    id: number | null;
    title: string;
    title_uz: string;
    title_kr: string;
    title_ru: string;
    description: string;
    description_uz: string;
    description_kr: string;
    description_ru: string;
    image: null | string;
    index: number

}

export interface Params {
    page?: number;
    page_size?: number;
    search?: string;
}

export interface Lang {
    ru: string;
    uz: string;
}

export interface EditDataVersion {
    id: number | null
    number: string,
    description: string
}

export interface EditVersion {
    id: number | null
    number: string,
    description: string,
    is_active: boolean
}


export interface EditDataProductModal {
    id: string | null,
    title: string,
    title_uz: string,
    title_kr: string,
    title_ru: string,
    description: string,
    description_uz: string,
    description_kr: string,
    description_ru: string,
    price: string,
    image: string,
    code: string;
    quantity: string;
    measurement_type: string;
    category: { id: number } | null

}

export interface EditRegion {
    id: string | null,
    title: string,
    title_ru: string,
    title_kr: string,
    title_uz: string,
}

export interface editRegionModal {
    id: number | null,
    name: string,
    name_ru: string,
    name_uz: string,
    name_kr: string,
}

export interface EditLink {
    id: null | number,
    type: string,
    url: string
}

export interface EditPhone {
    id: null | number,
    number: string,
}

export interface EditDataProduct {
    id: string | null,
    title: string,
    title_uz: string,
    title_kr: string,
    title_ru: string,
    description: string,
    description_uz: string,
    description_kr: string,
    description_ru: string,
    price: string | null,
    image: null | string,
    code: string,
    measurement_type: string | null,
    quantity: string | null
}

export interface LocationPlace {
    id?: number;
    title: string;
    title_uz: string;
    title_kr: string;
    title_ru: string;
    address: string;
    address_uz: string;
    address_kr: string;
    address_ru: string;
    coordinates: {
        lat: number;
        long: number;
    };
    phones: string[];
    region: {
        id: 1;
        name: {
            ru: string;
            uz: string;
        };
        parent: null;
    };
    opened_at: string,
    closed_at: string,
    content_type_id: number;
}

export interface LocationPlaceData {
    id: string;
    title: string;
    title_uz: string;
    title_kr: string;
    title_ru: string;
    address: string;
    address_uz: string;
    address_kr: string;
    address_ru: string;
    closed_at: string;
    district: string;
    coordinates: {
        lat: number | null;
        lng: number | null;
    };
    coordinatesData: {
        lat: number | null;
        lng: number | null;
    },
    photo: string,
    phones: '';
    opened_at: string,
    region: string;
}

export interface Regions {
    id: number;
    name: {
        ru: string;
        uz: string;
    };
    parent: null | number;
}

export interface VersionControl {
    number: string,
    is_active: boolean,
    created_date: string,
    modified_date: string
}


export interface Products {
    id: number,
    title: {
        ru: string | null,
        uz: string | null
    },
    price: null | number,
    image: string | null,
    code: string
}

export interface Pages {
    id: number,
    text: {
        ru: string,
        uz: string,
    },
    type: string
}

// contacts
export interface Link {
    id: number,
    type: string,
    url: string,
    position: number
}

export interface EditCreate {
    id: number | null,
    title: string,
    description: string,
}

export interface Phones {
    id: number,
    number: string,
    position: number
}

export interface editSms {
    id: number | null,
    title: '',
    title_ru: '',
    title_kr: '',
    title_uz: '',
    description: '',
    description_ru: '',
    description_uz: '',
    description_kr: '',
}


export interface RetseptCategory {
    id: number | null;
    name: string;
    name_uz: string;
    name_ru: string;
    name_kr: string;
}

export interface Splash {
    id: null | number,
    title_ru: string,
    title_uz: string,
    title_kr: string,
    color: string,
    image: null | string,
    version: string,
    is_active: boolean,
}

export interface QuantityType {
    id: number | null;
    title: string,
    title_ru: string,
    title_uz: string,
    title_kr: string,
    unique_name: string
}

export interface District {
    id: number | null;
    name: string;
    name_uz: string;
    name_ru: string;
    name_kr: string;
    parent: {
        id: number;
        name: string
    }
}

export interface EditDistrict {
    id: number | null;
    name: string;
    name_uz: string;
    name_ru: string;
    name_kr: string;
    parent: any
}

export interface ErrorMessage {
    status_code: number;
    message: string;
    message_ru: string;
    message_kr: string;
    message_uz: string;
}

export interface IProductCategories {

}
