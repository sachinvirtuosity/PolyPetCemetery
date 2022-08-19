import create from "zustand";
import { persist } from "zustand/middleware"

export const useWalletStore = create(persist(
    (set, get) => ({
        walletId: '',
        setWalletId: (payload) => set(() => ({ walletId: payload })),
        resetWalletId: () => set({ walletId: '' }),
    }),
    {
        name: "wallet-storage",
        getStorage: () => sessionStorage,
    }
))