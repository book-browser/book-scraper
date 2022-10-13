console.log('import a1');
import { launch } from 'puppeteer-core';
console.log('import a2');
import chromium from '@sparticuz/chromium';
const LambdaFS = require('lambdafs');

const getExecutablePath = async () => {
  if (process.env.IS_LOCAL) {
    return chromium.executablePath;
  }

  const promises = [LambdaFS.inflate(`/opt/bin/chromium.br`), LambdaFS.inflate(`/opt/bin/swiftshader.tar.br`)];

  if (/^AWS_Lambda_nodejs(?:10|12|14|16)[.]x$/.test(process.env.AWS_EXECUTION_ENV) === true) {
    promises.push(LambdaFS.inflate(`/opt/bin/aws.tar.br`));
  }

  return Promise.all(promises).then((result) => result.shift());
};

export const startBrowser = async () => {
  return launch({
    headless: true,
    defaultViewport: chromium.defaultViewport,
    args: chromium.args,
    executablePath: await getExecutablePath(),
    ignoreHTTPSErrors: true,
    dumpio: true
  });
};
