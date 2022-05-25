import { Page } from 'puppeteer';
import {
  createOrUpdateEpisode,
  createOrUpdateSeries,
  findAllSeries,
  mapTapasEpisodeToEpisode,
  mapTapasSeriesToSeries,
  Series
} from '../book-browser';
import { startBrowser } from '../browser';
import { series as tapasSeriesList } from '../series';

const scrape = async <E>(scrapeFn: (page: Page) => Promise<E>) => {
  try {
    const browser = await startBrowser();
    const page = await browser.newPage();
    const results = await scrapeFn(page);
    browser.close();
    return results;
  } catch (err) {
    console.error(JSON.stringify(err.response.data));
  }
};

const refresh = async () => {
  // const tapasSeriesList = await scrape(scrapeTapasSeries);
  for await (const tapasSeries of tapasSeriesList) {
    const seriesList = await findAllSeries({ link: tapasSeries.tapasUrl });
    if (seriesList.totalPages > 1) {
      console.log(`Ignoring "${tapasSeries.title}". Multiple existing entries discovered`);
      return;
    }
    let series: Partial<Series>;
    if (seriesList.totalPages === 0) {
      console.log(`Adding new series "${tapasSeries.title}"`);
      series = await mapTapasSeriesToSeries(tapasSeries);
    } else {
      console.log(`Refreshing existing series "${tapasSeries.title}"`);
      series = {
        ...seriesList.items[0],
        ...(await mapTapasSeriesToSeries(tapasSeries, seriesList.items[0]))
      };
    }
    const finalSeries = await createOrUpdateSeries(series);
    for await (const tapasEpisode of tapasSeries.episodes) {
      const episode = await mapTapasEpisodeToEpisode(tapasEpisode, finalSeries);
      console.log(`Creating or updating episode`, JSON.stringify(episode));
      await createOrUpdateEpisode(episode);
    }
  }
};

refresh()
  .then()
  .catch((err) => console.error(JSON.stringify(err.response.data)));
