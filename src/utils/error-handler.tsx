// import { toast.error } from "./notification-handler";

import { toast } from "react-hot-toast";

export type ErrorType = {
  response?: {
    data?: { data?: {}; message: any; error?: {} | string[]; errors?: {} };
    status: number;
  };
  message: string;
};
export const errorMessageHandler = (obj: ErrorType) => {
  if (obj.response) {
    if (obj.response.status === 401) {
      return (location.href = "/");
    }
    if (obj.response.status === 500) {
      if (
        obj?.response?.data?.error &&
        typeof obj?.response?.data?.error === "string"
      ) {
        return toast.error(obj?.response?.data?.error);
      }
      return toast.error(obj?.response?.data?.message);
    }
    if (obj.response.status === 404) {
      return toast.error(
        "Page not found, Please contact the site administrator"
      );
    }
    const data = obj?.response?.data?.data;
    const errors = obj?.response?.data?.errors;
    const message = obj?.response?.data?.message;

    if (data && !message) {
      if (typeof data === "object")
        Object.entries(data)?.map((item: any[], idx) => {
          if (item[1].length > 1) {
            item[1].forEach((el: string) => toast.error(el));
          } else {
            toast.error(item[1]);
          }
        });
    } else if (obj?.response?.data?.error) {
      const error = obj.response.data.error;
      if (typeof error !== "boolean") {
        if (Array.isArray(error)) {
          return error.forEach((el) => {
            if (typeof el === "object") {
              Object.entries(el).forEach(([k, v]) => {
                toast.error(`${k}: ${v}`);
              });
            } else if (typeof el === "string") {
              toast.error(el);
            }
          });
        }
        return toast.error(String(error));
      }
      if (obj.response.data.message) {
        return toast.error(String(obj.response.data.message));
      }
      if (typeof error === "string") {
        return toast.error(error);
      }
      if (Array.isArray(error))
        return error.forEach((el) => {
          if (typeof el === "object") {
            Object.entries(el).forEach(([k, v]) => {
              toast.error(`${k}: ${v}`);
            });
          } else toast.error(el);
        });
      Object.entries(error).map((item: any[], idx) => {
        if (item[1].length > 1) {
          item[1].forEach((el: any) => {
            if (typeof el === "string") {
              toast.error(el);
            } else if (typeof el === "object") {
              Object.entries(el).map((item: any[], idx) => {
                toast.error(item[1]);
              });
            }
          });
        } else {
          toast.error(item[1]);
        }
      });
    } else if (errors) {
      if (typeof errors === "object") {
        Object.entries(errors)?.forEach(([k, v]) => {
          if (typeof v === "string") toast.error(v);
          else if (Array.isArray(v)) {
            v?.forEach((el) => {
              if (typeof el === "string") {
                toast.error(el);
              } else if (typeof el === "object" && !Array.isArray(el)) {
                Object.entries(el).forEach(([key, val]) => {
                  if (key === "message") {
                    if (typeof val === "string") {
                      toast.error(val);
                    }
                  }
                });
              }
            });
          }
        });
      }
      if (typeof errors === "string") toast.error(errors);
    } else if (obj?.response.data?.message) {
      if (typeof message === "string") {
        toast.error(message);
      }
    }
  } else toast.error(obj.message);
};
