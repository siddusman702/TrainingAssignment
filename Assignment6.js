// @ts-check
const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const { receiveMessageOnPort } = require("worker_threads");

test.describe("Validating URL of different languages", () => {
  let baseURL = "https://playwright.dev/";

  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto(baseURL);
  });

  const records = parse(fs.readFileSync(path.join(__dirname, "data.csv")), {
    columns: true,
    skip_empty_lines: true,
  });

  for (const record of records) {
    test(`Validatiing URL after selecting : ${record.languages}`, async ({
      page,
    }) => {
      await page.locator("//a[@role='button' and .='Node.js']").click();
      if (record.languages == "Node.js") {
        await page
          .locator(
            "//a[.='" + record.languages + "' and @data-language-prefix='/']"
          )
          .click();
        await expect(page).toHaveURL(baseURL);
      } else {
        await page
          .locator(
            "xpath=//a[.='" +
              record.languages +
              "' and @data-language-prefix='/" +
              record.expectedURLs +
              "/']"
          )
          .click();
        await expect(page).toHaveURL(baseURL + record.expectedURLs + "/");
      }
    });
  }
});
