export interface Results<T> {
    count: number;
    next: number | null;
    previous: number | null;
    results: T[];
}

export interface EditDataNews {
    id: number | null,
    title: string,
    title_uz: string,
    title_ru: string,
    title_kr: string,
    file: string,
    start_time: string,
    status: string
}

export interface NewsData {
    start_time: any;
    url: string | null;
    status: string | null,
    title_ru: string,
    title_uz: string,
    title_kr: string,
    title: string,
    description_ru: string,
    description_uz: string,
    description_kr: string,
    description: string,
    photo: string | null,
    receivers: number[],
    template: object | null,
    enable_push_notify: boolean
}

export interface SmsSendingData {
    start_time: string | null;
    template: {
        id: number | null;
        title: string
        description: string
    } | null
    description: string
    receivers: number[]
    title: string
}

export interface EditData {
    id: number | null,
    title: string,
    title_uz: string,
    title_ru: string,
    title_kr: string,
    start_time: string,
}


export interface News {
    id: number;
    start_time: string;
    title: string,
    title_uz: string,
    title_ru: string,
    title_kr: string,
    description: string;
    description_uz: string;
    description_ru: string;
    description_kr: string;
    file: string | null;
    url_title: null | string,
    url: string | null,
    enable_push_notify: boolean;
    template: {
        id: number;
        title: string,
        title_ru: string,
        title_uz: string,
        title_kr: string,
        description: string,
        description_ru: string,
        description_uz: string,
        description_kr: string,
        file: string | null;
        url: string | null;
    }
    status: null | string
}

export interface SmsSending {
    id: number;
    start_time: string | null
    title: string,
    description: string;
    template: {
        id: number;
        title: string
        description: string
    }
    status: {
        id: number;
        title: {
            ru: string | null;
            uz: string | null
        }
        unique_name: string
    }
}

export interface Reseivers {
    id: number;
    full_name: string | null;
    phone: string | null;
    created_date: string | null;
    last_login: string | null;
    is_active: boolean
}

export interface Status {
    id: number;
    title: {
        ru: string | null;
        uz: string | null
    }
    unique_name: string
}