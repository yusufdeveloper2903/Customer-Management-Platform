export interface EditDataFirst {
    id: number | null,
    title_ru: string,
    title_uz: string,
    title_kr: string,
    is_active: boolean

}

export interface EditDataSecond {
    id: number | null,
    is_active: boolean,
    category: string,
    product: string,
    has_discount: string,
    title_ru: string,
    title_uz: string,
    title_kr: string,
    discount_percentage: string,
    price: string
}