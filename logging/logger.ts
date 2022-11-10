import winston from 'winston';
import { environment } from '../environment/environment';
import { v4 as uuidv4 } from 'uuid';

const { combine, timestamp, label, printf, errors } = winston.format;

const tracerId: string = uuidv4();

const myFormat = printf(({ level, message, label, timestamp, stack }) => {
  return `${timestamp} ${level.toLocaleUpperCase()} [${label}] : ${message} ${stack || ''}`;
});

export const logger = winston.createLogger({
  level: environment.logLevel,
  format: combine(label({ label: tracerId }), timestamp(), errors({ stack: true }), myFormat),
  defaultMeta: { service: 'user-service' },
  transports: [new winston.transports.Console()],
  exceptionHandlers: [new winston.transports.Console()],
  exitOnError: false
});

export default logger;
