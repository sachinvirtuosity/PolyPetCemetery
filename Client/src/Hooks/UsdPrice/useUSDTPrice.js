import { useMutation } from "@tanstack/react-query"
import axios from "axios";

const getMaticUsdtPrice = () => {
    return axios({
        method: 'get',
        url: `https://www.binance.com/api/v3/ticker/price?symbol=MATICUSDT`,
    });
}

export const useUSDTPrice = () => {
    return useMutation(getMaticUsdtPrice)
}