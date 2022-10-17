import { Browser, Page } from 'puppeteer-core';
import { createOrUpdateSeriesFromSeriesRequest } from '../book-browser/service';
import { startBrowser } from '../browser';
import { environment } from '../environment/environment';
import createLogger from '../logging/logger';
// import { series as seriesList } from '../series';
import { runScript } from '../websites';
import { getScrapeFunction } from '../websites/websites';

const logger = createLogger('refresh.ts');

const website: string | undefined = environment.bookScraper.targetWebsite || process.argv.slice(2)[0];

export const refresh = async () => {
  logger.info(`refreshing series from target website "${website}"`);
  const script = getWebsiteScrapeScript();
  const seriesList = await runInBrowser((page: Page) => runScript(page, script));
  for await (const series of seriesList) {
    await createOrUpdateSeriesFromSeriesRequest(series);
  }
};

export const scrape = async () => {
  logger.info(`scraping from target website "${website}"`);
  const script = getWebsiteScrapeScript();
  return runInBrowser((page: Page) => runScript(page, script));
};

const getWebsiteScrapeScript = () => {
  if (!website) {
    throw new Error(
      'required website option is missing. no command line option or BOOK_SCRAPER_TARGET_WEBSITE environment variable'
    );
  }
  return getScrapeFunction(website);
};

const runInBrowser = async <E>(scrapeFn: (page: Page) => Promise<E>) => {
  let browser: Browser;
  try {
    browser = await startBrowser();
    const page = await browser.newPage();
    const results = await scrapeFn(page);
    return results;
  } catch (err) {
    logger.error(err);
    throw err;
  } finally {
    await browser?.close();
  }
};
