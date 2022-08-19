import { useMutation } from "@tanstack/react-query"
import axios from "axios";
import { BASE_URL, CANCEL_EVENT } from "../../Utils/serviceURLConfig";

const cancelEvent = (id) => {
    return axios({
        method: 'post',
        url: `${BASE_URL}/${CANCEL_EVENT}`,
        data: id
    });
}

export const useCancelEvent = () => {
    return useMutation(cancelEvent)
}