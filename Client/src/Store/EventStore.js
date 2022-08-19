import create from "zustand";
import { persist } from "zustand/middleware";

export const useEventStore = create(persist(
    (set, get) => ({
        selectedEvent: null,
        setSelectedEvent: (payload) => set(() => ({ selectedEvent: payload }))
    }),
    {
        name: "event-storage",
        getStorage: () => sessionStorage,
    }
))