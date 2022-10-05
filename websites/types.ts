export declare type ScrapeProperties = {
  page: PageProperties;
  infiniteScroll: InfiniteScrollProperties;
  values: FunctionFieldProperty | ScrapedFieldProperty;
};

export declare type SeriesRequest = {
  title: string;
  description: string;
  seriesUrl: string;
  coverUrl: string;
  backgroundUrl?: string;
  creators?: string[];
  publishers?: string[];
  genres?: string[];
  episodes?: EpisodeRequest[];
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
    title: FunctionFieldProperty | ScrapedFieldProperty;
    description: FunctionFieldProperty | ScrapedFieldProperty;
    seriesUrl: FunctionFieldProperty | ScrapedFieldProperty;
    coverUrl: FunctionFieldProperty | ScrapedFieldProperty;
    backgroundUrl: FunctionFieldProperty | ScrapedFieldProperty;
    genres: FunctionFieldProperty | ScrapedFieldProperty;
    creators: FunctionFieldProperty | ScrapedFieldProperty;
    publishers: FunctionFieldProperty | ScrapedFieldProperty;
    episodes: {
      attributes: {
        thumbnailUrl: FunctionFieldProperty | ScrapedFieldProperty;
        title: FunctionFieldProperty | ScrapedFieldProperty;
        episodeUrl: FunctionFieldProperty | ScrapedFieldProperty;
        releaseDate: FunctionFieldProperty | ScrapedFieldProperty;
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

export declare type FunctionFieldProperty = () => string | string[];

export declare type ScrapedFieldProperty = {
  selector?: string;
  selectorAll?: string;
  path?: string;
  attributes?: {
    [key: string]: FunctionFieldProperty | ScrapedFieldProperty;
  };
  filter?: (element: HTMLElement) => boolean;
  formatters?: (string | ((field: string) => string))[];
};

export declare type SerializableScrapedFieldProperty = {
  selector?: string;
  selectorAll?: string;
  path?: string;
};
