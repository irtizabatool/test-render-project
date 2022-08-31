//eslint-disable-next-line
require('dotenv').config();

export const JWT_SECRET = process.env.JWT_SIGNATURE;

export const DEFAULT_PAGE_LIMIT = 10;
export const MAX_PAGE_LIMIT = 100;

export const DEFAULT_SORT_BY = 'id';

export const API_PREFIX = '/v1';

//Regex
export const PHONE_REGEX = /^[0-9\s+-.()]+$/;

export const SLUG_SEPARATOR = '-';

export const DO_BUCKET_NAME = process.env.DIGITAL_OCEAN_BUCKET_NAME;
export const DO_ACCESS_KEY_ID = process.env.DIGITAL_OCEAN_ACCESS_KEY_ID;
export const DO_END_POINT = process.env.DIGITAL_OCEAN_END_POINT;
export const DO_SECRET_ACCESS_KEY = process.env.DIGITAL_OCEAN_SECRET_ACCESS_KEY;
export const DO_URL = process.env.DIGITAL_OCEAN_URL;