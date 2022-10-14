import { Page } from 'puppeteer-core';
import { environment } from '../environment/environment';
import createLogger from '../logging/logger';
import { runScript } from '../websites/scrape';
import script from '../websites/tapas/script';
const logger = createLogger('aws/scrape.handler.ts');

exports.handler = (event, context, callback) => {
  console.log('EVENT: \n' + JSON.stringify(event, null, 2));
  logger.info('handling aws event in scrape');
  require('../commands/scrape');

  const website = environment.bookScraper.targetWebsite || process.argv.slice(2)[0];
  logger.info(`scraping from target website "${website}"`);

  const { scrape } = require('../commands/scrape');

  switch (website) {
    case 'tapas':
      scrape((page: Page) => runScript(page, script))
        .then(JSON.stringify)
        .then((str) => {
          console.log(str);
          callback(null, 'success');
        })
        .catch((e) => {
          console.log(e);
          console.log(e?.message);
        });
      break;
    default:
      console.log('Error: Unknown website option');
      throw new Error('Unknown website option');
  }
};
