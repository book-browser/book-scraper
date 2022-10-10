import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const startBrowser = async () => {
  return puppeteer.launch({
    headless: chromium.headless,
    defaultViewport: chromium.defaultViewport,
    args: chromium.args,
    executablePath: await chromium.executablePath,
    ignoreHTTPSErrors: true,
    dumpio: true
  });
};
