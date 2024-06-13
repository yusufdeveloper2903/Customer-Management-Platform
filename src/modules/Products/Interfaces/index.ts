export interface EditDataFirst {
    id: number | null,
    title_ru: string,
    title_uz: string,
    title_kr: string,
    status: string

}

export interface EditDataSecond {
    id: number | null,
    status: string,
    category: string,
    product: string,
    has_discount: boolean,
    title_ru: string,
    title_uz: string,
    title_kr: string,
    discount_percentage: number,
    price: string
}