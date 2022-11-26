import moment from 'moment';

export default async (tasks) => {
  const seriesUrls: string[] = await tasks.scrape({
    page: {
      url: 'https://www.webtoons.com/en/dailySchedule'
    },
    values: {
      selectorAll: '.daily_card_item',
      path: 'href'
    }
  });

  for await (const seriesUrl of seriesUrls) {
    await tasks.series({
      page: {
        url: `${seriesUrl}`
      },
      attributes: {
        publishers: () => ['webtoon'],
        title: {
          selector: '.detail_header .subj',
          path: 'textContent'
        },
        description: {
          selector: '.detail_body .summary',
          path: 'textContent',
          formatters: ['trim']
        },
        coverUrl: {
          selector: 'meta[name="twitter:image"]',
          path: 'content'
        },
        genres: {
          selector: 'h2.genre',
          path: 'textContent',
          formatters: ['lowercase', mapWebtoonGenreToGenre, (str) => [str]]
        },
        seriesUrl: () => `${seriesUrl}`,
        creators: {
          selectorAll: '.ly_creator_in .title',
          path: 'textContent',
          formatters: ['trim']
        }
      }
    });
  }
};

const mapWebtoonGenreToGenre = (webtoonGenre: string) => {
  switch (webtoonGenre) {
    case 'drama':
      return 'drama';
    case 'fantasy':
      return 'fantasy';
    case 'comedy':
      return 'comedy';
    case 'action':
      return 'action';
    case 'slice of life':
      return 'slice of life';
    case 'romance':
      return 'romance';
    case 'sci-fi':
      return 'sci-fi';
    case 'thriller':
      return 'horror';
    case 'horror':
      return 'horror';
    // case 'superhero':
    // case 'supernatural':
    // case 'mystery':
    // case 'sport':
    // case 'historical':
    // case 'heartwarming':
    // case 'informative':
    default:
      return null;
  }
};
