import logger from '../logging/logger';
import { EpisodeRequest, SeriesRequest } from '../websites';
import { createOrUpdateEpisode, createOrUpdateSeries, findAllSeries } from './api';
import { mapEpisodeRequestToEpisode, mapSeriesRequestToSeries } from './mapper';
import { Series } from './types';

export const createOrUpdateSeriesFromSeriesRequest = async (seriesRequest: SeriesRequest) => {
  logger.debug(`seriesRequest ${JSON.stringify({ seriesRequest }, null, 2)}`);
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
    logger.info(`Updating existing series "${seriesRequest.title}"`);
    series = await mapSeriesRequestToSeries(seriesRequest, seriesList.items[0]);
  }

  const finalSeries = await createOrUpdateSeries(series);

  for await (const episodeRequest of seriesRequest.episodes) {
    await createOrUpdateEpisodeFromEpisodeRequest(episodeRequest, finalSeries);
  }
};

const createOrUpdateEpisodeFromEpisodeRequest = async (episodeRequest: EpisodeRequest, series: Series) => {
  logger.debug(`episodeRequest ${JSON.stringify({ episodeRequest })}`);
  const existingEpisode = series.episodes.find((episode) => episode.title === episodeRequest.title);
  if (existingEpisode) {
    logger.info(`Updating existing episode "${episodeRequest.title}" from series "${series.title}"`);
  } else {
    logger.info(`Creating new episode "${episodeRequest.title}" from series "${series.title}"`);
  }
  const episode = await mapEpisodeRequestToEpisode(episodeRequest, series);
  await createOrUpdateEpisode(episode);
};
