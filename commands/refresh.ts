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
import createLogger from '../logging/logger';
import { series as tapasSeriesList } from '../series';
import { SeriesRequest, TapasEpisode, TapasSeries } from '../websites/tapas';

const logger = createLogger('refresh.ts');

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
    // await createOrUpdateTapasSeries(tapasSeries);
  }
};

// const createOrUpdateTapasSeries = async (tapasSeries: TapasSeries) => {
//   logger.info(`Creating or updating tapas series ${tapasSeries.title}`);
//   const seriesList = await findAllSeries({ link: tapasSeries.tapasUrl });
//   if (seriesList.totalPages > 1) {
//     logger.info(`Ignoring "${tapasSeries.title}". Multiple existing entries discovered`);
//     return;
//   }
//   let series: Partial<Series>;
//   if (seriesList.totalPages === 0) {
//     logger.info(`Adding new series "${tapasSeries.title}"`);
//     series = await mapTapasSeriesToSeries(tapasSeries);
//   } else {
//     logger.info(`Refreshing existing series "${tapasSeries.title}"`);
//     series = {
//       ...seriesList.items[0],
//       ...(await mapTapasSeriesToSeries(tapasSeries, seriesList.items[0]))
//     };
//   }
//   const finalSeries = await createOrUpdateSeries(series);
//   for await (const tapasEpisode of tapasSeries.episodes) {
//     await createOrUpdateTapasEpisode(finalSeries, tapasEpisode);
//   }
// };

// const createOrUpdateTapasEpisode = async (series: Series, tapasEpisode: TapasEpisode) => {
//   logger.info(`Creating or updating episode ${tapasEpisode.title}`);
//   logger.debug(JSON.stringify({ series, tapasEpisode }));
//   const episode = await mapTapasEpisodeToEpisode(tapasEpisode, series);
//   await createOrUpdateEpisode(episode);
// };

refresh()
  .then()
  .catch((err) => logger.error(JSON.stringify(err.response.data)));
