import { Page } from 'puppeteer';
import { startBrowser } from '../browser';
import { scrapeTapasSeries } from '../websites/tapas';
import script from '../websites/tapas/new-tapas';
import { runScript } from '../websites/tapas/test';

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
    // scrape(scrapeTapasSeries).then(JSON.stringify).then(console.log);
    scrape((page: Page) => runScript(page, script))
      .then(JSON.stringify)
      .then(console.log);
    break;
  default:
    throw new Error('Unknown website option');
}
