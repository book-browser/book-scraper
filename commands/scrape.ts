import { Browser, Page } from 'puppeteer-core';
import { startBrowser } from '../browser';
import script from '../websites/tapas/script';
import { runScript } from '../websites/scrape';
import { environment } from '../environment/environment';
import createLogger from '../logging/logger';

const logger = createLogger('commands/scrape.ts');

const scrape = async <E>(scrapeFn: (page: Page) => Promise<E>) => {
  let browser: Browser;
  try {
    browser = await startBrowser();
    const page = await browser.newPage();
    const results = await scrapeFn(page);
    return results;
  } catch (err) {
    console.error(err);
  } finally {
    browser?.close();
  }
};

const website = environment.bookScraper.targetWebsite || process.argv.slice(2)[0];
logger.info(`scraping from target website "${website}"`);

switch (website) {
  case 'tapas':
    scrape((page: Page) => runScript(page, script))
      .then(JSON.stringify)
      .then(console.log);
    break;
  default:
    throw new Error('Unknown website option');
}
