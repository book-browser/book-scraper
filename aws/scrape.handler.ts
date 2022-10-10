import 'puppeteer';
import { Page } from 'puppeteer-core';
import { scrape } from '../commands/scrape';
import { environment } from '../environment/environment';
import createLogger from '../logging/logger';
import { runScript } from '../websites/scrape';
import script from '../websites/tapas/script';

const logger = createLogger('aws/scrape.handler.ts');

exports.handler = () => {
  logger.info('handling aws event in scrape');
  require('../commands/scrape');

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
};
