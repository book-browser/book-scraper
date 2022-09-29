import { Serializable } from 'puppeteer';

export declare type TapasSeries = {
  title: string;
  description: string;
  episodeCount: number;
  coverUrl: string;
  backgroundUrl: string;
  tapasUrl: string;
  creators: string[];
  genres: TapasGenre[];
  episodes: TapasEpisode[];
};

export declare type TapasEpisode = {
  title: string;
  thumbnail: string;
  releaseDate: string;
  tapasUrl: string;
};

export declare type ScrapeProperties = {
  page: PageProperties;
  infiniteScroll: InfiniteScrollProperties;
  values: ScrapedFieldProperty;
};

export declare type SeriesRequest = {
  title: string;
  description: string;
  seriesUrl: string;
  coverUrl: string;
  backgroundUrl?: string;
  creators: string[];
  genres: string[];
  episodes: EpisodeRequest[];
};

export declare type EpisodeRequest = {
  thumbnailUrl: string;
  title: string;
  episodeUrl: string;
  releaseDate: string;
};

export declare type SeriesScrapeProperties = {
  page: PageProperties;
  infiniteScroll: InfiniteScrollProperties;
  attributes: {
    title: ScrapedFieldProperty;
    description: ScrapedFieldProperty;
    seriesUrl: ScrapedFieldProperty;
    coverUrl: ScrapedFieldProperty;
    backgroundUrl: ScrapedFieldProperty;
    genres: ScrapedFieldProperty;
    creators: ScrapedFieldProperty;
    episodes: {
      attributes: {
        thumbnailUrl: ScrapedFieldProperty;
        title: ScrapedFieldProperty;
        episodeUrl: ScrapedFieldProperty;
        releaseDate: ScrapedFieldProperty;
      };
      filter: (elem: Element) => boolean;
      selector: string;
    };
  };
};

export declare type ScrapeScript = (tasks: ScrapeTasks) => Promise<void>;

export declare type ScrapeTasks = {
  scrape: (properties: ScrapeProperties) => void;
  series: (properties: SeriesScrapeProperties) => void;
};

export declare type PageProperties = {
  url: string;
  selector: string;
};

export declare type InfiniteScrollProperties = {
  active: boolean;
  loadingSelector: string;
  hiddenClass: string;
};

export declare type ScrapedFieldProperty = {
  selector?: string;
  selectorAll?: string;
  path?: string;
  attributes?: {
    [key: string]: ScrapedFieldProperty;
  };
  filter?: (element: HTMLElement) => boolean;
  formatters?: (string | ((field: string) => string))[];
};

export declare type SerializableScrapedFieldProperty = {
  selector?: string;
  selectorAll?: string;
  path?: string;
};

export declare type TapasGenre =
  | 'romance'
  | 'action'
  | 'fantasy'
  | 'drama'
  | 'bl'
  | 'gl'
  | 'lgbtq+'
  | 'comedy'
  | 'slice-of-life'
  | 'mystery'
  | 'science-fiction'
  | 'gaming'
  | 'horror';
