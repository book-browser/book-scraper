import { EnvironmentConfiguration } from './types';
import * as dotenv from 'dotenv';
dotenv.config({
  override: false
});

export const environment = <EnvironmentConfiguration>{
  bookBrowser: {
    baseUrl: process.env.BOOK_BROWSER_BASE_URL
  },
  bookScraper: {
    targetWebsite: process.env.BOOK_SCRAPER_TARGET_WEBSITE
  },
  logLevel: process.env.LOG_LEVEL
};
