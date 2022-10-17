import { APIGatewayProxyHandler } from 'aws-lambda';
import { scrape } from '../commands/commands';
import createLogger from '../logging/logger';

const logger = createLogger('aws/scrape.handler.ts');

const handler: APIGatewayProxyHandler = (event, context, callback) => {
  logger.info(`consuming aws event in scrape handlers ${JSON.stringify(event, null, 2)}`);
  scrape()
    .then((data) => {
      callback(null, { statusCode: 200, body: JSON.stringify(data) });
    })
    .catch((error: Error) => {
      callback(error);
    });
};

exports.handler = handler;
