console.log('import 1');
import { Page } from 'puppeteer-core';
console.log('import 2');
import { scrape } from '../commands/scrape';
console.log('import 3');
import { environment } from '../environment/environment';
console.log('import 4');
import createLogger from '../logging/logger';
console.log('import 5');
import { runScript } from '../websites/scrape';
console.log('import 6');
import script from '../websites/tapas/script';

const logger = createLogger('aws/scrape.handler.ts');

exports.handler = (event, context, callback) => {
  logger.info('handling aws event in scrape');
  require('../commands/scrape');

  const website = environment.bookScraper.targetWebsite || process.argv.slice(2)[0];
  logger.info(`scraping from target website "${website}"`);

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
