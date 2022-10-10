import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const startBrowser = async () => {
  return puppeteer.launch({
    headless: true,
    defaultViewport: chromium.defaultViewport,
    dumpio: true,
    args: chromium.args,
    ignoreHTTPSErrors: true,
    executablePath: await chromium.executablePath
  });
};
