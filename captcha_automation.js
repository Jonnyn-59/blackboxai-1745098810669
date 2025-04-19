const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  try {
    await page.goto('https://ya.ru/', { waitUntil: 'networkidle2' });

    // Wait for the CAPTCHA container or checkbox
    await page.waitForTimeout(2000); // wait for 2 seconds for elements to load

    // Try to click "I'm not a robot" checkbox or button
    const notRobotSelector = 'button, input[type="checkbox"], div'; // generic selectors to try
    const elements = await page.$$(notRobotSelector);

    for (const el of elements) {
      const text = await page.evaluate(el => el.textContent, el);
      if (text && text.toLowerCase().includes("i'm not a robot")) {
        await el.click();
        console.log("Clicked 'I'm not a robot' button");
        break;
      }
    }

    // Try to click "Allow all" cookies button if present
    const allowAllSelector = 'button';
    const buttons = await page.$$(allowAllSelector);
    for (const btn of buttons) {
      const btnText = await page.evaluate(btn => btn.textContent, btn);
      if (btnText && btnText.toLowerCase().includes("allow all")) {
        await btn.click();
        console.log("Clicked 'Allow all' cookies button");
        break;
      }
    }

    // Wait some time to observe
    await page.waitForTimeout(5000);

  } catch (error) {
    console.error("Error during automation:", error);
  } finally {
    await browser.close();
  }
})();
