import { useMutation } from "@tanstack/react-query"
import axios from "axios";
import { BASE_URL, CREATE_EVENT } from "../../Utils/serviceURLConfig";

const createEvent = (eventReqJson) => {
    return axios({
        method: 'post',
        url: `${BASE_URL}/${CREATE_EVENT}`,
        data: eventReqJson
    });
}

export const useCreateEvent = () => {
    return useMutation(createEvent)
}