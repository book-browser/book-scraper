export type Genre =
  | 'drama'
  | 'fantasy'
  | 'comedy'
  | 'action'
  | 'slice of life'
  | 'superhero'
  | 'romance'
  | 'sci-fi'
  | 'supernatural'
  | 'horror'
  | 'mystery'
  | 'sports'
  | 'historical'
  | 'harem'
  | 'music'
  | 'mecha'
  | 'bl'
  | 'gl'
  | 'gaming'
  | 'adventure';

export declare type Book = {
  id: number;
  title: string;
  description: string;
  releaseDate?: Date;
  thumbnail?: string;
  seriesId?: number;
  seriesTitle?: string;
  genres: Genre[];
  creators: Creator[];
  links: Link[];
};

export interface Series {
  id: number;
  title: string;
  description: string;
  banner?: string;
  thumbnail?: string;
  books: Book[];
  genres: string[];
  links: Link[];
  creators: Creator[];
  episodes: Episode[];
  publishers: Publisher[];
}

export declare type Episode = {
  id: number;
  seriesId: number;
  title: string;
  description?: string;
  thumbnail?: string;
  releaseDate: string;
  links: Link[];
};

export interface Page<E> {
  items: E[];
  totalPages: number;
}

export declare type SeriesQuery = {
  link?: string;
};

export declare type Link = {
  id: number;
  url: string;
  description: string;
};

export interface Party {
  id: number;
  fullName: string;
}

export declare type Creator = {
  partyId: number;
  fullName: string;
  role: string;
};

export declare type Publisher = {
  partyId: number;
  fullName: string;
  url: string;
};
