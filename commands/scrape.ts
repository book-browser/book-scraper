import { Page } from 'puppeteer';
import { startBrowser } from '../browser';
import script from '../websites/tapas/script';
import { runScript } from '../websites/scrape';

const scrape = async <E>(scrapeFn: (page: Page) => Promise<E>) => {
  try {
    const browser = await startBrowser();
    const page = await browser.newPage();
    const results = await scrapeFn(page);
    browser.close();
    return results;
  } catch (err) {
    console.error(err);
  }
};

const website = process.argv.slice(2)[0];

switch (website) {
  case 'tapas':
    scrape((page: Page) => runScript(page, script))
      .then(JSON.stringify)
      .then(console.log);
    break;
  default:
    throw new Error('Unknown website option');
}
