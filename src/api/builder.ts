import { LOGINAPI, API, setAuthCookie } from "./axios-config";
import { SignInPayload, SignUpPayload } from "@/types/types";

export const apiBuilder = {
  auth: {
    signIn: (data: SignInPayload) =>
      LOGINAPI.post("/token?grant_type=password", data).then((response) => {
        setAuthCookie(response.data);
        return response.data;
      }),
    signUp: (data: SignUpPayload) =>
      LOGINAPI.post("/signup", data).then((response) => {
        if (response.data?.access_token) {
          setAuthCookie(response.data);
        }
        return response.data;
      }),
  },
  locations: {
    getLocations: (query: string) => {
      const params: any = {
        select: "country,city,country_slug,city_slug",
        limit: 10,
      };
      if (query) {
        params.city = `ilike.${query}*`;
      }
      return API.get(
        "https://axhkwqaxbnsguxzrfsfj.supabase.co/rest/v1/city_locations",
        { params }
      ).then((response) => response.data);
    },
  },
  profiles: {
    getProfiles: (filters: {
      gender?: string;
      priceRange?: string;
      citySlug?: string;
      countrySlug?: string;
    } = {}) => {
      const { gender = "Female", priceRange, citySlug, countrySlug } = filters;

      const params = new URLSearchParams();
      params.append(
        "select",
        "id,working_name,username,tagline,base_hourly_rate,base_currency,body_type,ethnicity_category,available_days,city,country,images!inner(public_url,is_primary)"
      );
      params.append("is_active", "eq.true");
      params.append("onboarding_completed", "eq.true");
      params.append("order", "created_at.desc");
      params.append("limit", "10");

      // Dynamic filters
      params.append("gender", `eq.${gender}`);

      if (citySlug) {
        params.append("city_slug", `eq.${citySlug}`);
      } else {

        params.append("city_slug", "eq.lagos");
      }

      if (countrySlug) {
        params.append("country_slug", `eq.${countrySlug}`);
      } else {
        // Default to Nigeria
        params.append("country_slug", "eq.nigeria");
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
      } else {

        params.append("base_hourly_rate", "gte.100");
        params.append("base_hourly_rate", "lte.300");
      }


      params.append("caters_to", "cs.{Male}");

      return API.get(
        `https://axhkwqaxbnsguxzrfsfj.supabase.co/rest/v1/profiles?${params.toString()}`
      ).then((response) => response.data);
    },
    updateProfile: (id: string, data: any) =>
      API.patch(`https://axhkwqaxbnsguxzrfsfj.supabase.co/rest/v1/profiles?id=eq.${id}`, data).then(
        (response) => response.data
      ),
    createProfile: (data: any) =>
      API.post(
        `https://axhkwqaxbnsguxzrfsfj.supabase.co/rest/v1/profiles?on_conflict=user_id`,
        data,
        {
          headers: {
            Prefer: "resolution=merge-duplicates",
          },
        }
      ).then((response) => response.data),
    createImage: (data: {
      user_id: string;
      public_url: string;
      is_primary: boolean;
    }) =>
      API.post(`https://axhkwqaxbnsguxzrfsfj.supabase.co/rest/v1/images`, data).then(
        (response) => response.data
      ),
  },
  storage: {
    uploadImage: async (file: File, userId: string) => {
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "");
      const fileName = `${userId}/${Date.now()}-${cleanName}`;
      const bucket = "profile_images";
      const supabaseUrl = "https://axhkwqaxbnsguxzrfsfj.supabase.co";

      await API.post(`${supabaseUrl}/storage/v1/object/${bucket}/${fileName}`, file, {
        headers: {
          "Content-Type": file.type,
          "x-upsert": "true",
        },
      });

      return `${supabaseUrl}/storage/v1/object/public/${bucket}/${fileName}`;
    },
  },
};
