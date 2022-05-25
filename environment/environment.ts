import { EnvironmentConfiguration } from './types';
import env from './env.json';

export const environment = env as unknown as EnvironmentConfiguration;
