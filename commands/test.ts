import createLogger from '../logging/logger';

const logger = createLogger('test.ts');

logger.debug('debug');
logger.info('info');
logger.error('error');

try {
  throw new Error('test');
} catch (e) {
  logger.error(e.message);
  logger.error(e.stack);
}
