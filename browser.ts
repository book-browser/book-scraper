import puppeteer from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';

export const startBrowser = async () => {
  return chromium.puppeteer.launch({
    headless: true,
    defaultViewport: chromium.defaultViewport,
    dumpio: true,
    args: chromium.args,
    ignoreHTTPSErrors: true,
    executablePath: await chromium.executablePath
  });
};
