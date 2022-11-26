import moment from 'moment';

export default async (tasks) => {
  const seriesUrls: string[] = await tasks.scrape({
    page: {
      url: 'https://tapas.io/comics?b=ORIGINAL&g=0&f=NONE',
      selector: '.content__list'
    },
    infiniteScroll: {
      active: true,
      loadingSelector: '#loading-indicator',
      hiddenClass: 'hidden'
    },
    values: {
      selectorAll: '.content__list .list__item .thumb',
      path: 'href'
    }
  });

  for await (const seriesUrl of seriesUrls) {
    await tasks.series({
      page: {
        url: `${seriesUrl}/info`,
        selector: '.series-root'
      },
      attributes: {
        publishers: () => ['tapas'],
        title: {
          selector: '.title',
          path: 'textContent',
          formatters: ['trim']
        },
        description: {
          selector: '.description__body',
          path: 'textContent',
          formatters: ['trim']
        },
        coverUrl: {
          selector: '.thumb img',
          path: 'src'
        },
        backgroundUrl: {
          selector: '.js-top-banner',
          path: 'style.backgroundImage',
          formatters: [(str) => str.slice(5, -2)]
        },
        genres: {
          selectorAll: '.section__top .info--top .genre-btn',
          path: 'textContent',
          formatters: ['lowercase', (str) => str.replace(/\s/g, '-'), mapTapasGenreToGenre]
        },
        seriesUrl: () => `${seriesUrl}/info`,
        creators: {
          selectorAll: '.section--right .name',
          path: 'textContent',
          formatters: ['trim']
        }
      }
    });
  }
};

const mapTapasGenreToGenre = (tapasGenre: string) => {
  switch (tapasGenre) {
    case 'romance':
      return 'romance';
    case 'action':
      return 'action';
    case 'fantasy':
      return 'fantasy';
    case 'drama':
      return 'drama';
    case 'bl':
      return 'bl';
    case 'gl':
      return 'gl';
    case 'comedy':
      return 'comedy';
    case 'slice-of-life':
      return 'slice of life';
    case 'mystery':
      return 'mystery';
    case 'science-fiction':
      return 'sci-fi';
    case 'gaming':
      return 'gaming';
    case 'horror':
      return 'horror';
    default:
      return null;
  }
};
