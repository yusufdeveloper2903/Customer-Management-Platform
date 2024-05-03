export interface storiesHeaders {
    id: string | number | null,
    subtitle: string,
    subtitle_uz: string,
    subtitle_kr: string,
    subtitle_ru: string,
    start_date: string,
    end_date: string,
    is_active: false,
    avatar: string | null
}

export interface storiesDetailHeaders {
    "story_id": number,
    "is_active": boolean,
    "background": string,
    "background_uz": string,
    "background_ru": string,
    "background_kr": string,
    "object_id": number | null,
    "content_type": number | null,
    "button_name": string | null,
    "button_name_uz": string | null,
    "button_name_ru": string | null,
    "button_name_kr": string | null,
    "button_type": string | null,
    "button_url": string | null,
    "is_button": boolean,
    "duration": number | null,
}

export interface EditData {
    id: number | null,
    duration: string | null,
    button_name: string | null,
    button_name_uz: string | null,
    button_name_kr: string | null,
    button_name_ru: string | null,
    button_type: string | null,
    button_url: string | null,
    is_button: boolean,
    is_active: boolean,
    object_id: number | null,
    story: number | null,
    content_type: number | null,
    background: string,
    background_uz: string | null,
    background_kr: string | null,
    background_ru: string | null,
}

export interface Results<T> {
    count: number;
    next: number | null;
    previous: number | null;
    results: T[];
}