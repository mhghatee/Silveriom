const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto('https://silveriom.ir/proposal/?id=SILV-06FA88', { waitUntil: 'networkidle2' });
  
  const content = await page.content();
  console.log("BODY TAG LENGTH:", content.length);
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => {
    errors.push(err.toString());
  });
  
  await page.reload({ waitUntil: 'networkidle2' });
  
  console.log("ERRORS:", errors);
  
  const isAppVisible = await page.evaluate(() => {
    const el = document.getElementById('app-container');
    if (!el) return 'NOT_FOUND';
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    return {
      width: rect.width,
      height: rect.height,
      opacity: style.opacity,
      display: style.display,
      visibility: style.visibility,
      zIndex: style.zIndex
    };
  });
  
  console.log("APP CONTAINER STATE:", isAppVisible);
  
  await browser.close();
})();
