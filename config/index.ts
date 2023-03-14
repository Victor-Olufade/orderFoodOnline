import dotenv from 'dotenv';

dotenv.config();

export const mongoConnectString = process.env.MONGO_URI as string;
export const appSecret = process.env.APP_SECRET as string;