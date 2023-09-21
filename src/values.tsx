export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const MOCK_TIHLDE_USER_ID = process.env.MOCK_TIHLDE_USER_ID ?? undefined;
export const SHOULD_MOCK_TIHLDE_API = !IS_PRODUCTION && MOCK_TIHLDE_USER_ID;

export const USER_STORAGE_KEY = 'pythons-user';
export const AUTH_TOKEN_COOKIE_KEY = 'tihlde-pythons-auth-token';
export const TIHLDE_API_URL = 'https://api.tihlde.org/';
export const PYTHONS_GROUP_SLUG = 'pythons-gutter-a';
