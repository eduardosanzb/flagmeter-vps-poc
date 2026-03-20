import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
  });
  
  const page = await browser.newPage();
  
  await page.setViewport({
    width: 1054,
    height: 700,
    deviceScaleFactor: 1,
  });
  
  const htmlPath = join(__dirname, 'business-card-print-ready.html');
  await page.goto(`file://${htmlPath}`, {
    waitUntil: 'networkidle0',
  });
  
  await page.pdf({
    path: join(__dirname, 'business-card-print-ready.pdf'),
    width: '89mm',
    height: '59mm',
    printBackground: true,
    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    scale: 1,
  });
  
  await browser.close();
  
  console.log('✅ PDF generated: business-card-print-ready.pdf');
  console.log('📐 Size: 89mm x 59mm (85x55mm + 2mm bleed)');
  console.log('🎯 Ready for German business card printers');
})();