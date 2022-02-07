import { Page, test as test_ } from "@playwright/test";

// from https://github.com/lit/lit.dev/blob/5d79d1e0989e68f8b5905e5271229ffe4c55265c/packages/lit-dev-tests/src/playwright/util.ts
export async function waitForPlaygroundPreviewToLoad(page: Page) {
  // We could get a series of iframe reloads, e.g. if we're typing multiple
  // characters, then there could be enough time for multiple previews to get
  // queued up inbetween each keystroke. Assume we've settled when we haven't
  // had an iframe load event for some period of time.
  const iframe = await page.waitForSelector("playground-preview iframe");
  await page.waitForFunction(async (iframe) => {
    const settleTime = 1000;
    await new Promise<void>((resolve) => {
      let timer = setTimeout(resolve, settleTime);
      iframe.addEventListener("load", () => {
        clearTimeout(timer);
        timer = setTimeout(resolve, settleTime);
      });
    });
    return true;
  }, iframe);
  // Hide the animated loading indicator.
  await page.evaluate((el) => {
    el.style.visibility = "hidden";
  }, await page.waitForSelector('playground-preview [part="preview-loading-indicator"]', { state: "attached" }));
}

export const failOnPageError = (page: Page) => {
  page.on("pageerror", (e) => {
    process.emit("uncaughtException", e);
  });
};
