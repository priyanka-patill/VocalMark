const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => {
      const text = msg.text();
      if (!text.includes('vite') && !text.includes('Download the React DevTools')) {
        console.log('CONSOLE:', text);
      }
    });
    
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
    
    await page.goto('http://localhost:5173/#/login', { waitUntil: 'networkidle2' });
    
    await page.evaluate(() => {
      document.querySelectorAll('button')[1].click();
    });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const randomEmail = `test_${Math.random()}@example.com`;
    console.log("Typing register info for", randomEmail);
    
    const inputs = await page.$$('input');
    await inputs[0].type('Test User');
    await inputs[1].type('45');
    await inputs[2].type('555-1234');
    await inputs[3].type(randomEmail);
    await inputs[4].type('password123');
    
    await page.evaluate(() => {
      const btns = document.querySelectorAll('button');
      btns[btns.length - 1].click();
    });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log("Finished script.");
    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
