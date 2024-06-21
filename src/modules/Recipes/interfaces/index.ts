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

export interface RecipeDetail {
    id: number | null;
    title: string;
    category: number | null;
    rating: string;
    calorie: number;
    preparation_time: string;
    is_active: boolean;
    media_files: string | null;
}

export interface RecipeDetailEdit {
    id: number | null;
    title: string;
    category: number | null;
    rating: string;
    calorie: number;
    preparation_time: string;
    is_active: boolean;
    title_kr: string,
  title_uz: string,
  title_ru: string,
}

export interface Ingredient {
    id: number | null;
    product: number | null 
    unit_of_measure: number | null
    food: number | null,
    discount: number | null
}

export interface Preparation {
    id: number | null;
    index: number | null;
    description: string;
    description_uz: string;
    description_ru: string;
    description_kr: string;
    food: number | null
}

export interface EditPreparation {
    id: number | null;
    description: string;
    description_uz: string;
    description_ru: string;
    description_kr: string;
    food: number | null
}


