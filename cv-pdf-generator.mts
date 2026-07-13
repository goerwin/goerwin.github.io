import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const rootDir = path.join(process.cwd());
const nextOutDir = path.join(rootDir, 'out');

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: process.env.CI ? ['--no-sandbox', '--disable-setuid-sandbox'] : [],
  });
  const tab = await browser.newPage();
  const cvHtml = fs.readFileSync(path.join(nextOutDir, 'cv.html'), {
    encoding: 'utf-8',
  });

  await tab.setContent(cvHtml);
  await tab.pdf({
    tagged: false,
    path: path.join(nextOutDir, 'Erwin_Gaitan_CV.pdf'),
    format: 'Letter',
    printBackground: true,
    margin: { top: '0.5cm', bottom: '0.5cm' },
  });

  console.log('PDF Generated!');
  await browser.close();
}

main();
