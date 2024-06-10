export interface PollsHeaders {
    id: string | number | null,
    name: string,
    status: string,
    count_question: number | null,
    modified_date: string,
    created_date: string,
    is_active: false,
}

export interface QuestionPoll {
    "id": number,
    "background": string,
    "background_uz": string,
    "background_ru": string,
    "background_kr": string,
    "question_type": string,
    "title": string,
    "title_kr": string,
    "title_ru": string,
    "title_uz": string,
    "options": object
}

export interface EditData {
    id: string | null,
    name: string | null,
    status: string | null,
}

export interface Results<T> {
    count: number;
    next: number | null;
    previous: number | null;
    results: T[];
}