import { Page } from 'puppeteer';
import { mapEpisodeRequestToEpisode, mapSeriesRequestToSeries, Series } from '../book-browser';
import { createOrUpdateEpisode, createOrUpdateSeries, findAllSeries } from '../book-browser/api';
import { startBrowser } from '../browser';
import createLogger from '../logging/logger';
// import { series as seriesList } from '../series';
import { EpisodeRequest, runScript, SeriesRequest } from '../websites';
import script from '../websites/tapas/script';

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
  const seriesList = await scrape((page: Page) => runScript(page, script));
  for await (const series of seriesList) {
    await createOrUpdateSeriesFromSeriesRequest(series);
  }
};

const createOrUpdateSeriesFromSeriesRequest = async (seriesRequest: SeriesRequest) => {
  logger.info(`Creating or updating tapas series ${seriesRequest.title}`);
  const seriesList = await findAllSeries({ link: seriesRequest.seriesUrl });
  if (seriesList.items.length > 1) {
    logger.info(`Ignoring "${seriesRequest.title}". Multiple existing entries discovered`);
    return;
  }
  let series: Partial<Series>;
  if (seriesList.items.length === 0) {
    logger.info(`Adding new series "${seriesRequest.title}"`);
    series = await mapSeriesRequestToSeries(seriesRequest);
  } else {
    logger.info(`Refreshing existing series "${seriesRequest.title}"`);
    series = await mapSeriesRequestToSeries(seriesRequest, seriesList.items[0]);
  }

  const finalSeries = await createOrUpdateSeries(series);

  for await (const episodeRequest of seriesRequest.episodes) {
    await createOrUpdateEpisodeFromEpisodeRequest(episodeRequest, finalSeries);
  }
};

const createOrUpdateEpisodeFromEpisodeRequest = async (episodeRequest: EpisodeRequest, series: Series) => {
  logger.info(`Creating or updating episode ${episodeRequest.title} from series ${series.title}`);
  logger.debug(JSON.stringify({ episodeRequest }));
  const episode = await mapEpisodeRequestToEpisode(episodeRequest, series);
  await createOrUpdateEpisode(episode);
};

refresh()
  .then()
  .catch((err) => logger.error(err));
