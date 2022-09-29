import moment from 'moment';
import { getBase64FromUrl } from '../image';
import { SeriesRequest, TapasEpisode, TapasGenre, TapasSeries } from '../websites/tapas';
import { findParties } from './api';
import { TAPAS_PARTY_ID } from './constants';
import { Creator, Episode, Link, Publisher, Series } from './types';

// export const mapTapasSeriesToSeries = async (tapasSeries: TapasSeries, series?: Series) => {
//   const existingCreators = series?.creators || [];
//   const existingLinks = series?.links || [];
//   const existingPublishers = series?.publishers || [];
//   return {
//     ...series,
//     title: tapasSeries.title,
//     description: tapasSeries.description,
//     banner: tapasSeries.backgroundUrl ? await getBase64FromUrl(tapasSeries.backgroundUrl) : undefined,
//     thumbnail: tapasSeries.coverUrl ? await getBase64FromUrl(tapasSeries.coverUrl) : undefined,
//     links: existingLinks,
//     publishers: mapTapasUrlToPublishers(tapasSeries.tapasUrl, existingPublishers),
//     genres: tapasSeries.genres.map(mapTapasGenreToGenre).filter((genre) => !!genre),
//     creators: [
//       ...existingCreators,
//       ...(await Promise.all(
//         tapasSeries.creators.map((tapasCreator) => mapTapasCreatorToSeriesCreator(tapasCreator, existingCreators))
//       ))
//     ].filter((creator) => !!creator)
//   } as Partial<Series>;
// };

// export const mapTapasEpisodeToEpisode = async (tapasEpisode: TapasEpisode, series: Series) => {
//   const existingEpisode = series.episodes.find((episode) => episode.title === tapasEpisode.title);

//   const episode = {
//     ...existingEpisode,
//     seriesId: series.id,
//     title: tapasEpisode.title,
//     thumbnail: await getBase64FromUrl(tapasEpisode.thumbnail),
//     releaseDate: moment(tapasEpisode.releaseDate, 'MMMM DD, YYYY').toISOString(),
//     links: mapTapasLinksToSeriesLinks(
//       [
//         {
//           description: 'Tapas Episode URL',
//           url: tapasEpisode.tapasUrl
//         }
//       ],
//       existingEpisode ? existingEpisode.links : []
//     )
//   };

//   return episode as Partial<Episode>;
// };

// const mapTapasUrlToPublishers = (tapasUrl: string, existingPublishers: Partial<Publisher>[]) => {
//   const publishers = [...existingPublishers];
//   const tapasPublisher = {
//     partyId: TAPAS_PARTY_ID,
//     url: tapasUrl
//   };

//   const existingPublisherIndex = publishers.findIndex(({ partyId }) => partyId === TAPAS_PARTY_ID);
//   if (existingPublisherIndex < 0) {
//     publishers.push(tapasPublisher);
//   } else {
//     publishers[existingPublisherIndex] = tapasPublisher;
//   }
//   return publishers;
// };

// const mergeLinks = (existingLinks: Link[], newLinks: Partial<Link>[]) => {
//   const mappedLinks = [...existingLinks];

//   newLinks
//     .filter((link) => !existingLinks.find((existingLink) => existingLink.url === link.url))
//     .forEach((link) => {
//       mappedLinks.push(link as Link);
//     });

//   return mappedLinks;
// };

// const mapTapasLinksToSeriesLinks = (tapasLinks: Partial<Link>[], existingLinks: Link[]) => {
//   const mappedLinks = [...existingLinks];

//   tapasLinks
//     .filter((link) => !existingLinks.find((existingLink) => existingLink.url === link.url))
//     .forEach((link) => {
//       mappedLinks.push(link as Link);
//     });

//   return mappedLinks;
// };

// const mapTapasCreatorToSeriesCreator = async (tapasCreator: string, creators: Creator[]) => {
//   const existingSeriesCreator = creators.find(
//     (creator) => creator.fullName.toLocaleLowerCase() === tapasCreator.toLocaleLowerCase()
//   );
//   if (existingSeriesCreator) {
//     return undefined;
//   }
//   const searchedPersons = (await findParties(tapasCreator)).items.filter(
//     ({ fullName }) => fullName.toLocaleLowerCase() === tapasCreator.toLocaleLowerCase()
//   );
//   if (searchedPersons.length > 1) {
//     return undefined;
//   } else if (searchedPersons.length === 1) {
//     return {
//       fullName: searchedPersons[0].fullName,
//       partyId: searchedPersons[0].id
//     } as Creator;
//   } else {
//     return {
//       partyId: null,
//       fullName: tapasCreator,
//       role: null
//     } as Creator;
//   }
// };

// const mapTapasGenreToGenre = (tapasGenre: TapasGenre) => {
//   switch (tapasGenre) {
//     case 'romance':
//       return 'romance';
//     case 'action':
//       return 'action';
//     case 'fantasy':
//       return 'fantasy';
//     case 'drama':
//       return 'drama';
//     case 'bl':
//       return 'bl';
//     case 'gl':
//       return 'gl';
//     case 'comedy':
//       return 'comedy';
//     case 'slice-of-life':
//       return 'slice of life';
//     case 'mystery':
//       return 'mystery';
//     case 'science-fiction':
//       return 'sci-fi';
//     case 'gaming':
//       return 'gaming';
//     case 'horror':
//       return 'horror';
//     default:
//       return null;
//   }
// };
