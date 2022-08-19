import create from "zustand";
import { persist } from "zustand/middleware";

export const useGraveStore = create(persist(
    (set, get) => ({
        selectedGrave: null,
        setSelectedGrave: (payload) => set(() => ({ selectedGrave: payload }))
    }),
    {
        name: "grave-storage",
        getStorage: () => sessionStorage,
    }
))