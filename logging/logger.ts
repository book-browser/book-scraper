import winston from 'winston';
import { environment } from '../environment/environment';
import { v4 as uuidv4 } from 'uuid';

const { combine, timestamp, label, printf } = winston.format;

const tracerId: string = uuidv4();

const createLogger = (caller: string) => {
  const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} ${level.toLocaleUpperCase()} [${label}] ${caller} : ${message}`;
  });

  const logger = winston.createLogger({
    level: environment.logLevel,
    format: combine(label({ label: tracerId }), timestamp(), myFormat),
    defaultMeta: { service: 'user-service' },
    transports: [new winston.transports.Console()],
    exceptionHandlers: [new winston.transports.Console()]
  });

  return logger;
};

export default createLogger;
