import puppeteer from "puppeteer";

async function generateImage({ url, res, selector }) {
  const browser = await puppeteer.launch();
  // Create a new page
  const page = await browser.newPage();
  await page.goto(url);

  // Set the content to our rendered HTML
  // await page.setContent(html, { waitUntil: "domcontentloaded" });

  // Wait until all images and fonts have loaded
  await page.evaluate(async () => {
    const selectors = Array.from(document.querySelectorAll("img"));
    await Promise.all([
      document.fonts.ready,
      ...selectors.map((img) => {
        // Image has already finished loading, let’s see if it worked
        if (img.complete) {
          // Image loaded and has presence
          if (img.naturalHeight !== 0) return;
          // Image failed, so it has no height
          throw new Error("Image failed to load");
        }
        // Image hasn’t loaded yet, added an event listener to know when it does
        return new Promise((resolve, reject) => {
          img.addEventListener("load", resolve);
          img.addEventListener("error", reject);
        });
      }),
    ]);
  });

  await page.waitForSelector(`#${selector}`);
  const element = await page.$(`#${selector}`);

  const screenshotBuffer = await element.screenshot({
    fullPage: false,
    type: "png",
  });

  res.writeHead(200, { "Content-Type": "image/png" });
  res.write(screenshotBuffer, "binary");
  res.end(null, "binary");

  await page.close();
  await browser.close();
}

export default async function handler(req, res) {
  const { url, selector } = req.query;
  if (url && selector) {
    await generateImage({ url, res, selector });
    return;
  }
  res.send("not valid");
}
