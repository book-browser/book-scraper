console.log('import a1');
import { launch } from 'puppeteer-core';
console.log('import a2');
import chromium from '@sparticuz/chromium';

export const startBrowser = async () => {
  return launch({
    headless: chromium.headless,
    defaultViewport: chromium.defaultViewport,
    args: chromium.args,
    executablePath: await chromium.executablePath,
    ignoreHTTPSErrors: true,
    dumpio: true
  });
};
