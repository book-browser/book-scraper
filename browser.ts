console.log('import a1');
import { launch } from 'puppeteer-core';
console.log('import a2');
import chromium from '@sparticuz/chromium';
const LambdaFS = require('lambdafs');
import fs from 'fs';

const getExecutablePath = async () => {
  console.log(process.env.IS_LOCAL);
  // if (process.env.IS_LOCAL === 'true') {
  //   return chromium.executablePath;
  // }

  const promises = [LambdaFS.inflate(`/opt/bin/chromium.br`), LambdaFS.inflate(`/opt/bin/swiftshader.tar.br`)];

  if (/^AWS_Lambda_nodejs(?:10|12|14|16)[.]x$/.test(process.env.AWS_EXECUTION_ENV) === true) {
    promises.push(LambdaFS.inflate(`/opt/bin/aws.tar.br`));
  }

  return Promise.all(promises).then((result) => result.shift());
};

export const startBrowser = async () => {
  const path = await getExecutablePath();
  console.log(path);
  const workingDir = fs.readdirSync('./');
  console.log(JSON.stringify(workingDir));
  const optDir = fs.readdirSync('/opt');
  console.log(JSON.stringify(optDir));
  const binDir = fs.readdirSync('/opt/bin');
  console.log(JSON.stringify(binDir));

  return launch({
    headless: true,
    defaultViewport: chromium.defaultViewport,
    args: chromium.args,
    executablePath: path,
    ignoreHTTPSErrors: true,
    dumpio: true
  });
};
