
const puppeteer = require('puppeteer');

const screenshot = async function (url, cookies = [], selector) {
  let browser
  let generatedPDF
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport(Object.assign(page.viewport(), { width: 1400, deviceScaleFactor: 2 }))
    await page.setCookie(...cookies)
    await page.goto(url, {
      waitUntil: 'networkidle2',
    });
    await new Promise(r => setTimeout(r, 10000));
    // page.pdf() is currently supported only in headless mode.
    // @see https://bugs.chromium.org/p/chromium/issues/detail?id=753118
    const elementHandle = await page.$(selector ?? 'body');
    console.log('screenshooting ...')
    const screenshot = await elementHandle.screenshot({ path: 'tmp/output.jpeg' })
    console.log('screenshot success')
    // Create a new page to display the screenshot
    console.log("create new page")
    const screenshotPage = await browser.newPage();

    // Set the content of the screenshot page to display the image
    console.log('set content')
    await screenshotPage.setContent(`<img src="data:image/png;base64,${screenshot.toString('base64')}" style="width: 100vw; height: auto;">`);

    // Generate a PDF from the screenshot page
    console.log('generating pdf ...')
    generatedPDF = await screenshotPage.pdf({
      path: 'tmp/output.pdf',   // Output file path
      format: 'A4',         // Page format
      printBackground: true, // Include background graphics
      margin: {
        top: 40,
        bottom: 40
      }
    });

    console.log({ generatedPDF })


    console.log('PDF generated successfully.');
    
  } catch (error) {
    console.error('an error occured: ', error)
  }
  await browser.close();

  return generatedPDF

}

module.exports = { screenshot }