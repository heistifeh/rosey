import { LOGINAPI } from "./axios-config";

type SignInPayload = {
  email: string;
  password: string;
  [key: string]: unknown;
};

type SignUpPayload = {
  email: string;
  password: string;
  [key: string]: unknown;
};

export const apiBuilder = {
  auth: {
    signIn: (data: SignInPayload) =>
      LOGINAPI.post("/token?grant_type=password", data).then(
        (response) => response.data
      ),
    signUp: (data: SignUpPayload) =>
      LOGINAPI.post("/signup", data).then((response) => response.data),
  },
};
