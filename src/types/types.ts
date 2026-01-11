export type AuthIdentity = {
  identity_id: string;
  id: string;
  user_id: string;
  identity_data: {
    email: string;
    email_verified: boolean;
    phone_verified: boolean;
    sub: string;
  };
  provider: string;
  last_sign_in_at: string;
  created_at: string;
  updated_at: string;
  email: string;
};

export type AuthUser = {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  confirmed_at: string;
  last_sign_in_at: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    email: string;
    email_verified: boolean;
    phone_verified: boolean;
    sub: string;
  };
  identities: AuthIdentity[];
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
  user: AuthUser;
  weak_password: null;
};

export type SignInPayload = {
  email: string;
  password: string;
  [key: string]: unknown;
};

export type SignUpPayload = {
  email: string;
  password: string;
  [key: string]: unknown;
};

export type ProfileImage = {
  id: string;
  profile_id: string;
  public_url: string;
  path?: string;
  is_primary: boolean;
};

export type Profile = {
  id: string;
  user_id: string;
  working_name?: string;
  username?: string;
  tagline?: string;
  name?: string;
  base_hourly_rate?: number;
  base_currency?: string;
  body_type?: string;
  ethnicity_category?: string;
  available_days?: string[] | null;
  city?: string;
  country?: string;
  city_slug?: string;
  country_slug?: string;
  gender?: string;
  bio?: string;
  location?: string;
  price?: string;
  status?: string;
  is_active?: boolean;
  onboarding_completed?: boolean;
  images?: ProfileImage[];
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};
