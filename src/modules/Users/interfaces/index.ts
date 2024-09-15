export interface UsersResults {
    count: number;
    results: {
        id: number,
        name: string,
        age: number | null,
        email: string,
        phone: string,
        hobbies: string[],
        username: string,
    }[];
}

export interface UserAdd {
    id: number,
    name: string,
    age: number | null,
    email: string,
    phone: string,
    hobbies: string[],
    username: string,
}

export interface UserDetail {
    id: number,
    name: string,
    age: number | null,
    email: string,
    phone: string,
    hobbies: string[],
    username: string,
}

