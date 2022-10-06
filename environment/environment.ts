import { EnvironmentConfiguration } from './types';
import * as dotenv from 'dotenv';
dotenv.config();

export const environment = <EnvironmentConfiguration>{
  bookBrowser: {
    baseUrl: process.env.BOOK_BROWSER_BASE_URL
  },
  logLevel: process.env.LOG_LEVEL
};
