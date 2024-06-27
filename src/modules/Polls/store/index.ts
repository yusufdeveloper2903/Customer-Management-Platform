import {defineStore} from "pinia";
import $axios from "@/plugins/axios";
import {Results, PollsHeaders, QuestionPoll} from "../interfaces";


export default defineStore("polls", {
    state: () => {
        return {
            PollsList: {
                count: 0,
                results: [] as PollsHeaders[],
            } as Results<PollsHeaders>,
            questionsPolls: {
                data: {
                    count: 0,
                    results: [

                    ] as QuestionPoll[]
                } as Results<QuestionPoll>,
            },
            questionsPollsId: {
                data: []
            },
            contentButtonTypeList: {
                results: []
            },
            questionsPollsCard: {}
        };
    },
    actions: {


        //GET REQUEST
        async getPollsList(params: any) {
            const {data} = await $axios.get("/knowledge_base/poll/", {params})
            this.PollsList = data
        },

        async getQuestionPolls(params: any) {
            const {data} = await $axios.get('/knowledge_base/poll_question/', {params})
            this.questionsPolls = data
        },
        async getQuestionPollsId(id: any) {
            const {data} = await $axios.get(`/knowledge_base/poll_question/${id}`,)
            this.questionsPollsId = data
        },

        //CREATE REQUEST
        createPolls(data: any) {
            return $axios.post("/knowledge_base/poll/", data);
        },
        createSectionQuestion(data: any) {
            return $axios.post("/knowledge_base/poll_question/", data);
        },


        //PATCH REQUEST
        updatePolls(data: any) {
            return $axios.patch(`/knowledge_base/poll/${data.id}/`, data);
        },
        updatePollsQuestion(data: any) {
            return $axios.patch(`/knowledge_base/poll_question/${data.id}/`, data);
        },


        //DELETE REQUEST
        deletePolls(id: number | null) {
            return $axios.delete(`/knowledge_base/poll/${id}/`);
        },
        deletePollsQuestion(id: number | null) {
            return $axios.delete(`/knowledge_base/poll_question/${id}/`);
        },


        async getQuestionPollsCard(params) {
            const {data} = await $axios.get(`/knowledge_base/poll_card/`, {params})
            this.questionsPollsCard = data.data
        },
    },
});
