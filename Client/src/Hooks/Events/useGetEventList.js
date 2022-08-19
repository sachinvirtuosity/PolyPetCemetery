import { useQuery } from "@tanstack/react-query"
import axios from "axios";
import { BASE_URL, EVENT_LIST } from "../../Utils/serviceURLConfig";

const getEventList = async (status) => {
    const { data } = await axios({
        method: 'get',
        url: `${BASE_URL}/${EVENT_LIST}?status=${status}`
    });
    return data
}

export const useGetEventList = (status) => {
    return useQuery(['getEventList', status], () => getEventList(status),
        {
            refetchOnWindowFocus: false
        })
}