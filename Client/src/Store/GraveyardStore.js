import create from "zustand";
import { persist } from "zustand/middleware"

export const useGraveYardStore = create(persist(
    (set) => ({
        selectedGraveYard: null,
        setSelectedGraveYard: (payload) => set(() => ({ selectedGraveYard: payload }))
    }),
    {
        name: "graveYard-storage",
        getStorage: () => sessionStorage,
    }
))