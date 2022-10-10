import createLogger from '../logging/logger';
const logger = createLogger('aws/scrape.handler.ts');

exports.handler = () => {
  logger.info('handling aws event in scrape');
  require('../commands/scrape');
};
