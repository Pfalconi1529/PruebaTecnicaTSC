// variables de entorno que se usa junto con el .env
import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(process.cwd(), '.env') });


const DEV_OPS_API_KEY = process.env.DEV_OPS_API_KEY; 
const ERR_GENERIC_METHOD = process.env.ERR_GENERIC_METHOD; 
const ERR_INVALID_AUTH = process.env.ERR_INVALID_AUTH; 
const ERR_MISSING_FIELDS = process.env.ERR_MISSING_FIELDS || ' '; 
const SUCCESS_GREETING = process.env.SUCCESS_GREETING;
const SUCCESS_SUFFIX = process.env.SUCCESS_SUFFIX;
const ERR_MISSING_JWT = process.env.ERR_MISSING_JWT;
const HEADER_JWT = process.env.HEADER_JWT || '';
const JWT_TRANSACTION_SECRET = process.env.JWT_TRANSACTION_SECRET!;
const ERROR_TOKEN = process.env.ERROR_TOKEN;
const TOKEN_DUPLICATE = process.env.TOKEN_DUPLICATE;
const HEADER_KEY = process.env.HEADER_KEY;
const ENVIRONMENT = process.env.NODE_ENV || 'unknown';
const HOST = process.env.HOST!;


export {
  DEV_OPS_API_KEY,
  ERR_GENERIC_METHOD,
  ERR_INVALID_AUTH,
  ERR_MISSING_FIELDS,
  SUCCESS_GREETING,
  SUCCESS_SUFFIX,
  HOST,
  ERR_MISSING_JWT,
  HEADER_JWT,
  JWT_TRANSACTION_SECRET,
  ERROR_TOKEN,
  TOKEN_DUPLICATE,
  HEADER_KEY,
  ENVIRONMENT
};