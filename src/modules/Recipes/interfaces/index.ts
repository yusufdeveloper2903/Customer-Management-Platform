export interface Results<T> {
    count: number;
    next: number | null;
    previous: number | null;
    results: T[];
}

export interface Params {
    page?: number;
    page_size?: number;
    search?: string;
}

export interface Retsept {
    id: number | null,
    title: string,
    title_uz: string,
    title_ru: string,
    title_kr: string,
    rating: string,
    calorie: number,
    preparation_time: string,
    is_active: boolean,
    category: number | null
}
