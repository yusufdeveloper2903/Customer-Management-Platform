//IMPORTED FILES
import {defineStore} from "pinia";
import {UserDetail, UsersResults} from "../interfaces/index";


//EXPORT DEFAULT
export default defineStore("users", {
    state: () => {
        return {
            userDetail: {} as UserDetail,
            usersList: {
                count: 30,
                results: [
                    {
                        "id": 1,
                        "name": "John Doe",
                        "age": 30,
                        "username": "johndoe",
                        "email": "john.doe@example.com",
                        "phone": "555-123-4567",
                        "hobbies": ["Reading", "Gaming"]
                    },
                    {
                        "id": 2,
                        "name": "Jane Smith",
                        "age": 25,
                        "username": "janesmith",
                        "email": "jane.smith@example.com",
                        "phone": "555-987-6543",
                        "hobbies": ["Painting", "Traveling"]
                    },
                    {
                        "id": 3,
                        "name": "Michael Johnson",
                        "age": 40,
                        "username": "michaeljohnson",
                        "email": "michael.johnson@example.com",
                        "phone": "555-456-7890",
                        "hobbies": ["Sports", "Writing"]
                    },
                    {
                        "id": 4,
                        "name": "Emily Johnson",
                        "age": 28,
                        "username": "emilyjohnson",
                        "email": "emily.johnson@example.com",
                        "phone": "555-789-0123",
                        "hobbies": ["Photography", "Gardening"]
                    },
                    {
                        "id": 5,
                        "name": "Michael Brown",
                        "age": 35,
                        "username": "michaelbrown",
                        "email": "michael.brown@example.com",
                        "phone": "555-234-5678",
                        "hobbies": ["Cooking", "Sports"]
                    },
                    {
                        "id": 6,
                        "name": "Sophia Lee",
                        "age": 22,
                        "username": "sophialee",
                        "email": "sophia.lee@example.com",
                        "phone": "555-678-9012",
                        "hobbies": ["Reading", "Writing"]
                    },
                    {
                        "id": 7,
                        "name": "John Smith",
                        "age": 28,
                        "username": "john.smith",
                        "email": "john.smith@example.com",
                        "phone": "555-678-9012",
                        "hobbies": ["Reading", "Playing Soccer"]
                    },
                    {
                        "id": 8,
                        "name": "Emma Johnson",
                        "age": 25,
                        "username": "emma.johnson",
                        "email": "emma.johnson@example.com",
                        "phone": "555-890-1234",
                        "hobbies": ["Photography", "Yoga"]
                    },
                    {
                        "id": 9,
                        "name": "Sophia Adams",
                        "age": 35,
                        "username": "sophia.adams",
                        "email": "sophia.adams@example.com",
                        "phone": "555-789-2345",
                        "hobbies": ["Hiking", "Cooking"]
                    },
                    {
                        "id": 10,
                        "name": "Emma Wilson",
                        "age": 27,
                        "username": "emmawilson",
                        "email": "emma.wilson@example.com",
                        "phone": "555-234-5678",
                        "hobbies": ["Cooking", "Writing"]
                    },
                    {
                        "id": 11,
                        "name": "Liam Martinez",
                        "age": 32,
                        "username": "liammartinez",
                        "email": "liam.martinez@example.com",
                        "phone": "555-678-9012",
                        "hobbies": ["Gaming", "Photography"]
                    },
                    {
                        "id": 12,
                        "name": "Ava Lee",
                        "age": 24,
                        "username": "avalee",
                        "email": "ava.lee@example.com",
                        "phone": "555-901-2345",
                        "hobbies": ["Reading", "Sports"]
                    },
                    {
                        "id": 13,
                        "name": "Noah Johnson",
                        "age": 31,
                        "username": "noahjohnson",
                        "email": "noah.johnson@example.com",
                        "phone": "555-345-6789",
                        "hobbies": ["Traveling", "Cooking"]
                    },
                    {
                        "id": 14,
                        "name": "Isabella Brown",
                        "age": 28,
                        "username": "isabellabrown",
                        "email": "isabella.brown@example.com",
                        "phone": "555-678-9012",
                        "hobbies": ["Painting", "Reading"]
                    },
                    {
                        "id": 15,
                        "name": "Ethan Lee",
                        "age": 29,
                        "username": "ethanlee",
                        "email": "ethan.lee@example.com",
                        "phone": "555-901-2345",
                        "hobbies": ["Photography", "Sports"]
                    },
                    {
                        "id": 16,
                        "name": "Sophia Wilson",
                        "age": 26,
                        "username": "sophiawilson",
                        "email": "sophia.wilson@example.com",
                        "phone": "555-234-5678",
                        "hobbies": ["Reading", "Writing"]
                    },
                    {
                        "id": 17,
                        "name": "Michael Martinez",
                        "age": 34,
                        "username": "michaelmartinez",
                        "email": "michael.martinez@example.com",
                        "phone": "555-678-9012",
                        "hobbies": ["Gaming", "Photography"]
                    }, {
                        "id": 18,
                        "name": "Olivia Lee",
                        "age": 23,
                        "username": "olivialee",
                        "email": "olivia.lee@example.com",
                        "phone": "555-901-2345",
                        "hobbies": ["Painting", "Dancing"]
                    }, {
                        "id": 19,
                        "name": "Liam Johnson",
                        "age": 29,
                        "username": "liamjohnson",
                        "email": "liam.johnson@example.com",
                        "phone": "555-234-5678",
                        "hobbies": ["Cooking", "Sports"]
                    }, {
                        "id": 20,
                        "name": "Isabella Wilson",
                        "age": 24,
                        "username": "isabellawilson",
                        "email": "isabella.wilson@example.com",
                        "phone": "555-678-9012",
                        "hobbies": ["Painting", "Reading"]
                    }, {
                        "id": 21,
                        "name": "Isabella Rodriguez",
                        "age": 29,
                        "username": "isabella.rodriguez",
                        "email": "isabella.rodriguez@example.com",
                        "phone": "555-345-6789",
                        "hobbies": ["Traveling", "Reading"]
                    }, {
                        "id": 22,
                        "name": "Ava Johnson",
                        "age": 31,
                        "username": "avajohnson",
                        "email": "ava.johnson@example.com",
                        "phone": "555-234-5678",
                        "hobbies": ["Reading", "Writing"]
                    }, {
                        "id": 23,
                        "name": "Noah Brown",
                        "age": 30,
                        "username": "noahbrown",
                        "email": "noah.brown@example.com",
                        "phone": "555-678-9012",
                        "hobbies": ["Gaming", "Photography"]
                    }, {
                        "id": 24,
                        "name": "Emma Lee",
                        "age": 25,
                        "username": "emmalee",
                        "email": "emma.lee@example.com",
                        "phone": "555-901-2345",
                        "hobbies": ["Painting", "Dancing"]
                    }, {
                        "id": 25,
                        "name": "William Wilson",
                        "age": 29,
                        "username": "williamwilson",
                        "email": "william.wilson@example.com",
                        "phone": "555-234-5678",
                        "hobbies": ["Cooking", "Sports"]
                    }, {
                        "id": 26,
                        "name": "Olivia Martinez",
                        "age": 27,
                        "username": "oliviamartinez",
                        "email": "olivia.martinez@example.com",
                        "phone": "555-678-9012",
                        "hobbies": ["Painting", "Reading"]
                    },
                    {
                        "id": 27,
                        "name": "James Lee",
                        "age": 32,
                        "username": "jameslee",
                        "email": "james.lee@example.com",
                        "phone": "555-901-2345",
                        "hobbies": ["Reading", "Photography"]
                    },
                    {
                        "id": 28,
                        "name": "Sophia Johnson",
                        "age": 26,
                        "username": "sophiajohnson",
                        "email": "sophia.johnson@example.com",
                        "phone": "555-234-5678",
                        "hobbies": ["Reading", "Writing"]
                    },
                    {
                        "id": 29,
                        "name": "Emily Davis",
                        "age": 30,
                        "username": "emily.davis",
                        "email": "emily.davis@example.com",
                        "phone": "555-890-1234",
                        "hobbies": ["Drawing", "Hiking"]
                    },
                    {
                        "id": 30,
                        "name": "Lucas Smith",
                        "age": 31,
                        "username": "lucassmith",
                        "email": "lucas.smith@example.com",
                        "phone": "555-901-2345",
                        "hobbies": ["Gaming", "Photography"]
                    }
                ]
            } as UsersResults

        };
    },
});
