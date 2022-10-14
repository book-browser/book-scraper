import { launch } from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import fs from 'fs';

export const startBrowser = async () => {
  const path = await chromium.executablePath;
  console.log(path);
  const workingDir = fs.readdirSync('./');
  console.log(JSON.stringify(workingDir));
  if (fs.existsSync('./opt')) {
    const optDir = fs.readdirSync('/opt');
    console.log(JSON.stringify(optDir));
  }
  if (fs.existsSync('/opt/bin')) {
    const binDir = fs.readdirSync('/opt/bin');
    console.log(JSON.stringify(binDir));
  }

  return launch({
    headless: true,
    defaultViewport: chromium.defaultViewport,
    args: chromium.args,
    executablePath: path,
    ignoreHTTPSErrors: true,
    dumpio: true
  });
};
