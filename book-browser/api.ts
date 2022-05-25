import axios from 'axios';
import { environment } from '../environment/environment';
import { Episode, Page, Party, Series, SeriesQuery } from './types';

export const createOrUpdateSeries = async (series: Partial<Series>) => {
  return (
    await axios.patch<Series>(`/api/series`, series, {
      baseURL: environment.bookBrowser.baseUrl
    })
  ).data;
};

export const createOrUpdateEpisode = async (episode: Partial<Episode>) => {
  return (
    await axios.put<Episode>(`/api/episode`, episode, {
      baseURL: environment.bookBrowser.baseUrl
    })
  ).data;
};

export const findAllSeries = async (query: SeriesQuery) => {
  return (
    await axios.get<Page<Series>>(`/api/series`, {
      params: query,
      baseURL: environment.bookBrowser.baseUrl
    })
  ).data;
};

export const findParties = async (query: string) => {
  return (
    await axios.get<Page<Party>>(`/api/parties`, {
      baseURL: environment.bookBrowser.baseUrl,
      params: {
        name: query
      }
    })
  ).data;
};
