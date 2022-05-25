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
