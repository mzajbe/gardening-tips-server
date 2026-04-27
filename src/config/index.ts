import dotenv from "dotenv";

dotenv.config();

const parseOrigins = (value?: string) =>
  value
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];

export default {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  port: process.env.PORT ?? "5000",
  db_url: process.env.DB_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  default_password: process.env.DEFAULT_PASS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  cloudinary_name: process.env.CLOUDINARY_NAME,
  cloudinary_api_key:
    process.env.CLOUDINARY_API_KEY ?? process.env.COUDINARY_API_KEY,
  cloudinary_api_secret:
    process.env.CLOUDINARY_API_SECRET ?? process.env.COUDINARY_API_SECRET,
  frontend_base_url: process.env.FRONTEND_BASE_URL,
  backend_base_url: process.env.BACKEND_BASE_URL,
  client_origin: process.env.CLIENT_ORIGIN,
  client_origins: parseOrigins(process.env.CLIENT_ORIGINS),
  payment_url: process.env.PAYMENT_URL,
  store_id: process.env.STORE_ID,
  payment_signature_key:
    process.env.SIGNATURE_KEY ?? process.env.SIGNATURE_Key,
};
