export const getScrapeFunction = (website: string) => {
  try {
    return require(`./${website}/script`).default;
  } catch (e) {
    throw new Error(`script for website "${website}" does not exist`);
  }
};
