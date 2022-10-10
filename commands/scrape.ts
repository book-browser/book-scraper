import { Browser, Page } from 'puppeteer-core';
import { startBrowser } from '../browser';
import script from '../websites/tapas/script';
import { runScript } from '../websites/scrape';
import { environment } from '../environment/environment';
import createLogger from '../logging/logger';

const logger = createLogger('commands/scrape.ts');

export const scrape = async <E>(scrapeFn: (page: Page) => Promise<E>) => {
  let browser: Browser;
  try {
    browser = await startBrowser();
    const page = await browser.newPage();
    const results = await scrapeFn(page);
    return results;
  } catch (err) {
    console.error(err);
  } finally {
    await browser?.close();
  }
};
