import { Page } from 'puppeteer';
import { infiniteScroll } from '../../browser/page';
import { TapasSeries } from './types';

const TAPAS_URL = 'https://tapas.io/comics?b=ORIGINAL&g=0&f=NONE';

function extractItems() {
  const extractedElements = document.querySelectorAll('.content__list .list__item');
  const items = [];
  for (let element of extractedElements) {
    items.push(element);
  }
  return items.map((item) => item.querySelector('a').href);
}

const waitForEpisodeLoadingToBeHidden = async (page: Page) => {
  await page.waitForFunction(() =>
    document.querySelector('.js-episode-loading-indicator').classList.contains('hidden')
  );
};

const extractSeries = async (page: Page, seriesUrl: string) => {
  await page.goto(`${seriesUrl}/info`);
  await page.waitForSelector('.series-root');
  await infiniteScroll(page, waitForEpisodeLoadingToBeHidden);
  return page.evaluate(extractSeriesInfo);
};

const extractSeriesInfo = () => {
  const title = document.querySelector('.title').textContent.trim();
  const description = document.querySelector('.description__body').textContent.trim();
  const episodeCount = Number.parseInt(document.querySelector('.episode-cnt').textContent.split(' ')[0]);
  const coverUrl = document.querySelector('.thumb img').getAttribute('src');
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

const extractSeriesUrls = async (page: Page) => {
  let items = [];
  let itemsLength = -1;
  console.log('Finding list of series...');
  await page.goto(TAPAS_URL);
  await page.waitForSelector('.content__list');
  try {
    let previousHeight;
    while (items.length != itemsLength) {
      itemsLength = items.length;
      items = await page.evaluate(extractItems);
      previousHeight = await page.evaluate(() => document.body.scrollHeight);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForFunction(
        (prevHeight: number) => document.body.scrollHeight > prevHeight,
        { timeout: 5000 },
        previousHeight
      );
      await page.waitForFunction(() => document.querySelector('#loading-indicator').classList.contains('hidden'));
    }
  } catch (e) {}
  return items;
};

export const scrapeTapasSeries = async (page: Page) => {
  console.log(`Navigating to ${TAPAS_URL}...`);

  const seriesUrls = await extractSeriesUrls(page);

  console.log('Extracting individual series info...');
  const seriesList: TapasSeries[] = [];
  let i = 0;
  for await (const seriesUrl of seriesUrls) {
    console.log(`Progress: ${i + 1}/${seriesUrls.length}`);
    const series = await extractSeries(page, seriesUrl);
    console.log(series);
    seriesList.push(series);
    i = i + 1;
  }
  return seriesList;
};
