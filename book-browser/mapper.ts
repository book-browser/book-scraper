import moment from 'moment';
import { getBase64FromUrl } from '../image';
import createLogger from '../logging/logger';
import { EpisodeRequest, SeriesRequest } from '../websites';
import { findParties } from './api';
import { GENRES } from './constants';
import { Creator, Episode, Link, Publisher, Series } from './types';

const logger = createLogger('mapper.ts');

export const mapSeriesRequestToSeries = async (seriesRequest: SeriesRequest, series?: Series) => {
  return <Partial<Series>>{
    ...series,
    title: seriesRequest.title,
    description: seriesRequest.description,
    banner: await mapImageUrlToBaseUrl(seriesRequest.backgroundUrl),
    thumbnail: await mapImageUrlToBaseUrl(seriesRequest.coverUrl),
    links: mapLinkStrsToLinks([seriesRequest.seriesUrl], series?.links, 'Series URL'),
    genres: mapGenreStringsToGenres(seriesRequest.genres),
    creators: await mapCreatorStrsToSeriesCreators(seriesRequest.creators, series?.creators),
    publishers: await mapPublisherStrsToPublishers(seriesRequest.publishers, series?.publishers)
  };
};

const mapImageUrlToBaseUrl = async (imageUrl?: string) => {
  if (imageUrl) {
    return getBase64FromUrl(imageUrl);
  }
  return undefined;
};

const mapGenreStringsToGenres = (genreStrs: string[]) => {
  return genreStrs.map((genreStr) => GENRES.find((genre) => genre === genreStr)).filter((genre) => !!genre);
};

export const mapEpisodeRequestToEpisode = async (episodeRequest: EpisodeRequest, series?: Series) => {
  const existingEpisode = series.episodes.find((episode) => episode.title === episodeRequest.title);

  const episode = <Partial<Episode>>{
    ...existingEpisode,
    seriesId: series.id,
    title: episodeRequest.title,
    thumbnail: await mapImageUrlToBaseUrl(episodeRequest.thumbnailUrl),
    releaseDate: mapDateStrToDate(episodeRequest.releaseDate),
    links: mapLinkStrsToLinks([episodeRequest.episodeUrl], existingEpisode?.links, 'Episode URL')
  };

  return episode;
};

export const mapDateStrToDate = (dateStr: string) => {
  const momentObj = moment(dateStr);

  if (momentObj.isValid()) {
    return momentObj.toISOString();
  }
  logger.warn(`Unable to convert '${dateStr}' into a date`);
  return undefined;
};

const mapLinkStrsToLinks = (linkStrs: string[], existingLinks: Link[] = [], defaultDescription: string) => {
  return [
    ...existingLinks,
    ...linkStrs.map((linkStr) => mapLinkStrToLink(linkStr, existingLinks, defaultDescription)).filter((link) => !!link)
  ];
};

const mapLinkStrToLink = (linkStr: string, existingLinks: Link[], defaultDescription: string) => {
  const existingLink = existingLinks.find((existingLink) => existingLink.url === linkStr);
  if (existingLink) {
    return undefined;
  } else {
    return {
      url: linkStr,
      description: defaultDescription
    };
  }
};

const mapCreatorStrsToSeriesCreators = async (creatorStrs: string[], creators: Creator[] = []) => {
  const newCreators = (
    await Promise.all(creatorStrs.map((creatorStr) => mapCreatorStrToSeriesCreator(creatorStr, creators)))
  ).filter((creator) => !!creator);
  return [...creators, ...newCreators];
};

const mapCreatorStrToSeriesCreator = async (creatorStr: string, creators: Creator[]) => {
  const existingSeriesCreator = creators.find(
    (creator) => creator.fullName.toLocaleLowerCase() === creatorStr.toLocaleLowerCase()
  );
  if (existingSeriesCreator) {
    return undefined;
  }
  const searchedPersons = (await findParties(creatorStr)).items.filter(
    ({ fullName }) => fullName.toLocaleLowerCase() === creatorStr.toLocaleLowerCase()
  );
  if (searchedPersons.length > 1) {
    logger.warn(`Found multiple parties with the name '${creatorStr}'. Unable to map to a single party`);
    return undefined;
  } else if (searchedPersons.length === 1) {
    return <Creator>{
      partyId: searchedPersons[0].id
    };
  } else {
    return <Creator>{
      partyId: null,
      fullName: creatorStr,
      role: null
    };
  }
};

const mapPublisherStrsToPublishers = async (publisherStrs: string[], existingPublishers: Publisher[] = []) => {
  const newPublishers = (
    await Promise.all(publisherStrs.map((publisherStr) => mapPublisherStrToPublisher(publisherStr, existingPublishers)))
  ).filter((creator) => !!creator);
  return [...existingPublishers, ...newPublishers];
};

const mapPublisherStrToPublisher = async (publisherStr: string, existingPublishers: Publisher[]) => {
  const existingPublisher = existingPublishers.find(
    (publisher) => publisher.fullName.toLocaleLowerCase() === publisherStr.toLocaleLowerCase()
  );
  if (existingPublisher) {
    return undefined;
  }
  const searchedParties = (await findParties(publisherStr)).items.filter(
    ({ fullName }) => fullName.toLocaleLowerCase() === publisherStr.toLocaleLowerCase()
  );
  if (searchedParties.length > 1) {
    logger.warn(`Found multiple parties with the name '${publisherStr}'. Unable to map to a single party`);
    return undefined;
  } else if (searchedParties.length === 1) {
    return <Creator>{
      partyId: searchedParties[0].id
    };
  } else {
    return <Publisher>{
      partyId: null,
      fullName: publisherStr
    };
  }
};
