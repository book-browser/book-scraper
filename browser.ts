import puppeteer from 'puppeteer';

export const startBrowser = async () => {
  return puppeteer.launch({
    headless: true,
    args: ['--disable-setuid-sandbox'],
    ignoreHTTPSErrors: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  });
};
