export interface storiesHeaders {
    id: number | null,
    subtitle: string,
    subtitle_uz: string,
    subtitle_kr: string,
    subtitle_ru: string,
    start_date: string,
    end_date: string,
    is_active: false,
    avatar: string | null
}

export interface Results<T> {
    count: number;
    next: number | null;
    previous: number | null;
    results: T[];
}