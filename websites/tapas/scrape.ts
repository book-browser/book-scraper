import { Page } from 'puppeteer';
import { infiniteScroll } from '../../browser/page';
import createLogger from '../../logging/logger';
import { TapasSeries } from './types';

const logger = createLogger('scrape.ts');

const TAPAS_URL = 'https://tapas.io/comics?b=ORIGINAL&g=0&f=NONE';

export const scrapeTapasSeries = async (page: Page) => {
  const seriesUrls = await scrapeSeriesUrls(page);
  const seriesList: TapasSeries[] = [];
  let i = 0;
  for await (const seriesUrl of seriesUrls) {
    logger.info(`Progress: ${i + 1}/${seriesUrls.length}`);
    try {
      const series = await scrapeSeries(page, seriesUrl);
      seriesList.push(series);
      i = i + 1;
      logger.debug(`Scraped series ${JSON.stringify(series)}`);
    } catch (e) {
      logger.error(`Unable to scrape series: ${(e as Error).stack}`);
    }
  }
  return seriesList;
};

const scrapeSeriesUrls = async (page: Page) => {
  logger.info(`Scraping series list from ${TAPAS_URL}...`);
  await page.goto(TAPAS_URL);
  await page.waitForSelector('.content__list');
  await infiniteScroll(page, waitForSeriesListLoadingToBeHidden);
  return page.evaluate(extractItems);
};

const scrapeSeries = async (page: Page, seriesUrl: string) => {
  logger.info(`Scraping series from ${seriesUrl}/info...`);
  await page.goto(`${seriesUrl}/info`);
  await page.waitForSelector('.series-root');
  await infiniteScroll(page, waitForEpisodeLoadingToBeHidden);
  return page.evaluate(extractSeriesInfo);
};

const extractSeriesInfo = () => {
  const title = document.querySelector('.title').textContent.trim();
  const description = document.querySelector('.description__body').textContent.trim();
  const episodeCount = Number.parseInt(document.querySelector('.episode-cnt').textContent.split(' ')[0]);
  const coverUrl = document.querySelector<HTMLImageElement>('.thumb img').src;
  const backgroundUrl = document.querySelector<HTMLDivElement>('.js-top-banner').style.backgroundImage.slice(5, -2);
  const genres = [];
  const genreButtons = document.querySelectorAll('.section__top .info--top .genre-btn');
  genreButtons.forEach((btn) => genres.push(btn.textContent.toLocaleLowerCase().replace(/\s/g, '-')));
  const tapasUrl = window.location.href;
  const creators = [];
  const creatorNames = document.querySelectorAll('.section--right .name');
  creatorNames.forEach((creatorName) => creators.push(creatorName.textContent.trim()));

  const episodeItems = document.querySelectorAll('.episode-item');
  const episodes = [...episodeItems]
    .filter((episodeItem) => {
      return !episodeItem.querySelector('.thumb').innerHTML.includes('sp-ico-schedule-wht-s');
    })
    .map((episodeItem) => {
      const thumbnail = episodeItem.querySelector('.thumb img').getAttribute('src');
      const episodeTitle = episodeItem.querySelector('.title__body').textContent.trim();
      const episodeUrl = `https://tapas.io${episodeItem.getAttribute('href')}`;
      const releaseDate = episodeItem.querySelector('.additional').firstChild.textContent.trim();
      return {
        title: episodeTitle,
        thumbnail,
        releaseDate: releaseDate,
        tapasUrl: episodeUrl
      };
    });

  return {
    title,
    description,
    episodeCount,
    coverUrl,
    backgroundUrl,
    genres,
    tapasUrl,
    creators,
    episodes
  } as TapasSeries;
};

const extractItems = () => {
  const extractedElements = document.querySelectorAll('.content__list .list__item');
  const items = [];
  for (let element of extractedElements) {
    items.push(element);
  }
  return items.map((item) => item.querySelector('a').href);
};

const waitForSeriesListLoadingToBeHidden = async (page: Page) => {
  await page.waitForFunction(() => document.querySelector('#loading-indicator').classList.contains('hidden'));
};

const waitForEpisodeLoadingToBeHidden = async (page: Page) => {
  await page.waitForFunction(() =>
    document.querySelector('.js-episode-loading-indicator').classList.contains('hidden')
  );
};
