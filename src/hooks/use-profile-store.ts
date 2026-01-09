import { useState, useCallback } from "react";

const STORAGE_KEYS = {
    general: "profile_setup_general",
    profile: "profile_setup_details",
    rates: "profile_setup_rates",
    availability: "profile_setup_availability",
} as const;

type Step = keyof typeof STORAGE_KEYS;

export function useProfileStore() {
    const saveData = useCallback((step: Step, data: any) => {
        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEYS[step], JSON.stringify(data));
        }
    }, []);

    const getData = useCallback((step: Step) => {
        if (typeof window !== "undefined") {
            const data = localStorage.getItem(STORAGE_KEYS[step]);
            return data ? JSON.parse(data) : null;
        }
        return null;
    }, []);

    const getAllData = useCallback(() => {
        if (typeof window !== "undefined") {
            return {
                ...getData("general"),
                ...getData("profile"),
                ...getData("rates"),
                ...getData("availability"),
            };
        }
        return {};
    }, [getData]);

    const clearData = useCallback(() => {
        if (typeof window !== "undefined") {
            Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
        }
    }, []);

    return {
        saveData,
        getData,
        getAllData,
        clearData,
    };
}
