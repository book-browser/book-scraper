import { Page } from 'puppeteer';

declare type PageFunction = (page: Page) => Promise<void>;

export const infiniteScroll = async (page: Page, onScroll: PageFunction) => {
  let lastHeight = await page.evaluate('document.body.scrollHeight');

  while (true) {
    try {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForFunction(
        (height: number) => document.body.scrollHeight > height,
        { timeout: 3000 }, // fails if the height hasn't changed in 5 seconds
        lastHeight
      );
      await onScroll?.(page);
      lastHeight = await page.evaluate('document.body.scrollHeight');
    } catch (e) {
      break;
    }
  }
};
