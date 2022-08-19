import create from "zustand";
import { persist } from "zustand/middleware";

export const useMaticUsdPrice = create(persist(
    (set, get) => ({
        USDRate: 0,
        setUSDRate: (payload) => set(() => ({ USDRate: payload }))
    }),
    {
        name: "usd-rate-storage",
        getStorage: () => sessionStorage,
    }
))