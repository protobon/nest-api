import * as dotenv from 'dotenv';

dotenv.config();

export class Env {
    static readonly HOST = process.env.HOST;
    static readonly PORT = parseInt(process.env.PORT);
    static readonly MONGO_URI = process.env.MONGO_URI;
    static readonly JWT_SECRET = process.env.JWT_SECRET;
    static readonly JWT_EXPIRE_IN = process.env.JWT_EXPIRE_IN;
    static readonly REFRESH_TOKEN_EXPIRE_IN_DAYS = parseInt(process.env.REFRESH_TOKEN_EXPIRE_IN_DAYS);
}