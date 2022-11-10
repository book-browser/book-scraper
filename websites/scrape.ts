import { ElementHandle, Page } from 'puppeteer-core';
import { infiniteScroll } from '../browser/page';
import logger from '../logging/logger';
import {
  InfiniteScrollProperties,
  PageProperties,
  ScrapedFieldProperty,
  ScrapeProperties,
  ScrapeScript,
  ScrapeTasks,
  SerializableScrapedFieldProperty,
  SeriesScrapeProperties
} from './types';

export const runScript = async (page: Page, script: ScrapeScript) => {
  logger.info('running scrape script');
  const seriesList = [];

  const tasks: ScrapeTasks = {
    scrape: async (properties: ScrapeProperties) => {
      return scrapeValues(page, properties);
    },
    series: async (properties: SeriesScrapeProperties) => {
      const series = await scrapeSeries(page, properties);
      seriesList.push(series);
      return series;
    }
  };

  await script(tasks);

  logger.debug(`series list: ${JSON.stringify(seriesList, null, 2)}`);

  return seriesList;
};

const scrapeValues = async (page: Page, properties: ScrapeProperties) => {
  logger.info(`scraping values from properties`);
  logger.debug(`scrape properties: ${JSON.stringify(properties, null, 2)}`);
  await navigateToPage(page, properties.page);
  await waitForInfiniteScroll(page, properties.infiniteScroll);

  if (typeof properties.values === 'object') {
    return extractProperty(await page.$('body'), properties.values);
  }
  return properties.values();
};

const scrapeSeries = async (page: Page, properties: SeriesScrapeProperties) => {
  logger.info(`scraping series properties`);
  logger.debug(`series scrape properties: ${JSON.stringify(properties, null, 2)}`);
  await navigateToPage(page, properties.page);
  await waitForInfiniteScroll(page, properties.infiniteScroll);
  return extractProperty(await page.$('body'), { attributes: properties.attributes });
};

const navigateToPage = async <E>(page: Page, properties: PageProperties) => {
  logger.info(`navigating to page ${properties.url}`);
  logger.debug(`page properties: ${JSON.stringify(properties, null, 2)}`);
  await page.goto(properties.url);
  await page.addScriptTag({ content: `${findPath}` });
  await page.waitForSelector(properties.selector);
};

const waitForInfiniteScroll = async (page: Page, properties: InfiniteScrollProperties) => {
  if (properties) {
    const waitForInfiniteScrollLoadingIndicator = async (page: Page) => {
      await page.waitForFunction(
        (infiniteScrollProperties: InfiniteScrollProperties) =>
          document
            .querySelector(infiniteScrollProperties.loadingSelector)
            .classList.contains(infiniteScrollProperties.hiddenClass),
        undefined,
        properties
      );
    };
    await infiniteScroll(page, waitForInfiniteScrollLoadingIndicator);
  }
};

const extractProperty = async (container: ElementHandle, property: ScrapedFieldProperty) => {
  logger.debug(`extracting property`);
  logger.debug(`scrape property: ${JSON.stringify(property, null, 2)}`);
  const serializableProperty = {
    selector: property.selector,
    selectorAll: property.selectorAll,
    path: property.path
  };

  let queryHandle = property.selector || property.selectorAll ? await queryItems(container, property) : container;

  if (property.filter) {
    if (Array.isArray(queryHandle)) {
      queryHandle = await filterHandles(queryHandle, property.filter);
    }
  }

  let out;

  if (property.path) {
    if (Array.isArray(queryHandle)) {
      out = await (
        await container.evaluateHandle(extractItemsValues, serializableProperty, ...queryHandle)
      ).jsonValue();
    } else {
      out = await (await container.evaluateHandle(extractItemValue, serializableProperty, queryHandle)).jsonValue();
    }
  }

  if (property.attributes) {
    if (Array.isArray(queryHandle)) {
      out = await Promise.all(queryHandle.map((item) => extractProperties(item, property)));
    } else {
      out = extractProperties(queryHandle, property);
      logger.debug(await out);
    }
  }

  if (property.formatters) {
    if (Array.isArray(out)) {
      out = out.map((item) => format(item, property.formatters));
    } else {
      out = format(out, property.formatters);
    }
  }

  return out;
};

const filterHandles = async (handles: ElementHandle<Element>[], filter: ScrapedFieldProperty['filter']) => {
  logger.debug(`filtering handles ${filter}`);
  const results = await Promise.all(handles.map((item) => item.evaluate(filter)));
  logger.debug(`filtering results ${results}`);
  return handles.filter((_item, index) => results[index]);
};

const extractProperties = async (container: ElementHandle, property: ScrapedFieldProperty) => {
  const obj = {};
  for await (const [key, childProperty] of Object.entries(property.attributes)) {
    if (typeof childProperty === 'object') {
      obj[key] = await extractProperty(container, childProperty);
    } else {
      obj[key] = childProperty();
    }
  }
  return obj;
};

const queryItems = (container: Page | ElementHandle, property: SerializableScrapedFieldProperty) => {
  if (property.selector) {
    return container.$(property.selector);
  } else if (property.selectorAll) {
    return container.$$(property.selectorAll);
  }
};

const extractItemsValues = (
  _container: Element,
  property: SerializableScrapedFieldProperty,
  ...elements: HTMLElement[]
) => {
  return elements.map((element) => findPath(element, property.path)) as string[];
};

const extractItemValue = (_container: Element, property: SerializableScrapedFieldProperty, element: HTMLElement) => {
  return findPath(element, property.path);
};

const format = (str: string, formatters: (string | ((field: string) => string))[]) => {
  let output = str;
  formatters.forEach((formatter) => {
    if (typeof formatter === 'string') {
      if (formatter === 'lowercase') {
        output = output.toLocaleLowerCase();
      } else if (formatter === 'trim') {
        output = output.trim();
      }
    } else {
      output = formatter(output);
    }
  });
  return output;
};

function findPath(obj, path) {
  if (!obj) {
    return undefined;
  }
  const keys = path.split('.');
  let out = obj;
  keys.forEach((key) => {
    out = out?.[key];
  });
  return out;
}
