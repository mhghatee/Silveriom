const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1');
  
  await page.goto('https://silveriom.ir/?v=99', { waitUntil: 'networkidle2' });
  
  // Scroll down 500px
  await page.evaluate(() => {
    window.scrollBy(0, 500);
  });
  
  // Wait a moment for JS scroll events to trigger
  await new Promise(r => setTimeout(r, 1000));
  
  await page.screenshot({ path: '/Users/michael/.gemini/antigravity/brain/af847c41-9357-42a9-ba92-a5c16c470f08/scrolled_500.png' });
  await browser.close();
})();
