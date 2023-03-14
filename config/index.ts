import multer from 'multer';
const cloudinary = require("cloudinary").v2;
import { CloudinaryStorage } from "multer-storage-cloudinary";


import dotenv from 'dotenv';

dotenv.config();

export const mongoConnectString = process.env.MONGO_URI as string;
export const appSecret = process.env.APP_SECRET as string;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: async(req, file)=>{
      return{
        folder: "SHOPRITE",
      }
    },
  });

export const upload = multer({storage: storage, limits: {fileSize: 1024 * 1024}})