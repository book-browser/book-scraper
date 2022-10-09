export declare type EnvironmentConfiguration = {
  bookBrowser: {
    baseUrl: string;
  };
  bookScraper: {
    targetWebsite: string;
  };
  logLevel: 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';
};
