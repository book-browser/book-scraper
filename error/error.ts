import logger from '../logging/logger';

const MAX_ERROR_COUNT = 5;

global.errorCount = 0;

export const handleRecoverableError = (error) => {
  if (error?.response?.data) {
    logger.error(JSON.stringify(error.response.data, null, 2));
  }
  logger.error(error);
  global.errorCount = global.errorCount + 1;
  if (global.errorCount >= MAX_ERROR_COUNT) {
    throw new Error('Maximum error count exceeded');
  }
};
