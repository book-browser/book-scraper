import createLogger from '../logging/logger';
const logger = createLogger('aws/refresh.handler.ts');

exports.handler = () => {
  logger.info('handling aws event in refresh');
  require('../commands/refresh');
};
