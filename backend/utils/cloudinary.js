import { v2 as cloudinary } from 'cloudinary';
import DataUriParser from 'datauri/parser.js';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: './config.env'});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const parser = new DataUriParser();

export const getDataUri = (file) => {
  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer);
};

export { cloudinary };
