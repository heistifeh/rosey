import {
  LOGINAPI,
  API,
  setAuthCookie,
  clearAuthCookie,
  getAccessToken,
  getAuthData,
  getUserId,
  getStoredUser,
} from "./axios-config";
import axios from "axios";
import {
  SignInPayload,
  SignUpPayload,
  Profile,
  Account,
  AvailableNowItem,
} from "@/types/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const DEFAULT_SUPABASE_URL = "https://axhkwqaxbnsguxzrfsfj.supabase.co";

const trimTrailingSlash = (value?: string) => value?.replace(/\/$/, "");

const baseFromAuth = (value?: string) => value?.replace(/\/auth\/v1\/?$/, "");

const SUPABASE_URL =
  trimTrailingSlash(process.env.NEXT_PUBLIC_SUPABASE_URL) ||
  trimTrailingSlash(baseFromAuth(process.env.NEXT_PUBLIC_BASE_URL)) ||
  DEFAULT_SUPABASE_URL;

const STORAGE_BASE = `${SUPABASE_URL}/storage/v1`;

const humanizeSlug = (value?: string | null) => {
  if (!value) return undefined;
  return value
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
};

const PROFILE_SELECT =
  "id,user_id,working_name,username,tagline,base_hourly_rate,base_currency,body_type,ethnicity_category,available_days,city,state,country,city_slug,country_slug,approval_status,verification_photo_verified,id_verified,min_photos_verified,profile_fields_verified,verified_at,verification_notes,is_fully_verified,images(public_url,is_primary), about,pronouns,languages,caters_to,age,height_cm,hair_color,eye_color,gender,gender_presentation,profile_type,trans_status,appear_on_other_profiles,trans_only,temporary_hide_days,onboarding_completed,contact_email,contact_phone,socials";
const SEARCH_PROFILE_SELECT =
  "id,working_name,username,tagline,base_hourly_rate,base_currency,body_type,ethnicity_category,available_days,city,state,country,city_slug,country_slug,approval_status,is_fully_verified,images!inner(public_url,is_primary)";

