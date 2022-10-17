import chromium from '@sparticuz/chromium';
import { launch } from 'puppeteer-core';

export const startBrowser = async () => {
  return launch({
    headless: true,
    defaultViewport: chromium.defaultViewport,
    args: chromium.args,
    executablePath: await chromium.executablePath,
    ignoreHTTPSErrors: true,
    dumpio: true
  });
};
