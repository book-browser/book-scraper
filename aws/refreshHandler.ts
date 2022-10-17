import { APIGatewayProxyHandler } from 'aws-lambda';
import { refresh } from '../commands/commands';
import createLogger from '../logging/logger';
const logger = createLogger('aws/refresh.handler.ts');

const handler: APIGatewayProxyHandler = (event, context, callback) => {
  logger.info(`consuming aws event in refresh handler ${JSON.stringify(event, null, 2)}`);
  refresh()
    .then(() => {
      callback(null, { statusCode: 200, body: 'success' });
    })
    .catch((error: Error) => {
      callback(error);
    });
};

exports.handler = handler;
