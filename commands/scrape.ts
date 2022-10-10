console.log('import a');
import { Browser, Page } from 'puppeteer-core';
console.log('import b');
import { startBrowser } from '../browser';
console.log('import c');
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
