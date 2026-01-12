"use client";

import { useCallback } from "react";

const STORAGE_KEY = "profile-setup-progress";

type SectionData = Record<string, unknown>;
type StoreSchema = Record<string, SectionData>;

const safeParse = (value: string | null) => {
  if (!value) {
    return {};
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.error("Failed to parse profile store data", error);
    return {};
  }
};

const readStore = () => {
  if (typeof window === "undefined") {
    return {};
  }

  return safeParse(window.localStorage.getItem(STORAGE_KEY));
};

const writeStore = (value: StoreSchema) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch (error) {
    console.error("Failed to write profile store data", error);
  }
};

export function useProfileStore() {
  const getStore = useCallback(() => readStore(), []);

  const saveData = useCallback(
    (section: string, data: SectionData) => {
      const store = getStore();
      const existingSection = (store as StoreSchema)[section] ?? {};
      const updatedSection = { ...existingSection, ...data };
      const updatedStore = { ...(store as StoreSchema), [section]: updatedSection };
      writeStore(updatedStore);
    },
    [getStore]
  );

  const getData = useCallback(
    (section: string) => {
      const store = getStore();
      return (store as StoreSchema)[section] ?? null;
    },
    [getStore]
  );

  const getAllData = useCallback(() => {
    const store = getStore();
    return Object.values((store as StoreSchema) ?? {}).reduce(
      (acc, section) => ({ ...acc, ...section }),
      {}
    );
  }, [getStore]);

  const clearData = useCallback(() => {
    writeStore({});
  }, []);

  return { saveData, getData, getAllData, clearData };
}