export const apiBuilder = {
  auth: {
    signIn: (data: SignInPayload) =>
      LOGINAPI.post("/token?grant_type=password", data).then((response) => {
        setAuthCookie(response.data);
        return response.data;
      }),
    signUp: (data: SignUpPayload) =>
      LOGINAPI.post("/signup", data).then((response) => response.data),
    signOut: async () => {
      try {
        await LOGINAPI.post("/logout");
      } catch (error) {
        // Clear local auth state even if the remote logout request fails/expired.
        if (!axios.isAxiosError(error) || error.response?.status !== 401) {
          console.error("Auth logout request failed", error);
        }
      } finally {
        clearAuthCookie();
      }
    },
    refreshSession: () => {
      const current = getAuthData();
      const refreshToken = current?.refresh_token;
      if (!refreshToken) {
        return Promise.reject(new Error("NO_REFRESH_TOKEN"));
      }

      return LOGINAPI.post("/token?grant_type=refresh_token", {
        refresh_token: refreshToken,
      }).then((response) => {
        setAuthCookie(response.data);
        return response.data;
      });
    },
    getCurrentUser: () => {
      const user = getStoredUser();
      const id = user?.id ?? getUserId();
      if (!id) {
        return Promise.resolve(null);
      }
      return Promise.resolve(user ?? { id });
    },
    // Hits Supabase Auth endpoint (POST /auth/v1/otp) - No custom backend required
    sendOtp: (data: {
      email?: string;
      phone?: string;
      type?: "signup" | "magiclink" | "recovery" | "invite" | "sms";
      create_user?: boolean;
    }) => {
      const payload = {
        type: data.type ?? "signup",
        create_user: data.create_user ?? false,
        ...data,
      };
      return LOGINAPI.post("/otp", payload).then((response) => response.data);
    },
    verifyOtp: (data: {
      email?: string;
      phone?: string;
      token: string;
      type: "sms" | "email" | "signup" | "magiclink";
    }) =>
      LOGINAPI.post("/verify", data).then((response) => {
        if (response.data?.access_token) {
          setAuthCookie(response.data);
        }
        return response.data;
      }),
    resendConfirmation: (email: string) =>
      LOGINAPI.post("/resend", { email, type: "signup" }).then(
        (response) => response.data
      ),
    updateUser: (metadata: { [key: string]: any }) => {
      return LOGINAPI.put("/user", { data: metadata }).then(
        (response) => {
          setAuthCookie(response.data); // Update cookie with new metadata
          return response.data;
        }
      );
    },
    // resetPassword: (email: string, redirectTo?: string) => {
    //   return LOGINAPI.post("/recover", {
    //     email,
    //     ...(redirectTo && {
    //       options: {
    //         redirectTo
    //       }
    //     }),
    //   }).then((response) => response.data);
    // },
    resetPassword: (email: string, redirectTo?: string) => {
      return LOGINAPI.post("/recover", {
        email,
        ...(redirectTo && {
          options: {
            redirectTo
          }
        }),
      }).then((response) => response.data);
    },

    updatePassword: (password: string) => {
      return LOGINAPI.put("/user", {
        password
      }).then((response) => {
        if (response.data?.access_token) {
          setAuthCookie(response.data);
        }
        return response.data;
      });
    },

    signInWithGoogle: async (redirectTo?: string) => {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          ...(redirectTo ? { redirectTo } : {}),
        },
      });

      if (error) {
        throw error;
      }

      return data;
    },

    updateUserMetadata: (data: Record<string, any>) => {
      return LOGINAPI.put("/user", {
        data
      }).then((response) => {
        const currentAuth = getAuthData();
        if (currentAuth?.access_token && response.data?.id) {
          setAuthCookie({
            ...currentAuth,
            user: response.data,
          });
        }
        return response.data;
      });
    },
  },
  locations: {
    getLocations: async (query: string) => {
      const safeQuery = query.replace(/[(),]/g, " ").trim();
      const params: Record<string, string | number> = {
        select: "country,state,city,country_slug,state_slug,city_slug",
        limit: 10,
      };
      if (safeQuery) {
        params.or = `(city.ilike.*${safeQuery}*,state.ilike.*${safeQuery}*,country.ilike.*${safeQuery}*)`;
      }

      try {
        const response = await API.get("/city_locations", { params });
        return response.data;
      } catch {
        const fallbackParams: Record<string, string | number> = {
          select: "country,city,country_slug,city_slug",
          limit: 10,
        };
        if (safeQuery) {
          fallbackParams.or = `(city.ilike.*${safeQuery}*,country.ilike.*${safeQuery}*)`;
        }
        return API.get("/city_locations", { params: fallbackParams }).then(
          (response) => response.data,
        );
      }
    },
  },
  profiles: {
    // getProfiles: (
    //   filters: {
    //     gender?: string;
    //     priceRange?: string;
    //     citySlug?: string;
    //     countrySlug?: string;
    //   } = {}
    // ) => {
    //   const { gender = "Female", priceRange, citySlug, countrySlug } = filters;

    //   const params = new URLSearchParams();
    //   params.append("select", "*");
    //   params.append("is_active", "eq.true");
    //   params.append("onboarding_completed", "eq.true");
    //   params.append("order", "created_at.desc");
    //   params.append("limit", "10");

    //   // Dynamic filters
    //   params.append("gender", `eq.${gender}`);

    //   if (citySlug) {
    //     params.append("city_slug", `eq.${citySlug}`);
    //   } else {
    //     params.append("city_slug", "eq.lagos");
    //   }

    //   if (countrySlug) {
    //     params.append("country_slug", `eq.${countrySlug}`);
    //   } else {
    //     // Default to Nigeria
    //     params.append("country_slug", "eq.nigeria");
    //   }

    //   if (priceRange) {
    //     const clean = priceRange.replace(/[\$\s]/g, "");
    //     if (clean.includes("-")) {
    //       const [min, max] = clean.split("-");
    //       params.append("base_hourly_rate", `gte.${min}`);
    //       params.append("base_hourly_rate", `lte.${max}`);
    //     } else if (clean.includes("+")) {
    //       const min = clean.replace("+", "");
    //       params.append("base_hourly_rate", `gte.${min}`);
    //     }
    //   } else {
    //     params.append("base_hourly_rate", "gte.100");
    //     params.append("base_hourly_rate", "lte.300");
    //   }

    //   params.append("caters_to", "cs.{Male}");

    // },

    getProfiles: (
      filters: {
        gender?: string;
        priceRange?: string;
        citySlug?: string;
        stateSlug?: string;
        countrySlug?: string;
        applyDefaults?: boolean;
      } = {},
    ) => {
      const {
        gender,
        priceRange,
        citySlug,
        stateSlug,
        countrySlug,
        applyDefaults = true,
      } = filters;

      const params = new URLSearchParams();
      params.append("select", PROFILE_SELECT);
      params.append("limit", "10");


      if (applyDefaults) {
        params.append("is_active", "eq.true");
        params.append("order", "created_at.desc");
      }

      if (gender && gender !== "All") {
        params.append("gender", `eq.${gender}`);
      }

      if (citySlug) {
        params.append("city_slug", `eq.${citySlug}`);
      }

      if (stateSlug) {
        const stateName = humanizeSlug(stateSlug) ?? stateSlug.replace(/-/g, " ");
        params.append("state", `ilike.*${stateName}*`);
      }

      if (countrySlug) {
        params.append("country_slug", `eq.${countrySlug}`);
      }

      if (priceRange) {
        const clean = priceRange.replace(/[\$\s]/g, "");
        if (clean.includes("-")) {
          const [min, max] = clean.split("-");
          params.append("base_hourly_rate", `gte.${min}`);
          params.append("base_hourly_rate", `lte.${max}`);
        } else if (clean.includes("+")) {
          const min = clean.replace("+", "");
          params.append("base_hourly_rate", `gte.${min}`);
        }
      }

      return API.get<Profile[]>("/profiles", { params }).then(
        (response) => response.data,
      );
    },
    searchProfiles: (paramsIn: {
      countrySlug?: string;
      citySlug?: string;
      stateSlug?: string;
      ethnicity?: string;
      gender?: string;
      minRate?: number;
      maxRate?: number;
      catersTo?: string | string[];
      availableNow?: boolean;
    }) => {
      const params = new URLSearchParams();

      const select = paramsIn.availableNow
        ? `${SEARCH_PROFILE_SELECT},ads!inner(status)`
        : SEARCH_PROFILE_SELECT;

      params.append("select", select);

      if (paramsIn.countrySlug) {
        params.append("country_slug", `eq.${paramsIn.countrySlug}`);
      }
      if (paramsIn.citySlug) {
        params.append("city_slug", `eq.${paramsIn.citySlug}`);
      }
      if (paramsIn.stateSlug) {
        const stateName =
          humanizeSlug(paramsIn.stateSlug) ?? paramsIn.stateSlug.replace(/-/g, " ");
        params.append("state", `ilike.*${stateName}*`);
      }

      if (paramsIn.availableNow) {
        params.append("ads.status", "eq.active");
        params.append("ads.placement_available_now", "eq.true");
      }

      // Organic discovery should only show unclaimed/scraped profiles.
      // Claimed/authenticated profiles appear via paid ads instead.
      params.append("user_id", "is.null");
      params.append("is_active", "eq.true");
      params.append("order", "created_at.desc");

      const gender =
        paramsIn.gender && paramsIn.gender !== "All" ? paramsIn.gender : null;
      if (gender) {
        params.append("gender", `eq.${gender}`);
      }

      const ethnicity =
        paramsIn.ethnicity && paramsIn.ethnicity !== "All"
          ? paramsIn.ethnicity
          : null;
      if (ethnicity) {
        params.append("ethnicity_category", `eq.${ethnicity}`);
      }

      if (
        typeof paramsIn.minRate === "number" &&
        !Number.isNaN(paramsIn.minRate)
      ) {
        params.append("base_hourly_rate", `gte.${paramsIn.minRate}`);
      }

      if (
        typeof paramsIn.maxRate === "number" &&
        !Number.isNaN(paramsIn.maxRate)
      ) {
        params.append("base_hourly_rate", `lte.${paramsIn.maxRate}`);
      }

      const catersToValue = Array.isArray(paramsIn.catersTo)
        ? paramsIn.catersTo.filter(Boolean).join(",")
        : paramsIn.catersTo;

      if (catersToValue) {
        params.append("caters_to", `cs.{${catersToValue}}`);
      }

      return API.get<Profile[]>("/profiles", { params }).then(
        (response) => response.data ?? [],
      );
    },
    getCityProfiles: (paramsIn: {
      citySlug: string;
      countrySlug: string;
      stateSlug?: string;
    }) => {
      const params = new URLSearchParams();
      params.append("select", PROFILE_SELECT);
      params.append("limit", "24");
      params.append("user_id", "is.null");
      params.append("is_active", "eq.true");
      params.append("city_slug", `eq.${paramsIn.citySlug}`);
      params.append("country_slug", `eq.${paramsIn.countrySlug}`);
      if (paramsIn.stateSlug) {
        const stateName =
          humanizeSlug(paramsIn.stateSlug) ?? paramsIn.stateSlug.replace(/-/g, " ");
        params.append("state", `ilike.*${stateName}*`);
      }

      return API.get<Profile[]>("/profiles", { params }).then(
        (response) => response.data ?? [],
      );
    },
    getProfileByUsername: (username: string) => {
      if (!username) return Promise.resolve(null);
      const params = new URLSearchParams();
      params.append("select", PROFILE_SELECT);
      params.append("username", `eq.${username}`);
      params.append("limit", "1");
      return API.get("/profiles", { params }).then(
        (response) => response.data?.[0] ?? null,
      );
    },
    verifyProfileContact: (
      email: string,
      phone: string,
      options?: { onlyUnclaimed?: boolean },
    ) => {
      const params = new URLSearchParams();
      params.append("select", "id,username,working_name,contact_email,contact_phone");

      const emailToCheck = email?.trim().toLowerCase();
      const phoneToCheck = phone?.trim();


      if (emailToCheck && phoneToCheck) {

        params.append(
          "or",
          `(contact_email.eq.${emailToCheck},contact_phone.eq.${phoneToCheck})`,
        );
      } else if (emailToCheck) {
        params.append("contact_email", `eq.${emailToCheck}`);
      } else if (phoneToCheck) {
        params.append("contact_phone", `eq.${phoneToCheck}`);
      } else {
        return Promise.resolve(null);
      }

      if (options?.onlyUnclaimed) {
        params.append("user_id", "is.null");
      }

      params.append("limit", "1");

      return API.get<Profile[]>("/profiles", { params }).then(
        (response) => response.data?.[0] ?? null
      ).catch(err => {
        console.error("Error verifying profile contact:", err);
        throw err;
      });
    },
    getProfileByUserId: (userId: string) => {
      if (!userId) return Promise.resolve(null);
      const params = new URLSearchParams();
      params.append("select", PROFILE_SELECT);
      params.append("user_id", `eq.${userId}`);
      params.append("limit", "1");
      return API.get("/profiles", { params }).then(
        (response) => response.data?.[0] ?? null,
      );
    },
    updateProfile: (id: string, data: any) =>
      API.patch(`/profiles?id=eq.${id}`, data, {
        headers: {
          Prefer: "return=representation",
        },
      }).then((response) => response.data),
    updateProfileByUserId: (userId: string, data: any) =>
      API.patch(`/profiles?user_id=eq.${userId}`, data).then(
        (response) => response.data,
      ),
    createProfile: (data: any) =>
      API.post(`/profiles?on_conflict=user_id`, data, {
        headers: {
          Prefer: "resolution=merge-duplicates, return=representation",
        },
      }).then((response) => response.data),
    createImage: (data: {
      profile_id: string;
      public_url: string;
      path: string;
      is_primary: boolean;
    }) =>
      API.post(`/images`, {
        profile_id: data.profile_id,
        public_url: data.public_url,
        path: data.path,
        is_primary: data.is_primary,
      }).then((response) => response.data),
    deleteImage: (imageId: string) =>
      API.delete(`/images?id=eq.${imageId}`).then((response) => response.data),
    // getProfileByUserId: (userId: string) => {
    //   const params = new URLSearchParams();
    //   params.append("select", "*");
    //   params.append("user_id", `eq.${userId}`);
    //   return API.get<Profile[]>(
    //     `https://axhkwqaxbnsguxzrfsfj.supabase.co/rest/v1/profiles?${params.toString()}`
    //   ).then((response) => response.data?.[0] ?? null);
    // },
    getMyProfile: () => {
      const userId = getUserId();
      if (!userId) {
        return Promise.resolve(null);
      }
      const params = new URLSearchParams();
      params.append("select", PROFILE_SELECT);
      params.append("user_id", `eq.${userId}`);
      params.append("limit", "1");
      return API.get<Profile[]>("/profiles", { params }).then(
        (response) => response.data?.[0] ?? null,
      );
    },
  },
  images: {
    listByProfile: (profileId: string) => {
      if (!profileId) {
        return Promise.resolve([]);
      }
      return API.get("/images", {
        params: {
          select: "id,profile_id,public_url,path,is_primary,created_at",
          profile_id: `eq.${profileId}`,
          order: "created_at.desc",
        },
      }).then((response) => response.data);
    },
    deleteImage: (id: string) =>
      API.delete(`/images?id=eq.${id}`).then((response) => response.data),
  },
  account: {
    getAccount: () => {
      const userId = getUserId();
      if (!userId) {
        return Promise.resolve<Account | null>(null);
      }
      const params = new URLSearchParams();
      params.append(
        "select",
        "id,user_id,two_factor_enabled,two_factor_method",
      );
      params.append("user_id", `eq.${userId}`);
      params.append("limit", "1");
      return API.get<Account[]>("/user_accounts", { params }).then(
        (response) => response.data?.[0] ?? null,
      );
    },
    updateAccount: (
      data: Partial<Pick<Account, "two_factor_enabled" | "two_factor_method">>,
    ) => {
      const userId = getUserId();
      if (!userId) {
        return Promise.resolve<Account | null>(null);
      }
      return API.patch<Account[]>(`/user_accounts?user_id=eq.${userId}`, data, {
        headers: {
          Prefer: "return=representation",
        },
      }).then((response) => response.data?.[0] ?? null);
    },
  },
  ads: {
    getAvailableNow: (gender?: string) => {
      const params = new URLSearchParams();

      params.append(
        "select",
        [
          "id,",
          "created_at,",
          "profile:profiles(",
          "id,",
          "username,",
          "working_name,",
          "gender,",
          "base_hourly_rate,",
          "base_currency,",
          "city,",
          "country,",
          "images(public_url,is_primary)",
          ")",
        ].join(""),
      );

      params.append("status", "eq.active");
      params.append("placement_available_now", "eq.true");

      if (gender && gender !== "All") {
        params.append("profile.gender", `eq.${gender}`);
      }

      params.append("order", "created_at.desc");
      params.append("limit", "12");

      return API.get<AvailableNowItem[]>("/ads", { params }).then(
        (response) => response.data ?? [],
      );
    },
    getMyAds: (profileId: string) => {
      if (!profileId) {
        return Promise.resolve([]);
      }
      return API.get("/ads", {
        params: {
          select:
            "id,title,status,start_at,end_at,budget_credits,spent_credits,placement_available_now,created_at,ad_city_targets(city_slug,state_slug,country_slug)",
          profile_id: `eq.${profileId}`,
          order: "created_at.desc",
        },
      }).then((response) => response.data);
    },
    getAdDailyStats: (adId: string, fromDate: string) => {
      if (!adId || !fromDate) {
        return Promise.resolve([]);
      }
      return API.get("/ad_daily_stats", {
        params: {
          select: "day,impressions,clicks",
          ad_id: `eq.${adId}`,
          day: `gte.${fromDate}`,
          order: "day.asc",
        },
      }).then((response) => response.data);
    },
    updateAdStatus: (adId: string, status: "active" | "paused" | "expired") => {
      if (!adId) {
        return Promise.resolve(null);
      }
      return axios
        .post("/api/ads/status", { adId, status })
        .then((response) => response.data?.ad ?? null);
    },
    getSponsoredProfilesForCity: (paramsIn: {
      citySlug: string;
      countrySlug: string;
      stateSlug?: string;
    }) => {
      const params = new URLSearchParams();
      params.append(
        "select",
        `profile:profiles(${PROFILE_SELECT}),ad_city_targets!inner(city_slug,state_slug,country_slug)`,
      );
      params.append("status", "eq.active");
      params.append("ad_city_targets.city_slug", `eq.${paramsIn.citySlug}`);
      params.append(
        "ad_city_targets.country_slug",
        `eq.${paramsIn.countrySlug}`,
      );
      if (paramsIn.stateSlug) {
        params.append("ad_city_targets.state_slug", `eq.${paramsIn.stateSlug}`);
      }

      return API.get<
        Array<{
          profile?: Profile | null;
          ad_city_targets?: {
            city_slug?: string | null;
            state_slug?: string | null;
            country_slug?: string | null;
          }[];
        }>
      >("/ads", {
        params,
      }).then((response) => {
        const rows = response.data ?? [];
        const unique = new Map<string, Profile>();

        rows.forEach((row) => {
          const profile = row?.profile;
          if (profile?.id && !unique.has(profile.id)) {
            const target = row.ad_city_targets?.[0];
            const citySlug = target?.city_slug ?? paramsIn.citySlug;
            const stateSlug = target?.state_slug ?? paramsIn.stateSlug ?? null;
            const countrySlug = target?.country_slug ?? paramsIn.countrySlug;

            unique.set(profile.id, {
              ...profile,
              city_slug: citySlug || profile.city_slug,
              ...(stateSlug ? { state_slug: stateSlug } : {}),
              country_slug: countrySlug || profile.country_slug,
              city: citySlug ? humanizeSlug(citySlug) : profile.city,
              country: countrySlug ? humanizeSlug(countrySlug) : profile.country,
              ...(stateSlug ? { state: humanizeSlug(stateSlug) } : {}),
            });
          }
        });

        return Array.from(unique.values());
      });
    },
    placeAd: (payload: {
      title: string;
      placement_available_now: boolean;
      cities: {
        country_slug: string;
        state_slug: string | null;
        city_slug: string;
      }[];
    }) =>
      axios.post("/api/ads/place", payload).then((response) => response.data),
  },
  reviews: {
    createReview: (data: {
      profile_id: string;
      client_id: string;
      rating: number;
      title: string;
      body: string;
    }) =>
      API.post("/profile_reviews", data).then((response) => response.data),

    getReviews: (profileId: string) => {
      if (!profileId) return Promise.resolve([]);
      const params = new URLSearchParams();
      params.append(
        "select",
        "id,rating,title,body,created_at,client_id",
      );
      params.append("profile_id", `eq.${profileId}`);
      // params.append("status", "eq.approved");
      params.append("order", "created_at.desc");

      return API.get("/profile_reviews", { params }).then(
        (response) => response.data,
      );
    },
  },
  notifications: {
    list: (limit = 20) => {
      const userId = getUserId();
      if (!userId) {
        return Promise.resolve([]);
      }
      return API.get("/notifications", {
        params: {
          select: "id,type,title,body,data,is_read,created_at",
          user_id: `eq.${userId}`,
          order: "created_at.desc",
          limit,
        },
      }).then((response) => response.data);
    },
    markRead: (id: string) => {
      if (!id) {
        return Promise.resolve(null);
      }
      return API.patch(`/notifications?id=eq.${id}`, { is_read: true }).then(
        (response) => response.data,
      );
    },
  },
  clients: {
    getMyClientProfile: (userIdOverride?: string | null) => {
      const userId = userIdOverride ?? getUserId();
      if (!userId) {
        return Promise.resolve(null);
      }
      const params = new URLSearchParams();
      params.append("select", "id,user_id,email,status,created_at");
      params.append("user_id", `eq.${userId}`);
      params.append("limit", "1");
      return API.get("/clients", { params }).then(
        (response) => response.data?.[0] ?? null,
      );
    },
    createClientProfile: (data: { user_id: string; email?: string | null }) => {
      if (!data?.user_id) {
        return Promise.reject(new Error("Missing user_id for client profile"));
      }
      return API.post("/clients", data).then((response) => response.data?.[0] ?? response.data);
    },
  },
  storage: {
    uploadImage: async (file: File, userId: string) => {
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "");
      const fileName = `${userId}/${Date.now()}-${cleanName}`;
      const bucket = "provider-images";
      const supabaseUrl = STORAGE_BASE;
      const token = getAccessToken();
      const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!token) throw new Error("Authentication required for upload");

      await axios.post(`${supabaseUrl}/object/${bucket}/${fileName}`, file, {
        headers: {
          "Content-Type": file.type || "application/octet-stream",
          "x-upsert": "true",
          Authorization: `Bearer ${token}`,
          apikey: apiKey,
        },
      });

      return {
        publicUrl: `${supabaseUrl}/object/public/${bucket}/${fileName}`,
        path: fileName,
      };
    },
    deleteImage: async (path: string) => {
      const bucket = "provider-images";
      const supabaseUrl = STORAGE_BASE;
      const token = getAccessToken();
      const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!token) {
        throw new Error("Authentication required for image deletion");
      }

      const encodedPath = encodeURIComponent(path);
      await axios.delete(`${supabaseUrl}/object/${bucket}/${encodedPath}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: apiKey,
        },
      });
    },
  },
};
