// import { toast.error } from "./notification-handler";

"use client";

import { toast } from "react-hot-toast";

type MaybeRecord = Record<string, unknown>;

export type ErrorType = {
  response?: {
    data?: MaybeRecord | string;
    status: number;
  };
  message: string;
};

const shouldSkipKey = (key?: string) => {
  if (!key) return false;
  return /code|status|id$/i.test(key);
};

const gatherMessages = (
  value: unknown,
  container: string[],
  key?: string,
) => {
  if (value === null || value === undefined) return;

  if (typeof value === "string") {
    if (!shouldSkipKey(key)) {
      container.push(value);
    }
    return;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    if (!shouldSkipKey(key)) {
      container.push(String(value));
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => gatherMessages(item, container));
    return;
  }

  if (typeof value === "object") {
    Object.entries(value as MaybeRecord).forEach(([entryKey, entryValue]) => {
      const priorityKeys = [
        "message",
        "msg",
        "error",
        "error_description",
        "detail",
      ];
      if (
        priorityKeys.includes(entryKey.toLowerCase()) &&
        typeof entryValue === "string"
      ) {
        if (!shouldSkipKey(entryKey)) {
          container.push(entryValue);
          return;
        }
      }
      gatherMessages(entryValue, container, entryKey);
    });
  }
};

const showBackendMessages = (responseData?: MaybeRecord | string) => {
  const messages: string[] = [];

  if (typeof responseData === "string") {
    messages.push(responseData);
  } else if (responseData && typeof responseData === "object") {
    gatherMessages(responseData, messages);
  }

  if (messages.length) {
    messages.forEach((msg) => toast.error(msg));
    return true;
  }
  return false;
};

export const errorMessageHandler = (obj: ErrorType) => {
  if (obj.response) {
    if (obj.response.status === 401) {
      return (location.href = "/");
    }

    if (obj.response.status === 500) {
      if (showBackendMessages(obj.response.data)) {
        return;
      }
      const fallback =
        typeof obj.response.data === "object"
          ? obj.response.data?.message
          : null;
      if (fallback) return toast.error(String(fallback));
      return toast.error("Something went wrong on the server.");
    }

    if (obj.response.status === 404) {
      return toast.error(
        "Page not found, Please contact the site administrator",
      );
    }

    if (showBackendMessages(obj.response.data)) {
      return;
    }

    const data = obj.response.data;
    if (typeof data === "object" && data && "message" in data) {
      const message = (data as MaybeRecord).message;
      if (typeof message === "string") {
        toast.error(message);
        return;
      }
    }

    toast.error(obj.message);
    return;
  }

  toast.error(obj.message);
};
