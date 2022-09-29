import { ScrapeProperties } from './types';

const properties: ScrapeProperties = {
  seriesList: {
    page: {
      url: 'https://tapas.io/comics?b=ORIGINAL&g=0&f=NONE',
      selector: '.content__list'
    },
    infiniteScroll: {
      active: true,
      loadingSelector: '#loading-indicator',
      hiddenClass: 'hidden'
    },
    seriesUrl: {
      selector: '.content__list .list__item .thumb',
      path: 'href'
    }
  },
  series: {
    page: {
      url: '${seriesUrl}/info',
      selector: '.series-root'
    },
    infiniteScroll: {
      active: true,
      loadingSelector: '.js-episode-loading-indicator',
      hiddenClass: 'hidden'
    },
    seriesInfo: {
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
        selector: '.section__top .info--top .genre-btn',
        path: 'textContent',
        formatters: ['lowercase', (str) => str.replace(/\s/g, '-')]
      },
      seriesUrl: {
        path: 'window.location.href'
      },
      creators: {
        selector: '.section--right .name',
        path: 'textContent',
        formatters: ['trim']
      },
      episodes: {
        selector: '.episode-item',
        filter: (elem) => elem.innerHTML.includes('sp-ico-schedule-wht-s'),
        thumbnailUrl: {
          selector: '.thumb img',
          path: 'src'
        },
        title: {
          selector: '.title__body',
          path: 'textContent',
          formatters: ['trim']
        },
        episodeUrl: 'https://tapas.io${href}',
        releaseDate: {
          selector: '.additional',
          path: 'firstChild.textContent',
          formatters: ['trim']
        }
      }
    }
  }
};

export default properties;
